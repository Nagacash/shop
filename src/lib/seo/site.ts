export const SITE_ORIGIN = "https://www.nagaclub.de";
export const SITE_DOMAIN = "www.nagaclub.de";
export const SUPPORT_EMAIL = "chosenfewrecords@hotmail.de";

export const SITE_NAME = "Naga Apparel";

export const SITE_DESCRIPTION =
  "Ancient Wisdom. Modern Hustle. Naga Apparel — premium streetwear rooted in the Amazon, inspired by ancient empires. Wear your wisdom. Get smart.";

export const SITE_KEYWORDS = [
  "Naga Apparel",
  "Ancient Wisdom Modern Hustle",
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
