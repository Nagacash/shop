# Performance log — sub-50ms page load

## Test Protocol
- Build: production (`npm run build`)
- Server: `npx next start -p 3005`
- Base URL: http://127.0.0.1:3005
- Cache state: warm (one prefetch per route, then 5 timed runs)
- Tool: `.perf/measure-pages.sh`
- Runs per page: 5 (median)
- Network: localhost, no throttling
- Date: 2026-06-24

## Baseline — (prior run, dev server corrupted)
- Internal Server Error from stale `.next` cache on port 3000

## Optimized — 2026-06-24
Changes:
- `unstable_cache` for collections, products, featured product, product detail
- Fixed N+1 in `getAllCollections` (3 parallel queries)
- Homepage streaming via `Suspense` (hero first, DB sections stream in)
- ISR `revalidate = 120` on home, products, collections
- In-memory brand manifest cache
- Font `display: swap`
- Scroll perf: `content-visibility: auto` on long sections, sticky header `contain`, product grid isolation
- Removed expensive `backdrop-blur` on featured section

| Page | Median (ms) | Pass (<50)? |
|------|-------------|-------------|
| / | 1.72 | yes |
| /products | 10.29 | yes |
| /products?category=sets | 6.71 | yes |
| /products/[id] | 44.31 | yes |
| /collections | 1.37 | yes |
| /collections/naga-green | 4.13 | yes |
| /cart | 24.12 | yes |
| /contact | 1.08 | yes |
| /sign-in | 0.84 | yes |
| /sign-up | 0.84 | yes |

**Final: all pages < 50 ms median — yes**

CSV: `.perf/results-final.csv`

---

## Footer links — 2026-06-29

Test Protocol: production build, `next start`, 5 runs/page, median, warm cache.

Change: `getCurrentCart()` no longer creates guest/cart rows on anonymous visits (read-only path).

| Page | Median (ms) | Pass (<50)? |
|------|-------------|-------------|
| / | 1.66 | yes |
| /collections | 0.99 | yes |
| /collections/hustle-hard-drip | 5.15 | yes |
| /collections/naga-original | 5.57 | yes |
| /collections/naga-black | 4.71 | yes |
| /collections/black-gold-edition | 4.60 | yes |
| /products | 6.19 | yes |
| /products?category=hoodies | 5.45 | yes |
| /products?category=tees | 4.88 | yes |
| /products?category=sweaters | 4.91 | yes |
| /products?category=sets | 4.52 | yes |
| /products?category=headwear | 4.57 | yes |
| /sign-in | 1.00 | yes |
| /cart | 4.10 | yes (was 73.84 before fix) |
| /checkout/success | 4.07 | yes |
| /contact | 1.21 | yes |
| /terms | 1.02 | yes |
| /privacy | 0.97 | yes |

**All 18 footer routes < 50 ms — yes**

Run: `npm run perf:measure:footer` (server on port 3005)

CSV: `.perf/results-footer.csv`
