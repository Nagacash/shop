import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Instagram } from "lucide-react";
import InViewMotion from "@/components/motion/InViewMotion";
import { getCachedCollections } from "@/lib/queries/collections";
import { BRAND_HEADLINE, BRAND_SUBTAGLINE_ALT, BRAND_TAGLINE, CTA } from "@/lib/brand/manifesto";
import { LEGACY_GALLERY, SECTION_CLIPS, type BrandClipId } from "@/lib/brand/marketing-images";
import PageHero from "@/components/PageHero";
import BrandVideoBackdrop from "@/components/BrandVideoBackdrop";

function SectionVideoShell({
  clipId,
  children,
  className = "",
}: {
  clipId: BrandClipId;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      <BrandVideoBackdrop clipId={clipId} />
      <div className="relative z-10">{children}</div>
    </div>
  );
}

export default async function HomeBrandSections() {
  const collections = await getCachedCollections();

  return (
    <>
      <SectionVideoShell
        clipId={SECTION_CLIPS.balance}
        className="scroll-layer border-b border-dark-900/8 text-light-100"
      >
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
          <InViewMotion reveal className="mb-12 max-w-2xl">
            <p data-motion-reveal className="naga-eyebrow border-light-100/15 bg-light-100/5">
              <span className="naga-eyebrow-dot" aria-hidden="true" />
              The cobra runs deep
            </p>
            <h2
              data-motion-reveal
              className="naga-display mt-4 text-heading-3 text-balance font-bold tracking-tighter sm:text-heading-2"
            >
              {BRAND_HEADLINE}
            </h2>
            <p data-motion-reveal className="mt-4 text-body leading-relaxed text-light-400">
              {BRAND_SUBTAGLINE_ALT} Same unapologetic energy as{" "}
              <a
                href="https://www.instagram.com/naga_apparel"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[--color-naga-gold] underline-offset-2 transition-colors duration-[var(--duration-normal)] ease-[var(--ease-premium)] hover:underline"
              >
                @naga_apparel
              </a>
              .
            </p>
          </InViewMotion>

          <InViewMotion stagger className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            <div data-motion-stagger className="naga-glass-card">
              <p className="text-caption uppercase tracking-[0.2em] text-light-400">Wisdom</p>
              <h3 className="naga-display mt-2 text-body-medium text-light-100">Ancient roots, modern strike</h3>
              <p className="mt-3 text-body leading-relaxed text-light-400">
                From the Amazon to Angkor Wat — the serpent symbolizes knowledge, power, and
                rebirth. We wear our history.
              </p>
            </div>
            <div data-motion-stagger className="naga-glass-card naga-glass-card--gold">
              <p className="text-caption uppercase tracking-[0.2em] text-[--color-naga-gold]">
                Hustle
              </p>
              <h3 className="naga-display mt-2 text-body-medium text-light-100">Smart hustle energy</h3>
              <p className="mt-3 text-body leading-relaxed text-light-400">
                For the knowledge-lovers and system-breakers. Hoodies and heavy tees built for
                those who refuse to bow.
              </p>
            </div>
            <div data-motion-stagger className="naga-glass-card md:col-span-2 lg:col-span-1">
              <p className="text-caption uppercase tracking-[0.2em] text-light-400">Empire</p>
              <h3 className="naga-display mt-2 text-body-medium text-light-100">Authentic craft</h3>
              <p className="mt-3 text-body leading-relaxed text-light-400">
                Heavy cotton, sharp prints, and the cobra mark — unapologetic quality you can see
                and feel before checkout.
              </p>
            </div>
          </InViewMotion>
        </div>
      </SectionVideoShell>

      <section className="scroll-layer border-b border-dark-900/8 bg-light-100">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <InViewMotion reveal className="mb-10 max-w-xl">
            <p data-motion-reveal className="naga-eyebrow w-fit">
              <span className="naga-eyebrow-dot" aria-hidden="true" />
              Real flat-lays
            </p>
            <h2
              data-motion-reveal
              className="naga-display mt-4 text-heading-3 font-bold tracking-tighter text-dark-900"
            >
              From the first drop
            </h2>
            <p data-motion-reveal className="mt-3 text-body text-dark-700">
              Original catalog shots — same pieces, same cobra mark, shot in Berlin and on the
              studio floor.
            </p>
          </InViewMotion>

          <InViewMotion stagger className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {LEGACY_GALLERY.map((item) => (
              <figure
                key={item.src}
                data-motion-stagger
                className="naga-bezel-light group overflow-hidden"
              >
                <div className="naga-bezel-light-inner relative aspect-[4/5] bg-light-200">
                  <Image
                    src={item.src}
                    alt={item.alt}
                    fill
                    unoptimized
                    className="object-cover transition-transform duration-700 ease-[var(--ease-premium)] group-hover:scale-[1.03]"
                    sizes="(max-width: 1024px) 45vw, 22vw"
                  />
                  <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-dark-900/85 to-transparent px-4 pb-4 pt-10">
                    <span className="text-caption uppercase tracking-[0.16em] text-light-200">
                      {item.label}
                    </span>
                  </figcaption>
                </div>
              </figure>
            ))}
          </InViewMotion>
        </div>
      </section>

      {collections.filter((col) => col.productCount > 0).length > 0 && (
        <>
          <PageHero
            clipId={SECTION_CLIPS.collections}
            page="collections"
            size="compact"
            eyebrow="Lines"
            title="Wear Your Wisdom"
            subtitle="Every drop carries the cobra — pick your line."
            headingAs="h2"
          />
          <section className="scroll-layer mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8 lg:pb-24">
            <InViewMotion stagger className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {collections.filter((col) => col.productCount > 0).slice(0, 6).map((col) => (
                <Link
                  key={col.id}
                  href={"/collections/" + col.slug}
                  data-motion-stagger
                  className="group naga-bezel-dark block cursor-pointer"
                >
                  <div className="naga-bezel-dark-inner relative aspect-[4/3] bg-dark-900">
                    <Image
                      src={col.imageUrl}
                      alt={col.name}
                      fill
                      unoptimized
                      className="object-cover transition-transform duration-700 ease-[var(--ease-premium)] group-hover:scale-[1.04]"
                      sizes="(max-width: 1024px) 100vw, 33vw"
                    />
                    <div
                      className="absolute inset-0 bg-gradient-to-t from-dark-900/92 via-dark-900/25 to-transparent"
                      aria-hidden="true"
                    />
                    <div className="absolute inset-x-0 bottom-0 p-5">
                      <p className="naga-display text-body-medium text-light-100">{col.name}</p>
                      <p className="mt-1 text-caption uppercase tracking-[0.14em] text-light-400">
                        {col.productCount} pieces
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </InViewMotion>
            <p className="mt-8 text-center">
              <Link
                href="/collections"
                className="naga-btn-text inline-flex focus-ring focus-visible:outline-none"
              >
                All collections
                <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden="true" />
              </Link>
            </p>
          </section>
        </>
      )}

      <SectionVideoShell
        clipId={SECTION_CLIPS.instagram}
        className="scroll-layer border-y border-dark-900/8 text-light-100"
      >
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-8 px-4 py-14 sm:flex-row sm:items-center sm:px-6 lg:px-8 lg:py-20">
          <div>
            <p className="naga-eyebrow border-light-100/15 bg-light-100/5">
              <span className="naga-eyebrow-dot" aria-hidden="true" />
              Follow the drop
            </p>
            <p className="naga-display mt-3 text-body-medium">Daily heat on Instagram</p>
            <p className="mt-1 text-body text-light-400">Fits, drops, and behind-the-scenes</p>
          </div>
          <a
            href="https://www.instagram.com/naga_apparel"
            target="_blank"
            rel="noopener noreferrer"
            className="naga-btn naga-btn-outline-light focus-ring focus-visible:outline-none"
          >
            <Instagram className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden="true" />
            @naga_apparel
            <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden="true" />
          </a>
        </div>
      </SectionVideoShell>

      <section className="scroll-layer mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <InViewMotion reveal>
          <div data-motion-reveal className="naga-bezel-light text-center">
            <div className="naga-bezel-light-inner px-8 py-12 sm:px-12 sm:py-14">
              <h2 className="naga-display text-heading-3 font-bold tracking-tighter text-dark-900">
                {BRAND_TAGLINE}
              </h2>
              <p className="mt-3 text-body text-dark-700">
                Knowledge is power. Dress like it.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <Link href="/products" className="naga-btn naga-btn-gold focus-ring focus-visible:outline-none">
                  {CTA.claimYours}
                </Link>
                <Link href="/about" className="naga-btn-text focus-ring focus-visible:outline-none">
                  {CTA.learnHistory}
                </Link>
                <Link href="/products?category=sets" className="naga-btn naga-btn-dark focus-ring focus-visible:outline-none">
                  {CTA.allSets}
                  <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden="true" />
                </Link>
              </div>
            </div>
          </div>
        </InViewMotion>
      </section>
    </>
  );
}
