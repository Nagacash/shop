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
      className="hero-cinematic relative z-0 min-h-[100svh] h-screen w-full overflow-hidden bg-black text-light-100"
      aria-labelledby="hero-heading"
      data-cursor-section
      data-cursor-index="00"
      data-cursor-label="Signal"
    >
      <HeroCinematicBackdrop />

      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[6] h-48 bg-gradient-to-b from-transparent to-black" />

      <HeroMotion>
        <div className="relative z-10 h-full w-full">
          <h1 id="hero-heading" className="sr-only">
            {BRAND_TAGLINE}
          </h1>

          <div className="hero-stagger-headline pointer-events-none" aria-hidden="true">
            <span
              data-hero-word
              className="hero-title naga-display absolute left-4 top-[18%] font-medium text-light-100 md:left-10"
            >
              Ancient
            </span>
            <span
              data-hero-word
              className="hero-title naga-display absolute right-4 top-[38%] font-medium text-light-100 md:right-10"
            >
              Your
            </span>
            <span
              data-hero-word
              className="hero-title hero-title--accent naga-display absolute left-[18%] top-[58%] font-medium text-light-100 md:left-[28%]"
            >
              Wisdom
            </span>
          </div>

          <div data-hero-copy className="absolute left-6 top-[46%] max-w-[240px] md:left-10">
            <p className="naga-eyebrow w-fit border-light-100/15 bg-light-100/5">
              <span className="naga-eyebrow-dot" aria-hidden="true" />
              [ Naga Apparel ]
            </p>
            <p className="mt-4 text-pretty text-[15px] leading-snug text-light-100/90">{BRAND_SUBTAGLINE}</p>
            <p className="mt-3 text-pretty text-[13px] leading-snug text-light-100/70">{BRAND_CLOSER_LINE}</p>
            <div className="mt-6 flex flex-wrap items-center gap-4">
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
