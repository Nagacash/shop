import Link from "next/link";
import { ArrowRight } from "lucide-react";
import BrandVideoBackdrop from "@/components/BrandVideoBackdrop";
import InViewMotion from "@/components/motion/InViewMotion";
import SectionChapterLabel from "@/components/SectionChapterLabel";
import { CTA } from "@/lib/brand/manifesto";
import { SECTION_CLIPS } from "@/lib/brand/marketing-images";

export default function BrandTeaserSection() {
  return (
    <section
      className="scroll-layer relative isolate overflow-hidden border-b border-dark-900/8 bg-black text-light-100"
      aria-labelledby="brand-teaser-heading"
      data-cursor-section
      data-cursor-index="04"
      data-cursor-label="Teaser"
    >
      <BrandVideoBackdrop clipId={SECTION_CLIPS.teaser} tone="cinematic" />

      <div className="relative z-10 mx-auto flex min-h-[56vh] max-w-7xl flex-col justify-end px-4 py-16 sm:min-h-[64vh] sm:px-6 lg:px-8 lg:py-24">
        <InViewMotion reveal className="max-w-xl">
          <SectionChapterLabel index="04" title="Teaser" tone="dark" className="mb-5" />
          <p data-motion-reveal className="naga-eyebrow w-fit border-light-100/15 bg-light-100/5">
            <span className="naga-eyebrow-dot" aria-hidden="true" />
            [ 15s reel ]
          </p>
          <h2
            id="brand-teaser-heading"
            data-motion-reveal
            className="naga-display mt-4 text-balance text-heading-3 font-bold tracking-tighter sm:text-heading-2"
          >
            Naga in motion
          </h2>
          <p data-motion-reveal className="mt-3 max-w-md text-body text-light-300/90">
            The mark, the cut, the night — a short reel of Naga in the wild.
          </p>
          <Link
            href="/products"
            data-motion-reveal
            className="naga-btn naga-btn-gold mt-8 inline-flex focus-ring focus-visible:outline-none"
          >
            {CTA.shopAll}
            <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden="true" />
          </Link>
        </InViewMotion>
      </div>
    </section>
  );
}
