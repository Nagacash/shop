export function normalizeImageUrl(url: string | null | undefined): string | null {
  if (!url) return null;
  if (url.startsWith("/static/uploads/")) {
    return url.replace("/static/uploads/", "/uploads/");
  }
  return url;
}

export const FALLBACK_PRODUCT_IMAGE = "/uploads/naga/placeholder.svg";

/** Dark studio backdrop — lets the product photo's natural tones read cleanly */
export const FLAT_LAY_IMAGE_BG = "#12100e";

export function isFlatLayProductImage(url: string | null | undefined): boolean {
  if (!url) return false;
  return (
    url.includes("naga-set-black") ||
    url.includes("naga-green") ||
    url.includes("naga-wood") ||
    url.includes("tshirt-black") ||
    url.includes("naga-golden-hoodie") ||
    url.includes("naga-hoodie") ||
    url.includes("naga-sweater") ||
    url.includes("tshirt-white") ||
    url.includes("/uploads/naga/products/")
  );
}

export function isSetProduct(categorySlug: string | null | undefined): boolean {
  return categorySlug === "sets";
}
