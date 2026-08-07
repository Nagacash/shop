import HeroMotion from "@/components/motion/HeroMotion";
import HeroCinematicBackdrop from "@/components/HeroCinematicBackdrop";
import HeroStatBlocks from "@/components/HeroStatBlocks";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { BRAND_CLOSER_LINE, BRAND_SUBTAGLINE, BRAND_TAGLINE, CTA } from "@/lib/brand/manifesto";

type HeroSectionProps = {
  dropCount: number;
  collectionCount: number;
};

export default function HeroSection({ dropCount, collectionCount }: HeroSectionProps) {
  return (
    <section
      className="hero-cinematic relative z-0 min-h-[100svh] h-[100svh] w-full overflow-hidden bg-black text-light-100"
      aria-labelledby="hero-heading"
      data-cursor-section
      data-cursor-index="00"
      data-cursor-label="Signal"
    >
      <HeroCinematicBackdrop />

      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[6] h-40 bg-gradient-to-b from-transparent to-black sm:h-48" />

      <HeroMotion>
        <div className="relative z-10 h-full w-full">
          <h1 id="hero-heading" className="sr-only">
            {BRAND_TAGLINE}
          </h1>

          <div className="hero-stagger-headline pointer-events-none" aria-hidden="true">
            <span
              data-hero-word
              className="hero-title naga-display absolute left-4 top-[11%] font-medium text-light-100 sm:left-6 sm:top-[18%] md:left-10"
            >
              Ancient
            </span>
            <span
              data-hero-word
              className="hero-title naga-display absolute right-4 top-[22%] font-medium text-light-100 sm:right-6 sm:top-[38%] md:right-10"
            >
              Your
            </span>
            <span
              data-hero-word
              className="hero-title hero-title--accent naga-display absolute left-4 top-[33%] font-medium text-light-100 sm:left-[18%] sm:top-[58%] md:left-[28%]"
            >
              Wisdom
            </span>
          </div>

          <div
            data-hero-copy
            className="absolute inset-x-4 bottom-[calc(7.5rem+env(safe-area-inset-bottom,0px))] z-20 max-w-md sm:inset-x-auto sm:bottom-auto sm:left-6 sm:top-[46%] sm:max-w-[260px] md:left-10 md:max-w-[280px]"
          >
            <p className="naga-eyebrow w-fit border-light-100/15 bg-light-100/5">
              <span className="naga-eyebrow-dot" aria-hidden="true" />
              [ Naga Apparel ]
            </p>
            <p className="mt-3 text-pretty text-[0.9375rem] leading-snug text-light-100/90 sm:mt-4 sm:text-[15px]">
              {BRAND_SUBTAGLINE}
            </p>
            <p className="mt-2 text-pretty text-[0.8125rem] leading-snug text-light-100/70 sm:mt-3 sm:text-[13px]">
              {BRAND_CLOSER_LINE}
            </p>
            <div className="mt-5 flex flex-wrap items-center gap-3 sm:mt-6 sm:gap-4">
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

          <HeroStatBlocks dropCount={dropCount} collectionCount={collectionCount} />
        </div>
      </HeroMotion>

      <div className="hero-cinematic-scroll-hint" aria-hidden="true">
        <span className="hero-cinematic-scroll-line" />
        <span className="text-[0.625rem] uppercase tracking-[0.22em] text-light-400">
          &gt;&gt;&gt; Scroll
        </span>
      </div>
    </section>
  );
}
