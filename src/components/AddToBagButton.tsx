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
      className="naga-btn naga-btn-gold w-full focus-ring focus-visible:outline-none sm:w-auto"
      aria-label={soldOut ? `${productName} is sold out` : `Add ${productName} to bag`}
    >
      {soldOut ? (
        <>Sold Out</>
      ) : loading ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" strokeWidth={1.5} />
          Adding…
        </>
      ) : (
        <>
          Add to Bag
          <ShoppingBag className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden="true" />
        </>
      )}
    </button>
  );
}
