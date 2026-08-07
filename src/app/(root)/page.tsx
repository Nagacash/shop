import { Suspense } from "react";
import { HeroSection, HomeBrandSections } from "@/components";
import Woodland360Section from "@/components/Woodland360Section";
import BrandLookbookSection from "@/components/BrandLookbookSection";
import BrandTeaserSection from "@/components/BrandTeaserSection";
import HoodieStreetSection from "@/components/HoodieStreetSection";
import FeaturedDropSection from "@/components/FeaturedDropSection";
import HomeAvailableSection from "@/components/HomeAvailableSection";
import FaqSection from "@/components/FaqSection";
import JsonLd from "@/components/JsonLd";
import SectionColorBridge from "@/components/SectionColorBridge";
import { faqJsonLd } from "@/lib/seo/jsonld";
import { NAGA_FAQS } from "@/lib/seo/faq";
import { BRAND_CLOSER_LINE, BRAND_TAGLINE, BRAND_SUBTAGLINE } from "@/lib/brand/manifesto";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { SOCIAL_SHARE_IMAGE } from "@/lib/brand/marketing-images";
import { getCachedAllProducts } from "@/lib/queries/products";
import { getCachedCollections } from "@/lib/queries/collections";
import { parseFilterParams } from "@/lib/utils/query";

export const revalidate = 120;

export const metadata = buildPageMetadata({
  title: BRAND_TAGLINE,
  description: `${BRAND_SUBTAGLINE} ${BRAND_CLOSER_LINE}`,
  path: "/",
  image: SOCIAL_SHARE_IMAGE,
});

function SectionSkeleton({ tall = false }: { tall?: boolean }) {
  return (
    <div
      className={`scroll-layer animate-pulse bg-light-200 ${tall ? "min-h-[520px]" : "min-h-[280px]"}`}
      aria-hidden="true"
    />
  );
}

export default async function Home() {
  const [{ totalCount: dropCount }, collections] = await Promise.all([
    getCachedAllProducts(parseFilterParams({})),
    getCachedCollections(),
  ]);

  return (
    <>
      <HeroSection dropCount={dropCount} collectionCount={collections.length} />
      <Suspense fallback={<SectionSkeleton />}>
        <HomeAvailableSection />
      </Suspense>
      <HoodieStreetSection />
      <SectionColorBridge />
      <Suspense fallback={<SectionSkeleton tall />}>
        <FeaturedDropSection />
      </Suspense>
      <Suspense fallback={<SectionSkeleton />}>
        <HomeBrandSections />
      </Suspense>
      <BrandLookbookSection />
      <BrandTeaserSection />
      <Woodland360Section />
      <JsonLd data={faqJsonLd([...NAGA_FAQS])} />
      <div className="scroll-layer border-t border-dark-900/8 bg-light-100">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <FaqSection contactLink />
        </div>
      </div>
    </>
  );
}
