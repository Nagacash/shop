"use client";

import Image, { type ImageProps } from "next/image";
import { useEffect, useState } from "react";
import { normalizeImageUrl, FALLBACK_PRODUCT_IMAGE } from "@/lib/utils/images";

const FALLBACK = FALLBACK_PRODUCT_IMAGE;

type ProductImageProps = Omit<ImageProps, "src" | "alt"> & {
  src: string | null | undefined;
  alt: string;
};

export default function ProductImage({ src, alt, className, priority, loading, ...props }: ProductImageProps) {
  const resolved = normalizeImageUrl(src) ?? FALLBACK;
  const [imgSrc, setImgSrc] = useState(resolved);

  useEffect(() => {
    setImgSrc(resolved);
  }, [resolved]);

  return (
    <Image
      {...props}
      src={imgSrc}
      alt={alt}
      unoptimized
      priority={priority}
      loading={loading ?? (priority ? undefined : "lazy")}
      decoding="async"
      className={`pointer-events-none ${className ?? ""}`}
      onError={() => {
        if (imgSrc !== FALLBACK) setImgSrc(FALLBACK);
      }}
    />
  );
}
