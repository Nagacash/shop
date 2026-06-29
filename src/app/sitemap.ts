import type { MetadataRoute } from "next";
import { eq, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { collections, productCollections, products } from "@/lib/db/schema";
import { getSiteUrl } from "@/lib/seo/site";

const SHOP_CATEGORIES = ["tees", "sweaters", "sets", "hoodies"] as const;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = getSiteUrl();
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    { url: `${base}/`, lastModified: now, changeFrequency: "daily", priority: 1 },
    { url: `${base}/products`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${base}/collections`, lastModified: now, changeFrequency: "weekly", priority: 0.85 },
    { url: `${base}/contact`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
  ];

  const categoryPages: MetadataRoute.Sitemap = SHOP_CATEGORIES.map((category) => ({
    url: `${base}/products?category=${category}`,
    lastModified: now,
    changeFrequency: "daily" as const,
    priority: 0.8,
  }));

  try {
    const productRows = await db
      .select({ id: products.id, updatedAt: products.updatedAt })
      .from(products)
      .where(eq(products.isPublished, true));

    const productPages: MetadataRoute.Sitemap = productRows.map((row) => ({
      url: `${base}/products/${row.id}`,
      lastModified: row.updatedAt ?? now,
      changeFrequency: "weekly",
      priority: 0.75,
    }));

    const collectionRows = await db
      .select({ slug: collections.slug, createdAt: collections.createdAt })
      .from(collections)
      .innerJoin(productCollections, eq(productCollections.collectionId, collections.id))
      .groupBy(collections.slug, collections.createdAt)
      .having(sql`count(${productCollections.productId}) > 0`);

    const collectionPages: MetadataRoute.Sitemap = collectionRows.map((row) => ({
      url: `${base}/collections/${row.slug}`,
      lastModified: row.createdAt ?? now,
      changeFrequency: "weekly",
      priority: 0.7,
    }));

    return [...staticPages, ...categoryPages, ...productPages, ...collectionPages];
  } catch {
    return [...staticPages, ...categoryPages];
  }
}
