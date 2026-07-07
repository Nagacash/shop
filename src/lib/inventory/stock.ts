import "server-only";

import { and, eq, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { cartItems, productVariants } from "@/lib/db/schema";

export async function getVariantInStock(variantId: string): Promise<number | null> {
  const [row] = await db
    .select({ inStock: productVariants.inStock })
    .from(productVariants)
    .where(eq(productVariants.id, variantId))
    .limit(1);

  return row?.inStock ?? null;
}

/** Atomic decrement — returns false when stock is insufficient. */
export async function decrementVariantStock(
  variantId: string,
  quantity: number,
): Promise<boolean> {
  if (quantity <= 0) return true;

  const rows = await db
    .update(productVariants)
    .set({
      inStock: sql`${productVariants.inStock} - ${quantity}`,
    })
    .where(
      and(
        eq(productVariants.id, variantId),
        sql`${productVariants.inStock} >= ${quantity}`,
      ),
    )
    .returning({ id: productVariants.id });

  return rows.length > 0;
}

export async function incrementVariantStock(
  variantId: string,
  quantity: number,
): Promise<void> {
  if (quantity <= 0) return;

  await db
    .update(productVariants)
    .set({
      inStock: sql`${productVariants.inStock} + ${quantity}`,
    })
    .where(eq(productVariants.id, variantId));
}

export async function validateCartStock(
  cartId: string,
): Promise<{ ok: true } | { ok: false; message: string }> {
  const rows = await db
    .select({
      quantity: cartItems.quantity,
      inStock: productVariants.inStock,
    })
    .from(cartItems)
    .innerJoin(productVariants, eq(productVariants.id, cartItems.productVariantId))
    .where(eq(cartItems.cartId, cartId));

  for (const row of rows) {
    if (row.quantity > (row.inStock ?? 0)) {
      return { ok: false, message: "Not enough stock available for an item in your bag." };
    }
  }

  return { ok: true };
}

export async function validateLineItemsStock(
  items: Array<{ variantId: string; quantity: number }>,
): Promise<{ ok: true } | { ok: false; message: string }> {
  for (const item of items) {
    const inStock = await getVariantInStock(item.variantId);
    if (inStock === null || item.quantity > inStock) {
      return { ok: false, message: "Not enough stock to fulfill this order." };
    }
  }

  return { ok: true };
}

/** Decrement all line items; rolls back partial decrements on failure. */
export async function decrementOrderStock(
  items: Array<{ variantId: string; quantity: number }>,
): Promise<void> {
  const applied: Array<{ variantId: string; quantity: number }> = [];

  try {
    for (const item of items) {
      const ok = await decrementVariantStock(item.variantId, item.quantity);
      if (!ok) {
        throw new Error("Insufficient stock to fulfill this order.");
      }
      applied.push(item);
    }
  } catch (error) {
    for (const item of applied) {
      await incrementVariantStock(item.variantId, item.quantity);
    }
    throw error;
  }
}
