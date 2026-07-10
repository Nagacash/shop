import type { ProductCraftSpec, ProductStoryBeat } from "@/lib/brand/product-stories";

type Props = {
  beats: ProductStoryBeat[];
  craft: ProductCraftSpec;
  className?: string;
};

export default function ProductStoryBeats({ beats, craft, className = "" }: Props) {
  return (
    <section
      className={`naga-product-story scroll-layer border-y border-dark-900/8 bg-[--hero-light-base] ${className}`.trim()}
      aria-labelledby="product-story-heading"
    >
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
        <p className="naga-eyebrow w-fit">
          <span className="naga-eyebrow-dot" aria-hidden="true" />
          The piece
        </p>
        <h2
          id="product-story-heading"
          className="naga-display mt-4 text-heading-3 font-bold tracking-tighter text-dark-900 sm:text-heading-2"
        >
          Wear your wisdom
        </h2>

        <div className="mt-10 grid gap-4 lg:grid-cols-3">
          {beats.map((beat) => (
            <article key={beat.label} className="naga-story-beat">
              <p className="naga-story-beat-label">{beat.label}</p>
              <h3 className="naga-display mt-2 text-body-medium text-dark-900">{beat.title}</h3>
              <p className="mt-3 text-body leading-relaxed text-dark-700">{beat.body}</p>
            </article>
          ))}
        </div>

        <dl className="naga-craft-strip mt-10 grid gap-px overflow-hidden rounded-sm border border-dark-900/8 bg-dark-900/8 sm:grid-cols-3">
          <div className="naga-craft-cell">
            <dt>Fabric</dt>
            <dd>{craft.fabric}</dd>
          </div>
          <div className="naga-craft-cell">
            <dt>Fit</dt>
            <dd>{craft.fit}</dd>
          </div>
          <div className="naga-craft-cell">
            <dt>Print</dt>
            <dd>{craft.print}</dd>
          </div>
        </dl>
      </div>
    </section>
  );
}
