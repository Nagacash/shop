import { Suspense } from "react";
import { HeroSection, HomeBrandSections } from "@/components";
import Woodland360Section from "@/components/Woodland360Section";
import BrandLookbookSection from "@/components/BrandLookbookSection";
import FeaturedDropSection from "@/components/FeaturedDropSection";
import HomeAvailableSection from "@/components/HomeAvailableSection";
import FaqSection from "@/components/FaqSection";
import JsonLd from "@/components/JsonLd";
import SectionColorBridge from "@/components/SectionColorBridge";
import { faqJsonLd } from "@/lib/seo/jsonld";
import { NAGA_FAQS } from "@/lib/seo/faq";
import { BRAND_CLOSER_LINE, BRAND_TAGLINE, BRAND_SUBTAGLINE } from "@/lib/brand/manifesto";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const revalidate = 120;

export const metadata = buildPageMetadata({
  title: BRAND_TAGLINE,
  description: `${BRAND_SUBTAGLINE} ${BRAND_CLOSER_LINE}`,
  path: "/",
  image: "/new/img/naga-dust.jpeg",
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
  return (
    <>
      <HeroSection />
      <Suspense fallback={<SectionSkeleton />}>
        <HomeAvailableSection />
      </Suspense>
      <SectionColorBridge />
      <Suspense fallback={<SectionSkeleton tall />}>
        <FeaturedDropSection />
      </Suspense>
      <Suspense fallback={<SectionSkeleton />}>
        <HomeBrandSections />
      </Suspense>
      <BrandLookbookSection />
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
