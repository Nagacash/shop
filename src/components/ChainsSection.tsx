import Link from "next/link";
import { ArrowRight } from "lucide-react";
import InViewMotion from "@/components/motion/InViewMotion";
import SectionChapterLabel from "@/components/SectionChapterLabel";
import { CHAINS_DE_BLUF } from "@/lib/seo/chains";

const FACTS = [
  { label: "Link", detail: "Miami Cuban" },
  { label: "Metal", detail: "Gold plated stainless steel" },
  { label: "Next", detail: "More chains as they land" },
] as const;

export default function ChainsSection() {
  return (
    <section
      id="chains"
      className="scroll-layer border-b border-dark-900/8 bg-dark-900 text-light-100"
      aria-labelledby="chains-heading"
      data-cursor-section
      data-cursor-index="08"
      data-cursor-label="Chains"
    >
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <InViewMotion reveal className="grid items-end gap-10 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="max-w-xl">
            <SectionChapterLabel index="08" title="Chains" tone="dark" className="mb-5" />
            <p data-motion-reveal className="naga-eyebrow w-fit border-light-100/15 bg-light-100/5">
              <span className="naga-eyebrow-dot" aria-hidden="true" />
              [ New section ]
            </p>
            <h2
              id="chains-heading"
              data-motion-reveal
              className="naga-display mt-4 text-balance text-heading-3 font-bold tracking-tighter sm:text-heading-2"
            >
              Cuban chains, with room for the next pieces
            </h2>
            <p data-motion-reveal className="mt-3 text-body text-light-400">
              A shop section for link chains. Miami Cuban links open the line. More styles
              go here as soon as they are ready to ship.
            </p>
            <p data-motion-reveal className="mt-2 text-caption text-light-500">
              {CHAINS_DE_BLUF}
            </p>
            <Link
              href="/products?category=chains"
              data-motion-reveal
              className="naga-btn naga-btn-gold mt-8 inline-flex focus-ring focus-visible:outline-none"
            >
              Shop chains
              <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden="true" />
            </Link>
          </div>

          <dl data-motion-reveal className="grid gap-px overflow-hidden rounded-sm border border-light-100/15 bg-light-100/15 sm:grid-cols-3 lg:grid-cols-1">
            {FACTS.map((fact) => (
              <div key={fact.label} className="bg-dark-900 px-4 py-4">
                <dt className="text-caption uppercase tracking-[0.16em] text-[--color-naga-gold]">
                  {fact.label}
                </dt>
                <dd className="mt-1 text-body text-light-100">{fact.detail}</dd>
              </div>
            ))}
          </dl>
        </InViewMotion>
      </div>
    </section>
  );
}
