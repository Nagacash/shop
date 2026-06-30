import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Instagram } from "lucide-react";
import { getCachedCollections } from "@/lib/queries/collections";
import { MARKETING_IMAGES } from "@/lib/brand/marketing-images";
import PageHero from "@/components/PageHero";

function SectionBackdrop({
  imageSrc,
  children,
  className = "",
}: {
  imageSrc: string | null;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      {imageSrc && (
        <Image
          src={imageSrc}
          alt=""
          fill
          unoptimized
          className="object-cover object-center opacity-40"
          sizes="100vw"
        />
      )}
      <div className="absolute inset-0 bg-dark-900/80" aria-hidden="true" />
      <div className="relative z-10">{children}</div>
    </div>
  );
}

export default async function HomeBrandSections() {
  const collections = await getCachedCollections();
  const balanceImage = MARKETING_IMAGES.hoodieFlatLay;
  const instagramImage = MARKETING_IMAGES.berlinLifestyle;

  return (
    <>
      <SectionBackdrop
        imageSrc={balanceImage}
        className="scroll-layer border-b border-light-300 text-light-100"
      >
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
          <div className="mb-10 max-w-2xl">
            <p className="text-caption uppercase tracking-[0.22em] text-[--color-naga-gold]">
              The Naga balance
            </p>
            <h2 className="mt-2 text-heading-3 text-balance">
              Hustle grit meets ultra-fine glamour
            </h2>
            <p className="mt-3 text-body text-light-400">
              Knowledge and quality over ignorance — built for the grind, styled for the
              spotlight. Same energy as{" "}
              <a
                href="https://www.instagram.com/naga_apparel"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[--color-naga-gold] underline-offset-2 hover:underline"
              >
                @naga_apparel
              </a>
              .
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <SectionBackdrop
              imageSrc={MARKETING_IMAGES.hoodieFlatLay}
              className="rounded-2xl border border-light-100/10"
            >
              <div className="p-6 sm:p-8">
                <p className="text-caption uppercase tracking-[0.2em] text-light-400">Hustle</p>
                <h3 className="mt-2 text-body-medium text-light-100">Raw street power</h3>
                <p className="mt-3 text-body text-light-400">
                  Black concrete, gold neon, chain-link nights. Hoodies and heavy tees built for
                  people who move with purpose.
                </p>
              </div>
            </SectionBackdrop>
            <SectionBackdrop
              imageSrc={MARKETING_IMAGES.berlinLifestyle}
              className="rounded-2xl border border-[--color-naga-gold]/30"
            >
              <div className="p-6 sm:p-8">
                <p className="text-caption uppercase tracking-[0.2em] text-[--color-naga-gold]">
                  Glamour
                </p>
                <h3 className="mt-2 text-body-medium text-light-100">Ultra-fine presence</h3>
                <p className="mt-3 text-body text-light-400">
                  Champagne gold light, bold feminine energy, trap-luxe attitude. Streetwear that
                  commands the room.
                </p>
              </div>
            </SectionBackdrop>
            <SectionBackdrop
              imageSrc={MARKETING_IMAGES.logoDetail}
              className="rounded-2xl border border-light-100/10 md:col-span-2 lg:col-span-1"
            >
              <div className="p-6 sm:p-8">
                <p className="text-caption uppercase tracking-[0.2em] text-light-400">Craft</p>
                <h3 className="mt-2 text-body-medium text-light-100">Built to last</h3>
                <p className="mt-3 text-body text-light-400">
                  Heavy cotton, sharp screen prints, and the cobra mark — quality you can see and
                  feel before checkout.
                </p>
              </div>
            </SectionBackdrop>
          </div>
        </div>
      </SectionBackdrop>

      {collections.filter((col) => col.productCount > 0).length > 0 && (
        <>
          <PageHero
            page="collections"
            size="compact"
            eyebrow="Lines"
            title="Pick your collection"
            subtitle="Every drop has its own hero — tap in."
          />
          <section className="scroll-layer mx-auto max-w-7xl px-4 pb-14 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {collections.filter((col) => col.productCount > 0).slice(0, 6).map((col) => (
                <Link
                  key={col.id}
                  href={"/collections/" + col.slug}
                  className="group relative aspect-[4/3] overflow-hidden rounded-2xl border border-light-300 bg-dark-900"
                >
                  <Image
                    src={col.imageUrl}
                    alt={col.name}
                    fill
                    unoptimized
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 1024px) 100vw, 33vw"
                  />
                  <div
                    className="absolute inset-0 bg-gradient-to-t from-dark-900/90 via-dark-900/20 to-transparent"
                    aria-hidden="true"
                  />
                  <div className="absolute inset-x-0 bottom-0 p-5">
                    <p className="text-body-medium text-light-100">{col.name}</p>
                    <p className="mt-1 text-caption text-light-400">{col.productCount} pieces</p>
                  </div>
                </Link>
              ))}
            </div>
            <p className="mt-6 text-center">
              <Link href="/collections" className="text-body-medium text-dark-900 underline-offset-4 hover:underline">
                All collections
              </Link>
            </p>
          </section>
        </>
      )}

      <SectionBackdrop imageSrc={instagramImage} className="scroll-layer border-y border-light-300 text-light-100">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 px-4 py-10 sm:flex-row sm:items-center sm:px-6 lg:px-8">
          <div>
            <p className="text-caption uppercase tracking-[0.2em] text-[--color-naga-gold]">
              Follow the drop
            </p>
            <p className="mt-2 text-body-medium">Daily heat on Instagram</p>
            <p className="mt-1 text-body text-light-400">Fits, drops, and behind-the-scenes</p>
          </div>
          <a
            href="https://www.instagram.com/naga_apparel"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 items-center gap-2 rounded-full border border-[--color-naga-gold]/50 bg-[--color-naga-gold]/10 px-6 py-3 text-body-medium text-[--color-naga-gold] transition hover:bg-[--color-naga-gold]/20"
          >
            <Instagram className="h-4 w-4" aria-hidden="true" />
            @naga_apparel
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </a>
        </div>
      </SectionBackdrop>

      <section className="scroll-layer mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-light-300 bg-light-100 p-8 text-center sm:p-10">
          <h2 className="text-heading-3 text-dark-900">Shop the drop</h2>
          <p className="mt-2 text-body text-dark-700">
            Tees and sets — real Naga pieces with your logo.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link
              href="/products?category=tees"
              className="inline-flex min-h-11 items-center gap-2 rounded-full bg-dark-900 px-6 py-3 text-body-medium text-light-100 hover:bg-dark-700"
            >
              Tees
            </Link>
            <Link
              href="/products?category=sets"
              className="inline-flex min-h-11 items-center gap-2 rounded-full border border-light-300 px-6 py-3 text-body-medium text-dark-900 hover:border-dark-500"
            >
              Sets
            </Link>
            <Link
              href="/products"
              className="inline-flex min-h-11 items-center gap-2 rounded-full border border-light-300 px-6 py-3 text-body-medium text-dark-900 hover:border-dark-500"
            >
              Shop all
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
