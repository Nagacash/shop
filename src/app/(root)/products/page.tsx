import PageHero from "@/components/PageHero";
import ProductsShop from "@/components/ProductsShop";
import { BLACK_TEE_NAME, BRAND_SUBTAGLINE } from "@/lib/brand/manifesto";
import { SECTION_CLIPS } from "@/lib/brand/marketing-images";
import { parseFilterParams } from "@/lib/utils/query";
import { buildPageMetadata } from "@/lib/seo/metadata";
import type { Metadata } from "next";

type SearchParams = Record<string, string | string[] | undefined>;

export const revalidate = 120;

const CATEGORY_SEO: Record<string, { title: string; description: string; subtitle: string }> = {
  tees: {
    title: "Get Smart Tees",
    description:
      `${BLACK_TEE_NAME} and The Wisdom & Hustle Tee — heavyweight cotton, cobra chest graphics, built for the hustle.`,
    subtitle: "Knowledge is power. Dress like it.",
  },
  sweaters: {
    title: "Empire Crews",
    description:
      "The Angkor Heavyweight Crew and The Empire Roots Crew — premium knit streetwear rooted in ancient wisdom.",
    subtitle: "Ancient craft. Modern hustle.",
  },
  sets: {
    title: "Syndicate Sets",
    description:
      "The Amazonian Syndicate Set — matching tee and shorts with Get Smart chest graphic, Hustle Hard leg print, and cobra patch.",
    subtitle: "Raise the cobra. Get smart.",
  },
  hoodies: {
    title: "Cobra Hoodies",
    description:
      "The Cobra Wisdom Hoodie and The Golden Empire Hoodie — fleece interior, cobra chest graphics, unapologetic street fit.",
    subtitle: "Wear your wisdom.",
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
    title: "Shop the Drop",
    description: `${BRAND_SUBTAGLINE} Tees, sweaters, hoodies, and sets — claim yours.`,
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

  const categorySeo = category ? CATEGORY_SEO[category] : undefined;
  const heroTitle = searchQuery
    ? `Results for "${searchQuery}"`
    : categorySeo?.title ?? "Shop the Drop";
  const heroSubtitle = searchQuery
    ? "Filter by size, color, and price."
    : categorySeo?.subtitle ?? "Tees, sweaters, hoodies, and sets — filter by size, color, and price.";

  return (
    <>
      <PageHero
        clipId={SECTION_CLIPS.shop}
        page="shop"
        size="compact"
        eyebrow="Naga drop"
        title={heroTitle}
        subtitle={heroSubtitle}
      />

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <ProductsShop sp={sp} />
      </main>
    </>
  );
}
