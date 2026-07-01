import Link from "next/link";
import ProductImage from "./ProductImage";
import FlatLayFrame from "./FlatLayFrame";
import { isFlatLayProductImage } from "@/lib/utils/images";
import { formatPrice } from "@/lib/utils/currency";

export type BadgeTone = "red" | "green" | "orange";

export interface CardProps {
  title: string;
  description?: string;
  subtitle?: string;
  meta?: string | string[];
  imageSrc: string;
  imageAlt?: string;
  price?: string | number;
  href?: string;
  badge?: { label: string; tone?: BadgeTone };
  className?: string;
}

const toneToClass: Record<BadgeTone, string> = {
  red: "text-[--color-red] border-[--color-red]/20 bg-dark-900/80",
  green: "text-[--color-naga-sage-light] border-[--color-naga-sage]/30 bg-dark-900/80",
  orange: "text-[--color-orange] border-[--color-orange]/20 bg-dark-900/80",
};

export default function Card({
  title,
  description,
  subtitle,
  meta,
  imageSrc,
  imageAlt = title,
  price,
  href,
  badge,
  className = "",
}: CardProps) {
  const displayPrice =
    price === undefined ? undefined : typeof price === "number" ? formatPrice(price) : price;
  const flatLay = isFlatLayProductImage(imageSrc);

  const imageBlock = flatLay ? (
    <FlatLayFrame
      src={imageSrc}
      alt={imageAlt}
      variant="card"
      sizes="(min-width: 1280px) 360px, (min-width: 1024px) 300px, (min-width: 640px) 45vw, 90vw"
    >
      {badge && (
        <span
          className={`absolute left-3 top-3 z-20 border px-2.5 py-1 text-[0.6875rem] uppercase tracking-[0.1em] ${toneToClass[badge.tone ?? "green"]}`}
        >
          {badge.label}
        </span>
      )}
    </FlatLayFrame>
  ) : (
    <div className="relative aspect-square overflow-hidden bg-light-200">
      <ProductImage
        src={imageSrc}
        alt={imageAlt}
        fill
        sizes="(min-width: 1280px) 360px, (min-width: 1024px) 300px, (min-width: 640px) 45vw, 90vw"
        className="object-cover transition-transform duration-500 ease-[var(--ease-premium)] group-hover:scale-[1.04]"
      />
      {badge && (
        <span
          className={`absolute left-3 top-3 border border-light-300 bg-light-100/95 px-2.5 py-1 text-[0.6875rem] uppercase tracking-[0.1em] ${toneToClass[badge.tone ?? "green"]}`}
        >
          {badge.label}
        </span>
      )}
    </div>
  );

  const content = (
    <article className={`product-card group naga-bezel-light transition-transform duration-[var(--duration-normal)] ease-[var(--ease-premium)] ${className}`}>
      <div className="naga-bezel-light-inner">
        {imageBlock}
        <div className="p-5">
          <div className="mb-1 flex items-baseline justify-between gap-3">
            <h3 className="naga-display text-heading-3 text-dark-900">{title}</h3>
            {displayPrice && (
              <span className="price-tabular shrink-0 text-body-medium text-dark-900">{displayPrice}</span>
            )}
          </div>
          {description && <p className="text-body text-dark-700">{description}</p>}
          {subtitle && <p className="text-body text-dark-700">{subtitle}</p>}
          {meta && (
            <p className="mt-1 text-caption uppercase tracking-[0.12em] text-dark-500">
              {Array.isArray(meta) ? meta.join(" · ") : meta}
            </p>
          )}
        </div>
      </div>
    </article>
  );

  return href ? (
    <Link
      href={href}
      aria-label={title}
      className="product-card block cursor-pointer rounded-[4px] transition-opacity duration-[var(--duration-normal)] ease-[var(--ease-premium)] focus-visible:outline-none focus-ring active:opacity-90"
    >
      {content}
    </Link>
  ) : (
    content
  );
}
