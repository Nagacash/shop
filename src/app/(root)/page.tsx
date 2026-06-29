import { Suspense } from "react";
import { HeroSection, HomeBrandSections } from "@/components";
import FeaturedDropSection from "@/components/FeaturedDropSection";

export const revalidate = 120;

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
      <Suspense fallback={<SectionSkeleton tall />}>
        <FeaturedDropSection />
      </Suspense>
      <Suspense fallback={<SectionSkeleton />}>
        <HomeBrandSections />
      </Suspense>
    </>
  );
}
