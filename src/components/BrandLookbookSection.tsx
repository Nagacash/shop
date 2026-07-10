import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import InViewMotion from "@/components/motion/InViewMotion";
import SectionChapterLabel from "@/components/SectionChapterLabel";
import { CTA } from "@/lib/brand/manifesto";
import { EDITORIAL_LOOKBOOK } from "@/lib/brand/marketing-images";

type LookbookItem = (typeof EDITORIAL_LOOKBOOK)[number];

function lookbookFrameClass(item: LookbookItem) {
  if (item.layout === "feature") return "naga-lookbook-feature";
  if (item.layout === "product") return "naga-lookbook-product";
  return "naga-lookbook-mood";
}

function LookbookPlate({
  item,
  priority = false,
  sizes,
}: {
  item: LookbookItem;
  priority?: boolean;
  sizes: string;
}) {
  const fit = "fit" in item && item.fit === "contain" ? "object-contain" : "object-cover";
  const aspect = "aspect" in item ? item.aspect : undefined;
  const backdrop = "backdrop" in item ? item.backdrop : "#f4f2ee";

  return (
    <figure className={`${lookbookFrameClass(item)} naga-bezel-light group`}>
      <div
        className="naga-bezel-light-inner relative overflow-hidden"
        style={{
          aspectRatio: aspect,
          backgroundColor: backdrop,
        }}
      >
        <Image
          src={item.src}
          alt={item.alt}
          fill
          unoptimized
          priority={priority}
          className={`${fit} object-center transition-transform duration-700 ease-[var(--ease-premium)] group-hover:scale-[1.02]`}
          sizes={sizes}
        />
        <figcaption className="naga-lookbook-caption">
          <span className="naga-lookbook-caption-label">{item.label}</span>
          <span className="naga-lookbook-caption-detail">{item.detail}</span>
        </figcaption>
      </div>
    </figure>
  );
}

export default function BrandLookbookSection() {
  const [feature, product, mood] = EDITORIAL_LOOKBOOK;

  return (
    <section
      className="scroll-layer border-b border-dark-900/8 bg-light-100 text-dark-900"
      aria-labelledby="brand-lookbook-heading"
    >
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <InViewMotion reveal className="mb-10 flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-xl">
            <SectionChapterLabel index="03" title="The lookbook" className="mb-5" />
            <p data-motion-reveal className="naga-eyebrow w-fit">
              <span className="naga-eyebrow-dot" aria-hidden="true" />
              Naga in the wild
            </p>
            <h2
              id="brand-lookbook-heading"
              data-motion-reveal
              className="naga-display mt-4 text-heading-3 font-bold tracking-tighter sm:text-heading-2"
            >
              Wear it on the skyline
            </h2>
            <p data-motion-reveal className="mt-3 text-body text-dark-700">
              Golden-hour rooftops, cobra craft, and the city behind the drop — shot for Naga
              Apparel.
            </p>
          </div>
          <Link
            href="/products"
            data-motion-reveal
            className="naga-btn-text focus-ring focus-visible:outline-none"
          >
            {CTA.shopTheDrop}
            <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden="true" />
          </Link>
        </InViewMotion>

        <InViewMotion stagger className="naga-lookbook-grid">
          <div data-motion-stagger>
            <LookbookPlate
              item={feature}
              priority
              sizes="(max-width: 1280px) 100vw, 80rem"
            />
          </div>
          <div data-motion-stagger>
            <LookbookPlate item={product} sizes="(max-width: 1024px) 100vw, 40vw" />
          </div>
          <div data-motion-stagger>
            <LookbookPlate item={mood} sizes="(max-width: 1024px) 100vw, 40vw" />
          </div>
        </InViewMotion>
      </div>
    </section>
  );
}
