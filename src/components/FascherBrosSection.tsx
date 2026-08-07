import { ArrowUpRight, Clapperboard, Film } from "lucide-react";
import InViewMotion from "@/components/motion/InViewMotion";
import SectionChapterLabel from "@/components/SectionChapterLabel";
import { FASCHER_BROS } from "@/lib/brand/naga-network";

export default function FascherBrosSection() {
  return (
    <section
      id="fascher-bros"
      className="scroll-layer border-t border-dark-900/8 bg-light-100 text-dark-900"
      aria-labelledby="fascher-bros-heading"
      data-cursor-section
      data-cursor-index="07"
      data-cursor-label="Fascher Bros"
    >
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <InViewMotion reveal className="grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-end lg:gap-12">
          <div>
            <SectionChapterLabel index="07" title="Naga Films" className="mb-5" />
            <p data-motion-reveal className="naga-eyebrow w-fit">
              <span className="naga-eyebrow-dot" aria-hidden="true" />
              <Film className="inline h-3 w-3 text-[--color-naga-gold]" strokeWidth={1.75} aria-hidden="true" />{" "}
              {FASCHER_BROS.status}
            </p>
            <h2
              id="fascher-bros-heading"
              data-motion-reveal
              className="naga-display mt-4 text-balance text-heading-3 font-bold tracking-tighter sm:text-heading-2"
            >
              {FASCHER_BROS.name}
            </h2>
            <p data-motion-reveal className="mt-2 text-caption uppercase tracking-[0.18em] text-[--color-naga-gold]">
              {FASCHER_BROS.tagline}
            </p>
            <p data-motion-reveal className="mt-4 max-w-xl text-pretty text-body leading-relaxed text-dark-700">
              {FASCHER_BROS.description}
            </p>
          </div>

          <div data-motion-reveal className="naga-bezel-light">
            <div className="naga-bezel-light-inner flex flex-col gap-5 px-6 py-7 sm:px-8 sm:py-8">
              <div className="flex items-start gap-3">
                <span className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center border border-[--color-naga-gold]/35 bg-[--color-naga-gold]/10 text-[--color-naga-gold]">
                  <Clapperboard className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
                </span>
                <div>
                  <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-dark-500">
                    {FASCHER_BROS.label}
                  </p>
                  <p className="mt-1 naga-display text-body-medium text-dark-900">
                    Movie in progress
                  </p>
                  <p className="mt-2 text-caption leading-relaxed text-dark-700">
                    Currently working on getting the film on board and made — follow the project page
                    for updates, story, and crowdfunding.
                  </p>
                </div>
              </div>

              <a
                href={FASCHER_BROS.url}
                target="_blank"
                rel="noopener noreferrer"
                className="naga-btn naga-btn-dark inline-flex w-fit focus-ring focus-visible:outline-none"
                data-cursor="acquire"
                data-cursor-label="Fascher Bros"
              >
                Visit fascherbros.com
                <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden="true" />
              </a>
            </div>
          </div>
        </InViewMotion>
      </div>
    </section>
  );
}
