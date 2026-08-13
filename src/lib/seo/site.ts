export const SITE_ORIGIN = "https://www.nagaclub.de";
export const SITE_DOMAIN = "www.nagaclub.de";

/** Legal operator — privacy policy, terms, Impressum-style disclosures. */
export const LEGAL_OPERATOR = {
  name: "Maurice Holda",
  addressLine: "20355 Hamburg",
  country: "Germany",
  phone: "+4917629255188",
  email: "chosenfewrecords@hotmail.de",
} as const;

export const SUPPORT_EMAIL = LEGAL_OPERATOR.email;

export const LEGAL_OPERATOR_CONTACT_BLOCK = [
  LEGAL_OPERATOR.name,
  LEGAL_OPERATOR.addressLine,
  LEGAL_OPERATOR.country,
  `Tel: ${LEGAL_OPERATOR.phone}`,
  LEGAL_OPERATOR.email,
].join("\n");

export const SITE_NAME = "Naga Apparel";

/**
 * Meta description. Kept under ~160 characters so it is not truncated in
 * results. The previous copy was brand poetry only — it never said what is
 * sold, where the brand is from, or that it ships internationally, so it
 * matched no search intent beyond the brand name itself.
 */
export const SITE_DESCRIPTION =
  "Naga Apparel — independent streetwear brand from Hamburg. Premium heavyweight tees, sweaters and sets. Ancient Wisdom, Modern Hustle. Shipping worldwide.";

/**
 * Note: Google has ignored the keywords meta tag since 2009, so this is not a
 * ranking lever — Bing and Yandex give it only marginal weight. Real ranking
 * signals live in the title, description, on-page copy and structured data.
 * Kept broad rather than product-name-only so the tag at least describes the
 * category and market.
 */
export const SITE_KEYWORDS = [
  // Brand
  "Naga Apparel",
  "Naga Club",
  "Ancient Wisdom Modern Hustle",
  // Category
  "streetwear brand",
  "independent streetwear",
  "premium streetwear",
  "heavyweight tees",
  "designer sweatshirts",
  "clothing brand",
  // Location
  "streetwear Hamburg",
  "Hamburg clothing brand",
  "German streetwear brand",
  "Streetwear Hamburg kaufen",
  // Reach
  "streetwear worldwide shipping",
  "European streetwear brand",
  // Products
  "Get Smart Tee",
  "Amazonian Syndicate Set",
  "Angkor Heavyweight Crew",
];

export const SOCIAL = {
  instagram: "https://www.instagram.com/naga_apparel",
  facebook: "https://www.facebook.com/nagaapparel",
  x: "https://x.com/nagaapparel",
  website: SITE_ORIGIN,
} as const;

function isLocalhostUrl(url: string): boolean {
  return /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?(\/|$)/i.test(url);
}

export function getSiteUrl(): string {
  const raw =
    process.env.NEXT_PUBLIC_SITE_URL ??
    process.env.BETTER_AUTH_URL ??
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null) ??
    SITE_ORIGIN;
  const url = raw.replace(/\/$/, "");

  // Misconfigured env on Vercel (e.g. BETTER_AUTH_URL=localhost) must not leak into Stripe redirects.
  if (process.env.NODE_ENV === "production" && isLocalhostUrl(url)) {
    return SITE_ORIGIN;
  }

  return url;
}

export function absoluteUrl(path: string): string {
  const base = getSiteUrl();
  if (path.startsWith("http")) return path;
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}

/** Preferred canonical URL — root always ends with `/`; other paths have no trailing slash. */
export function canonicalUrl(path: string = "/"): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  const base = getSiteUrl().replace(/\/$/, "");

  if (normalized === "/") {
    return `${base}/`;
  }

  return `${base}${normalized}`.replace(/\/$/, "");
}
