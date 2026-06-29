import { Suspense } from "react";
import Link from "next/link";
import { Card } from "@/components";
import ActiveFilterBadges from "@/components/ActiveFilterBadges";
import Filters from "@/components/Filters";
import Sort from "@/components/Sort";
import { getCachedAllProducts } from "@/lib/queries/products";
import { buildActiveFilterBadges, clearProductFiltersUrl, parseFilterParams } from "@/lib/utils/query";
import { FALLBACK_PRODUCT_IMAGE, isFlatLayProductImage } from "@/lib/utils/images";
import { formatPriceRange } from "@/lib/utils/currency";

type SearchParams = Record<string, string | string[] | undefined>;

const PRODUCTS_PATH = "/products";

function filterKey(sp: SearchParams) {
  return JSON.stringify(parseFilterParams(sp));
}

function FiltersFallback() {
  return (
    <aside className="hidden min-h-[320px] min-w-60 rounded-lg border border-light-300 bg-light-100 p-4 md:block">
      <div className="h-4 w-20 animate-pulse rounded bg-light-300" />
    </aside>
  );
}

function GridFallback() {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="h-80 animate-pulse rounded-xl bg-light-200" />
      ))}
    </div>
  );
}

function buildActiveBadges(sp: SearchParams) {
  return buildActiveFilterBadges(PRODUCTS_PATH, sp);
}

async function ProductGrid({ sp }: { sp: SearchParams }) {
  const parsed = parseFilterParams(sp);
  const { products, totalCount } = await getCachedAllProducts(parsed);
  const searchQuery = parsed.search;
  const activeBadges = buildActiveBadges(sp);
  const clearFiltersUrl = clearProductFiltersUrl(PRODUCTS_PATH, sp);
  const hasActiveFilters = activeBadges.length > 0;

  return (
    <>
      <div className="flex items-center justify-end py-4">
        <Suspense fallback={<div className="h-10 w-40 animate-pulse rounded bg-light-200" />}>
          <Sort />
        </Suspense>
      </div>

      {hasActiveFilters && <ActiveFilterBadges badges={activeBadges} />}

      <p className="mb-4 text-caption text-dark-700">
        {totalCount} piece{totalCount === 1 ? "" : "s"}
        {searchQuery ? ` for "${searchQuery}"` : ""}
      </p>

      <section className="grid grid-cols-1 gap-6 md:grid-cols-[240px_1fr] pb-8">
        <Suspense fallback={<FiltersFallback />}>
          <Filters />
        </Suspense>
        <div>
          {products.length === 0 ? (
            <div className="rounded-xl border border-light-300 bg-light-100 p-10 text-center">
              <p className="text-body-medium text-dark-900">
                {searchQuery
                  ? `No products found for "${searchQuery}".`
                  : "No products match your filters."}
              </p>
              <p className="mt-2 text-body text-dark-700">
                Try adjusting your filters or browse the full catalog.
              </p>
              <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                {hasActiveFilters && (
                  <Link
                    href={clearFiltersUrl}
                    scroll={false}
                    className="focus-ring inline-flex min-h-11 items-center rounded-full border border-dark-900 px-5 py-2.5 text-body-medium text-dark-900 transition hover:bg-light-200 focus-visible:outline-none"
                  >
                    Clear filters
                  </Link>
                )}
                <Link
                  href={PRODUCTS_PATH}
                  className="focus-ring inline-flex min-h-11 items-center rounded-full bg-dark-900 px-5 py-2.5 text-body-medium text-light-100 transition hover:bg-dark-700 focus-visible:outline-none active:scale-[0.98]"
                >
                  Shop all
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 product-grid">
              {products.map((p) => {
                const price =
                  p.minPrice !== null && p.maxPrice !== null && p.minPrice !== p.maxPrice
                    ? formatPriceRange(p.minPrice, p.maxPrice)
                    : p.minPrice !== null
                      ? p.minPrice
                      : undefined;
                return (
                  <Card
                    key={p.id}
                    title={p.name}
                    subtitle={p.subtitle ?? undefined}
                    imageSrc={p.imageUrl ?? FALLBACK_PRODUCT_IMAGE}
                    price={price}
                    href={`/products/${p.id}`}
                    badge={
                      p.soldOut
                        ? { label: "Sold out", tone: "orange" }
                        : isFlatLayProductImage(p.imageUrl)
                          ? { label: "New", tone: "green" }
                          : undefined
                    }
                  />
                );
              })}
            </div>
          )}
        </div>
      </section>
    </>
  );
}

export default function ProductsShop({ sp }: { sp: SearchParams }) {
  return (
    <Suspense key={filterKey(sp)} fallback={<GridFallback />}>
      <ProductGrid sp={sp} />
    </Suspense>
  );
}
