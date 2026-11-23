import { db } from '@/lib/db';
import {
  brands,
  categories,
  colors,
  insertCategorySchema,
  insertProductImageSchema,
  insertProductSchema,
  insertVariantSchema,
  productImages,
  productVariants,
  products,
  sizes,
  type InsertProduct,
  type InsertProductImage,
  type InsertVariant,
} from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { existsSync } from 'fs';
import { join } from 'path';

const PRODUCT_NAME = 'Push Button Clasp 8mm Miami Cuban Link Chain';
const VARIANT_SKU = 'KRKC-0083-CH-GD-8mm-18in';
const VARIANT_PRICE = '49.00';
const DESCRIPTION =
  '8mm Miami Cuban link chain with a push-button clasp. Gold plated stainless steel with a polished, bold finish. The plating is gold tone over a stainless steel base, so this is not solid gold. Includes a gift box. Keep it dry and wipe it after wearing to keep the shine.';

const IMAGES = [
  { file: 'krkc-0083-main.png', sortOrder: 0, isPrimary: true },
  { file: 'krkc-0083-alt.png', sortOrder: 1, isPrimary: false },
];

const TAG = '[add-krkc-0083-chain]';

async function main() {
  // Verify both images exist on disk before touching the database.
  const missing = IMAGES.filter(
    (img) => !existsSync(join(process.cwd(), 'public', 'uploads', 'krkc', img.file))
  ).map((img) => img.file);
  if (missing.length) {
    throw new Error(`${TAG} Missing image file(s) in public/uploads/krkc/: ${missing.join(', ')}`);
  }

  // Idempotency: stop if the SKU already exists.
  const existingVariant = await db
    .select({ id: productVariants.id, productId: productVariants.productId })
    .from(productVariants)
    .where(eq(productVariants.sku, VARIANT_SKU))
    .limit(1);
  if (existingVariant.length) {
    console.log(
      `${TAG} SKU ${VARIANT_SKU} already exists (variant ${existingVariant[0].id}, product ${existingVariant[0].productId}). Nothing changed.`
    );
    return;
  }

  // Category: create "Chains" if missing.
  let [category] = await db.select().from(categories).where(eq(categories.slug, 'chains')).limit(1);
  if (!category) {
    const row = insertCategorySchema.parse({ name: 'Chains', slug: 'chains', parentId: null });
    [category] = await db.insert(categories).values(row).returning();
    console.log(`${TAG} Created category "Chains" (${category.id})`);
  }

  const [brand] = await db.select().from(brands).where(eq(brands.slug, 'naga-apparel')).limit(1);
  if (!brand) throw new Error(`${TAG} Brand "naga-apparel" not found — run db:seed first`);

  const [gold] = await db.select().from(colors).where(eq(colors.slug, 'gold')).limit(1);
  if (!gold) throw new Error(`${TAG} Color "gold" not found — run db:seed first`);

  const [oneSize] = await db.select().from(sizes).where(eq(sizes.slug, 'one-size')).limit(1);
  if (!oneSize) throw new Error(`${TAG} Size "one-size" not found — run db:seed first`);

  // Product: unpublished.
  const product = insertProductSchema.parse({
    name: PRODUCT_NAME,
    description: DESCRIPTION,
    categoryId: category.id,
    brandId: brand.id,
    isPublished: false,
  });
  const [insertedProduct] = await db
    .insert(products)
    .values(product as InsertProduct)
    .returning();
  console.log(`${TAG} Created product "${PRODUCT_NAME}" (${insertedProduct.id}), unpublished`);

  // Variant: 0 in stock.
  const variant = insertVariantSchema.parse({
    productId: insertedProduct.id,
    sku: VARIANT_SKU,
    price: VARIANT_PRICE,
    colorId: gold.id,
    sizeId: oneSize.id,
    inStock: 0,
  });
  const [insertedVariant] = await db
    .insert(productVariants)
    .values(variant as InsertVariant)
    .returning();

  await db
    .update(products)
    .set({ defaultVariantId: insertedVariant.id })
    .where(eq(products.id, insertedProduct.id));
  console.log(`${TAG} Created variant ${VARIANT_SKU} (${insertedVariant.id}) at ${VARIANT_PRICE} EUR, stock 0`);

  // Images: main (primary, sortOrder 0) and alt (sortOrder 1).
  for (const img of IMAGES) {
    const row: InsertProductImage = insertProductImageSchema.parse({
      productId: insertedProduct.id,
      variantId: insertedVariant.id,
      url: `/uploads/krkc/${img.file}`,
      sortOrder: img.sortOrder,
      isPrimary: img.isPrimary,
    });
    await db.insert(productImages).values(row);
    console.log(`${TAG} Attached /uploads/krkc/${img.file} (sortOrder ${img.sortOrder}, primary ${img.isPrimary})`);
  }

  console.log(`${TAG} Done. Product ID: ${insertedProduct.id}`);
}

main().catch((e) => {
  console.error(`${TAG}:error`, e);
  process.exitCode = 1;
});
