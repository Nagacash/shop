import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { products } from "@/lib/db/schema";
import { PRODUCT_RENAMES } from "@/lib/brand/manifesto";

async function main() {
  let updated = 0;

  for (const [legacyName, next] of Object.entries(PRODUCT_RENAMES)) {
    const [row] = await db
      .select({ id: products.id, name: products.name })
      .from(products)
      .where(eq(products.name, legacyName))
      .limit(1);

    if (!row) {
      console.log(`[rename-manifesto] skip — not found: "${legacyName}"`);
      continue;
    }

    await db
      .update(products)
      .set({
        name: next.name,
        ...(next.description ? { description: next.description } : {}),
        updatedAt: new Date(),
      })
      .where(eq(products.id, row.id));

    console.log(`[rename-manifesto] "${legacyName}" → "${next.name}"`);
    updated++;
  }

  console.log(`[rename-manifesto] Done. Updated ${updated} product(s).`);
}

main().catch((e) => {
  console.error("[rename-manifesto:error]", e);
  process.exitCode = 1;
});
