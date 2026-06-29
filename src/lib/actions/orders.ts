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
} from "@/lib/db/schema";
import { clearCart } from "@/lib/actions/cart";
import { getStripeClient, centsToDollars } from "@/lib/stripe/client";

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
  totalAmount: number;
  totalCents: number;
  createdAt: Date;
  items: OrderItemView[];
};

export async function createOrder(stripeSessionId: string, userId?: string) {
  const [existingPayment] = await db
    .select()
    .from(payments)
    .where(eq(payments.transactionId, stripeSessionId))
    .limit(1);

  if (existingPayment) {
    return getOrder(existingPayment.orderId);
  }

  const session = await getStripeClient().checkout.sessions.retrieve(stripeSessionId);

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
  const totalCents = session.amount_total ?? 0;
  const totalAmount = centsToDollars(totalCents);

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

  const [order] = await db
    .insert(orders)
    .values({
      userId: resolvedUserId || null,
      status: "paid",
      totalAmount: totalAmount.toFixed(2),
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

  return getOrder(order.id);
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

  const totalAmount = Number(order.totalAmount);
  const totalCents = Math.round(totalAmount * 100);

  return {
    id: order.id,
    status: order.status,
    totalAmount,
    totalCents,
    createdAt: order.createdAt,
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
