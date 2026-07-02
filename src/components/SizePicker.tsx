"use client";

import Link from "next/link";

export type SizeOption = {
  slug: string;
  label: string;
  disabled?: boolean;
};

export interface SizePickerProps {
  sizes: SizeOption[];
  selected: string | null;
  onSelect: (slug: string | null) => void;
  sizeGuideHref?: string;
  className?: string;
}

export default function SizePicker({
  sizes,
  selected,
  onSelect,
  sizeGuideHref = "/contact",
  className = "",
}: SizePickerProps) {
  if (sizes.length === 0) return null;

  return (
    <div className={`flex flex-col gap-3 ${className}`}>
      <div className="flex items-center justify-between">
        <p className="text-body-medium text-dark-900">Select Size</p>
        <Link
          href={sizeGuideHref}
          className="focus-ring rounded-sm text-caption text-dark-700 underline-offset-2 hover:text-dark-900 hover:underline focus-visible:outline-none"
        >
          Size Guide
        </Link>
      </div>

      <div
        className="grid grid-cols-3 gap-2 sm:grid-cols-6"
        role="radiogroup"
        aria-label="Select size"
      >
        {sizes.map((s) => {
          const isActive = selected === s.slug;
          return (
            <button
              key={s.slug}
              type="button"
              role="radio"
              aria-checked={isActive}
              disabled={s.disabled}
              onClick={() => onSelect(isActive ? null : s.slug)}
              className={`focus-ring min-h-11 rounded-lg border px-3 py-3 text-center text-body transition focus-visible:outline-none active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40 ${
                isActive
                  ? "border-[--color-naga-gold] bg-[--color-naga-gold]/8 font-medium text-dark-900 ring-1 ring-[--color-naga-gold]"
                  : "border-light-300 text-dark-700 hover:border-dark-500"
              }`}
            >
              {s.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
