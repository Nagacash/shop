/**
 * Apply retail tier prices from src/lib/pricing/catalog-tiers.ts
 *
 * Run: npm run db:set-retail-prices
 * Dry run: DRY_RUN=1 npm run db:set-retail-prices
 */
import { db } from "@/lib/db";
import { products, productVariants } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import {
  RETAIL_TIER_SUMMARY,
  retailPriceForProduct,
} from "@/lib/pricing/catalog-tiers";

const DRY_RUN = process.env.DRY_RUN === "1" || process.env.DRY_RUN === "true";
const SKIP_NAME_PATTERNS = [/LIVE TEST/i, /Digital Checkout/i];

async function main() {
  console.log("[set-retail-prices] Naga retail tiers (shipping included):");
  for (const row of RETAIL_TIER_SUMMARY) {
    console.log(`  ${row.tier}: €${row.price} — ${row.note}`);
  }
  if (DRY_RUN) console.log("[set-retail-prices] DRY RUN — no writes");

  const catalog = await db
    .select({
      productId: products.id,
      productName: products.name,
      isDigital: products.isDigital,
      variantId: productVariants.id,
      price: productVariants.price,
    })
    .from(products)
    .innerJoin(productVariants, eq(productVariants.productId, products.id))
    .where(eq(products.isPublished, true));

  let updated = 0;
  let skipped = 0;
  const logged = new Set<string>();

  for (const row of catalog) {
    if (row.isDigital || SKIP_NAME_PATTERNS.some((re) => re.test(row.productName))) {
      skipped += 1;
      continue;
    }

    const target = retailPriceForProduct(row.productName);
    if (target == null) {
      console.warn(`[set-retail-prices] skip unknown product: "${row.productName}"`);
      skipped += 1;
      continue;
    }

    const oldPrice = Number(row.price);
    if (!logged.has(row.productName)) {
      console.log(`  ${row.productName}: €${oldPrice.toFixed(2)} → €${target.toFixed(2)}`);
      logged.add(row.productName);
    }

    if (!DRY_RUN) {
      await db
        .update(productVariants)
        .set({ price: target.toFixed(2), salePrice: null })
        .where(eq(productVariants.id, row.variantId));
    }
    updated += 1;
  }

  console.log(
    `\n[set-retail-prices] ${DRY_RUN ? "Would update" : "Updated"} ${updated} variant(s), skipped ${skipped}.`,
  );
}

main().catch((e) => {
  console.error("[set-retail-prices:error]", e);
  process.exitCode = 1;
});
