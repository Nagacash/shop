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
  insertColorSchema,
  insertProductSchema,
  insertVariantSchema,
  insertProductImageSchema,
  type InsertProduct,
  type InsertVariant,
  type InsertProductImage,
} from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { cpSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';

const PRODUCT_NAME = 'Naga Original Cream Hoodie';
const IMAGE_SRC = join(process.cwd(), 'public', 'naga-t-shirt', 'Naga-hoodie.png');
const IMAGE_DEST = join(process.cwd(), 'public', 'uploads', 'naga', 'naga-hoodie.png');
const IMAGE_URL = '/uploads/naga/naga-hoodie.png';

async function ensureColor() {
  const existing = await db.select().from(colors).where(eq(colors.slug, 'cream')).limit(1);
  if (existing.length) return existing[0];
  const row = insertColorSchema.parse({
    name: 'Cream',
    slug: 'cream',
    hexCode: '#F5F0E8',
  });
  const [created] = await db.insert(colors).values(row).returning();
  return created;
}

async function main() {
  mkdirSync(join(process.cwd(), 'public', 'uploads', 'naga'), { recursive: true });

  const existing = await db
    .select({ id: products.id })
    .from(products)
    .where(eq(products.name, PRODUCT_NAME))
    .limit(1);

  if (existing.length) {
    console.log(`[add-real-hoodie] "${PRODUCT_NAME}" already exists (${existing[0].id})`);
    return;
  }

  if (existsSync(IMAGE_SRC)) {
    cpSync(IMAGE_SRC, IMAGE_DEST);
    console.log('[add-real-hoodie] Copied image to', IMAGE_DEST);
  } else {
    console.warn('[add-real-hoodie] Source image missing:', IMAGE_SRC);
  }

  const category = (await db.select().from(categories).where(eq(categories.slug, 'hoodies')).limit(1))[0];
  if (!category) throw new Error('Hoodies category not found — run db:seed first');

  const nagaBrand = (await db.select().from(brands).where(eq(brands.slug, 'naga-apparel')))[0];
  const gender = (await db.select().from(genders).where(eq(genders.slug, 'unisex')))[0];
  const collection = (
    await db.select().from(collections).where(eq(collections.slug, 'naga-original')).limit(1)
  )[0];
  const color = await ensureColor();

  const allSizes = await db.select().from(sizes);
  const apparelSizes = allSizes.filter((s) =>
    ['xs', 's', 'm', 'l', 'xl', 'xxl'].includes(s.slug),
  );

  const product = insertProductSchema.parse({
    name: PRODUCT_NAME,
    description:
      'Cream pullover hoodie with the Naga Original cobra chest graphic. Soft fleece interior, kangaroo pocket, drawstring hood, relaxed street fit.',
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
      sku: `NAGA-${insertedProduct.id.slice(0, 8)}-CREAM-${size.slug.toUpperCase()}`,
      price: '68.00',
      colorId: color.id,
      sizeId: size.id,
      inStock: 25,
      weight: 0.75,
      dimensions: { length: 34, width: 30, height: 10 },
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

  if (collection) {
    await db.insert(productCollections).values({
      productId: insertedProduct.id,
      collectionId: collection.id,
    });
  }

  console.log(`[add-real-hoodie] Created "${PRODUCT_NAME}" (${insertedProduct.id})`);
}

main().catch((e) => {
  console.error('[add-real-hoodie:error]', e);
  process.exitCode = 1;
});
