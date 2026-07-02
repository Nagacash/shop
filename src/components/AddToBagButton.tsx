"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShoppingBag, Loader2 } from "lucide-react";
import { addToCart } from "@/lib/actions/cart";

type Props = {
  variantId: string;
  productName: string;
  soldOut?: boolean;
  disabled?: boolean;
};

export default function AddToBagButton({
  variantId,
  productName,
  soldOut = false,
  disabled = false,
}: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleClick = async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await addToCart(variantId, 1);
      if (!result.ok) {
        setError(result.error ?? "Could not add this item. Try again or pick another size.");
        return;
      }
      router.refresh();
      router.push("/cart");
    } catch {
      setError("Could not add this item. Check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  const isDisabled = loading || soldOut || disabled;

  return (
    <div>
      {error && (
        <p className="mb-3 text-caption text-[--color-red]" role="alert" aria-live="polite">
          {error}
        </p>
      )}
      <button
        type="button"
        onClick={handleClick}
        disabled={isDisabled}
        className="naga-btn naga-btn-gold w-full focus-ring focus-visible:outline-none sm:w-auto"
        aria-label={
          soldOut
            ? `${productName} is sold out`
            : disabled
              ? `Select a size for ${productName}`
              : `Add ${productName} to bag`
        }
      >
        {soldOut ? (
          <>Sold Out</>
        ) : loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" strokeWidth={1.5} aria-hidden="true" />
            Adding…
          </>
        ) : (
          <>
            Add to Bag
            <ShoppingBag className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden="true" />
          </>
        )}
      </button>
    </div>
  );
}
