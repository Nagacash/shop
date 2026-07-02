# SEO/GEO audit log — 2026-07-02

## Crawlability — Pass
- robots.txt 200; allows `/`, disallows cart/checkout/api/auth/admin
- sitemap.xml 200; 21 URLs (includes LIVE TEST product — fixed in code, pending deploy)
- All sitemap URLs return 200
- apex `nagaclub.de` → 308 → `www.nagaclub.de`
- Internal crawl: 27 pages, 0 critical HTTP errors

## Indexation — Warn
- Cart/sign-in correctly noindex (crawler flags as high — expected)
- LIVE TEST product was indexable — **fixed** (noindex + sitemap exclusion)
- GSC/Bing submission not confirmed — user action

## Page intent — Pass
- Query map complete; one target page per priority query
- Category URLs map cleanly to product intent

## Titles & meta — Pass (minor)
- Unique titles and descriptions on crawled pages
- Homepage multiple H1s (design-driven)
- Category pages have intent-aligned titles (e.g. "Naga Original Tees")

## Internal links — Pass
- Nav/footer link products, collections, contact
- Collections hub links to all drops
- Product pages link back to shop/collections

## Structured data — Warn
- Organization + WebSite on layout; Product + BreadcrumbList on PDPs
- FAQPage on /contact with matching visible FAQ — Pass
- Homepage had duplicate FAQPage without visible FAQ — **fixed**

## Source citations (GEO) — Warn
- Contact page has entity signals (Germany, support email)
- No outbound authoritative citations on product/category pages
- No author/dateModified on content pages

## Answer-first content (GEO) — Partial
- /contact: FAQ answers "what is Naga Apparel" + shipping — Pass
- Homepage: strong hero/sections but no explicit BLUF paragraph above fold
- Category pages: product grids; intent clear but thin definitional copy
