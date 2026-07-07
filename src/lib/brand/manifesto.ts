/** Naga Apparel — brand manifesto & messaging (single source of truth). */

export const BRAND_TAGLINE = "Ancient Wisdom. Modern Hustle.";

export const BRAND_SUBTAGLINE =
  "Premium streetwear rooted in the Amazon, inspired by ancient empires, built for the streets.";

export const BRAND_SUBTAGLINE_ALT =
  "Unapologetic apparel for the hustle-minded and the knowledge-loving.";

/** Short closer — hero, footer, meta. */
export const BRAND_CLOSER = "Get smart.";

export const BRAND_CLOSER_LINE = `Wear your wisdom. ${BRAND_CLOSER}`;

/** Section headline — homepage, about. */
export const BRAND_HEADLINE = "Get Smart";

export const BRAND_STORY = `The snake runs deep. From our roots in the Amazon to the ancient empires of Mexico, Egypt, and Angkor Wat, the serpent has always been the ultimate symbol of wisdom and hidden power. Naga Apparel is a homage to that ancient knowledge, built for the modern hustle.

We are for the knowledge-lovers, the system-breakers, and the unapologetic rebels. We don't just wear clothes; we wear our history. Built for those who hustle hard, think critically, and refuse to bow to a broken, racist system. Raise the cobra. Get smart. Wear your wisdom.`;

/** Black tee — manifesto product name. */
export const BLACK_TEE_NAME = "The Get Smart Tee";

export const CTA = {
  shopTheDrop: "Shop the Drop",
  claimYours: "Claim Yours",
  joinSyndicate: "Join the Syndicate",
  learnHistory: "Learn the History",
  shopAll: "Shop the Drop",
  allSets: "All Sets",
  allCollections: "All Collections",
  continueShopping: "Claim More",
  viewDetails: "Learn the History",
} as const;

/** Featured set — used for homepage featured drop when in stock. */
export const FEATURED_SET_NAME = "The Amazonian Syndicate Set";

/** Homepage “Available now” strip — in-stock products, priority order. */
export const HOME_AVAILABLE_PRIORITY = [
  BLACK_TEE_NAME,
  "The Wisdom & Hustle Tee",
  "The Cobra Wisdom Hoodie",
  "The Golden Empire Hoodie",
  "The Angkor Heavyweight Crew",
  "The Empire Roots Crew",
] as const;

/** Legacy product names → manifesto names (for DB rename script + seed). */
export const PRODUCT_RENAMES: Record<string, { name: string; description?: string }> = {
  "Naga Black Set": {
    name: "The Amazonian Syndicate Set",
    description:
      "The Amazonian Syndicate Set — matching black tee and shorts. Get Smart chest graphic, Hustle Hard leg print, cobra patch. Soft cotton-blend jersey, relaxed street fit.",
  },
  "Naga Original Black Tee": {
    name: BLACK_TEE_NAME,
    description:
      "The Get Smart Tee in black. Heavyweight cotton, cobra chest graphic, unapologetic fit. Wear your wisdom. Get smart.",
  },
  "The Anti-System Strike Tee": {
    name: BLACK_TEE_NAME,
    description:
      "The Get Smart Tee in black. Heavyweight cotton, cobra chest graphic, unapologetic fit. Wear your wisdom. Get smart.",
  },
  "Naga Original White Tee": {
    name: "The Wisdom & Hustle Tee",
    description:
      "The Wisdom & Hustle Tee in white. Premium cotton, Naga cobra graphic, clean street cut. Knowledge is power — dress like it.",
  },
  "Naga Original Grey Sweater": {
    name: "The Angkor Heavyweight Crew",
    description:
      "The Angkor Heavyweight Crew in grey. Inspired by ancient empire craft — premium knit, cobra graphic, built for the hustle.",
  },
  "Naga Original Light Brown Sweater": {
    name: "The Empire Roots Crew",
    description:
      "The Empire Roots Crew in light brown. Premium knit streetwear rooted in ancient wisdom — cobra mark, heavyweight comfort.",
  },
  "Naga Original Cream Hoodie": {
    name: "The Cobra Wisdom Hoodie",
    description:
      "The Cobra Wisdom Hoodie in cream. Fleece interior, cobra chest graphic, drawstring hood. Ancient wisdom, modern hustle.",
  },
  "Golden Naga Hoodie": {
    name: "The Golden Empire Hoodie",
    description:
      "The Golden Empire Hoodie. Gold cobra graphic on premium fleece — unapologetic presence for the knowledge-loving.",
  },
};
