import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import InViewMotion from "@/components/motion/InViewMotion";
import SectionChapterLabel from "@/components/SectionChapterLabel";
import { CTA } from "@/lib/brand/manifesto";
import { HOODIE_STREET_EDITORIAL } from "@/lib/brand/marketing-images";

export default function HoodieStreetSection() {
  return (
    <section
      className="scroll-layer border-b border-dark-900/8 bg-black text-light-100"
      aria-labelledby="hoodie-street-heading"
      data-cursor-section
      data-cursor-index="02"
      data-cursor-label="In the crowd"
    >
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <InViewMotion reveal className="mb-10 flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-xl">
            <SectionChapterLabel index="02" title="In the crowd" tone="dark" className="mb-5" />
            <p data-motion-reveal className="naga-eyebrow w-fit border-light-100/15 bg-light-100/5">
              <span className="naga-eyebrow-dot" aria-hidden="true" />
              [ Naga Original ]
            </p>
            <h2
              id="hoodie-street-heading"
              data-motion-reveal
              className="naga-display mt-4 text-balance text-heading-3 font-bold tracking-tighter sm:text-heading-2"
            >
              Wear it where the night moves
            </h2>
            <p data-motion-reveal className="mt-3 text-body text-light-400">
              Black hoodie, cobra chest mark, city frequency — Naga Original shot in the wild.
            </p>
          </div>
          <Link
            href="/collections/naga-original"
            data-motion-reveal
            className="naga-btn-text-light focus-ring focus-visible:outline-none"
          >
            Naga Original
            <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden="true" />
          </Link>
        </InViewMotion>

        <InViewMotion stagger className="grid gap-4 md:grid-cols-2">
          {HOODIE_STREET_EDITORIAL.map((item, index) => (
            <figure
              key={item.src}
              data-motion-stagger
              className="naga-bezel-dark group overflow-hidden"
            >
              <div
                className="naga-bezel-dark-inner relative overflow-hidden"
                style={{ aspectRatio: item.aspect, backgroundColor: item.backdrop }}
              >
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  unoptimized
                  priority={index === 0}
                  className="object-cover object-center transition-transform duration-700 ease-[var(--ease-premium)] group-hover:scale-[1.02]"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                <figcaption className="naga-lookbook-caption">
                  <span className="naga-lookbook-caption-label">{item.label}</span>
                  <span className="naga-lookbook-caption-detail">{item.detail}</span>
                </figcaption>
              </div>
            </figure>
          ))}
        </InViewMotion>

        <InViewMotion reveal className="mt-8 flex justify-center">
          <Link
            href="/products?category=hoodies"
            data-motion-reveal
            className="naga-btn naga-btn-gold focus-ring focus-visible:outline-none"
          >
            {CTA.shopTheDrop}
            <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden="true" />
          </Link>
        </InViewMotion>
      </div>
    </section>
  );
}
