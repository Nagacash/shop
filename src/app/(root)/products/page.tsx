import PageHero from "@/components/PageHero";
import ProductsShop from "@/components/ProductsShop";
import { BLACK_TEE_NAME, BRAND_SUBTAGLINE } from "@/lib/brand/manifesto";
import { SECTION_CLIPS } from "@/lib/brand/marketing-images";
import { parseFilterParams } from "@/lib/utils/query";
import {
  CHAINS_HERO_SUBTITLE,
  CHAINS_SEO_DESCRIPTION,
  CHAINS_SEO_TITLE,
} from "@/lib/seo/chains";
import { buildPageMetadata } from "@/lib/seo/metadata";
import type { Metadata } from "next";

type SearchParams = Record<string, string | string[] | undefined>;

export const revalidate = 120;

const CATEGORY_SEO: Record<string, { title: string; description: string; subtitle: string }> = {
  tees: {
    title: "Naga Tees",
    description:
      `${BLACK_TEE_NAME} — heavyweight cotton, regular cobra crest, built for the hustle.`,
    subtitle: "Knowledge is power. Dress like it.",
  },
  sweaters: {
    title: "Naga Sweaters",
    description:
      "Naga Original Sweater and Naga Golden Edition Sweater — premium knit with the Naga cobra crest, regular and gold.",
    subtitle: "Ancient craft. Modern hustle.",
  },
  sets: {
    title: "Syndicate Sets",
    description:
      "The Amazonian Syndicate Set — matching tee and shorts with Get Smart chest graphic, Hustle Hard leg print, and cobra patch.",
    subtitle: "Raise the cobra. Get smart.",
  },
  hoodies: {
    title: "Naga Hoodies",
    description:
      "Naga Original Hoodie and Naga Golden Edition Hoodie — fleece interior, cobra crest, unapologetic street fit.",
    subtitle: "Wear your wisdom.",
  },
  chains: {
    title: CHAINS_SEO_TITLE,
    description: CHAINS_SEO_DESCRIPTION,
    subtitle: CHAINS_HERO_SUBTITLE,
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
    description: `${BRAND_SUBTAGLINE} Tees, sweaters, hoodies, sets, and Cuban Link Ketten — Versand aus Hamburg.`,
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
    : categorySeo?.subtitle ??
      "Tees, sweaters, hoodies, sets, Cuban link chains — filter by size, color, and price.";

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
