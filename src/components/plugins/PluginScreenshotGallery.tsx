"use client";

import ProductImage from "@/components/ProductImage";
import { useCallback, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { NagaPluginScreenshot } from "@/lib/audio/plugins";

type Props = {
  screenshots: readonly NagaPluginScreenshot[];
  productName: string;
};

export default function PluginScreenshotGallery({ screenshots, productName }: Props) {
  const [activeIndex, setActiveIndex] = useState(0);
  const images = screenshots.filter((s) => s.src?.trim());
  const showNav = images.length > 1;

  const go = useCallback(
    (dir: -1 | 1) => {
      if (!images.length) return;
      setActiveIndex((i) => (i + dir + images.length) % images.length);
    },
    [images.length],
  );

  if (!images.length) return null;

  const active = images[activeIndex] ?? images[0];

  return (
    <section className="flex w-full flex-col gap-4 lg:flex-row" aria-label={`${productName} screenshots`}>
      {showNav && (
        <div className="order-2 flex gap-3 overflow-x-auto lg:order-1 lg:flex-col">
          {images.map((shot, i) => (
            <button
              key={shot.src}
              type="button"
              aria-label={`Screenshot ${i + 1}`}
              aria-current={i === activeIndex ? "true" : undefined}
              onClick={() => setActiveIndex(i)}
              className={`relative h-[52px] w-[92px] flex-shrink-0 overflow-hidden rounded-lg bg-[#12100e] ring-1 ring-light-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-[--color-dark-500] ${i === activeIndex ? "ring-[--color-dark-500]" : ""}`}
            >
              <ProductImage
                src={shot.src}
                alt=""
                fill
                sizes="92px"
                className="object-contain p-0.5"
              />
            </button>
          ))}
        </div>
      )}

      <div className="order-1 relative aspect-video w-full overflow-hidden rounded-2xl bg-[#12100e] ring-1 ring-light-300 lg:order-2 lg:max-h-[min(72vh,520px)]">
        <ProductImage
          src={active.src}
          alt={active.alt}
          fill
          sizes="(min-width:1024px) 720px, 100vw"
          className="object-contain p-2 sm:p-4"
          priority
        />
        {showNav && (
          <div className="absolute inset-0 flex items-center justify-between px-2">
            <button
              type="button"
              aria-label="Previous screenshot"
              onClick={() => go(-1)}
              className="rounded-full bg-light-100/80 p-2 ring-1 ring-light-300 transition hover:bg-light-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-[--color-dark-500]"
            >
              <ChevronLeft className="h-5 w-5 text-dark-900" aria-hidden />
            </button>
            <button
              type="button"
              aria-label="Next screenshot"
              onClick={() => go(1)}
              className="rounded-full bg-light-100/80 p-2 ring-1 ring-light-300 transition hover:bg-light-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-[--color-dark-500]"
            >
              <ChevronRight className="h-5 w-5 text-dark-900" aria-hidden />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}