import Link from "next/link";
import Image from "next/image";
import PageHero from "@/components/PageHero";
import {
  BRAND_HEADLINE,
  BRAND_STORY,
  BRAND_SUBTAGLINE,
  BRAND_SUBTAGLINE_ALT,
  BRAND_TAGLINE,
  CTA,
} from "@/lib/brand/manifesto";
import {
  BRAND_IMAGE_ASPECT,
  MARKETING_IMAGES,
  SECTION_CLIPS,
} from "@/lib/brand/marketing-images";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const revalidate = 120;

export const metadata = buildPageMetadata({
  title: "About Naga Apparel",
  description: `${BRAND_TAGLINE} ${BRAND_SUBTAGLINE}`,
  path: "/about",
  image: MARKETING_IMAGES.productDust,
});

export default function AboutPage() {
  const paragraphs = BRAND_STORY.split("\n\n");

  return (
    <>
      <PageHero
        clipId={SECTION_CLIPS.balance}
        imageSrc={MARKETING_IMAGES.berlinLifestyle}
        eyebrow="Our roots"
        title={BRAND_TAGLINE}
        subtitle={BRAND_SUBTAGLINE}
      />

      <main className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <nav className="text-caption text-dark-700">
          <Link href="/" className="hover:underline">
            Home
          </Link>{" "}
          / <span className="text-dark-900">About</span>
        </nav>

        <article className="mt-10 space-y-6 text-body leading-relaxed text-dark-700">
          {paragraphs.map((paragraph) => (
            <p key={paragraph.slice(0, 40)}>{paragraph}</p>
          ))}
        </article>

        <section className="mt-14 grid gap-4" aria-label="Naga Apparel brand photography">
          <figure className="naga-bezel-light">
            <div
              className="naga-bezel-light-inner relative overflow-hidden"
              style={{ aspectRatio: BRAND_IMAGE_ASPECT.cinematic, backgroundColor: "#141210" }}
            >
              <Image
                src={MARKETING_IMAGES.berlinLifestyle}
                alt="Model wearing Naga Original hoodie against a golden-hour city skyline"
                fill
                unoptimized
                className="object-contain object-center"
                sizes="(max-width: 768px) 100vw, 80rem"
              />
            </div>
          </figure>
          <figure className="naga-bezel-light">
            <div
              className="naga-bezel-light-inner relative overflow-hidden"
              style={{ aspectRatio: BRAND_IMAGE_ASPECT.productDust, backgroundColor: "#2a2a2a" }}
            >
              <Image
                src={MARKETING_IMAGES.productDust}
                alt="Naga hoodie flat lay with macro cobra logo and golden dust particles"
                fill
                unoptimized
                className="object-contain object-center"
                sizes="(max-width: 768px) 100vw, 80rem"
              />
            </div>
          </figure>
          <figure className="naga-bezel-light">
            <div
              className="naga-bezel-light-inner relative overflow-hidden"
              style={{ aspectRatio: BRAND_IMAGE_ASPECT.cinematic, backgroundColor: "#141210" }}
            >
              <Image
                src={MARKETING_IMAGES.berlinWide}
                alt="Silhouette in Naga hoodie on a rooftop overlooking the city at sunset"
                fill
                unoptimized
                className="object-contain object-center"
                sizes="(max-width: 768px) 100vw, 80rem"
              />
            </div>
          </figure>
        </section>

        <section className="mt-14 border-t border-dark-900/8 pt-10">
          <h2 className="naga-display text-heading-3 font-bold tracking-tighter text-dark-900">
            {BRAND_HEADLINE}
          </h2>
          <p className="mt-3 text-body text-dark-700">
            {BRAND_SUBTAGLINE_ALT} Every piece carries the cobra — a symbol of wisdom, power, and
            rebirth across the Amazon, Mexico, Egypt, and Angkor Wat.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/products"
              className="naga-btn naga-btn-gold focus-ring focus-visible:outline-none"
            >
              {CTA.shopTheDrop}
            </Link>
            <Link
              href="/contact"
              className="naga-btn naga-btn-ghost focus-ring focus-visible:outline-none"
            >
              {CTA.joinSyndicate}
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}
