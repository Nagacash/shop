/**
 * Set shipping-inclusive catalog prices from known product-only base prices + DHL US 2 kg rate.
 * Idempotent — safe to re-run.
 *
 * Run: npm run db:adjust-shipping-prices
 * Dry run: DRY_RUN=1 npm run db:adjust-shipping-prices
 */
import { db } from "@/lib/db";
import { products, productVariants } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { BLACK_TEE_NAME } from "@/lib/brand/manifesto";
import {
  SHIPPING_INCLUDED_EUR,
  formatShippingRateSource,
} from "@/lib/shipping/rates";

const DRY_RUN = process.env.DRY_RUN === "1" || process.env.DRY_RUN === "true";

const SKIP_NAME_PATTERNS = [/LIVE TEST/i, /Digital Checkout/i];

/** Product-only prices from Neon catalog + seed (before shipping included). */
const BASE_PRODUCT_PRICES_EUR: Record<string, number> = {
  [BLACK_TEE_NAME]: 32,
  "The Anti-System Strike Tee": 32,
  "The Wisdom & Hustle Tee": 32,
  "The Amazonian Syndicate Set": 48,
  "Naga Black Set": 48,
  "The Angkor Heavyweight Crew": 58,
  "The Empire Roots Crew": 58,
  "The Cobra Wisdom Hoodie": 68,
  "Naga Original Cream Hoodie": 68,
  "The Golden Empire Hoodie": 72,
  "Golden Naga Hoodie": 72,
};

function targetPriceForProduct(name: string): number | null {
  const base = BASE_PRODUCT_PRICES_EUR[name];
  if (base == null) return null;
  return Math.round(base + SHIPPING_INCLUDED_EUR);
}

async function main() {
  console.log("[adjust-shipping-prices] Included shipping per item:", SHIPPING_INCLUDED_EUR, "EUR");
  console.log("[adjust-shipping-prices]", formatShippingRateSource());
  if (DRY_RUN) console.log("[adjust-shipping-prices] DRY RUN — no writes");

  const catalog = await db
    .select({
      productId: products.id,
      productName: products.name,
      isDigital: products.isDigital,
      variantId: productVariants.id,
      price: productVariants.price,
      salePrice: productVariants.salePrice,
    })
    .from(products)
    .innerJoin(productVariants, eq(productVariants.productId, products.id))
    .where(eq(products.isPublished, true));

  let updatedVariants = 0;
  let skipped = 0;
  const logged = new Set<string>();

  for (const row of catalog) {
    if (row.isDigital || SKIP_NAME_PATTERNS.some((re) => re.test(row.productName))) {
      skipped += 1;
      continue;
    }

    const target = targetPriceForProduct(row.productName);
    if (target == null) {
      console.warn(`[adjust-shipping-prices] skip unknown product: "${row.productName}"`);
      skipped += 1;
      continue;
    }

    const oldPrice = Number(row.price);
    const oldSale = row.salePrice != null ? Number(row.salePrice) : null;
    const base = BASE_PRODUCT_PRICES_EUR[row.productName]!;
    const saleDelta = oldSale != null && !Number.isNaN(oldSale) ? oldSale - base : null;
    const newSale =
      saleDelta != null && saleDelta > 0 ? Math.round(target + saleDelta) : null;

    if (!DRY_RUN) {
      await db
        .update(productVariants)
        .set({
          price: target.toFixed(2),
          ...(newSale != null ? { salePrice: newSale.toFixed(2) } : { salePrice: null }),
        })
        .where(eq(productVariants.id, row.variantId));
    }

    if (!logged.has(row.productName)) {
      console.log(
        `  ${row.productName}: €${oldPrice.toFixed(2)} → €${target.toFixed(2)}` +
          (newSale != null ? ` (sale → €${newSale.toFixed(2)})` : ""),
      );
      logged.add(row.productName);
    }
    updatedVariants += 1;
  }

  console.log(
    `\n[adjust-shipping-prices] ${DRY_RUN ? "Would update" : "Updated"} ${updatedVariants} variant(s), skipped ${skipped}.`,
  );
}

main().catch((e) => {
  console.error("[adjust-shipping-prices:error]", e);
  process.exitCode = 1;
});
