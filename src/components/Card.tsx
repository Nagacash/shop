import Link from "next/link";
import FlatLayFrame from "./FlatLayFrame";
import CardHoverMotion from "@/components/motion/CardHoverMotion";
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
  const isCollectionCard = Boolean(meta) && !subtitle && !description;

  const imageBlock = (
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
  );

  const copyBlock = isCollectionCard ? (
    <div className="product-card__copy--collection">
      <h3 className="product-card__title naga-display line-clamp-2 text-dark-900">{title}</h3>
      <p className="line-clamp-1 text-caption uppercase tracking-[0.12em] text-dark-500">
        {Array.isArray(meta) ? meta.join(" · ") : meta}
      </p>
    </div>
  ) : (
    <div className="product-card__copy--product">
      <h3 className="product-card__title naga-display line-clamp-2 text-dark-900">{title}</h3>
      <div className="flex items-baseline overflow-hidden">
        {displayPrice ? (
          <span className="price-tabular text-body-medium text-dark-900">{displayPrice}</span>
        ) : (
          <span className="invisible text-body-medium" aria-hidden="true">
            —
          </span>
        )}
      </div>
      {description ? (
        <p className="line-clamp-2 text-body text-dark-700">{description}</p>
      ) : (
        <p className="line-clamp-1 text-body text-dark-700">{subtitle ?? "\u00A0"}</p>
      )}
    </div>
  );

  const content = (
    <article
      className={`product-card group naga-bezel-light flex h-full min-h-0 flex-1 flex-col transition-transform duration-[var(--duration-normal)] ease-[var(--ease-premium)] ${className}`}
    >
      <div className="naga-bezel-light-inner flex h-full min-h-0 flex-col">
        <div className="shrink-0">{imageBlock}</div>
        {copyBlock}
      </div>
    </article>
  );

  return href ? (
    <CardHoverMotion className="h-full min-h-0 flex-1">
      <Link
        href={href}
        aria-label={title}
        data-cursor="lock"
        data-cursor-label="Lock"
        className="flex h-full min-h-0 flex-1 flex-col cursor-pointer rounded-[4px] transition-opacity duration-[var(--duration-normal)] ease-[var(--ease-premium)] focus-visible:outline-none focus-ring active:opacity-90"
      >
        {content}
      </Link>
    </CardHoverMotion>
  ) : (
    content
  );
}
