import HeroMotion from "@/components/motion/HeroMotion";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { MARKETING_ALT, MARKETING_IMAGES } from "@/lib/brand/marketing-images";
import { BRAND_CLOSER_LINE, BRAND_TAGLINE, CTA } from "@/lib/brand/manifesto";

export default function HeroSection() {
  return (
    <section
      className="relative z-0 overflow-hidden bg-[--hero-light-base] text-dark-900"
      aria-labelledby="hero-heading"
    >
      <div
        data-hero-bg
        className="relative aspect-[4/3] w-full sm:aspect-[16/10] lg:aspect-[2/1] lg:max-h-[min(72vh,820px)]"
      >
        <Image
          src={MARKETING_IMAGES.productDust}
          alt={MARKETING_ALT.productDust}
          fill
          priority
          unoptimized
          className="object-cover object-center"
          sizes="100vw"
        />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8 lg:py-14">
        <HeroMotion>
          <div data-hero-panel className="max-w-xl">
            <p data-hero-item className="naga-eyebrow">
              <span className="naga-eyebrow-dot" aria-hidden="true" />
              Raise the cobra
            </p>

            <h1
              id="hero-heading"
              data-hero-item
              className="naga-display mt-6 text-balance font-bold leading-[0.9] tracking-tighter text-dark-900"
              style={{ fontSize: "clamp(2.5rem, 8.5vw, 4.75rem)" }}
            >
              {BRAND_TAGLINE}
            </h1>

            <p
              data-hero-item
              className="mt-6 max-w-md text-pretty text-lead leading-relaxed text-dark-700"
            >
              {BRAND_CLOSER_LINE}
            </p>

            <div data-hero-item className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                href="/products"
                className="naga-btn naga-btn-gold focus-ring focus-visible:outline-none"
              >
                {CTA.shopTheDrop}
                <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden="true" />
              </Link>
              <Link
                href="/about"
                className="naga-btn-text focus-ring focus-visible:outline-none"
              >
                {CTA.learnHistory}
              </Link>
            </div>
          </div>
        </HeroMotion>
      </div>
    </section>
  );
}
