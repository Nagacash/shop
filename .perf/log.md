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
