import { db } from '@/lib/db';
import {
  collections,
  colors,
  productImages,
  productVariants,
  products,
} from '@/lib/db/schema';
import { eq, or } from 'drizzle-orm';
import { cpSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';

const OLD_NAMES = ['Naga Green Set', 'Naga Black Set'];
const NEW_NAME = 'Naga Black Set';
const NEW_DESCRIPTION =
  'Matching black tee and shorts set. Naga Original chest graphic, Hustle Hard leg print, and cobra patch detail. Soft cotton-blend jersey, relaxed street fit.';

const IMAGE_SRC = join(process.cwd(), 'public', 'naga-t-shirt', 'Naga-set-black.jpeg');
const IMAGE_DEST = join(process.cwd(), 'public', 'uploads', 'naga', 'naga-set-black.jpg');
const IMAGE_URL = '/uploads/naga/naga-set-black.jpg';

const COLLECTION_COVER_DEST = join(
  process.cwd(),
  'public',
  'uploads',
  'naga',
  'brand',
  'collections',
  'naga-black.jpg',
);

async function main() {
  mkdirSync(join(process.cwd(), 'public', 'uploads', 'naga'), { recursive: true });
  mkdirSync(join(process.cwd(), 'public', 'uploads', 'naga', 'brand', 'collections'), {
    recursive: true,
  });
  if (existsSync(IMAGE_SRC)) {
    cpSync(IMAGE_SRC, IMAGE_DEST);
    cpSync(IMAGE_SRC, COLLECTION_COVER_DEST);
    console.log('[update-set] Copied product + collection cover images');
  }

  const [product] = await db
    .select({ id: products.id, name: products.name })
    .from(products)
    .where(or(...OLD_NAMES.map((name) => eq(products.name, name))))
    .limit(1);

  if (!product) {
    console.error('[update-set] Product not found — run db:add-naga-green first');
    process.exit(1);
  }

  const [blackColor] = await db.select().from(colors).where(eq(colors.slug, 'black')).limit(1);
  if (!blackColor) throw new Error('Black color not found — run db:seed first');

  await db
    .update(products)
    .set({ name: NEW_NAME, description: NEW_DESCRIPTION })
    .where(eq(products.id, product.id));

  await db
    .update(productVariants)
    .set({ colorId: blackColor.id })
    .where(eq(productVariants.productId, product.id));

  const images = await db
    .select({ id: productImages.id })
    .from(productImages)
    .where(eq(productImages.productId, product.id));

  for (const img of images) {
    await db
      .update(productImages)
      .set({ url: IMAGE_URL })
      .where(eq(productImages.id, img.id));
  }

  const [greenCollection] = await db
    .select()
    .from(collections)
    .where(eq(collections.slug, 'naga-green'))
    .limit(1);

  if (greenCollection) {
    await db
      .update(collections)
      .set({ name: 'Naga Black', slug: 'naga-black' })
      .where(eq(collections.id, greenCollection.id));
  }

  console.log(`[update-set] Updated "${product.name}" → "${NEW_NAME}" with black image and color`);
  console.log('[update-set] Restart dev server (npm run dev:clean) or wait ~2 min for cache to refresh.');
}

main().catch((e) => {
  console.error('[update-set:error]', e);
  process.exitCode = 1;
});
