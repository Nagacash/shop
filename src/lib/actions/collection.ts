"use server";

import { and, desc, eq, inArray, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import {
  collections,
  productCollections,
  products,
  productImages,
  productVariants,
  genders,
  categories,
  type SelectCollection,
} from "@/lib/db/schema";
import { normalizeImageUrl } from "@/lib/utils/images";

export type CollectionListItem = SelectCollection & {
  productCount: number;
  imageUrl: string;
};

export type CollectionProduct = {
  id: string;
  name: string;
  imageUrl: string | null;
  minPrice: number | null;
  maxPrice: number | null;
  createdAt: Date;
  subtitle?: string | null;
};

export async function getAllCollections(): Promise<CollectionListItem[]> {
  const { getCachedCollections } = await import("@/lib/queries/collections");
  return getCachedCollections();
}

export async function getCollectionBySlug(slug: string): Promise<SelectCollection | null> {
  const [collection] = await db
    .select()
    .from(collections)
    .where(eq(collections.slug, slug))
    .limit(1);

  return collection ?? null;
}

export async function getCollectionProducts(slug: string): Promise<{
  collection: SelectCollection;
  products: CollectionProduct[];
} | null> {
  const collection = await getCollectionBySlug(slug);
  if (!collection) return null;

  const linked = await db
    .select({ productId: productCollections.productId })
    .from(productCollections)
    .where(eq(productCollections.collectionId, collection.id));

  if (!linked.length) {
    return { collection, products: [] };
  }

  const productIds = linked.map((row) => row.productId);

  const rows = await db
    .select({
      id: products.id,
      name: products.name,
      createdAt: products.createdAt,
      subtitle: genders.label,
      categoryLabel: categories.name,
      minPrice: sql<number | null>`min(${productVariants.price}::numeric)`,
      maxPrice: sql<number | null>`max(${productVariants.price}::numeric)`,
      imageUrl: sql<string | null>`max(case when ${productImages.isPrimary} then ${productImages.url} else null end)`,
    })
    .from(products)
    .leftJoin(productVariants, eq(productVariants.productId, products.id))
    .leftJoin(productImages, eq(productImages.productId, products.id))
    .leftJoin(genders, eq(genders.id, products.genderId))
    .leftJoin(categories, eq(categories.id, products.categoryId))
    .where(and(eq(products.isPublished, true), inArray(products.id, productIds)))
    .groupBy(products.id, products.name, products.createdAt, genders.label, categories.name)
    .orderBy(desc(products.createdAt));

  const productsOut: CollectionProduct[] = rows.map((row) => ({
    id: row.id,
    name: row.name,
    imageUrl: normalizeImageUrl(row.imageUrl),
    minPrice: row.minPrice === null ? null : Number(row.minPrice),
    maxPrice: row.maxPrice === null ? null : Number(row.maxPrice),
    createdAt: row.createdAt,
    subtitle: [row.categoryLabel, row.subtitle].filter(Boolean).join(" · ") || null,
  }));

  return { collection, products: productsOut };
}
