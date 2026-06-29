import { Card } from "@/components";
import Filters from "@/components/Filters";
import Sort from "@/components/Sort";
import PageHero from "@/components/PageHero";
import { parseFilterParams } from "@/lib/utils/query";
import { getCachedAllProducts } from "@/lib/queries/products";
import { FALLBACK_PRODUCT_IMAGE, isFlatLayProductImage } from "@/lib/utils/images";
import { buildPageMetadata } from "@/lib/seo/metadata";
import type { Metadata } from "next";

type SearchParams = Record<string, string | string[] | undefined>;

export const revalidate = 120;

const CATEGORY_SEO: Record<string, { title: string; description: string }> = {
  tees: {
    title: "Naga Original Tees",
    description: "Shop Naga Original black and white graphic tees. Heavyweight cotton, cobra chest print, real flat-lay photos.",
  },
  sweaters: {
    title: "Naga Sweaters",
    description: "Shop Naga Original grey and light brown sweaters. Premium knit crewnecks with the Naga cobra graphic.",
  },
  sets: {
    title: "Naga Sets",
    description: "Shop Naga matching tee and shorts sets. The Naga Black Set — Naga Original graphic tee and Hustle Hard shorts.",
  },
  hoodies: {
    title: "Naga Hoodies",
    description:
      "Shop the Naga Original cream pullover hoodie. Cobra chest graphic, fleece interior, kangaroo pocket, and drawstring hood.",
  },
};

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}): Promise<Metadata> {
  const sp = await searchParams;
  const category = typeof sp.category === "string" ? sp.category : sp.category?.[0];
  const search = typeof sp.search === "string" ? sp.search : sp.search?.[0];

  if (search) {
    return buildPageMetadata({
      title: `Search: ${search}`,
      description: `Search results for "${search}" at Naga Apparel.`,
      path: `/products?search=${encodeURIComponent(search)}`,
    });
  }

  if (category && CATEGORY_SEO[category]) {
    const seo = CATEGORY_SEO[category];
    return buildPageMetadata({
      title: seo.title,
      description: seo.description,
      path: `/products?category=${category}`,
    });
  }

  return buildPageMetadata({
    title: "Shop All Products",
    description: "Shop all Naga Apparel — tees, sweaters, sets, and streetwear drops with real product photography.",
    path: "/products",
  });
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const sp = await searchParams;

  const parsed = parseFilterParams(sp);
  const { products, totalCount } = await getCachedAllProducts(parsed);
  const searchQuery = parsed.search;
  const category = parsed.categorySlugs[0];

  const heroTitle = searchQuery
    ? `Results for "${searchQuery}"`
    : category
      ? category.charAt(0).toUpperCase() + category.slice(1)
      : "Shop";

  const activeBadges: string[] = [];
  if (searchQuery) activeBadges.push(`Search: ${searchQuery}`);
  (sp.gender ? (Array.isArray(sp.gender) ? sp.gender : [sp.gender]) : []).forEach((g) =>
    activeBadges.push(String(g)[0].toUpperCase() + String(g).slice(1))
  );
  (sp.size ? (Array.isArray(sp.size) ? sp.size : [sp.size]) : []).forEach((s) =>
    activeBadges.push(`Size: ${s}`)
  );
  (sp.color ? (Array.isArray(sp.color) ? sp.color : [sp.color]) : []).forEach((c) =>
    activeBadges.push(String(c)[0].toUpperCase() + String(c).slice(1))
  );
  (sp.price ? (Array.isArray(sp.price) ? sp.price : [sp.price]) : []).forEach((p) => {
    const [min, max] = String(p).split("-");
    const label =
      min && max ? `$${min} - $${max}` : min && !max ? `Over $${min}` : `$0 - $${max}`;
    activeBadges.push(label);
  });

  return (
    <>
      <PageHero
        page="shop"
        size="compact"
        eyebrow="Naga drop"
        title={heroTitle}
        subtitle={`${totalCount} piece${totalCount === 1 ? "" : "s"} — tees, sweaters, and sets.`}
      />

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-end py-4">
          <Sort />
        </div>

        {activeBadges.length > 0 && (
          <div className="mb-4 flex flex-wrap gap-2">
            {activeBadges.map((b, i) => (
              <span
                key={`${b}-${i}`}
                className="rounded-full border border-light-300 px-3 py-1 text-caption text-dark-900"
              >
                {b}
              </span>
            ))}
          </div>
        )}

        <section className="grid grid-cols-1 gap-6 md:grid-cols-[240px_1fr] pb-8">
          <Filters />
          <div>
            {products.length === 0 ? (
              <div className="rounded-lg border border-light-300 p-8 text-center">
                <p className="text-body text-dark-700">
                  {searchQuery
                    ? `No products found for "${searchQuery}".`
                    : "No products match your filters."}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 product-grid">
                {products.map((p) => {
                  const price =
                    p.minPrice !== null && p.maxPrice !== null && p.minPrice !== p.maxPrice
                      ? `$${p.minPrice.toFixed(2)} - $${p.maxPrice.toFixed(2)}`
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
      </main>
    </>
  );
}
