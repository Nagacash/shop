import HeroMotion from "@/components/motion/HeroMotion";
import HeroCinematicBackdrop from "@/components/HeroCinematicBackdrop";
import SectionChapterLabel from "@/components/SectionChapterLabel";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { BRAND_CLOSER_LINE, BRAND_TAGLINE, CTA } from "@/lib/brand/manifesto";
import { SITE_DESCRIPTION } from "@/lib/seo/site";

export default function HeroSection() {
  return (
    <section
      className="hero-cinematic relative z-0 min-h-[min(100svh,920px)] overflow-hidden text-light-100"
      aria-labelledby="hero-heading"
    >
      <HeroCinematicBackdrop />

      <p className="hero-cinematic-watermark naga-display" aria-hidden="true">
        HUSTLE
      </p>

      <div className="relative z-10 flex min-h-[min(100svh,920px)] flex-col justify-end lg:items-start">
        <div className="mx-auto w-full max-w-7xl px-4 pb-14 pt-28 sm:px-6 sm:pb-16 sm:pt-32 lg:px-8 lg:pb-20">
          <HeroMotion>
            <div data-hero-panel className="hero-cinematic-panel max-w-xl lg:max-w-md">
              <SectionChapterLabel index="00" title="Raise the cobra" tone="dark" className="mb-6" />

              <p data-hero-item className="naga-eyebrow border-light-100/15 bg-light-100/5">
                <span className="naga-eyebrow-dot" aria-hidden="true" />
                Naga Apparel
              </p>

              <h1
                id="hero-heading"
                data-hero-item
                className="naga-display mt-6 text-balance font-bold leading-[0.88] tracking-tighter text-light-100"
                style={{ fontSize: "clamp(2.75rem, 9vw, 5.25rem)" }}
              >
                {BRAND_TAGLINE}
              </h1>

              <p
                data-hero-item
                className="mt-6 max-w-lg text-pretty text-body leading-relaxed text-light-400"
              >
                {SITE_DESCRIPTION}
              </p>

              <p
                data-hero-item
                className="mt-4 max-w-md text-pretty text-lead leading-relaxed text-light-100"
              >
                {BRAND_CLOSER_LINE}
              </p>

              <div data-hero-item className="mt-9 flex flex-wrap items-center gap-4">
                <Link
                  href="/products"
                  className="naga-btn naga-btn-gold focus-ring focus-visible:outline-none"
                >
                  {CTA.shopTheDrop}
                  <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden="true" />
                </Link>
                <Link
                  href="/about"
                  className="naga-btn-text-light focus-ring focus-visible:outline-none"
                >
                  {CTA.learnHistory}
                </Link>
              </div>
            </div>
          </HeroMotion>
        </div>
      </div>

      <div className="hero-cinematic-scroll-hint" aria-hidden="true">
        <span className="hero-cinematic-scroll-line" />
        <span className="text-[0.625rem] uppercase tracking-[0.22em] text-light-400">Scroll</span>
      </div>
    </section>
  );
}
