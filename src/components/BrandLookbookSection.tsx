import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Download, FileText } from "lucide-react";
import InViewMotion from "@/components/motion/InViewMotion";
import SectionChapterLabel from "@/components/SectionChapterLabel";
import { CTA } from "@/lib/brand/manifesto";
import { EDITORIAL_LOOKBOOK, LOOKBOOK_PDF } from "@/lib/brand/marketing-images";

type LookbookItem = (typeof EDITORIAL_LOOKBOOK)[number];

const LOOKBOOK_IDENTITY = [
  { label: "Origin", value: "Amazon · Ancient Empires" },
  { label: "The Mark", value: "Cobra — Knowledge. Power. Rebirth." },
  { label: "Built For", value: "The hustle-minded & unapologetic" },
] as const;

function lookbookFrameClass(item: LookbookItem) {
  if (item.layout === "feature") return "naga-lookbook-feature";
  if (item.layout === "product") return "naga-lookbook-product";
  if (item.layout === "heritage") return "naga-lookbook-heritage";
  return "naga-lookbook-mood";
}

function LookbookPlate({
  item,
  index,
  priority = false,
  sizes,
}: {
  item: LookbookItem;
  index: string;
  priority?: boolean;
  sizes: string;
}) {
  const fit = item.fit === "cover" ? "object-cover" : "object-contain";
  const aspect = item.aspect;
  const backdrop = item.backdrop;

  return (
    <figure className={`${lookbookFrameClass(item)} naga-bezel-light group`}>
      <div
        className="naga-bezel-light-inner naga-lookbook-frame relative overflow-hidden"
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
          className={`${fit} object-center transition-opacity duration-[var(--duration-normal)] ease-[var(--ease-premium)] group-hover:opacity-90`}
          sizes={sizes}
        />
        <figcaption className="naga-lookbook-caption">
          <span className="naga-lookbook-caption-index" aria-hidden="true">
            {index}
          </span>
          <span className="naga-lookbook-caption-label">{item.label}</span>
          <span className="naga-lookbook-caption-detail">{item.detail}</span>
        </figcaption>
      </div>
    </figure>
  );
}

export default function BrandLookbookSection() {
  const [feature, product, mood, heritage] = EDITORIAL_LOOKBOOK;

  return (
    <section
      className="scroll-layer border-b border-dark-900/8 bg-light-100 text-dark-900"
      aria-labelledby="brand-lookbook-heading"
      data-cursor-section
      data-cursor-index="03"
      data-cursor-label="The lookbook"
    >
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <InViewMotion reveal className="mb-10 flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-xl">
            <SectionChapterLabel index="03" title="The lookbook" className="mb-5" />
            <p data-motion-reveal className="naga-eyebrow w-fit">
              <span className="naga-eyebrow-dot" aria-hidden="true" />
              Real logo. Real drop.
            </p>
            <h2
              id="brand-lookbook-heading"
              data-motion-reveal
              className="naga-display mt-4 text-balance text-heading-3 font-bold tracking-tighter sm:text-heading-2"
            >
              Wear the mark
            </h2>
            <p data-motion-reveal className="mt-3 text-pretty text-body text-dark-700">
              Rooftop cover, black set still life, concrete tees, and Angkor crew — shot with the
              real Naga Original cobra.
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

        {/* Identity strip — inspired by digital lookbook HTML */}
        <InViewMotion stagger className="naga-lookbook-identity mb-10">
          {LOOKBOOK_IDENTITY.map((cell) => (
            <div key={cell.label} data-motion-stagger className="naga-lookbook-identity-cell">
              <p className="naga-lookbook-identity-label">{cell.label}</p>
              <p className="naga-lookbook-identity-value">{cell.value}</p>
            </div>
          ))}
        </InViewMotion>

        <InViewMotion stagger className="naga-lookbook-grid">
          <div data-motion-stagger>
            <LookbookPlate
              item={feature}
              index="01"
              priority
              sizes="(max-width: 1280px) 100vw, 80rem"
            />
          </div>
          <div data-motion-stagger>
            <LookbookPlate item={product} index="02" sizes="(max-width: 1024px) 100vw, 33vw" />
          </div>
          <div data-motion-stagger>
            <LookbookPlate item={mood} index="03" sizes="(max-width: 1024px) 100vw, 33vw" />
          </div>
          <div data-motion-stagger>
            <LookbookPlate item={heritage} index="04" sizes="(max-width: 1024px) 100vw, 33vw" />
          </div>
        </InViewMotion>

        {/* Business / press closing bar */}
        <InViewMotion reveal className="naga-lookbook-business mt-12">
          <div data-motion-reveal className="naga-lookbook-business-copy">
            <p className="naga-lookbook-identity-label">For partners</p>
            <p className="naga-lookbook-business-title naga-display">
              Digital lookbook
            </p>
            <p className="mt-2 max-w-md text-pretty text-body text-dark-700">
              Full PDF for wholesale, press, and future business interest — same plates, print-ready.
            </p>
          </div>
          <div data-motion-reveal className="naga-lookbook-business-actions">
            <a
              href={LOOKBOOK_PDF.href}
              download={LOOKBOOK_PDF.filename}
              className="naga-btn naga-btn-gold focus-ring hidden focus-visible:outline-none md:inline-flex"
              data-cursor="acquire"
              data-cursor-label="Download"
            >
              <Download className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden="true" />
              {CTA.downloadLookbook}
            </a>
            <Link
              href="/contact"
              className="naga-btn naga-btn-dark focus-ring focus-visible:outline-none"
            >
              <FileText className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden="true" />
              {CTA.businessContact}
            </Link>
            <p className="naga-meta hidden text-dark-500 md:block">{LOOKBOOK_PDF.detail}</p>
          </div>
        </InViewMotion>
      </div>
    </section>
  );
}
