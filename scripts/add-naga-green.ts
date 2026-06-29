import { db } from '@/lib/db';
import {
  brands,
  categories,
  collections,
  colors,
  genders,
  productCollections,
  productImages,
  productVariants,
  products,
  sizes,
  insertCategorySchema,
  insertCollectionSchema,
  insertProductSchema,
  insertVariantSchema,
  insertProductImageSchema,
  type InsertProduct,
  type InsertVariant,
  type InsertProductImage,
} from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { cpSync, existsSync, mkdirSync } from 'fs';
import { join, basename } from 'path';

const PRODUCT_NAME = 'Naga Black Set';
const IMAGE_SRC = join(process.cwd(), 'public', 'naga-t-shirt', 'Naga-set-black.jpeg');
const IMAGE_DEST = join(process.cwd(), 'public', 'uploads', 'naga', 'naga-set-black.jpg');
const IMAGE_URL = '/uploads/naga/naga-set-black.jpg';

async function ensureCategory(slug: string, name: string) {
  const existing = await db.select().from(categories).where(eq(categories.slug, slug)).limit(1);
  if (existing.length) return existing[0];
  const row = insertCategorySchema.parse({ name, slug, parentId: null });
  const [created] = await db.insert(categories).values(row).returning();
  return created;
}

async function ensureCollection(slug: string, name: string) {
  const existing = await db.select().from(collections).where(eq(collections.slug, slug)).limit(1);
  if (existing.length) return existing[0];
  const row = insertCollectionSchema.parse({ name, slug });
  const [created] = await db.insert(collections).values(row).returning();
  return created;
}

async function main() {
  const existing = await db
    .select({ id: products.id })
    .from(products)
    .where(eq(products.name, PRODUCT_NAME))
    .limit(1);

  if (existing.length) {
    console.log(`[add-naga-green] "${PRODUCT_NAME}" already exists (${existing[0].id})`);
    return;
  }

  mkdirSync(join(process.cwd(), 'public', 'uploads', 'naga'), { recursive: true });
  if (existsSync(IMAGE_SRC)) {
    cpSync(IMAGE_SRC, IMAGE_DEST);
    console.log('[add-naga-green] Copied product image to', IMAGE_DEST);
  } else if (!existsSync(IMAGE_DEST)) {
    console.warn('[add-naga-green] Source image missing; using placeholder');
  }

  const category = await ensureCategory('sets', 'Sets');
  const collection = await ensureCollection('naga-black', 'Naga Black');
  const nagaBrand = (await db.select().from(brands).where(eq(brands.slug, 'naga-apparel')))[0];
  const gender = (await db.select().from(genders).where(eq(genders.slug, 'unisex')))[0];
  const blackColor = (await db.select().from(colors).where(eq(colors.slug, 'black')))[0];
  const apparelSizes = await db
    .select()
    .from(sizes)
    .where(eq(sizes.slug, 'xs'))
    .then(async () =>
      db.select().from(sizes).then((all) =>
        all.filter((s) => ['xs', 's', 'm', 'l', 'xl', 'xxl'].includes(s.slug))
      )
    );

  if (!blackColor) throw new Error('Black color not found — run db:seed first');

  const product = insertProductSchema.parse({
    name: PRODUCT_NAME,
    description:
      'Matching black tee and shorts set. Naga Original chest graphic, Hustle Hard leg print, and cobra patch detail. Soft cotton-blend jersey, relaxed street fit.',
    categoryId: category.id,
    genderId: gender?.id ?? null,
    brandId: nagaBrand?.id ?? null,
    isPublished: true,
  });

  const [insertedProduct] = await db
    .insert(products)
    .values(product as InsertProduct)
    .returning();

  let defaultVariantId: string | null = null;

  for (const size of apparelSizes) {
    const variant = insertVariantSchema.parse({
      productId: insertedProduct.id,
      sku: `NAGA-${insertedProduct.id.slice(0, 8)}-BLACK-${size.slug.toUpperCase()}`,
      price: '48.00',
      colorId: blackColor.id,
      sizeId: size.id,
      inStock: 0,
      weight: 0.55,
      dimensions: { length: 35, width: 28, height: 6 },
    });
    const [created] = await db.insert(productVariants).values(variant as InsertVariant).returning();
    if (!defaultVariantId) defaultVariantId = created.id;
  }

  if (defaultVariantId) {
    await db
      .update(products)
      .set({ defaultVariantId })
      .where(eq(products.id, insertedProduct.id));
  }

  const img: InsertProductImage = insertProductImageSchema.parse({
    productId: insertedProduct.id,
    url: existsSync(IMAGE_DEST) ? IMAGE_URL : '/uploads/naga/placeholder.svg',
    sortOrder: 0,
    isPrimary: true,
  });
  await db.insert(productImages).values(img);

  await db.insert(productCollections).values({
    productId: insertedProduct.id,
    collectionId: collection.id,
  });

  console.log(`[add-naga-green] Created "${PRODUCT_NAME}" (${insertedProduct.id})`);
}

main().catch((e) => {
  console.error('[add-naga-green:error]', e);
  process.exitCode = 1;
});
