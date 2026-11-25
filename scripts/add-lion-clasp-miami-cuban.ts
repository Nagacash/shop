/**
 * Add the Lion Head Clasp 10mm Miami Cuban Link Chain (supplier KRKC, series 0301).
 *
 * Source: "10-Miami Cuban.pdf" — KRKC-0301 slant 4-sides polished, 10mm, 14K gold plate + steel.
 * Only SKUs with a listed price in the PDF are created (18K gold 24in is not listed).
 *
 * Model: colors = gold / steel; sizes = chain length (18–26 in). Product is created
 * unpublished so the price can be confirmed in admin before it goes live.
 *
 * Run: npm run db:add-lion-clasp-miami-cuban
 */
import { db } from '@/lib/db';
import {
  brands,
  categories,
  colors,
  productImages,
  productVariants,
  products,
  sizes,
  insertColorSchema,
  insertProductImageSchema,
  insertProductSchema,
  insertSizeSchema,
  insertVariantSchema,
  type InsertProductImage,
  type InsertVariant,
} from '@/lib/db/schema';
import { DROPSHIP_DEFAULT_PLACEHOLDER_STOCK } from '@/lib/inventory/dropship';
import { eq, ilike } from 'drizzle-orm';

const PRODUCT_NAME = 'Lion Head Clasp 10mm Miami Cuban Link Chain';
/** Placeholder — same as the existing supplier chain. Confirm before publishing. */
const PLACEHOLDER_PRICE_EUR = '49.00';

const LENGTHS_IN = [18, 20, 22, 24, 26] as const;

/** Only SKUs with a listed price in the supplier PDF. */
const SKU_TABLE: Record<'GD' | 'SL', { length: number; sku: string }[]> = {
  GD: [18, 20, 22, 26].map((length) => ({ length, sku: `KRKC-0301-CH-GD-10mm-${length}in` })),
  SL: [18, 20, 22, 24, 26].map((length) => ({ length, sku: `KRKC-0301-CH-SL-10mm-${length}in` })),
};

const IMAGES = [
  { url: '/uploads/krkc/miami-cuban-lion-silver-hero.jpg', sortOrder: 0, isPrimary: true },
  { url: '/uploads/krkc/miami-cuban-lion-gold-wrist.jpg', sortOrder: 1, isPrimary: false },
  { url: '/uploads/krkc/miami-cuban-lion-silver-leather.jpg', sortOrder: 2, isPrimary: false },
] as const;

const DESCRIPTION =
  '10mm Miami Cuban link chain with a lion-head clasp. Polished stainless steel with a 14K gold plate or steel finish. Available in 18 to 26 inches. Keep it dry and wipe it after wearing to keep the shine.';

async function ensureColor(name: string, slug: string, hexCode: string) {
  const [existing] = await db.select().from(colors).where(eq(colors.slug, slug)).limit(1);
  if (existing) return existing;
  const [created] = await db
    .insert(colors)
    .values(insertColorSchema.parse({ name, slug, hexCode }))
    .returning();
  console.log(`[add-lion-clasp] Created color "${name}"`);
  return created;
}

async function ensureLengthSize(inches: number, sortOrder: number) {
  const slug = `chain-${inches}in`;
  const [existing] = await db.select().from(sizes).where(eq(sizes.slug, slug)).limit(1);
  if (existing) return existing;
  const [created] = await db
    .insert(sizes)
    .values(insertSizeSchema.parse({ name: `${inches} in`, slug, sortOrder }))
    .returning();
  console.log(`[add-lion-clasp] Created size "${created.name}"`);
  return created;
}

async function main() {
  const [existing] = await db
    .select({ id: products.id })
    .from(products)
    .where(eq(products.name, PRODUCT_NAME))
    .limit(1);
  if (existing) {
    console.log(`[add-lion-clasp] "${PRODUCT_NAME}" already exists (${existing.id})`);
    return;
  }

  // Reuse the category and brand of the existing supplier Miami Cuban chain.
  const [sibling] = await db
    .select({ categoryId: products.categoryId, brandId: products.brandId })
    .from(products)
    .where(ilike(products.name, '%Miami Cuban%'))
    .limit(1);
  let categoryId = sibling?.categoryId ?? null;
  if (!categoryId) {
    const [chains] = await db.select().from(categories).where(eq(categories.slug, 'chains')).limit(1);
    if (!chains) throw new Error('Chains category not found — run db:seed first');
    categoryId = chains.id;
  }
  const brandId = sibling?.brandId ?? (await db.select().from(brands).limit(1))[0]?.id ?? null;

  const gold = await db.select().from(colors).where(eq(colors.slug, 'gold')).limit(1).then((r) => r[0]);
  if (!gold) throw new Error('Gold color not found — run db:seed first');
  const steel = await ensureColor('Steel', 'steel', '#C0C0C0');

  const sizeByLength = new Map<number, (typeof sizes.$inferSelect)>();
  for (const [i, inches] of LENGTHS_IN.entries()) {
    sizeByLength.set(inches, await ensureLengthSize(inches, 100 + i));
  }

  const [inserted] = await db
    .insert(products)
    .values(
      insertProductSchema.parse({
        name: PRODUCT_NAME,
        description: DESCRIPTION,
        categoryId,
        brandId,
        genderId: null,
        isPublished: false,
      }),
    )
    .returning();

  let defaultVariantId: string | null = null;
  const colorFor = { GD: gold, SL: steel } as const;

  for (const finish of ['GD', 'SL'] as const) {
    for (const { length, sku } of SKU_TABLE[finish]) {
      const size = sizeByLength.get(length);
      if (!size) throw new Error(`Missing size for ${length}in`);
      const variant = insertVariantSchema.parse({
        productId: inserted.id,
        sku,
        price: PLACEHOLDER_PRICE_EUR,
        colorId: colorFor[finish].id,
        sizeId: size.id,
        inStock: DROPSHIP_DEFAULT_PLACEHOLDER_STOCK,
      });
      const [created] = await db
        .insert(productVariants)
        .values(variant as InsertVariant)
        .returning();
      if (!defaultVariantId) defaultVariantId = created.id;
    }
  }

  if (defaultVariantId) {
    await db.update(products).set({ defaultVariantId }).where(eq(products.id, inserted.id));
  }

  for (const image of IMAGES) {
    const img: InsertProductImage = insertProductImageSchema.parse({
      productId: inserted.id,
      url: image.url,
      sortOrder: image.sortOrder,
      isPrimary: image.isPrimary,
    });
    await db.insert(productImages).values(img);
  }

  console.log(
    `[add-lion-clasp] Created "${PRODUCT_NAME}" (${inserted.id}) — ${SKU_TABLE.GD.length + SKU_TABLE.SL.length} variants, unpublished`,
  );
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error('[add-lion-clasp:error]', e);
    process.exit(1);
  });
