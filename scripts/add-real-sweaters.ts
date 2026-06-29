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

type SweaterProduct = {
  name: string;
  description: string;
  colorSlug: string;
  colorName: string;
  colorHex: `#${string}`;
  imageFile: string;
  imageDest: string;
  imageUrl: string;
  price: string;
};

const SWEATERS: SweaterProduct[] = [
  {
    name: 'Naga Original Grey Sweater',
    description:
      'Heavyweight grey crew sweater with the Naga Original chest graphic. Soft brushed fleece interior, relaxed fit, everyday street layer.',
    colorSlug: 'gray',
    colorName: 'Gray',
    colorHex: '#6B7280',
    imageFile: 'Naga-sweater-grey.jpeg',
    imageDest: 'naga-sweater-grey.jpg',
    imageUrl: '/uploads/naga/naga-sweater-grey.jpg',
    price: '58.00',
  },
  {
    name: 'Naga Original Light Brown Sweater',
    description:
      'Light brown crew sweater with the Naga Original chest graphic. Premium knit, warm neutral tone, relaxed street fit.',
    colorSlug: 'light-brown',
    colorName: 'Light Brown',
    colorHex: '#C4A574',
    imageFile: 'Naga-sweater-lightbrown.jpeg',
    imageDest: 'naga-sweater-lightbrown.jpg',
    imageUrl: '/uploads/naga/naga-sweater-lightbrown.jpg',
    price: '58.00',
  },
];

async function ensureCategory(slug: string, name: string) {
  const existing = await db.select().from(categories).where(eq(categories.slug, slug)).limit(1);
  if (existing.length) return existing[0];
  const row = insertCategorySchema.parse({ name, slug, parentId: null });
  const [created] = await db.insert(categories).values(row).returning();
  return created;
}

async function ensureColor(slug: string, name: string, hexCode: `#${string}`) {
  const existing = await db.select().from(colors).where(eq(colors.slug, slug)).limit(1);
  if (existing.length) return existing[0];
  const row = insertColorSchema.parse({ name, slug, hexCode });
  const [created] = await db.insert(colors).values(row).returning();
  return created;
}

async function main() {
  const uploadsDir = join(process.cwd(), 'public', 'uploads', 'naga');
  const sourceDir = join(process.cwd(), 'public', 'naga-t-shirt');
  mkdirSync(uploadsDir, { recursive: true });

  const category = await ensureCategory('sweaters', 'Sweaters');
  const nagaBrand = (await db.select().from(brands).where(eq(brands.slug, 'naga-apparel')))[0];
  const gender = (await db.select().from(genders).where(eq(genders.slug, 'unisex')))[0];
  const collection = (
    await db.select().from(collections).where(eq(collections.slug, 'naga-original')).limit(1)
  )[0];

  const allSizes = await db.select().from(sizes);
  const apparelSizes = allSizes.filter((s) =>
    ['xs', 's', 'm', 'l', 'xl', 'xxl'].includes(s.slug),
  );

  for (const sweater of SWEATERS) {
    const existing = await db
      .select({ id: products.id })
      .from(products)
      .where(eq(products.name, sweater.name))
      .limit(1);

    if (existing.length) {
      console.log(`[add-real-sweaters] "${sweater.name}" already exists (${existing[0].id})`);
      continue;
    }

    const src = join(sourceDir, sweater.imageFile);
    const dest = join(uploadsDir, sweater.imageDest);
    if (existsSync(src)) {
      cpSync(src, dest);
      console.log(`[add-real-sweaters] Copied ${sweater.imageFile} → ${dest}`);
    } else {
      console.warn(`[add-real-sweaters] Missing source image: ${src}`);
    }

    const color = await ensureColor(sweater.colorSlug, sweater.colorName, sweater.colorHex);

    const product = insertProductSchema.parse({
      name: sweater.name,
      description: sweater.description,
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
    const skuColor = sweater.colorSlug.replace(/-/g, '').toUpperCase().slice(0, 6);

    for (const size of apparelSizes) {
      const variant = insertVariantSchema.parse({
        productId: insertedProduct.id,
        sku: `NAGA-${insertedProduct.id.slice(0, 8)}-${skuColor}-${size.slug.toUpperCase()}`,
        price: sweater.price,
        colorId: color.id,
        sizeId: size.id,
        inStock: 25,
        weight: 0.65,
        dimensions: { length: 32, width: 28, height: 8 },
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
      url: existsSync(dest) ? sweater.imageUrl : '/uploads/naga/placeholder.svg',
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

    console.log(`[add-real-sweaters] Created "${sweater.name}" (${insertedProduct.id})`);
  }
}

main().catch((e) => {
  console.error('[add-real-sweaters:error]', e);
  process.exitCode = 1;
});
