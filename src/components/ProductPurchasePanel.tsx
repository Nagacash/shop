"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import ColorSwatches from "@/components/ColorSwatches";
import SizePicker from "@/components/SizePicker";
import AddToBagButton from "@/components/AddToBagButton";
import { useVariantStore } from "@/store/variant";

export type PurchaseVariant = {
  id: string;
  colorName: string;
  sizeName: string | null;
  sizeSlug: string | null;
  inStock: number;
};

type GalleryVariant = {
  color: string;
  images: string[];
  variantId: string;
};

type Props = {
  productId: string;
  productName: string;
  defaultVariantId: string;
  variants: PurchaseVariant[];
  galleryVariants: GalleryVariant[];
  allSoldOut: boolean;
};

const SIZE_ORDER = ["xs", "s", "m", "l", "xl", "xxl"];

function sortSizes(a: { slug: string }, b: { slug: string }) {
  return SIZE_ORDER.indexOf(a.slug) - SIZE_ORDER.indexOf(b.slug);
}

export default function ProductPurchasePanel({
  productId,
  productName,
  defaultVariantId,
  variants,
  galleryVariants,
  allSoldOut,
}: Props) {
  const initialized = useRef(false);
  const colorIndex = useVariantStore((s) => s.getSelected(productId, 0));
  const setColorIndex = useVariantStore((s) => s.setSelected);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);

  const colorName =
    galleryVariants[colorIndex]?.color ??
    galleryVariants[0]?.color ??
    variants.find((v) => v.id === defaultVariantId)?.colorName ??
    variants[0]?.colorName;

  const sizeOptions = useMemo(() => {
    if (!colorName) return [];
    const seen = new Map<string, { slug: string; label: string; inStock: number }>();
    for (const v of variants) {
      if (v.colorName !== colorName || !v.sizeSlug || !v.sizeName) continue;
      const existing = seen.get(v.sizeSlug);
      if (!existing || v.inStock > existing.inStock) {
        seen.set(v.sizeSlug, { slug: v.sizeSlug, label: v.sizeName, inStock: v.inStock });
      }
    }
    return Array.from(seen.values()).sort(sortSizes);
  }, [variants, colorName]);

  const showSizePicker = sizeOptions.length > 1;

  const selectedVariant = useMemo(() => {
    if (!colorName) return null;
    const forColor = variants.filter((v) => v.colorName === colorName);
    if (forColor.length === 0) return null;
    if (!showSizePicker) {
      return forColor.find((v) => v.inStock > 0) ?? forColor[0];
    }
    if (!selectedSize) return null;
    return forColor.find((v) => v.sizeSlug === selectedSize) ?? null;
  }, [variants, colorName, showSizePicker, selectedSize]);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    if (galleryVariants.length > 0) {
      const defaultIndex = galleryVariants.findIndex((g) => g.variantId === defaultVariantId);
      if (defaultIndex >= 0) {
        setColorIndex(productId, defaultIndex);
      }
    }

    const defaultVariant = variants.find((v) => v.id === defaultVariantId);
    if (defaultVariant?.sizeSlug) {
      setSelectedSize(defaultVariant.sizeSlug);
    }
  }, [productId, defaultVariantId, galleryVariants, variants, setColorIndex]);

  useEffect(() => {
    if (!showSizePicker) {
      setSelectedSize(null);
      return;
    }
    if (selectedSize && sizeOptions.some((s) => s.slug === selectedSize)) return;
    const firstInStock = sizeOptions.find((s) => s.inStock > 0);
    setSelectedSize(firstInStock?.slug ?? sizeOptions[0]?.slug ?? null);
  }, [colorIndex, colorName, showSizePicker, sizeOptions, selectedSize]);

  const variantSoldOut = selectedVariant ? selectedVariant.inStock <= 0 : allSoldOut;
  const needsSize = showSizePicker && !selectedSize;

  return (
    <>
      {galleryVariants.length > 0 && (
        <ColorSwatches productId={productId} variants={galleryVariants} />
      )}
      {showSizePicker && (
        <SizePicker
          sizes={sizeOptions.map((s) => ({
            slug: s.slug,
            label: s.label,
            disabled: s.inStock <= 0,
          }))}
          selected={selectedSize}
          onSelect={setSelectedSize}
        />
      )}
      <div className="flex flex-col gap-3">
        {allSoldOut && (
          <p className="rounded-full border border-light-300 bg-light-200 px-4 py-2 text-center text-body-medium text-dark-700">
            Sold out for now — check back soon.
          </p>
        )}
        {needsSize && !allSoldOut && (
          <p className="text-caption text-dark-700">Select a size to add this item to your bag.</p>
        )}
        {selectedVariant && (
          <AddToBagButton
            variantId={selectedVariant.id}
            productName={productName}
            soldOut={variantSoldOut}
            disabled={needsSize}
          />
        )}
      </div>
    </>
  );
}
