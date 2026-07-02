import { ilike, not, type SQL } from "drizzle-orm";
import { products } from "@/lib/db/schema";

export const INTERNAL_TEST_PRODUCT_NAME_PREFIX = "LIVE TEST";

export function isInternalTestProduct(name: string): boolean {
  return name.startsWith(INTERNAL_TEST_PRODUCT_NAME_PREFIX);
}

/** Exclude checkout QA products from public catalog and sitemap. */
export function excludeInternalTestProducts(): SQL {
  return not(ilike(products.name, `${INTERNAL_TEST_PRODUCT_NAME_PREFIX}%`));
}
