type HeroStatBlocksProps = {
  dropCount: number;
  collectionCount: number;
};

export default function HeroStatBlocks({ dropCount, collectionCount }: HeroStatBlocksProps) {
  return (
    <>
      <div
        data-hero-stat
        className="hero-stat hero-stat--top-right absolute right-4 top-[11%] z-20 sm:right-6 sm:top-[14%] md:right-24"
      >
        <div className="flex items-center justify-end gap-3">
          <span
            className="hero-stat-divider hidden h-px w-24 rotate-[20deg] bg-light-100/40 md:block"
            aria-hidden="true"
          />
          <p className="hero-stat-value text-3xl font-medium tracking-tight text-light-100 sm:text-4xl md:text-5xl">
            +{dropCount}
          </p>
        </div>
        <p className="hero-stat-label mt-1 text-right text-light-100/70">
          pieces in drop
        </p>
      </div>

      <div
        data-hero-stat
        className="hero-stat hero-stat--bottom-left absolute bottom-[calc(1.25rem+env(safe-area-inset-bottom,0px))] left-4 z-20 hidden sm:bottom-20 sm:left-6 sm:block md:bottom-24 md:left-20"
      >
        <div className="flex items-center gap-3">
          <p className="hero-stat-value text-3xl font-medium tracking-tight text-light-100 sm:text-4xl md:text-5xl">
            Hamburg
          </p>
          <span
            className="hero-stat-divider hidden h-px w-24 rotate-[-20deg] bg-light-100/40 md:block"
            aria-hidden="true"
          />
        </div>
        <p className="hero-stat-label mt-1 text-light-100/70">studio origin</p>
      </div>

      <div
        data-hero-stat
        className="hero-stat hero-stat--bottom-right absolute bottom-[calc(1.25rem+env(safe-area-inset-bottom,0px))] right-4 z-20 sm:bottom-16 sm:right-6 md:bottom-20 md:right-20"
      >
        <div className="flex items-center justify-end gap-3">
          <span
            className="hero-stat-divider hidden h-px w-24 rotate-[-20deg] bg-light-100/40 md:block"
            aria-hidden="true"
          />
          <p className="hero-stat-value text-3xl font-medium tracking-tight text-light-100 sm:text-4xl md:text-5xl">
            +{collectionCount}
          </p>
        </div>
        <p className="hero-stat-label mt-1 text-right text-light-100/70">
          collections live
        </p>
      </div>
    </>
  );
}
