import { catalogCache } from "@/lib/cache/catalog";
import {
  getFeaturedProduct,
  getAllProducts,
  getProductReviews,
  getRecommendedProducts,
  type FeaturedProduct,
  type GetAllProductsResult,
  type Review,
  type RecommendedProduct,
} from "@/lib/actions/product";
import type { NormalizedProductFilters } from "@/lib/utils/query";

export type { Review, RecommendedProduct };

export function getCachedFeaturedProduct(name: string): Promise<FeaturedProduct | null> {
  return catalogCache(["featured-product", name], () => getFeaturedProduct(name));
}

function filtersCacheKey(filters: NormalizedProductFilters): string {
  return JSON.stringify({
    search: filters.search,
    categorySlugs: filters.categorySlugs,
    genderSlugs: filters.genderSlugs,
    brandSlugs: filters.brandSlugs,
    colorSlugs: filters.colorSlugs,
    sizeSlugs: filters.sizeSlugs,
    priceRanges: filters.priceRanges,
    priceMin: filters.priceMin,
    priceMax: filters.priceMax,
    sort: filters.sort,
    page: filters.page,
    limit: filters.limit,
  });
}

export function getCachedAllProducts(filters: NormalizedProductFilters): Promise<GetAllProductsResult> {
  return catalogCache(["all-products", filtersCacheKey(filters)], () => getAllProducts(filters));
}

export function getCachedProduct(productId: string) {
  return catalogCache(["product", productId], async () => {
    const { getProduct } = await import("@/lib/actions/product");
    return getProduct(productId);
  });
}

export function getCachedProductReviews(productId: string): Promise<Review[]> {
  return catalogCache(["product-reviews", productId], () => getProductReviews(productId));
}

export function getCachedRecommendedProducts(productId: string): Promise<RecommendedProduct[]> {
  return catalogCache(["product-recs", productId], () => getRecommendedProducts(productId));
}
