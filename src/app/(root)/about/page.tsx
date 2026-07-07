import Link from "next/link";
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
  LEGACY_MARKETING_IMAGES,
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
        imageSrc={LEGACY_MARKETING_IMAGES.berlinLifestyle}
        eyebrow="Our roots"
        title={BRAND_TAGLINE}
        subtitle={BRAND_SUBTAGLINE}
      />

      <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
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
