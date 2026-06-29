import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getHeroImageUrl, getHeroGlamourImageUrl } from "@/lib/brand/assets";

export default function HeroSection() {
  const heroImage = getHeroImageUrl();
  const glamourImage = getHeroGlamourImageUrl() ?? heroImage;

  return (
    <section
      className="relative overflow-hidden bg-dark-900 text-light-100"
      aria-labelledby="hero-heading"
    >
      {heroImage && (
        <Image
          src={heroImage}
          alt=""
          fill
          priority
          unoptimized
          className="object-cover object-center"
          sizes="100vw"
        />
      )}

      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-r from-dark-900/95 via-dark-900/80 to-dark-900/55"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(201,162,39,0.22),transparent_42%)]"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <div className="grid items-center gap-12 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="max-w-xl">
            <p className="hero-enter hero-enter-1 inline-flex items-center gap-2 border border-[--color-naga-gold]/40 bg-[--color-naga-gold]/10 px-3 py-1.5 text-caption uppercase tracking-[0.22em] text-[--color-naga-gold]">
              <span className="h-1.5 w-1.5 rounded-full bg-[--color-naga-gold]" />
              Golden Drip // Hustle Hard
            </p>

            <h1
              id="hero-heading"
              className="hero-enter hero-enter-2 mt-6 text-balance font-bold leading-[0.92] tracking-tighter"
              style={{ fontSize: "clamp(3rem, 11vw, 5.75rem)" }}
            >
              <span className="block">NAGA</span>
              <span className="block text-[--color-naga-gold]">APPAREL</span>
            </h1>

            <p className="hero-enter hero-enter-3 mt-6 max-w-md text-pretty text-lead text-light-400">
              Knowledge and quality over ignorance. Hustle grit and ultra-fine glamour —
              hoodies, heavy tees, and headwear for the ones who move different.
            </p>

            <div className="hero-enter hero-enter-4 mt-8 flex flex-wrap gap-3">
              <Link
                href="/products?category=hoodies"
                className="inline-flex min-h-11 items-center gap-2 rounded-full bg-[--color-naga-gold] px-6 py-3 text-body-medium text-dark-900 transition-[background-color,transform] duration-200 ease-out hover:brightness-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-[--color-naga-gold]/50 active:scale-[0.98]"
              >
                Shop Hoodies
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <Link
                href="/collections"
                className="inline-flex min-h-11 items-center gap-2 rounded-full border border-light-100/30 px-6 py-3 text-body-medium text-light-100 transition-[border-color,background-color] duration-200 ease-out hover:border-[--color-naga-gold] hover:bg-light-100/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-light-100/40"
              >
                View Collections
              </Link>
            </div>

            <dl className="hero-enter hero-enter-5 mt-10 grid grid-cols-3 gap-4 border-t border-light-100/10 pt-6">
              <div>
                <dt className="text-caption uppercase tracking-widest text-light-400">Lines</dt>
                <dd className="mt-1 text-body-medium">3 Core</dd>
              </div>
              <div>
                <dt className="text-caption uppercase tracking-widest text-light-400">Fit</dt>
                <dd className="mt-1 text-body-medium">Unisex</dd>
              </div>
              <div>
                <dt className="text-caption uppercase tracking-widest text-light-400">Returns</dt>
                <dd className="mt-1 text-body-medium tabular-nums">30 Days</dd>
              </div>
            </dl>
          </div>

          <div className="hero-enter hero-enter-3 relative mx-auto w-full max-w-md lg:max-w-none">
            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-[--color-naga-gold]/25 bg-dark-900/60 backdrop-blur-sm">
              {glamourImage ? (
                <>
                  <Image
                    src={glamourImage}
                    alt=""
                    fill
                    unoptimized
                    className="object-cover object-top opacity-95"
                    sizes="(max-width: 1024px) 100vw, 40vw"
                  />
                  <div
                    className="absolute inset-0 bg-gradient-to-t from-dark-900/90 via-dark-900/20 to-transparent"
                    aria-hidden="true"
                  />
                </>
              ) : (
                <div
                  className="absolute inset-0 bg-gradient-to-br from-dark-900 via-[#1a1a1a] to-dark-900"
                  aria-hidden="true"
                />
              )}

              <div className="relative z-10 flex h-full flex-col justify-between p-8">
                <Image
                  src="/logo.png"
                  alt="Naga Apparel"
                  width={72}
                  height={72}
                  className="h-16 w-16 rounded-full object-cover sm:h-[4.5rem] sm:w-[4.5rem]"
                />
                <div>
                  <p className="text-caption uppercase tracking-[0.25em] text-[--color-naga-gold]">
                    Glamour // Hustle
                  </p>
                  <p
                    className="mt-3 font-bold leading-none tracking-tighter text-light-100"
                    style={{ fontSize: "clamp(2rem, 7vw, 3.5rem)" }}
                  >
                    HUSTLE HARD
                  </p>
                  <p className="mt-3 text-body text-light-400">
                    Hoodies · Heavy tees · Trucker caps
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
