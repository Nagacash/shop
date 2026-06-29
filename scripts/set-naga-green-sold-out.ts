import { db } from '@/lib/db';
import { products, productVariants } from '@/lib/db/schema';
import { eq, inArray } from 'drizzle-orm';

const PRODUCT_NAME = 'Naga Green Set';

async function main() {
  const [product] = await db
    .select({ id: products.id })
    .from(products)
    .where(eq(products.name, PRODUCT_NAME))
    .limit(1);

  if (!product) {
    console.error(`[set-stock] Product not found: ${PRODUCT_NAME}`);
    process.exit(1);
  }

  const updated = await db
    .update(productVariants)
    .set({ inStock: 0 })
    .where(eq(productVariants.productId, product.id))
    .returning({ id: productVariants.id });

  console.log(`[set-stock] ${PRODUCT_NAME}: set ${updated.length} variant(s) to sold out (inStock=0)`);
}

main().catch((e) => {
  console.error('[set-stock:error]', e);
  process.exitCode = 1;
});
