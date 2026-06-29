"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShoppingBag, Loader2 } from "lucide-react";
import { addToCart } from "@/lib/actions/cart";

type Props = {
  variantId: string;
  productName: string;
  soldOut?: boolean;
};

export default function AddToBagButton({ variantId, productName, soldOut = false }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    try {
      const result = await addToCart(variantId, 1);
      if (!result.ok) {
        setLoading(false);
        return;
      }
      router.refresh();
      router.push("/cart");
    } catch {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={loading || soldOut}
      className="flex min-h-11 items-center justify-center gap-2 rounded-full bg-dark-900 px-6 py-4 text-body-medium text-light-100 transition hover:opacity-90 focus-ring focus-visible:outline-none active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
      aria-label={soldOut ? `${productName} is sold out` : `Add ${productName} to bag`}
    >
      {soldOut ? (
        <>Sold Out</>
      ) : loading ? (
        <>
          <Loader2 className="h-5 w-5 animate-spin" />
          Adding…
        </>
      ) : (
        <>
          <ShoppingBag className="h-5 w-5" />
          Add to Bag
        </>
      )}
    </button>
  );
}
