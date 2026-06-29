import { unstable_cache } from "next/cache";

/** Default ISR / data cache window for catalog reads (seconds). */
export const CATALOG_REVALIDATE = 120;

export function catalogCache<T>(key: string[], fn: () => Promise<T>): Promise<T> {
  return unstable_cache(fn, key, { revalidate: CATALOG_REVALIDATE })();
}
