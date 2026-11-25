/**
 * Add the Chosen Few Records Tee and Hoodie — black garments with the label's
 * lion / crossed spears / star logo in white. The logo file is placed exactly as
 * supplied (only scaled) in the product photos; it is never redrawn.
 *
 * Both pieces are styled to pair with the Lion Head Clasp Miami Cuban chain.
 * Category and brand are copied from the Naga Original tee and hoodie; prices come
 * from the tier map in src/lib/pricing/catalog-tiers.ts.
 *
 * Run: npm run db:add-chosen-few-records
 */
import { db } from '@/lib/db';
import { colors, productImages, productVariants, products, sizes } from '@/lib/db/schema';
import { retailPriceForProduct } from '@/lib/pricing/catalog-tiers';
import { eq } from 'drizzle-orm';

const APPAREL_SIZES = ['xs', 's', 'm', 'l', 'xl', 'xxl'];
const CHAIN = 'Lion Head Clasp 10mm Miami Cuban Link Chain';

const ITEMS = [
  {
    name: 'Chosen Few Records Tee',
    siblingName: 'Naga Original Tee',
    skuPart: 'CFR-TEE',
    weight: 0.25,
    description: `Chosen Few Records Tee. Black heavyweight cotton with the Chosen Few Records lion, crossed spears and star crest printed in white on the chest. Made to be worn with the ${CHAIN}.`,
    images: ['/uploads/naga/chosen-few-tee-floor.jpg', '/uploads/naga/chosen-few-tee-close.jpg'],
  },
  {
    name: 'Chosen Few Records Hoodie',
    siblingName: 'Naga Original Hoodie',
    skuPart: 'CFR-HOODIE',
    weight: 0.75,
    description: `Chosen Few Records Hoodie. Black fleece with the Chosen Few Records lion, crossed spears and star crest printed in white on the chest. Made to be worn with the ${CHAIN}.`,
    images: ['/uploads/naga/chosen-few-hoodie-floor.jpg', '/uploads/naga/chosen-few-hoodie-detail.jpg'],
  },
] as const;

async function main() {
  const [black] = await db.select().from(colors).where(eq(colors.slug, 'black')).limit(1);
  if (!black) throw new Error('Black color not found');
  const allSizes = await db.select().from(sizes);
  const apparel = APPAREL_SIZES.map((slug) => allSizes.find((s) => s.slug === slug)).filter((s) => !!s);

  for (const item of ITEMS) {
    const [existing] = await db.select({ id: products.id }).from(products).where(eq(products.name, item.name)).limit(1);
    if (existing) {
      console.log(`[add-chosen-few] "${item.name}" already exists (${existing.id})`);
      continue;
    }

    const price = retailPriceForProduct(item.name);
    if (price == null) throw new Error('No retail tier for ' + item.name);

    const [sibling] = await db
      .select({ categoryId: products.categoryId, brandId: products.brandId, genderId: products.genderId })
      .from(products)
      .where(eq(products.name, item.siblingName))
      .limit(1);
    if (!sibling) throw new Error(`${item.siblingName} not found`);

    const [product] = await db
      .insert(products)
      .values({
        name: item.name,
        description: item.description,
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
          sku: `${item.skuPart}-${product.id.slice(0, 8)}-BLACK-${size!.slug.toUpperCase()}`,
          price: price.toFixed(2),
          colorId: black.id,
          sizeId: size!.id,
          inStock: 25,
          weight: item.weight,
        })
        .returning();
      if (!defaultVariantId) defaultVariantId = v.id;
    }
    if (defaultVariantId) {
      await db.update(products).set({ defaultVariantId }).where(eq(products.id, product.id));
    }

    for (const [i, url] of item.images.entries()) {
      await db.insert(productImages).values({ productId: product.id, url, sortOrder: i, isPrimary: i === 0 });
    }
    console.log(`[add-chosen-few] Created "${item.name}" (${product.id}) at €${price}`);
  }
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error('[add-chosen-few:error]', e?.cause?.message ?? e);
    process.exit(1);
  });
