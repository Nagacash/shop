/**
 * Add Naga Golden Edition Sweater — black knit sweater with the gold Naga crest
 * (sweater counterpart of Naga Golden Edition Hoodie).
 *
 * Copies category and brand from Naga Original Sweater and mirrors its sizes.
 * Price comes from the sweaterPremium tier in src/lib/pricing/catalog-tiers.ts.
 *
 * Run: npm run db:add-golden-empire-crew
 */
import { db } from '@/lib/db';
import {
  colors,
  productImages,
  productVariants,
  products,
  sizes,
} from '@/lib/db/schema';
import { retailPriceForProduct } from '@/lib/pricing/catalog-tiers';
import { eq } from 'drizzle-orm';

const PRODUCT_NAME = 'Naga Golden Edition Sweater';
const IMAGE_URL = '/uploads/naga/golden-empire-sweater.jpg';
const APPAREL_SIZES = ['xs', 's', 'm', 'l', 'xl', 'xxl'];

async function main() {
  const [existing] = await db.select({ id: products.id }).from(products).where(eq(products.name, PRODUCT_NAME)).limit(1);
  if (existing) {
    console.log(`[add-golden-empire-crew] "${PRODUCT_NAME}" already exists (${existing.id})`);
    return;
  }

  const price = retailPriceForProduct(PRODUCT_NAME);
  if (price == null) throw new Error('No retail tier for ' + PRODUCT_NAME);

  const [sibling] = await db
    .select({ categoryId: products.categoryId, brandId: products.brandId, genderId: products.genderId })
    .from(products)
    .where(eq(products.name, 'Naga Original Sweater'))
    .limit(1);
  if (!sibling) throw new Error('Naga Original Sweater not found');

  const [gold] = await db.select().from(colors).where(eq(colors.slug, 'gold')).limit(1);
  if (!gold) throw new Error('Gold color not found');

  const allSizes = await db.select().from(sizes);
  const apparel = APPAREL_SIZES.map((slug) => allSizes.find((s) => s.slug === slug)).filter((s) => !!s);

  const [product] = await db
    .insert(products)
    .values({
      name: PRODUCT_NAME,
      description:
        'Naga Golden Edition Sweater. Black premium knit with the gold Naga cobra crest on the chest. Built for the hustle.',
      categoryId: sibling.categoryId,
      brandId: sibling.brandId,
      genderId: sibling.genderId,
      isPublished: true,
    })
    .returning();

  let defaultVariantId: string | null = null;
  for (const size of apparel) {
    const [v] = await db
      .insert(productVariants)
      .values({
        productId: product.id,
        sku: `NAGA-${product.id.slice(0, 8)}-GOLD-${size!.slug.toUpperCase()}`,
        price: price.toFixed(2),
        colorId: gold.id,
        sizeId: size!.id,
        inStock: 25,
        weight: 0.65,
      })
      .returning();
    if (!defaultVariantId) defaultVariantId = v.id;
  }
  if (defaultVariantId) {
    await db.update(products).set({ defaultVariantId }).where(eq(products.id, product.id));
  }

  await db.insert(productImages).values({ productId: product.id, url: IMAGE_URL, sortOrder: 0, isPrimary: true });
  console.log(`[add-golden-empire-crew] Created "${PRODUCT_NAME}" (${product.id}) at €${price}`);
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error('[add-golden-empire-crew:error]', e?.cause?.message ?? e);
    process.exit(1);
  });
