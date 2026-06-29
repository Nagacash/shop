import { db } from '@/lib/db';
import {
  cartItems,
  orderItems,
  orders,
  products,
  productVariants,
} from '@/lib/db/schema';
import { eq, inArray, notInArray } from 'drizzle-orm';

const KEEP_NAMES = [
  'Naga Black Set',
  'Naga Original Black Tee',
  'Naga Original White Tee',
  'Naga Original Grey Sweater',
  'Naga Original Light Brown Sweater',
  'Naga Original Cream Hoodie',
] as const;

async function main() {
  const keepRows = await db
    .select({ id: products.id, name: products.name })
    .from(products)
    .where(inArray(products.name, [...KEEP_NAMES]));

  const keepIds = new Set(keepRows.map((r) => r.id));
  const missing = KEEP_NAMES.filter((n) => !keepRows.some((r) => r.name === n));

  if (missing.length) {
    console.warn('[prune-catalog] Missing expected products:', missing.join(', '));
  }

  const removeRows = await db
    .select({ id: products.id, name: products.name })
    .from(products)
    .where(notInArray(products.name, [...KEEP_NAMES]));

  if (!removeRows.length) {
    console.log('[prune-catalog] Catalog already trimmed — only real products remain.');
    for (const row of keepRows) {
      console.log(`  kept: ${row.name} (${row.id})`);
    }
    return;
  }

  const removeIds = removeRows.map((r) => r.id);
  const removeVariants = await db
    .select({ id: productVariants.id })
    .from(productVariants)
    .where(inArray(productVariants.productId, removeIds));

  const removeVariantIds = removeVariants.map((v) => v.id);

  if (removeVariantIds.length) {
    await db.delete(cartItems).where(inArray(cartItems.productVariantId, removeVariantIds));
    await db.delete(orderItems).where(inArray(orderItems.productVariantId, removeVariantIds));
  }

  const orphanOrders = await db.select({ id: orders.id }).from(orders);
  for (const order of orphanOrders) {
    const items = await db
      .select({ id: orderItems.id })
      .from(orderItems)
      .where(eq(orderItems.orderId, order.id));
    if (!items.length) {
      await db.delete(orders).where(eq(orders.id, order.id));
    }
  }

  await db.delete(products).where(inArray(products.id, removeIds));

  console.log(`[prune-catalog] Removed ${removeRows.length} product(s):`);
  for (const row of removeRows) {
    console.log(`  - ${row.name}`);
  }

  console.log('[prune-catalog] Kept:');
  for (const name of KEEP_NAMES) {
    const kept = keepRows.find((r) => r.name === name);
    if (kept) console.log(`  ✓ ${name} (${kept.id})`);
  }

  if (keepIds.size !== KEEP_NAMES.length) {
    console.warn('[prune-catalog] Run db:add-naga-green / db:add-real-tees for any missing products.');
  }
}

main().catch((e) => {
  console.error('[prune-catalog:error]', e);
  process.exitCode = 1;
});
