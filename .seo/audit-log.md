# SEO/GEO audit log — 2026-07-07 (iteration 2)

## Crawlability — Pass
- robots.txt 200; sitemap.xml 200
- 25 pages crawled on www.nagaclub.de; **0 critical** HTTP errors
- apex → www redirect working

## Indexation — Pass (expected flags)
- `/cart` and `/sign-in` correctly **noindex** (crawler flags as high — intentional)
- Sitemap includes static, category, product, collection URLs

## Page intent — Pass
- Query map: one target page per priority query

## Titles & meta — Pass
- Unique titles on all crawled money pages
- **Fixed G15:** homepage secondary PageHero now renders `h2` (single h1 on home)
- **Fixed G16:** canonical URLs normalized (`/` → trailing slash on root)

## Internal links — Pass
- Nav/footer link shop categories, collections, contact

## Structured data — Pass
- Organization + WebSite (layout); FAQPage + visible FAQ (home + contact); Product on PDPs

## Source citations (GEO) — Warn
- Entity signals on contact/about; no outbound citations on product pages

## Answer-first content (GEO) — Pass (homepage)
- **Fixed G14:** hero now shows full `SITE_DESCRIPTION` BLUF paragraph above fold
- FAQ section + FAQPage schema match visible content

## Open (non-code)
- **G12:** brand visibility vs competing domains — content + backlinks + time
- **G13:** submit sitemap in Google Search Console / Bing Webmaster (user action)
