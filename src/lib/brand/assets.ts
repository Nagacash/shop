import { existsSync, readFileSync } from "fs";
import { join } from "path";
import {
  PAGE_HERO_KEYS,
  PAGE_HERO_COLLECTION_FALLBACK,
  type PageHeroKey,
} from "./page-heroes";

export type BrandManifest = {
  hero: string;
  heroGlamour?: string;
  pages?: Record<string, string>;
  collections: Record<string, string>;
  generatedAt: string;
};

const BRAND_DIR = join(process.cwd(), "public", "uploads", "naga", "brand");
const MANIFEST_PATH = join(BRAND_DIR, "manifest.json");

let manifestMemory: BrandManifest | null | undefined;

function publicPath(urlPath: string): string {
  return join(process.cwd(), "public", urlPath.replace(/^\//, ""));
}

function readManifest(): BrandManifest | null {
  if (manifestMemory !== undefined) return manifestMemory;
  if (!existsSync(MANIFEST_PATH)) {
    manifestMemory = null;
    return null;
  }
  try {
    manifestMemory = JSON.parse(readFileSync(MANIFEST_PATH, "utf8")) as BrandManifest;
    return manifestMemory;
  } catch {
    manifestMemory = null;
    return null;
  }
}

export function getHeroImageUrl(): string | null {
  const manifest = readManifest();
  if (manifest?.hero) return manifest.hero;

  const fallback = "/uploads/naga/brand/hero.png";
  if (existsSync(publicPath(fallback))) return fallback;
  return null;
}

export function getHeroGlamourImageUrl(): string | null {
  const manifest = readManifest();
  if (manifest?.heroGlamour) return manifest.heroGlamour;

  const fallback = "/uploads/naga/brand/hero-glamour.png";
  if (existsSync(publicPath(fallback))) return fallback;
  return null;
}

export function getCollectionCoverUrl(slug: string): string | null {
  const manifest = readManifest();
  if (manifest?.collections?.[slug]) return manifest.collections[slug];

  for (const ext of ["png", "jpg", "jpeg", "webp"]) {
    const fallback = `/uploads/naga/brand/collections/${slug}.${ext}`;
    if (existsSync(publicPath(fallback))) return fallback;
  }
  return null;
}

export function getPageHeroUrl(page: PageHeroKey): string | null {
  const manifest = readManifest();
  if (manifest?.pages?.[page]) return manifest.pages[page];

  const pageFile = "/uploads/naga/brand/pages/" + page + ".png";
  if (existsSync(publicPath(pageFile))) return pageFile;

  for (const ext of ["jpg", "jpeg", "webp"]) {
    const alt = `/uploads/naga/brand/pages/${page}.${ext}`;
    if (existsSync(publicPath(alt))) return alt;
  }

  if (page === "contact") {
    return getHeroGlamourImageUrl() ?? getCollectionCoverUrl("golden-drip") ?? getHeroImageUrl();
  }

  if (page === "collections") {
    return getHeroImageUrl() ?? getCollectionCoverUrl("naga-original");
  }

  const collectionSlug = PAGE_HERO_COLLECTION_FALLBACK[page];
  return getCollectionCoverUrl(collectionSlug) ?? getHeroImageUrl();
}

export function getAllPageHeroKeys(): PageHeroKey[] {
  return [...PAGE_HERO_KEYS];
}
