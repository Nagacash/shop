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

type TeeProduct = {
  name: string;
  slug: string;
  description: string;
  colorSlug: 'black' | 'white';
  imageFile: string;
  imageDest: string;
  imageUrl: string;
  price: string;
  collectionSlug: string;
};

const TEES: TeeProduct[] = [
  {
    name: 'Naga Original Black Tee',
    slug: 'tshirt-black',
    description:
      'Classic black crew neck with the Naga Original chest graphic. Heavyweight cotton jersey, relaxed street fit, true-to-size.',
    colorSlug: 'black',
    imageFile: 'Naga-wood.jpeg',
    imageDest: 'naga-wood.jpg',
    imageUrl: '/uploads/naga/naga-wood.jpg',
    price: '32.00',
    collectionSlug: 'naga-original',
  },
  {
    name: 'Naga Original White Tee',
    slug: 'tshirt-white',
    description:
      'Crisp white crew neck with the Naga Original chest graphic. Premium cotton, clean contrast print, everyday street staple.',
    colorSlug: 'white',
    imageFile: 'Naga-white-tshirts.jpeg',
    imageDest: 'naga-white-tees.jpg',
    imageUrl: '/uploads/naga/naga-white-tees.jpg',
    price: '32.00',
    collectionSlug: 'naga-original',
  },
];

async function main() {
  const uploadsDir = join(process.cwd(), 'public', 'uploads', 'naga');
  const sourceDir = join(process.cwd(), 'public', 'naga-t-shirt');
  mkdirSync(uploadsDir, { recursive: true });

  const nagaBrand = (await db.select().from(brands).where(eq(brands.slug, 'naga-apparel')))[0];
  const gender = (await db.select().from(genders).where(eq(genders.slug, 'unisex')))[0];
  const category = (await db.select().from(categories).where(eq(categories.slug, 'tees')))[0];
  const allSizes = await db.select().from(sizes);
  const apparelSizes = allSizes.filter((s) =>
    ['xs', 's', 'm', 'l', 'xl', 'xxl'].includes(s.slug),
  );

  if (!category) throw new Error('Tees category not found — run db:seed first');

  for (const tee of TEES) {
    const existing = await db
      .select({ id: products.id })
      .from(products)
      .where(eq(products.name, tee.name))
      .limit(1);

    if (existing.length) {
      console.log(`[add-real-tees] "${tee.name}" already exists (${existing[0].id})`);
      continue;
    }

    const src = join(sourceDir, tee.imageFile);
    const dest = join(uploadsDir, tee.imageDest);
    if (existsSync(src)) {
      cpSync(src, dest);
      console.log(`[add-real-tees] Copied ${tee.imageFile} → ${dest}`);
    } else {
      console.warn(`[add-real-tees] Missing source image: ${src}`);
    }

    const color = (await db.select().from(colors).where(eq(colors.slug, tee.colorSlug)))[0];
    if (!color) throw new Error(`Color "${tee.colorSlug}" not found`);

    const collection = (
      await db.select().from(collections).where(eq(collections.slug, tee.collectionSlug)).limit(1)
    )[0];

    const product = insertProductSchema.parse({
      name: tee.name,
      description: tee.description,
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
        sku: `NAGA-${insertedProduct.id.slice(0, 8)}-${tee.colorSlug.toUpperCase()}-${size.slug.toUpperCase()}`,
        price: tee.price,
        colorId: color.id,
        sizeId: size.id,
        inStock: 25,
        weight: 0.35,
        dimensions: { length: 30, width: 25, height: 4 },
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
      url: existsSync(dest) ? tee.imageUrl : '/uploads/naga/placeholder.svg',
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

    console.log(`[add-real-tees] Created "${tee.name}" (${insertedProduct.id})`);
  }
}

main().catch((e) => {
  console.error('[add-real-tees:error]', e);
  process.exitCode = 1;
});
