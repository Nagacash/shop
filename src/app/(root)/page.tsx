import { Suspense } from "react";
import { HeroSection, HomeBrandSections } from "@/components";
import FeaturedDropSection from "@/components/FeaturedDropSection";
import SectionColorBridge from "@/components/SectionColorBridge";
import JsonLd from "@/components/JsonLd";
import { faqJsonLd } from "@/lib/seo/jsonld";
import { NAGA_FAQS } from "@/lib/seo/faq";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const revalidate = 120;

export const metadata = buildPageMetadata({
  title: "Urban Streetwear Tees, Sweaters & Sets",
  description:
    "Shop Naga Apparel — Naga Original tees, grey and light brown sweaters, and the Naga Black set. Germany-based urban streetwear with real product photography.",
  path: "/",
  image: "/website-images/naga-tee.jpeg",
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
      <JsonLd data={faqJsonLd([...NAGA_FAQS])} />
      <HeroSection />
      <SectionColorBridge />
      <Suspense fallback={<SectionSkeleton tall />}>
        <FeaturedDropSection />
      </Suspense>
      <Suspense fallback={<SectionSkeleton />}>
        <HomeBrandSections />
      </Suspense>
    </>
  );
}
