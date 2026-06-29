import { unstable_cache } from "next/cache";

/** Bump when catalog data changes outside the app (e.g. db scripts) to invalidate stale cache. */
const CACHE_VERSION = "9";

/** Default ISR / data cache window for catalog reads (seconds). */
export const CATALOG_REVALIDATE = 120;

export function catalogCache<T>(key: string[], fn: () => Promise<T>): Promise<T> {
  return unstable_cache(fn, [CACHE_VERSION, ...key], {
    revalidate: CATALOG_REVALIDATE,
    tags: ["catalog"],
  })();
}
