import { db } from '@/lib/db';
import { productImages, products } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { cpSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';

const PRODUCT_NAME = 'Naga Original White Tee';
const IMAGE_SRC = join(process.cwd(), 'public', 'naga-t-shirt', 'Naga-white-tshirts.jpeg');
const IMAGE_DEST = join(process.cwd(), 'public', 'uploads', 'naga', 'naga-white-tees.jpg');
const IMAGE_URL = '/uploads/naga/naga-white-tees.jpg';

async function main() {
  mkdirSync(join(process.cwd(), 'public', 'uploads', 'naga'), { recursive: true });
  if (existsSync(IMAGE_SRC)) {
    cpSync(IMAGE_SRC, IMAGE_DEST);
    console.log('[update-white-tee] Copied image to', IMAGE_DEST);
  }

  const [product] = await db
    .select({ id: products.id })
    .from(products)
    .where(eq(products.name, PRODUCT_NAME))
    .limit(1);

  if (!product) {
    console.error(`[update-white-tee] Product not found: ${PRODUCT_NAME}`);
    process.exit(1);
  }

  const images = await db
    .select({ id: productImages.id })
    .from(productImages)
    .where(eq(productImages.productId, product.id));

  for (const img of images) {
    await db.update(productImages).set({ url: IMAGE_URL }).where(eq(productImages.id, img.id));
  }

  console.log(`[update-white-tee] Updated ${images.length} image(s) for "${PRODUCT_NAME}"`);
  console.log('[update-white-tee] Restart dev server (npm run dev:clean) to clear cache.');
}

main().catch((e) => {
  console.error('[update-white-tee:error]', e);
  process.exitCode = 1;
});
