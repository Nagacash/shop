# Performance log — sub-50ms page load

## Test Protocol
- Build: production (`pnpm run build`)
- Server: `pnpm exec next start -p 3005`
- Base URL: http://127.0.0.1:3005
- Cache state: warm (one prefetch per route, then 5 timed runs)
- Tool: `.perf/measure-pages.sh` → curl `time_total` median
- Runs per page: 5 (median)
- Network: localhost, no throttling
- Date: 2026-07-19

## Audit re-measure — 2026-07-19
(change: inventory refresh — added `/about`, `/podcast`; post design/cursor work)

| Page | Median (ms) | Pass (<50)? |
|------|-------------|-------------|
| / | 1.99 | yes |
| /products | 8.57 | yes |
| /products?category=tees | 7.41 | yes |
| /products?category=sweaters | 7.54 | yes |
| /products?category=hoodies | 6.86 | yes |
| /products?category=sets | 6.41 | yes |
| /products?category=headwear | 6.63 | yes |
| /products/[id] | 8.40 | yes |
| /collections | 1.45 | yes |
| /collections/naga-black | 5.86 | yes |
| /collections/naga-original | 6.74 | yes |
| /collections/black-gold-edition | 7.86 | yes |
| /collections/hustle-hard-drip | 5.59 | yes |
| /cart | 5.52 | yes |
| /checkout/success | 5.14 | yes |
| /contact | 1.53 | yes |
| /about | 1.35 | yes |
| /podcast | 1.46 | yes |
| /privacy | 1.56 | yes |
| /terms | 1.53 | yes |
| /sign-in | 1.36 | yes |
| /sign-up | 1.21 | yes |

**Final: all 22 pages < 50 ms median — yes**

CSV: `.perf/results-audit-2026-07-19.csv`

---

## Baseline — (prior run, 2026-06-24)
See git history / `.perf/results-final.csv`. Prior final also all < 50 ms.
