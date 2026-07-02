import ProtectedLogo from "@/components/ProtectedLogo";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { MARKETING_ALT, MARKETING_IMAGES } from "@/lib/brand/marketing-images";

export default function HeroSection() {
  const portraitImage = MARKETING_IMAGES.berlinLifestyle;

  return (
    <section
      className="relative z-0 min-h-[min(100dvh,920px)] overflow-hidden bg-[--hero-light-base] text-dark-900"
      aria-labelledby="hero-heading"
    >
      <Image
        src={MARKETING_IMAGES.nagaTee}
        alt=""
        fill
        priority
        unoptimized
        className="object-cover object-[center_35%]"
        sizes="100vw"
      />

      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-r from-light-100/96 via-light-100/78 to-light-100/28"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_88%_18%,color-mix(in_srgb,var(--color-naga-gold)_16%,transparent),transparent_48%)]"
        aria-hidden="true"
      />

      <div className="relative mx-auto flex min-h-[min(100dvh,920px)] max-w-7xl items-center px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <div className="grid w-full items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
          <div className="hero-enter hero-enter-1 naga-bezel-light max-w-xl">
            <div className="naga-bezel-light-inner bg-light-100/88 p-6 sm:p-8">
              <p className="hero-enter hero-enter-1 naga-eyebrow">
                <span className="naga-eyebrow-dot" aria-hidden="true" />
                Naga Original // Tee Drop
              </p>

              <h1
                id="hero-heading"
                className="naga-display hero-enter hero-enter-2 mt-6 text-balance font-bold leading-[0.9] tracking-tighter text-dark-900"
                style={{ fontSize: "clamp(3rem, 11vw, 5.75rem)" }}
              >
                <span className="block">NAGA</span>
                <span className="block text-[--color-naga-gold]">APPAREL</span>
              </h1>

              <p className="hero-enter hero-enter-3 mt-6 max-w-md text-pretty text-lead leading-relaxed text-dark-700">
                Naga Apparel is a Germany-based urban streetwear brand — Naga Original
                graphic tees, sweaters, hoodies, and matching sets with real flat-lay product
                photography. Knowledge and quality over ignorance.
              </p>

              <div className="hero-enter hero-enter-4 mt-8 flex flex-wrap items-center gap-4">
                <Link
                  href="/products?category=tees"
                  className="naga-btn naga-btn-gold focus-ring focus-visible:outline-none"
                >
                  Shop Tees
                  <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden="true" />
                </Link>
                <Link
                  href="/collections"
                  className="naga-btn-text focus-ring focus-visible:outline-none"
                >
                  View Collections
                </Link>
              </div>

              <dl className="hero-enter hero-enter-5 mt-10 grid grid-cols-3 gap-4 border-t border-dark-900/8 pt-6">
                <div>
                  <dt className="text-caption uppercase tracking-[0.18em] text-dark-500">Lines</dt>
                  <dd className="naga-display mt-1 text-body-medium text-dark-900">3 Core</dd>
                </div>
                <div>
                  <dt className="text-caption uppercase tracking-[0.18em] text-dark-500">Fit</dt>
                  <dd className="naga-display mt-1 text-body-medium text-dark-900">Unisex</dd>
                </div>
                <div>
                  <dt className="text-caption uppercase tracking-[0.18em] text-dark-500">Returns</dt>
                  <dd className="naga-display mt-1 text-body-medium tabular-nums text-dark-900">30 Days</dd>
                </div>
              </dl>
            </div>
          </div>

          <div className="hero-enter hero-enter-3 relative mx-auto w-full max-w-md lg:max-w-none">
            <div className="naga-bezel-dark">
              <div className="naga-bezel-dark-inner relative aspect-[4/5] bg-dark-900">
                {portraitImage ? (
                  <>
                    <Image
                      src={portraitImage}
                      alt={MARKETING_ALT.berlinLifestyle}
                      fill
                      unoptimized
                      className="object-cover object-top"
                      sizes="(max-width: 1024px) 100vw, 40vw"
                    />
                    <div
                      className="absolute inset-0 bg-gradient-to-t from-dark-900/80 via-dark-900/15 to-transparent"
                      aria-hidden="true"
                    />
                  </>
                ) : null}

                <div className="relative z-10 flex h-full flex-col justify-between p-8 text-light-100">
                  <ProtectedLogo className="h-20 w-20 sm:h-24 sm:w-24" />
                  <div>
                    <p className="naga-eyebrow border-light-100/15 bg-light-100/5 text-[--color-naga-gold]">
                      Berlin // Golden hour
                    </p>
                    <p
                      className="naga-display mt-4 font-bold leading-none tracking-tighter"
                      style={{ fontSize: "clamp(2rem, 7vw, 3.5rem)" }}
                    >
                      HUSTLE HARD
                    </p>
                    <p className="mt-3 text-body text-light-300">
                      Hoodies · Tees · Sets
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div
              className="absolute -right-2 -top-2 hidden border border-[--color-naga-gold]/60 bg-dark-900 px-3 py-1.5 text-[0.625rem] font-medium uppercase tracking-[0.22em] text-[--color-naga-gold] sm:block"
              aria-hidden="true"
            >
              OG Drop
            </div>
          </div>
        </div>
      </div>

      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-32 bg-gradient-to-b from-transparent to-[--hero-light-base] sm:h-40"
        aria-hidden="true"
      />
    </section>
  );
}
