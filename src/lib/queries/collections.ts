import { asc, count, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { collections, productCollections, productImages } from "@/lib/db/schema";
import { normalizeImageUrl, FALLBACK_PRODUCT_IMAGE } from "@/lib/utils/images";
import { getCollectionCoverUrl } from "@/lib/brand/assets";
import { catalogCache } from "@/lib/cache/catalog";
import type { CollectionListItem } from "@/lib/actions/collection";

async function fetchAllCollections(): Promise<CollectionListItem[]> {
  const [cols, counts, coverRows] = await Promise.all([
    db.select().from(collections).orderBy(asc(collections.name)),
    db
      .select({
        collectionId: productCollections.collectionId,
        productCount: count(),
      })
      .from(productCollections)
      .groupBy(productCollections.collectionId),
    db
      .select({
        collectionId: productCollections.collectionId,
        url: productImages.url,
        isPrimary: productImages.isPrimary,
        sortOrder: productImages.sortOrder,
      })
      .from(productCollections)
      .innerJoin(productImages, eq(productImages.productId, productCollections.productId)),
  ]);

  const countMap = new Map(counts.map((r) => [r.collectionId, r.productCount]));

  const coverMap = new Map<string, string>();
  for (const row of coverRows.sort(
    (a, b) =>
      Number(b.isPrimary) - Number(a.isPrimary) || (a.sortOrder ?? 0) - (b.sortOrder ?? 0),
  )) {
    if (!coverMap.has(row.collectionId)) {
      coverMap.set(row.collectionId, row.url);
    }
  }

  return cols.map((col) => ({
    ...col,
    productCount: countMap.get(col.id) ?? 0,
    imageUrl:
      getCollectionCoverUrl(col.slug) ??
      normalizeImageUrl(coverMap.get(col.id)) ??
      FALLBACK_PRODUCT_IMAGE,
  }));
}

export function getCachedCollections(): Promise<CollectionListItem[]> {
  return catalogCache(["all-collections"], fetchAllCollections);
}

export function getCachedCollectionProducts(slug: string) {
  return catalogCache(["collection-products", slug], async () => {
    const { getCollectionProducts } = await import("@/lib/actions/collection");
    return getCollectionProducts(slug);
  });
}
