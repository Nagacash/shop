/**
 * Naga retail tiers — all-in prices (DHL US 2 kg shipping already included).
 *
 * Benchmarks (EU, early 2026, excl. tax):
 * - Stüssy basic tee €48–50 + shipping | hoodie €145–160 + shipping
 * - Patta / Daily Paper hoodies ~€129–139 + shipping
 * - Carhartt WIP tees ~€35–45 + shipping
 *
 * Naga sits between established global names and fast fashion:
 * premium indie, story-led, not luxury (Represent €245+).
 */

import { SHIPPING_INCLUDED_EUR } from "@/lib/shipping/rates";

export type RetailTierId = "tee" | "set" | "sweater" | "hoodie" | "hoodiePremium";

/** Customer-facing all-in EUR prices */
export const RETAIL_TIER_EUR: Record<RetailTierId, number> = {
  tee: 68,
  set: 89,
  sweater: 98,
  hoodie: 118,
  hoodiePremium: 128,
};

/** Maps live product names → retail tier */
export const PRODUCT_RETAIL_TIER: Record<string, RetailTierId> = {
  "The Get Smart Tee": "tee",
  "The Anti-System Strike Tee": "tee",
  "The Wisdom & Hustle Tee": "tee",
  "The Amazonian Syndicate Set": "set",
  "Naga Black Set": "set",
  "The Angkor Heavyweight Crew": "sweater",
  "The Empire Roots Crew": "sweater",
  "The Cobra Wisdom Hoodie": "hoodie",
  "Naga Original Cream Hoodie": "hoodie",
  "The Golden Empire Hoodie": "hoodiePremium",
  "Golden Naga Hoodie": "hoodiePremium",
};

export function retailPriceForProduct(productName: string): number | null {
  const tier = PRODUCT_RETAIL_TIER[productName];
  if (!tier) return null;
  return RETAIL_TIER_EUR[tier];
}

/** Implied product-only value before shipping (for margin notes). */
export function impliedProductValueEur(retailPriceEur: number): number {
  return retailPriceEur - SHIPPING_INCLUDED_EUR;
}

export const RETAIL_TIER_SUMMARY = [
  { tier: "Graphic tee", price: RETAIL_TIER_EUR.tee, note: "Above Carhartt WIP, near Stüssy all-in EU" },
  { tier: "Tee + shorts set", price: RETAIL_TIER_EUR.set, note: "Two-piece drop value" },
  { tier: "Heavyweight crew", price: RETAIL_TIER_EUR.sweater, note: "Knit premium" },
  { tier: "Hoodie", price: RETAIL_TIER_EUR.hoodie, note: "Below Stüssy/Patta sticker, premium indie" },
  { tier: "Golden hoodie", price: RETAIL_TIER_EUR.hoodiePremium, note: "Hero piece, still under global names" },
] as const;
