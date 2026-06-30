"use server";

import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import {
  orders,
  orderItems,
  payments,
  cartItems,
  productVariants,
  products,
  sizes,
  colors,
  addresses,
} from "@/lib/db/schema";
import { clearCart } from "@/lib/actions/cart";
import { getStripeClient, centsToDollars } from "@/lib/stripe/client";
import { parseSessionAmounts } from "@/lib/stripe/checkout-amounts";
import { saveShippingAddressFromSession, type ShippingAddressView } from "@/lib/stripe/shipping";
import { maybeSendOrderConfirmationEmail } from "@/lib/email/order-confirmation";

export type OrderItemView = {
  id: string;
  name: string;
  quantity: number;
  priceAtPurchase: number;
  size?: string | null;
  color?: string | null;
};

export type OrderView = {
  id: string;
  status: string;
  subtotalAmount: number | null;
  shippingAmount: number | null;
  taxAmount: number | null;
  totalAmount: number;
  totalCents: number;
  createdAt: Date;
  items: OrderItemView[];
  shippingAddress: ShippingAddressView | null;
  customerEmail: string | null;
};

function formatAmount(cents: number): string {
  return centsToDollars(cents).toFixed(2);
}

export async function createOrder(stripeSessionId: string, userId?: string) {
  const [existingPayment] = await db
    .select()
    .from(payments)
    .where(eq(payments.transactionId, stripeSessionId))
    .limit(1);

  if (existingPayment) {
    return getOrder(existingPayment.orderId);
  }

  const session = await getStripeClient().checkout.sessions.retrieve(stripeSessionId, {
    expand: ["customer_details"],
  });

  if (session.payment_status !== "paid") {
    throw new Error("Payment not completed.");
  }

  const cartId = session.metadata?.cartId;
  if (!cartId) {
    throw new Error("Missing cart ID in Stripe session metadata.");
  }

  const resolvedUserId =
    userId ?? (session.metadata?.userId && session.metadata.userId.length > 0
      ? session.metadata.userId
      : null);

  const { totalCents, subtotalCents, taxCents, shippingCents } = parseSessionAmounts(session);
  const customerEmail = session.customer_details?.email ?? null;

  const items = await db
    .select({
      variantId: cartItems.productVariantId,
      quantity: cartItems.quantity,
      price: productVariants.price,
      salePrice: productVariants.salePrice,
    })
    .from(cartItems)
    .innerJoin(productVariants, eq(productVariants.id, cartItems.productVariantId))
    .where(eq(cartItems.cartId, cartId));

  if (!items.length) {
    throw new Error("Cart has no items for this order.");
  }

  const shippingAddressId = await saveShippingAddressFromSession(session, resolvedUserId);

  const [order] = await db
    .insert(orders)
    .values({
      userId: resolvedUserId || null,
      status: "paid",
      subtotalAmount: formatAmount(subtotalCents),
      shippingAmount: formatAmount(shippingCents),
      taxAmount: formatAmount(taxCents),
      totalAmount: formatAmount(totalCents),
      customerEmail,
      shippingAddressId,
    })
    .returning();

  for (const item of items) {
    const unitPrice = item.salePrice ?? item.price;
    await db.insert(orderItems).values({
      orderId: order.id,
      productVariantId: item.variantId,
      quantity: item.quantity,
      priceAtPurchase: unitPrice,
    });
  }

  await db.insert(payments).values({
    orderId: order.id,
    method: "stripe",
    status: "completed",
    paidAt: new Date(),
    transactionId: stripeSessionId,
  });

  await clearCart(cartId);

  const orderView = await getOrder(order.id);
  if (!orderView) {
    throw new Error("Failed to load order.");
  }

  await maybeSendOrderConfirmationEmail(orderView);

  return orderView;
}

async function loadShippingAddress(
  shippingAddressId: string | null,
): Promise<ShippingAddressView | null> {
  if (!shippingAddressId) return null;

  const [row] = await db
    .select({
      recipientName: addresses.recipientName,
      line1: addresses.line1,
      line2: addresses.line2,
      city: addresses.city,
      state: addresses.state,
      country: addresses.country,
      postalCode: addresses.postalCode,
    })
    .from(addresses)
    .where(eq(addresses.id, shippingAddressId))
    .limit(1);

  if (!row) return null;

  return {
    recipientName: row.recipientName,
    line1: row.line1,
    line2: row.line2,
    city: row.city,
    state: row.state,
    country: row.country,
    postalCode: row.postalCode,
  };
}

function mapOrderView(
  order: typeof orders.$inferSelect,
  rows: Array<{
    id: string;
    quantity: number;
    priceAtPurchase: string | number;
    productName: string;
    sizeName: string | null;
    colorName: string | null;
  }>,
  shippingAddress: ShippingAddressView | null,
): OrderView {
  const totalAmount = Number(order.totalAmount);
  const totalCents = Math.round(totalAmount * 100);

  return {
    id: order.id,
    status: order.status,
    subtotalAmount: order.subtotalAmount != null ? Number(order.subtotalAmount) : null,
    shippingAmount: order.shippingAmount != null ? Number(order.shippingAmount) : null,
    taxAmount: order.taxAmount != null ? Number(order.taxAmount) : null,
    totalAmount,
    totalCents,
    createdAt: order.createdAt,
    customerEmail: order.customerEmail,
    shippingAddress,
    items: rows.map((row) => ({
      id: row.id,
      name: row.productName,
      quantity: row.quantity,
      priceAtPurchase: Number(row.priceAtPurchase),
      size: row.sizeName,
      color: row.colorName,
    })),
  };
}

export async function getOrder(orderId: string): Promise<OrderView | null> {
  const [order] = await db.select().from(orders).where(eq(orders.id, orderId)).limit(1);
  if (!order) return null;

  const rows = await db
    .select({
      id: orderItems.id,
      quantity: orderItems.quantity,
      priceAtPurchase: orderItems.priceAtPurchase,
      productName: products.name,
      sizeName: sizes.name,
      colorName: colors.name,
    })
    .from(orderItems)
    .innerJoin(productVariants, eq(productVariants.id, orderItems.productVariantId))
    .innerJoin(products, eq(products.id, productVariants.productId))
    .leftJoin(sizes, eq(sizes.id, productVariants.sizeId))
    .leftJoin(colors, eq(colors.id, productVariants.colorId))
    .where(eq(orderItems.orderId, orderId));

  const shippingAddress = await loadShippingAddress(order.shippingAddressId);

  return mapOrderView(order, rows, shippingAddress);
}

export async function getOrderByStripeSession(
  stripeSessionId: string,
): Promise<OrderView | null> {
  const [payment] = await db
    .select()
    .from(payments)
    .where(eq(payments.transactionId, stripeSessionId))
    .limit(1);

  if (!payment) return null;

  return getOrder(payment.orderId);
}
