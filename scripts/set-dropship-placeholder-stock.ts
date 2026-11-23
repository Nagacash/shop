/**
 * Set placeholder in_stock for dropship SKUs (not warehouse counts).
 * See src/lib/inventory/dropship.ts.
 */
import { db } from "@/lib/db";
import { productVariants } from "@/lib/db/schema";
import { DROPSHIP_DEFAULT_PLACEHOLDER_STOCK } from "@/lib/inventory/dropship";
import { eq } from "drizzle-orm";

const DROPSHIP_SKUS: { sku: string; inStock?: number }[] = [
  { sku: "KRKC-0083-CH-GD-8mm-18in", inStock: DROPSHIP_DEFAULT_PLACEHOLDER_STOCK },
];

async function main() {
  for (const row of DROPSHIP_SKUS) {
    const inStock = row.inStock ?? DROPSHIP_DEFAULT_PLACEHOLDER_STOCK;
    const updated = await db
      .update(productVariants)
      .set({ inStock })
      .where(eq(productVariants.sku, row.sku))
      .returning({ id: productVariants.id, sku: productVariants.sku, inStock: productVariants.inStock });

    if (!updated.length) {
      console.warn(`[set-dropship-placeholder-stock] SKU not found: ${row.sku}`);
      continue;
    }

    console.log(
      `[set-dropship-placeholder-stock] ${updated[0].sku} placeholder in_stock=${updated[0].inStock} (dropship, not warehouse)`,
    );
  }
}

main().catch((e) => {
  console.error("[set-dropship-placeholder-stock:error]", e);
  process.exitCode = 1;
});