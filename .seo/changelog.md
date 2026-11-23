# SEO changelog

## 2026-11-23 — Plugins, chains (DE), podcast

Updated:
- `src/lib/seo/chains.ts` — shared chains titles/descriptions (EN + DE search terms)
- German FAQ (`Verkauft Naga Cuban Link Ketten…`) + English chains-from-Germany FAQ
- `SITE_KEYWORDS` — Cuban Link Kette, kaufen, Hamburg, Edelstahl, etc.
- `/products?category=chains` meta + hero; homepage + `SITE_DESCRIPTION`; ChainsSection DE blurb
- Organization `knowsAbout` — Cuban Link Ketten
- Global `SITE_DESCRIPTION`, `SITE_KEYWORDS`, and layout default title — streetwear + chains + Naga Glue VST/AU + Woodland 360
- Homepage, about, contact, `/plugins`, and `/podcast` meta descriptions
- `NAGA_FAQS` — chains in catalogue answer; new entries for free VST/AU plugins and Woodland 360
- Organization `knowsAbout` — jewelry, audio plugins, podcasts
- `/plugins` — `ItemList` JSON-LD for published plugins
- `/llms.txt` — plugin catalogue lines, podcast episode list, aligned with `SITE_DESCRIPTION`
- `.seo/pages.txt` — chains category, plugins, podcast, about

User action:
- Request indexing in GSC for `/plugins`, `/plugins/naga-glue-vol-2`, and `/podcast`
- Rich-results test: `https://www.nagaclub.de/plugins/naga-glue-vol-2` (SoftwareApplication)

## 2026-07-07 — Production audit iteration 2

Fixed:
- G14: Visible BLUF paragraph in homepage hero (`SITE_DESCRIPTION`)
- G15: Homepage collections PageHero uses `headingAs="h2"` — single H1 per page
- G16: `canonicalUrl()` helper; root canonical uses trailing slash

Crawl baseline:
- `.seo/crawl-20260707.json` — 25 pages, 0 critical, 0 code-action high gaps

User action (still open — G13):
- Submit `https://www.nagaclub.de/sitemap.xml` in Google Search Console and Bing Webmaster Tools

## 2026-07-02 — Production audit iteration 1

Fixed:
- G10: Exclude `LIVE TEST*` products from sitemap, shop listings, collections, recommendations; `noindex` on test PDP
- G11: Removed duplicate FAQPage JSON-LD from homepage (canonical FAQ remains on `/contact`)
- G14: Answer-first BLUF in homepage hero (Germany + brand definition)

Documented:
- `.seo/crawl-protocol.md`, `.seo/benchmark-protocol.md`, `.seo/pages.txt`
- `.seo/gap-register.md`, `.seo/audit-log.md`, `.seo/benchmark-log.md`
- `.seo/crawl-20260702.json` baseline crawl (27 pages, 0 critical)

User action (High — G13):
- Submit `https://www.nagaclub.de/sitemap.xml` in [Google Search Console](https://search.google.com/search-console) and Bing Webmaster Tools
- Request indexing for `/` and `/contact`
- Validate schema: https://search.google.com/test/rich-results?url=https://www.nagaclub.de/contact

## 2026-06-29 — Initial SEO/GEO pass

Fixed (Critical/High):
- G01: Added `robots.ts` + dynamic `sitemap.xml` (products, collections, categories)
- G02: Sitewide metadata — titles, descriptions, Open Graph, Twitter, canonicals
- G03: JSON-LD Organization + WebSite + SearchAction
- G04: Product JSON-LD + breadcrumbs on product pages
- G05: Collection breadcrumbs + per-collection metadata
- G06: Category-specific metadata on `/products?category=*`
- G07: FAQPage schema + visible FAQ on `/contact` (GEO answer-first)
- G08: noindex on cart, auth, checkout paths
- G09: Germany entity signals in contact copy + footer alignment

Next (user action):
- Set `NEXT_PUBLIC_SITE_URL=https://your-vercel-domain.vercel.app` in Vercel
- Submit sitemap in Google Search Console + Bing Webmaster Tools
- Validate schema: https://search.google.com/test/rich-results
