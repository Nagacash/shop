import Link from "next/link";
import { ArrowRight, Shirt, Sparkles } from "lucide-react";
import { getCachedFeaturedProduct } from "@/lib/queries/products";
import FlatLayFrame from "@/components/FlatLayFrame";

const HIGHLIGHTS = [
  { label: "Naga Original graphic", detail: "Chest print" },
  { label: "Hustle Hard + cobra patch", detail: "Leg details" },
  { label: "Black jersey", detail: "Tee & shorts" },
] as const;

export default async function FeaturedDropSection() {
  const product = await getCachedFeaturedProduct("Naga Black Set");
  if (!product) return null;

  const priceLabel =
    product.minPrice !== null ? `$${product.minPrice.toFixed(2)}` : null;

  return (
    <section className="scroll-layer relative overflow-hidden bg-dark-900 text-light-100">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(255,255,255,0.06),transparent_45%)]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_85%_70%,rgba(201,162,39,0.12),transparent_40%)]"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
          <Link
            href={`/products/${product.id}`}
            className="drop-enter drop-enter-1 group block overflow-hidden rounded-2xl ring-1 ring-light-100/10"
          >
            <FlatLayFrame
              src={product.imageUrl}
              alt={product.name}
              variant="hero"
              priority
              interactive
              sizes="(max-width: 1024px) 100vw, 52vw"
            >
              <span
                className={`absolute left-4 top-4 z-20 inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-caption uppercase tracking-[0.2em] bg-dark-900/90 ${product.soldOut ? "border-light-100/25 text-light-400" : "border-light-100/25 text-light-200"}`}
              >
                {product.soldOut ? (
                  <>Sold out</>
                ) : (
                  <>
                    <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
                    New drop
                  </>
                )}
              </span>
            </FlatLayFrame>
          </Link>

          <div className="drop-enter drop-enter-2">
            <p className="inline-flex items-center gap-2 text-caption uppercase tracking-[0.24em] text-light-300">
              <Shirt className="h-4 w-4" aria-hidden="true" />
              Complete set
            </p>

            <h2
              className="mt-4 text-balance font-bold leading-[0.95] tracking-tighter text-light-100"
              style={{ fontSize: "clamp(2.25rem, 6vw, 3.75rem)" }}
            >
              Naga
              <span className="block text-light-300">Black Set</span>
            </h2>

            {product.subtitle && (
              <p className="mt-3 text-body text-light-400">{product.subtitle}</p>
            )}

            <p className="mt-5 max-w-md text-body leading-relaxed text-light-400">
              {product.description}
            </p>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              {HIGHLIGHTS.map((item) => (
                <div
                  key={item.label}
                  className="rounded-xl border border-light-100/10 bg-light-100/5 px-4 py-3"
                >
                  <p className="text-caption uppercase tracking-[0.14em] text-[--color-naga-gold]">
                    {item.detail}
                  </p>
                  <p className="mt-1 text-body-medium text-light-100">{item.label}</p>
                </div>
              ))}
            </div>

            <div className="drop-enter drop-enter-3 mt-10 flex flex-wrap items-center gap-4">
              {priceLabel && (
                <p className="text-lead tabular-nums text-light-100">{priceLabel}</p>
              )}
              {product.soldOut ? (
                <Link
                  href={`/products/${product.id}`}
                  className="inline-flex min-h-11 items-center gap-2 rounded-full border border-light-100/20 px-6 py-3 text-body-medium text-light-400"
                >
                  Sold out — view details
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              ) : (
                <Link
                  href={`/products/${product.id}`}
                  className="inline-flex min-h-11 items-center gap-2 rounded-full bg-[--color-naga-gold] px-6 py-3 text-body-medium text-dark-900 transition hover:brightness-110"
                >
                  Shop the set
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              )}
              <Link
                href="/products?category=sets"
                className="inline-flex min-h-11 items-center gap-2 rounded-full border border-light-100/20 px-6 py-3 text-body-medium text-light-100 transition hover:border-light-100/40 hover:bg-light-100/5"
              >
                All sets
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
