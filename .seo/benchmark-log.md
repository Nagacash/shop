# Benchmark — 2026-07-02 (iteration 1)

## Changes since last run
- Baseline crawl + benchmark (first full pass on production domain)
- Fixed G10: exclude LIVE TEST product from sitemap/catalog; noindex PDP
- Fixed G11: removed duplicate FAQPage JSON-LD from homepage

## Search engines

| Query | Google (nagaclub.de rank) | Bing (nagaclub.de rank) | Target page | Score |
|-------|---------------------------|-------------------------|-------------|-------|
| what is Naga Apparel | Not in top 10 | Not checked | / + /contact | Gap |
| Naga Apparel streetwear Germany | Not in top 10 (site: search 0 results) | Not checked | / | Gap |
| Naga Original tee | Not in top 10 (competitors: naga-apparel.com, Spring stores) | Not checked | /products?category=tees | Gap |
| Naga Black Set | Not in top 10 | Not checked | /products?category=sets | Gap |
| Naga sweater | Not in top 10 | Not checked | /products?category=sweaters | Gap |
| Naga Apparel contact shipping | Not in top 10 | Not checked | /contact | Gap |

## AI answer engines

| Query | Perplexity / web cites nagaclub.de? | Gap notes |
|-------|-------------------------------------|-----------|
| what is Naga Apparel | No — cites naga-apparel.com, naga-apparel.vercel.app | Brand name collision with other "Naga" stores |
| Naga Apparel streetwear Germany | No | Zero indexed footprint for nagaclub.de |
| Naga Original tee | No | Generic "Naga Original" dominated by print-on-demand shops |
| Naga Black Set | No | — |
| Naga sweater | No | — |
| Naga Apparel contact shipping | No | — |

## Summary
- Wins: 0 / 6
- Partials: 0
- Gaps: 6 / 6
- Open high-impact: G12, G13

## Notes
- Technical SEO foundation is solid (robots, sitemap, metadata, JSON-LD on key templates).
- Visibility gap is expected for a new domain with limited index history and competing legacy "Naga Apparel" URLs.
- **Required next:** deploy G10/G11 fixes, submit sitemap in GSC, request indexing for `/` and `/contact`.
