type HeroStatBlocksProps = {
  dropCount: number;
  collectionCount: number;
};

export default function HeroStatBlocks({ dropCount, collectionCount }: HeroStatBlocksProps) {
  return (
    <>
      <div
        data-hero-stat
        className="hero-stat hero-stat--top-right absolute right-6 top-[14%] md:right-24"
      >
        <div className="flex items-center justify-end gap-3">
          <span
            className="hero-stat-divider hidden h-px w-24 rotate-[20deg] bg-light-100/40 md:block"
            aria-hidden="true"
          />
          <p className="hero-stat-value text-4xl font-medium tracking-tight text-light-100 md:text-5xl">
            +{dropCount}
          </p>
        </div>
        <p className="hero-stat-label mt-1 text-right text-xs text-light-100/70 md:text-sm">
          pieces in drop
        </p>
      </div>

      <div
        data-hero-stat
        className="hero-stat hero-stat--bottom-left absolute bottom-20 left-6 md:bottom-24 md:left-20"
      >
        <div className="flex items-center gap-3">
          <p className="hero-stat-value text-4xl font-medium tracking-tight text-light-100 md:text-5xl">
            Hamburg
          </p>
          <span
            className="hero-stat-divider hidden h-px w-24 rotate-[-20deg] bg-light-100/40 md:block"
            aria-hidden="true"
          />
        </div>
        <p className="hero-stat-label mt-1 text-xs text-light-100/70 md:text-sm">studio origin</p>
      </div>

      <div
        data-hero-stat
        className="hero-stat hero-stat--bottom-right absolute bottom-16 right-6 md:bottom-20 md:right-20"
      >
        <div className="flex items-center justify-end gap-3">
          <span
            className="hero-stat-divider hidden h-px w-24 rotate-[-20deg] bg-light-100/40 md:block"
            aria-hidden="true"
          />
          <p className="hero-stat-value text-4xl font-medium tracking-tight text-light-100 md:text-5xl">
            +{collectionCount}
          </p>
        </div>
        <p className="hero-stat-label mt-1 text-right text-xs text-light-100/70 md:text-sm">
          collections live
        </p>
      </div>
    </>
  );
}
