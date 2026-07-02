"use client";

import ProductImage from "@/components/ProductImage";
import { Check } from "lucide-react";
import { useVariantStore } from "@/store/variant";

type Variant = { color: string; images: string[] };

export interface ColorSwatchesProps {
  productId: string;
  variants: Variant[];
  className?: string;
}

function firstValidImage(images: string[]) {
  return images.find((s) => typeof s === "string" && s.trim().length > 0);
}

export default function ColorSwatches({ productId, variants, className = "" }: ColorSwatchesProps) {
  const setSelected = useVariantStore((s) => s.setSelected);
  const selected = useVariantStore((s) => s.getSelected(productId, 0));

  return (
    <div className={`flex flex-wrap gap-3 ${className}`} role="listbox" aria-label="Choose color">
      {variants.map((v, i) => {
        const src = firstValidImage(v.images);
        if (!src) return null;
        const isActive = selected === i;
        return (
          <button
            key={`${v.color}-${i}`}
            type="button"
            onClick={() => setSelected(productId, i)}
            aria-label={`Color ${v.color}`}
            aria-selected={isActive}
            role="option"
            className={`focus-ring relative h-[72px] w-[120px] min-h-11 overflow-hidden rounded-lg ring-1 transition focus-visible:outline-none active:scale-[0.98] ${
              isActive
                ? "ring-2 ring-[--color-naga-gold]"
                : "ring-light-300 hover:ring-dark-500"
            }`}
          >
            <ProductImage src={src} alt={v.color} fill sizes="120px" className="object-cover" />
            {isActive && (
              <span className="absolute right-1 top-1 rounded-full bg-[--color-naga-gold] p-1">
                <Check className="h-4 w-4 text-dark-900" aria-hidden="true" />
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
