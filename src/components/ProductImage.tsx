"use client";

import Image, { type ImageProps } from "next/image";
import { useState } from "react";
import { normalizeImageUrl, FALLBACK_PRODUCT_IMAGE } from "@/lib/utils/images";

const FALLBACK = FALLBACK_PRODUCT_IMAGE;

type ProductImageProps = Omit<ImageProps, "src" | "alt"> & {
  src: string | null | undefined;
  alt: string;
};

export default function ProductImage({ src, alt, className, ...props }: ProductImageProps) {
  const initial = normalizeImageUrl(src) ?? FALLBACK;
  const [imgSrc, setImgSrc] = useState(initial);

  return (
    <Image
      {...props}
      src={imgSrc}
      alt={alt}
      unoptimized
      className={`pointer-events-none ${className ?? ""}`}
      onError={() => {
        if (imgSrc !== FALLBACK) setImgSrc(FALLBACK);
      }}
    />
  );
}
