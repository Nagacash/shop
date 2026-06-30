"use server";

import { desc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import {
  orders,
  orderItems,
  products,
  productVariants,
  sizes,
  colors,
  addresses,
  users,
} from "@/lib/db/schema";
import { requireAdmin } from "@/lib/auth/admin";
import { formatShippingAddress, type ShippingAddressView } from "@/lib/stripe/shipping";
import { formatPriceFromCents } from "@/lib/utils/currency";

export type AdminOrderRow = {
  id: string;
  status: string;
  createdAt: Date;
  customerEmail: string | null;
  customerName: string | null;
  totalCents: number;
  subtotalAmount: number | null;
  shippingAmount: number | null;
  taxAmount: number | null;
  itemCount: number;
  shippingAddress: ShippingAddressView | null;
  items: Array<{
    name: string;
    quantity: number;
    priceAtPurchase: number;
    size: string | null;
    color: string | null;
  }>;
};

async function loadShippingAddress(shippingAddressId: string | null): Promise<ShippingAddressView | null> {
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

export async function listAdminOrders(): Promise<AdminOrderRow[]> {
  await requireAdmin();

  const rows = await db
    .select({
      id: orders.id,
      status: orders.status,
      createdAt: orders.createdAt,
      customerEmail: orders.customerEmail,
      totalAmount: orders.totalAmount,
      subtotalAmount: orders.subtotalAmount,
      shippingAmount: orders.shippingAmount,
      taxAmount: orders.taxAmount,
      shippingAddressId: orders.shippingAddressId,
      userName: users.name,
    })
    .from(orders)
    .leftJoin(users, eq(users.id, orders.userId))
    .orderBy(desc(orders.createdAt))
    .limit(100);

  const result: AdminOrderRow[] = [];

  for (const row of rows) {
    const items = await db
      .select({
        productName: products.name,
        quantity: orderItems.quantity,
        priceAtPurchase: orderItems.priceAtPurchase,
        sizeName: sizes.name,
        colorName: colors.name,
      })
      .from(orderItems)
      .innerJoin(productVariants, eq(productVariants.id, orderItems.productVariantId))
      .innerJoin(products, eq(products.id, productVariants.productId))
      .leftJoin(sizes, eq(sizes.id, productVariants.sizeId))
      .leftJoin(colors, eq(colors.id, productVariants.colorId))
      .where(eq(orderItems.orderId, row.id));

    const shippingAddress = await loadShippingAddress(row.shippingAddressId);

    result.push({
      id: row.id,
      status: row.status,
      createdAt: row.createdAt,
      customerEmail: row.customerEmail,
      customerName: row.userName,
      totalCents: Math.round(Number(row.totalAmount) * 100),
      subtotalAmount: row.subtotalAmount != null ? Number(row.subtotalAmount) : null,
      shippingAmount: row.shippingAmount != null ? Number(row.shippingAmount) : null,
      taxAmount: row.taxAmount != null ? Number(row.taxAmount) : null,
      itemCount: items.reduce((sum, item) => sum + item.quantity, 0),
      shippingAddress,
      items: items.map((item) => ({
        name: item.productName,
        quantity: item.quantity,
        priceAtPurchase: Number(item.priceAtPurchase),
        size: item.sizeName,
        color: item.colorName,
      })),
    });
  }

  return result;
}

export async function updateOrderStatus(
  orderId: string,
  status: "pending" | "paid" | "shipped" | "delivered" | "cancelled",
) {
  await requireAdmin();

  await db.update(orders).set({ status }).where(eq(orders.id, orderId));
  return { ok: true as const };
}

export { formatShippingAddress };
