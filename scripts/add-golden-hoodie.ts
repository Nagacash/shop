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

const PRODUCT_NAME = 'Golden Naga Hoodie';
const IMAGE_SOURCES = [
  {
    src: join(process.cwd(), 'public', 'hoodie', 'gold-front.jpg'),
    fallback: join(process.cwd(), 'public', 'hoddie', 'gold-front.jpg'),
    dest: join(process.cwd(), 'public', 'uploads', 'naga', 'naga-golden-hoodie-front.jpg'),
    url: '/uploads/naga/naga-golden-hoodie-front.jpg',
    sortOrder: 0,
    isPrimary: true,
  },
  {
    src: join(process.cwd(), 'public', 'hoodie', 'gold-back.jpg'),
    fallback: join(process.cwd(), 'public', 'hoddie', 'gold-back.jpg'),
    dest: join(process.cwd(), 'public', 'uploads', 'naga', 'naga-golden-hoodie-back.jpg'),
    url: '/uploads/naga/naga-golden-hoodie-back.jpg',
    sortOrder: 1,
    isPrimary: false,
  },
] as const;

function resolveSource(src: string, fallback: string) {
  if (existsSync(src)) return src;
  if (existsSync(fallback)) return fallback;
  return null;
}

async function main() {
  mkdirSync(join(process.cwd(), 'public', 'uploads', 'naga'), { recursive: true });

  const existing = await db
    .select({ id: products.id })
    .from(products)
    .where(eq(products.name, PRODUCT_NAME))
    .limit(1);

  if (existing.length) {
    console.log(`[add-golden-hoodie] "${PRODUCT_NAME}" already exists (${existing[0].id})`);
    return;
  }

  for (const image of IMAGE_SOURCES) {
    const source = resolveSource(image.src, image.fallback);
    if (source) {
      cpSync(source, image.dest);
      console.log('[add-golden-hoodie] Copied image to', image.dest);
    } else {
      console.warn('[add-golden-hoodie] Source image missing:', image.src);
    }
  }

  const category = (await db.select().from(categories).where(eq(categories.slug, 'hoodies')).limit(1))[0];
  if (!category) throw new Error('Hoodies category not found — run db:seed first');

  const nagaBrand = (await db.select().from(brands).where(eq(brands.slug, 'naga-apparel')))[0];
  const gender = (await db.select().from(genders).where(eq(genders.slug, 'unisex')))[0];
  const collection = (
    await db.select().from(collections).where(eq(collections.slug, 'black-gold-edition')).limit(1)
  )[0];
  const color = (await db.select().from(colors).where(eq(colors.slug, 'gold')).limit(1))[0];
  if (!color) throw new Error('Gold color not found — run db:seed first');

  const allSizes = await db.select().from(sizes);
  const apparelSizes = allSizes.filter((s) =>
    ['xs', 's', 'm', 'l', 'xl', 'xxl'].includes(s.slug),
  );

  const product = insertProductSchema.parse({
    name: PRODUCT_NAME,
    description:
      'Gold pullover hoodie with the Naga cobra graphic on the chest and a bold back print. Soft fleece interior, kangaroo pocket, drawstring hood, relaxed street fit.',
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
      sku: `NAGA-${insertedProduct.id.slice(0, 8)}-GOLD-${size.slug.toUpperCase()}`,
      price: '72.00',
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

  for (const image of IMAGE_SOURCES) {
    const img: InsertProductImage = insertProductImageSchema.parse({
      productId: insertedProduct.id,
      url: existsSync(image.dest) ? image.url : '/uploads/naga/placeholder.svg',
      sortOrder: image.sortOrder,
      isPrimary: image.isPrimary,
    });
    await db.insert(productImages).values(img);
  }

  if (collection) {
    await db.insert(productCollections).values({
      productId: insertedProduct.id,
      collectionId: collection.id,
    });
  }

  console.log(`[add-golden-hoodie] Created "${PRODUCT_NAME}" (${insertedProduct.id})`);
}

main().catch((e) => {
  console.error('[add-golden-hoodie:error]', e);
  process.exitCode = 1;
});
