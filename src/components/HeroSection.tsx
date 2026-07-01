import ProtectedLogo from "@/components/ProtectedLogo";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { MARKETING_ALT, MARKETING_IMAGES } from "@/lib/brand/marketing-images";

export default function HeroSection() {
  const portraitImage = MARKETING_IMAGES.berlinLifestyle;

  return (
    <section
      className="relative min-h-[min(100dvh,920px)] overflow-hidden bg-[#e8e4df] text-dark-900"
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
        className="pointer-events-none absolute inset-0 bg-gradient-to-r from-light-100/94 via-light-100/72 to-light-100/25"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_88%_18%,color-mix(in_srgb,var(--color-naga-gold)_18%,transparent),transparent_48%)]"
        aria-hidden="true"
      />

      <div className="relative mx-auto flex min-h-[min(100dvh,920px)] max-w-7xl items-center px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="grid w-full items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
          <div className="hero-enter hero-enter-1 max-w-xl rounded-2xl border border-dark-900/5 bg-light-100/55 p-6 backdrop-blur-md sm:p-8">
            <p className="hero-enter hero-enter-1 inline-flex items-center gap-2 border border-[--color-naga-gold]/35 bg-[--color-naga-gold]/10 px-3 py-1.5 text-caption uppercase tracking-[0.22em] text-[--color-naga-gold]">
              <span className="h-1.5 w-1.5 rounded-full bg-[--color-naga-gold]" />
              Naga Original // Tee Drop
            </p>

            <h1
              id="hero-heading"
              className="hero-enter hero-enter-2 mt-6 text-balance font-bold leading-[0.92] tracking-tighter text-dark-900"
              style={{ fontSize: "clamp(3rem, 11vw, 5.75rem)" }}
            >
              <span className="block">NAGA</span>
              <span className="block text-[--color-naga-gold]">APPAREL</span>
            </h1>

            <p className="hero-enter hero-enter-3 mt-6 max-w-md text-pretty text-lead text-dark-700">
              Knowledge and quality over ignorance. Premium tees, sweaters, and sets —
              real pieces, shot in the light, built for the grind.
            </p>

            <div className="hero-enter hero-enter-4 mt-8 flex flex-wrap gap-3">
              <Link
                href="/products?category=tees"
                className="inline-flex min-h-11 items-center gap-2 rounded-full bg-[--color-naga-gold] px-6 py-3 text-body-medium text-dark-900 transition-[background-color,transform] duration-200 ease-out hover:brightness-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-[--color-naga-gold]/50 active:scale-[0.98]"
              >
                Shop Tees
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <Link
                href="/collections"
                className="inline-flex min-h-11 items-center gap-2 rounded-full border border-dark-900/15 bg-light-100/60 px-6 py-3 text-body-medium text-dark-900 transition-[border-color,background-color] duration-200 ease-out hover:border-[--color-naga-gold] hover:bg-light-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-dark-900/20"
              >
                View Collections
              </Link>
            </div>

            <dl className="hero-enter hero-enter-5 mt-10 grid grid-cols-3 gap-4 border-t border-dark-900/10 pt-6">
              <div>
                <dt className="text-caption uppercase tracking-widest text-dark-500">Lines</dt>
                <dd className="mt-1 text-body-medium text-dark-900">3 Core</dd>
              </div>
              <div>
                <dt className="text-caption uppercase tracking-widest text-dark-500">Fit</dt>
                <dd className="mt-1 text-body-medium text-dark-900">Unisex</dd>
              </div>
              <div>
                <dt className="text-caption uppercase tracking-widest text-dark-500">Returns</dt>
                <dd className="mt-1 text-body-medium tabular-nums text-dark-900">30 Days</dd>
              </div>
            </dl>
          </div>

          <div className="hero-enter hero-enter-3 relative mx-auto w-full max-w-md lg:max-w-none">
            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-dark-900/10 bg-light-100 shadow-[0_24px_64px_rgba(17,17,17,0.12)]">
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
                    className="absolute inset-0 bg-gradient-to-t from-dark-900/75 via-dark-900/10 to-transparent"
                    aria-hidden="true"
                  />
                </>
              ) : null}

              <div className="relative z-10 flex h-full flex-col justify-between p-8 text-light-100">
                <ProtectedLogo className="h-20 w-20 sm:h-24 sm:w-24" />
                <div>
                  <p className="text-caption uppercase tracking-[0.25em] text-[--color-naga-gold]">
                    Berlin // Golden hour
                  </p>
                  <p
                    className="mt-3 font-bold leading-none tracking-tighter"
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
            <div
              className="absolute -right-3 -top-3 hidden rounded-full border border-[--color-naga-gold] bg-dark-900 px-4 py-2 text-caption font-medium uppercase tracking-widest text-[--color-naga-gold] sm:block"
              aria-hidden="true"
            >
              OG Drop
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
