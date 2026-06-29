import { db } from '@/lib/db';
import { productImages, products } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { cpSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';

const PRODUCT_NAME = 'Naga Original Black Tee';
const IMAGE_CANDIDATES = ['Naga-wood.jpg', 'Naga-wood.jpeg'];
const IMAGE_DEST = join(process.cwd(), 'public', 'uploads', 'naga', 'naga-wood.jpg');
const IMAGE_URL = '/uploads/naga/naga-wood.jpg';

function resolveSource(): string | null {
  const dir = join(process.cwd(), 'public', 'naga-t-shirt');
  for (const name of IMAGE_CANDIDATES) {
    const path = join(dir, name);
    if (existsSync(path)) return path;
  }
  return null;
}

async function main() {
  mkdirSync(join(process.cwd(), 'public', 'uploads', 'naga'), { recursive: true });

  const source = resolveSource();
  if (source) {
    cpSync(source, IMAGE_DEST);
    console.log('[update-black-tee] Copied image to', IMAGE_DEST);
  } else {
    console.error('[update-black-tee] Source not found (Naga-wood.jpg / Naga-wood.jpeg)');
    process.exit(1);
  }

  const [product] = await db
    .select({ id: products.id })
    .from(products)
    .where(eq(products.name, PRODUCT_NAME))
    .limit(1);

  if (!product) {
    console.error(`[update-black-tee] Product not found: ${PRODUCT_NAME}`);
    process.exit(1);
  }

  const images = await db
    .select({ id: productImages.id })
    .from(productImages)
    .where(eq(productImages.productId, product.id));

  for (const img of images) {
    await db.update(productImages).set({ url: IMAGE_URL }).where(eq(productImages.id, img.id));
  }

  console.log(`[update-black-tee] Updated ${images.length} image(s) for "${PRODUCT_NAME}"`);
  console.log('[update-black-tee] Restart dev server (npm run dev:clean) to clear cache.');
}

main().catch((e) => {
  console.error('[update-black-tee:error]', e);
  process.exitCode = 1;
});
