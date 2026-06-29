"use client";

import { useState } from "react";
import Link from "next/link";

const SIZES = ["XS", "S", "M", "L", "XL", "XXL"];

export interface SizePickerProps {
  className?: string;
}

export default function SizePicker({ className = "" }: SizePickerProps) {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <div className={`flex flex-col gap-3 ${className}`}>
      <div className="flex items-center justify-between">
        <p className="text-body-medium text-dark-900">Select Size</p>
        <Link
          href="/products"
          className="focus-ring rounded-sm text-caption text-dark-700 underline-offset-2 hover:text-dark-900 hover:underline focus-visible:outline-none"
        >
          Size Guide
        </Link>
      </div>

      <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
        {SIZES.map((s) => {
          const isActive = selected === s;
          return (
            <button
              key={s}
              type="button"
              onClick={() => setSelected(isActive ? null : s)}
              className={`focus-ring min-h-11 rounded-lg border px-3 py-3 text-center text-body transition focus-visible:outline-none active:scale-[0.98] ${
                isActive
                  ? "border-[--color-naga-gold] bg-[--color-naga-gold]/8 font-medium text-dark-900 ring-1 ring-[--color-naga-gold]"
                  : "border-light-300 text-dark-700 hover:border-dark-500"
              }`}
              aria-pressed={isActive}
            >
              {s}
            </button>
          );
        })}
      </div>
    </div>
  );
}
