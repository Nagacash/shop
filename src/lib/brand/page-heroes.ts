export const PAGE_HERO_KEYS = [
  "shop",
  "cart",
  "collections",
  "contact",
  "checkout",
  "auth",
  "product",
] as const;

export type PageHeroKey = (typeof PAGE_HERO_KEYS)[number];

/** Collection slug used when a dedicated page hero image is not generated yet. */
export const PAGE_HERO_COLLECTION_FALLBACK: Record<PageHeroKey, string> = {
  shop: "hustle-hard-drip",
  cart: "black-gold-edition",
  collections: "naga-original",
  contact: "golden-drip",
  checkout: "golden-drip",
  auth: "naga-og",
  product: "naga-square",
};
