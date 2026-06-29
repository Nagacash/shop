"use client";

import FlatLayFrame from "@/components/FlatLayFrame";
import ProductImage from "@/components/ProductImage";
import { isFlatLayProductImage } from "@/lib/utils/images";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, ImageOff } from "lucide-react";
import { useVariantStore } from "@/store/variant";

type Variant = {
  color: string;
  images: string[];
};

export interface ProductGalleryProps {
  productId: string;
  variants: Variant[];
  initialVariantIndex?: number;
  className?: string;
}

function isValidSrc(src: string | undefined | null) {
  return typeof src === "string" && src.trim().length > 0;
}

export default function ProductGallery({
  productId,
  variants,
  initialVariantIndex = 0,
  className = "",
}: ProductGalleryProps) {
  const validVariants = useMemo(
    () => variants.filter((v) => Array.isArray(v.images) && v.images.some(isValidSrc)),
    [variants]
  );

  const variantIndex =
    useVariantStore(
      (s) => s.selectedByProduct[productId] ?? Math.min(initialVariantIndex, Math.max(validVariants.length - 1, 0))
    );

  const images = validVariants[variantIndex]?.images?.filter(isValidSrc) ?? [];
  const flatLay = images.some(isFlatLayProductImage);
  const showNav = images.length > 1;
  const [activeIndex, setActiveIndex] = useState(0);
  const mainRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setActiveIndex(0);
  }, [variantIndex]);

  const go = useCallback(
    (dir: -1 | 1) => {
      if (images.length === 0) return;
      setActiveIndex((i) => (i + dir + images.length) % images.length);
    },
    [images.length]
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!mainRef.current) return;
      if (!document.activeElement) return;
      if (!mainRef.current.contains(document.activeElement)) return;
      if (e.key === "ArrowLeft") go(-1);
      if (e.key === "ArrowRight") go(1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go]);

  return (
    <section className={`flex w-full flex-col gap-4 lg:flex-row ${className}`}>
      {images.length > 1 && (
        <div className="order-2 flex gap-3 overflow-x-auto lg:order-1 lg:flex-col">
          {images.map((src, i) => (
            <button
              key={`${src}-${i}`}
              aria-label={`Thumbnail ${i + 1}`}
              onClick={() => setActiveIndex(i)}
              className={`relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg ring-1 ring-light-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-[--color-dark-500] ${i === activeIndex ? "ring-[--color-dark-500]" : ""}`}
            >
              <ProductImage
                src={src}
                alt={`Thumbnail ${i + 1}`}
                fill
                sizes="64px"
                className={flatLay ? "object-contain bg-[#12100e] p-1" : "object-cover"}
              />
            </button>
          ))}
        </div>
      )}

      <div ref={mainRef} className="order-1 relative w-full overflow-hidden rounded-2xl ring-1 ring-light-300 lg:order-2">
        {images.length > 0 ? (
          flatLay ? (
            <div className="relative">
              <FlatLayFrame
                src={images[activeIndex]}
                alt="Product image"
                variant="gallery"
                sizes="(min-width:1024px) 720px, 100vw"
                priority
              />
              {showNav && (
                <div className="absolute inset-x-0 bottom-4 z-20 flex items-center justify-center gap-2">
                  {images.map((_, i) => (
                    <button
                      key={i}
                      aria-label={`Go to image ${i + 1}`}
                      onClick={() => setActiveIndex(i)}
                      className={`h-1.5 rounded-full transition-all ${i === activeIndex ? "w-6 bg-[--color-naga-gold]" : "w-1.5 bg-light-100/40"}`}
                    />
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="relative h-[500px] bg-light-200">
              <ProductImage
                src={images[activeIndex]}
                alt="Product image"
                fill
                sizes="(min-width:1024px) 720px, 100vw"
                className="object-cover"
                priority
              />
              {showNav && (
                <div className="absolute inset-0 flex items-center justify-between px-2">
                  <button
                    aria-label="Previous image"
                    onClick={() => go(-1)}
                    className="rounded-full bg-light-100/80 p-2 ring-1 ring-light-300 transition hover:bg-light-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-[--color-dark-500]"
                  >
                    <ChevronLeft className="h-5 w-5 text-dark-900" />
                  </button>
                  <button
                    aria-label="Next image"
                    onClick={() => go(1)}
                    className="rounded-full bg-light-100/80 p-2 ring-1 ring-light-300 transition hover:bg-light-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-[--color-dark-500]"
                  >
                    <ChevronRight className="h-5 w-5 text-dark-900" />
                  </button>
                </div>
              )}
            </div>
          )
        ) : (
          <div className="flex h-[500px] w-full items-center justify-center bg-light-200 text-dark-700">
            <div className="flex items-center gap-2 rounded-lg border border-light-300 bg-light-100 px-4 py-3">
              <ImageOff className="h-5 w-5" />
              <span className="text-body">No images available</span>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
