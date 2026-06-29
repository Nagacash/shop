# SEO changelog

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
