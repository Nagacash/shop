import Image from "next/image";
import type { ReactNode } from "react";

type FlatLayFrameProps = {
  src: string;
  alt: string;
  priority?: boolean;
  sizes?: string;
  /** Taller portrait frame for editorial layouts */
  variant?: "card" | "gallery" | "hero";
  className?: string;
  interactive?: boolean;
  children?: ReactNode;
};

const variantStyles = {
  card: {
    wrapper: "aspect-[4/5]",
    image: "object-contain p-3 sm:p-4",
  },
  gallery: {
    wrapper: "min-h-[520px] h-[min(72vh,640px)]",
    image: "object-contain p-5 sm:p-8 lg:p-10",
  },
  hero: {
    wrapper: "aspect-[4/5] sm:aspect-[5/6] lg:min-h-[560px] lg:aspect-auto",
    image: "object-contain p-4 sm:p-8 lg:p-12",
  },
} as const;

export default function FlatLayFrame({
  src,
  alt,
  priority = false,
  sizes = "100vw",
  variant = "card",
  className = "",
  interactive = false,
  children,
}: FlatLayFrameProps) {
  const styles = variantStyles[variant];

  return (
    <div
      className={`flat-lay-frame relative overflow-hidden ${styles.wrapper} ${interactive ? "flat-lay-frame--interactive" : ""} ${className}`}
    >
      <div className="flat-lay-frame__glow" aria-hidden="true" />
      <div className="flat-lay-frame__grain" aria-hidden="true" />

      <Image
        src={src}
        alt={alt}
        fill
        unoptimized
        priority={priority}
        loading={priority ? undefined : "lazy"}
        decoding="async"
        sizes={sizes}
        className={`relative z-10 ${styles.image} ${interactive ? "transition-transform duration-700 ease-out group-hover:scale-[1.015]" : ""}`}
      />

      {children}
    </div>
  );
}
