import { db } from '@/lib/db';
import {
  genders, colors, sizes, brands, categories, collections, productCollections,
  products, productVariants, productImages, cartItems, orderItems, orders, reviews, wishlists,
  insertGenderSchema, insertColorSchema, insertSizeSchema, insertBrandSchema,
  insertCategorySchema, insertCollectionSchema, insertProductSchema, insertVariantSchema, insertProductImageSchema,
  type InsertProduct, type InsertVariant, type InsertProductImage,
} from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { mkdirSync, existsSync, cpSync } from 'fs';
import { join, basename } from 'path';

type ProductRow = typeof products.$inferSelect;
type VariantRow = typeof productVariants.$inferSelect;

type RGBHex = `#${string}`;

const log = (...args: unknown[]) => console.log('[seed]', ...args);
const err = (...args: unknown[]) => console.error('[seed:error]', ...args);

type NagaProduct = {
  name: string;
  description: string;
  categorySlug: 'hoodies' | 'tees' | 'headwear' | 'sets';
  collectionSlug: string;
  genderSlug: 'men' | 'women' | 'unisex' | 'kids';
  basePrice: number;
  headwear?: boolean;
  imageFile?: string;
  imageUrl?: string;
  colorSlugs?: Array<'black' | 'white' | 'gold' | 'green'>;
  inStock?: number;
};

const NAGA_PRODUCTS: NagaProduct[] = [
  {
    name: 'Naga Green Set',
    description:
      'Matching sage green tee and shorts set. Naga Original chest graphic, Hustle Hard leg print, and cobra patch detail. Soft cotton-blend jersey, relaxed street fit.',
    categorySlug: 'sets',
    collectionSlug: 'naga-green',
    genderSlug: 'unisex',
    basePrice: 48,
    imageUrl: '/uploads/naga/naga-green.jpg',
    colorSlugs: ['green'],
    inStock: 0,
  },
  {
    name: 'Naga Original Black Tee',
    description:
      'Classic black crew neck with the Naga Original chest graphic. Heavyweight cotton jersey, relaxed street fit, true-to-size.',
    categorySlug: 'tees',
    collectionSlug: 'naga-original',
    genderSlug: 'unisex',
    basePrice: 32,
    imageUrl: '/uploads/naga/tshirt-black.png',
    colorSlugs: ['black'],
  },
  {
    name: 'Naga Original White Tee',
    description:
      'Crisp white crew neck with the Naga Original chest graphic. Premium cotton, clean contrast print, everyday street staple.',
    categorySlug: 'tees',
    collectionSlug: 'naga-original',
    genderSlug: 'unisex',
    basePrice: 32,
    imageUrl: '/uploads/naga/tshirt-white.png',
    colorSlugs: ['white'],
  },
];

async function clearProductData() {
  log('Clearing existing product, cart, and order data (SEED_REPLACE=1)');
  await db.delete(cartItems);
  await db.delete(orderItems);
  await db.delete(orders);
  await db.delete(reviews);
  await db.delete(wishlists);
  await db.delete(productCollections);
  await db.delete(productImages);
  await db.delete(productVariants);
  await db.delete(products);
}

async function seed() {
  try {
    const replace = process.env.SEED_REPLACE === '1' || process.env.SEED_REPLACE === 'true';

    if (replace) {
      await clearProductData();
    } else {
      const existing = await db.select({ id: products.id }).from(products).limit(1);
      if (existing.length) {
        log('Products already exist. Set SEED_REPLACE=1 to wipe and re-seed Naga catalog.');
        return;
      }
    }

    log('Seeding filters: genders, colors, sizes');

    const genderRows = [
      insertGenderSchema.parse({ label: 'Men', slug: 'men' }),
      insertGenderSchema.parse({ label: 'Women', slug: 'women' }),
      insertGenderSchema.parse({ label: 'Unisex', slug: 'unisex' }),
      insertGenderSchema.parse({ label: 'Kids', slug: 'kids' }),
    ];
    for (const row of genderRows) {
      const exists = await db.select().from(genders).where(eq(genders.slug, row.slug)).limit(1);
      if (!exists.length) await db.insert(genders).values(row);
    }

    const colorRows = [
      { name: 'Black', slug: 'black', hexCode: '#000000' as RGBHex },
      { name: 'White', slug: 'white', hexCode: '#FFFFFF' as RGBHex },
      { name: 'Gold', slug: 'gold', hexCode: '#C9A227' as RGBHex },
      { name: 'Red', slug: 'red', hexCode: '#FF0000' as RGBHex },
      { name: 'Blue', slug: 'blue', hexCode: '#1E3A8A' as RGBHex },
      { name: 'Green', slug: 'green', hexCode: '#10B981' as RGBHex },
      { name: 'Gray', slug: 'gray', hexCode: '#6B7280' as RGBHex },
    ].map((c) => insertColorSchema.parse(c));
    for (const row of colorRows) {
      const exists = await db.select().from(colors).where(eq(colors.slug, row.slug)).limit(1);
      if (!exists.length) await db.insert(colors).values(row);
    }

    const sizeRows = [
      { name: 'XS', slug: 'xs', sortOrder: 0 },
      { name: 'S', slug: 's', sortOrder: 1 },
      { name: 'M', slug: 'm', sortOrder: 2 },
      { name: 'L', slug: 'l', sortOrder: 3 },
      { name: 'XL', slug: 'xl', sortOrder: 4 },
      { name: 'XXL', slug: 'xxl', sortOrder: 5 },
      { name: 'One Size', slug: 'one-size', sortOrder: 6 },
    ].map((s) => insertSizeSchema.parse(s));
    for (const row of sizeRows) {
      const exists = await db.select().from(sizes).where(eq(sizes.slug, row.slug)).limit(1);
      if (!exists.length) await db.insert(sizes).values(row);
    }

    log('Seeding brand: Naga Apparel');
    const brand = insertBrandSchema.parse({ name: 'Naga Apparel', slug: 'naga-apparel', logoUrl: undefined });
    {
      const exists = await db.select().from(brands).where(eq(brands.slug, brand.slug)).limit(1);
      if (!exists.length) await db.insert(brands).values(brand);
    }

    log('Seeding categories');
    const catRows = [
      { name: 'Hoodies', slug: 'hoodies', parentId: null },
      { name: 'Tees', slug: 'tees', parentId: null },
      { name: 'Headwear', slug: 'headwear', parentId: null },
      { name: 'Sets', slug: 'sets', parentId: null },
    ].map((c) => insertCategorySchema.parse(c));
    for (const row of catRows) {
      const exists = await db.select().from(categories).where(eq(categories.slug, row.slug)).limit(1);
      if (!exists.length) await db.insert(categories).values(row);
    }

    log('Seeding collections');
    const collectionRows = [
      insertCollectionSchema.parse({ name: 'Hustle Hard Drip', slug: 'hustle-hard-drip' }),
      insertCollectionSchema.parse({ name: 'Naga Original', slug: 'naga-original' }),
      insertCollectionSchema.parse({ name: 'Black & Gold Edition', slug: 'black-gold-edition' }),
      insertCollectionSchema.parse({ name: 'Naga Square', slug: 'naga-square' }),
      insertCollectionSchema.parse({ name: 'Golden Drip', slug: 'golden-drip' }),
      insertCollectionSchema.parse({ name: 'NAGA OG', slug: 'naga-og' }),
      insertCollectionSchema.parse({ name: 'Naga Green', slug: 'naga-green' }),
    ];
    for (const row of collectionRows) {
      const exists = await db.select().from(collections).where(eq(collections.slug, row.slug)).limit(1);
      if (!exists.length) await db.insert(collections).values(row);
    }

    const allGenders = await db.select().from(genders);
    const allColors = await db.select().from(colors);
    const allSizes = await db.select().from(sizes);
    const nagaBrand = (await db.select().from(brands).where(eq(brands.slug, 'naga-apparel')))[0];
    const categoryMap = Object.fromEntries(
      (await db.select().from(categories)).map((c) => [c.slug, c])
    );
    const collectionMap = Object.fromEntries(
      (await db.select().from(collections)).map((c) => [c.slug, c])
    );

    const uploadsRoot = join(process.cwd(), 'public', 'uploads', 'naga');
    if (!existsSync(uploadsRoot)) {
      mkdirSync(uploadsRoot, { recursive: true });
    }

    const sourceDir = join(process.cwd(), 'public', 'shoes');
    const sourceImages = [
      'shoe-1.jpg', 'shoe-2.webp', 'shoe-3.webp', 'shoe-4.webp', 'shoe-5.avif',
      'shoe-6.avif', 'shoe-7.avif', 'shoe-8.avif', 'shoe-9.avif',
    ];

    const blackColor = allColors.find((c) => c.slug === 'black');
    const goldColor = allColors.find((c) => c.slug === 'gold');
    const whiteColor = allColors.find((c) => c.slug === 'white');
    const apparelSizes = allSizes.filter((s) => ['xs', 's', 'm', 'l', 'xl', 'xxl'].includes(s.slug));
    const oneSize = allSizes.find((s) => s.slug === 'one-size');

    log('Creating Naga products with variants and images');
    for (let i = 0; i < NAGA_PRODUCTS.length; i++) {
      const item = NAGA_PRODUCTS[i];
      const gender = allGenders.find((g) => g.slug === item.genderSlug);
      const category = categoryMap[item.categorySlug];
      const collection = collectionMap[item.collectionSlug];

      const product = insertProductSchema.parse({
        name: item.name,
        description: item.description,
        categoryId: category?.id ?? null,
        genderId: gender?.id ?? null,
        brandId: nagaBrand?.id ?? null,
        isPublished: true,
      });

      const retP = await db.insert(products).values(product as InsertProduct).returning();
      const insertedProduct = (retP as ProductRow[])[0];

      const colorChoices = item.colorSlugs?.length
        ? item.colorSlugs.map((slug) => allColors.find((c) => c.slug === slug)).filter(Boolean)
        : item.categorySlug === 'headwear'
          ? [blackColor, goldColor].filter(Boolean)
          : [blackColor, whiteColor, goldColor].filter(Boolean);

      const sizeChoices = item.headwear
        ? oneSize ? [oneSize] : apparelSizes.slice(2, 3)
        : apparelSizes;

      let defaultVariantId: string | null = null;
      let variantCount = 0;

      for (const color of colorChoices) {
        if (!color) continue;
        for (const size of sizeChoices) {
          const priceNum = Number(item.basePrice.toFixed(2));
          const discountedNum =
            item.collectionSlug === 'black-gold-edition' && Math.random() < 0.25
              ? Number((priceNum - 5).toFixed(2))
              : null;
          const sku = `NAGA-${insertedProduct.id.slice(0, 8)}-${color.slug.toUpperCase()}-${size.slug.toUpperCase()}`;
          const variant = insertVariantSchema.parse({
            productId: insertedProduct.id,
            sku,
            price: priceNum.toFixed(2),
            salePrice: discountedNum !== null ? discountedNum.toFixed(2) : undefined,
            colorId: color.id,
            sizeId: size.id,
            inStock: item.inStock ?? 25,
            weight: item.headwear ? 0.15 : 0.45,
            dimensions: item.headwear
              ? { length: 20, width: 20, height: 8 }
              : { length: 30, width: 25, height: 5 },
          });
          const retV = await db.insert(productVariants).values(variant as InsertVariant).returning();
          const created = (retV as VariantRow[])[0];
          variantCount += 1;
          if (!defaultVariantId) defaultVariantId = created.id;
        }
      }

      if (defaultVariantId) {
        await db.update(products).set({ defaultVariantId }).where(eq(products.id, insertedProduct.id));
      }

      let imageUrl = item.imageUrl ?? '/uploads/naga/placeholder.svg';

      if (!item.imageUrl) {
        const pickName = sourceImages[i % sourceImages.length];
        const src = item.imageFile
          ? join(process.cwd(), 'public', item.imageFile)
          : join(sourceDir, pickName);
        const destName = item.imageFile
          ? basename(item.imageFile).replace(/\.JPG$/i, '.jpg')
          : `${insertedProduct.id}-${basename(pickName)}`;
        const dest = join(uploadsRoot, destName);
        try {
          if (existsSync(src)) {
            cpSync(src, dest);
          }
          imageUrl = existsSync(dest) ? `/uploads/naga/${destName}` : '/uploads/naga/placeholder.svg';
        } catch (e) {
          err('Failed to copy product image', { src, dest, e });
          imageUrl = '/uploads/naga/placeholder.svg';
        }
      }

      const img: InsertProductImage = insertProductImageSchema.parse({
        productId: insertedProduct.id,
        url: imageUrl,
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

      log(`Seeded ${item.name} with ${variantCount} variants`);
    }

    log('Naga Apparel seeding complete');
    log('Tomorrow: drop real photos into public/uploads/naga/ and update product_images.url in Neon');
  } catch (e) {
    err(e);
    process.exitCode = 1;
  }
}

seed();
