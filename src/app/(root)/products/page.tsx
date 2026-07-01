import PageHero from "@/components/PageHero";
import ProductsShop from "@/components/ProductsShop";
import { SECTION_CLIPS } from "@/lib/brand/marketing-images";
import { parseFilterParams } from "@/lib/utils/query";
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
      "Shop Naga Original cream and Golden Naga hoodies. Cobra chest graphics, fleece interior, kangaroo pocket, and drawstring hood.",
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
  const searchQuery = parsed.search;
  const category = parsed.categorySlugs[0];

  const heroTitle = searchQuery
    ? `Results for "${searchQuery}"`
    : category
      ? category.charAt(0).toUpperCase() + category.slice(1)
      : "Shop";

  return (
    <>
      <PageHero
        clipId={SECTION_CLIPS.shop}
        page="shop"
        size="compact"
        eyebrow="Naga drop"
        title={heroTitle}
        subtitle="Tees, sweaters, hoodies, and sets — filter by size, color, and price."
      />

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <ProductsShop sp={sp} />
      </main>
    </>
  );
}
