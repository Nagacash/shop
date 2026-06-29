import Link from "next/link";
import ProductImage from "./ProductImage";
import FlatLayFrame from "./FlatLayFrame";
import { isFlatLayProductImage } from "@/lib/utils/images";

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
    price === undefined ? undefined : typeof price === "number" ? `$${price.toFixed(2)}` : price;
  const flatLay = isFlatLayProductImage(imageSrc);

  const imageBlock = flatLay ? (
    <FlatLayFrame
      src={imageSrc}
      alt={imageAlt}
      variant="card"
      sizes="(min-width: 1280px) 360px, (min-width: 1024px) 300px, (min-width: 640px) 45vw, 90vw"
      className="rounded-t-xl"
    >
      {badge && (
        <span
          className={`absolute left-3 top-3 z-20 rounded-full border px-2.5 py-1 text-caption backdrop-blur-sm ${toneToClass[badge.tone ?? "green"]}`}
        >
          {badge.label}
        </span>
      )}
    </FlatLayFrame>
  ) : (
    <div className="relative aspect-square overflow-hidden rounded-t-xl bg-light-200">
      <ProductImage
        src={imageSrc}
        alt={imageAlt}
        fill
        sizes="(min-width: 1280px) 360px, (min-width: 1024px) 300px, (min-width: 640px) 45vw, 90vw"
        className="object-cover transition-transform duration-300 group-hover:scale-105"
      />
      {badge && (
        <span
          className={`absolute left-3 top-3 rounded-full border border-light-300 bg-light-100/95 px-2.5 py-1 text-caption ${toneToClass[badge.tone ?? "green"]}`}
        >
          {badge.label}
        </span>
      )}
    </div>
  );

  const content = (
    <article
      className={`group overflow-hidden rounded-xl bg-light-100 ring-1 ring-light-300 transition-[box-shadow,ring-color] hover:ring-dark-500 ${flatLay ? "hover:shadow-lg hover:shadow-dark-900/10" : ""} ${className}`}
    >
      {imageBlock}
      <div className="p-4">
        <div className="mb-1 flex items-baseline justify-between gap-3">
          <h3 className="text-heading-3 text-dark-900">{title}</h3>
          {displayPrice && <span className="shrink-0 text-body-medium text-dark-900">{displayPrice}</span>}
        </div>
        {flatLay && !subtitle && (
          <p className="text-caption uppercase tracking-[0.12em] text-[--color-naga-sage]">Tee + shorts set</p>
        )}
        {description && <p className="text-body text-dark-700">{description}</p>}
        {subtitle && <p className="text-body text-dark-700">{subtitle}</p>}
        {meta && (
          <p className="mt-1 text-caption text-dark-700">
            {Array.isArray(meta) ? meta.join(" • ") : meta}
          </p>
        )}
      </div>
    </article>
  );

  return href ? (
    <Link
      href={href}
      aria-label={title}
      className="block rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-[--color-dark-500] cursor-pointer"
    >
      {content}
    </Link>
  ) : (
    content
  );
}
