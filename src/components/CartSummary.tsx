"use client";

import ProductImage from "@/components/ProductImage";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Minus, Plus, Trash2, ShoppingBag, Loader2 } from "lucide-react";
import { createStripeCheckoutSession } from "@/lib/actions/checkout";
import { updateCartItemQuantity, removeCartItem, type CartView } from "@/lib/actions/cart";

import {
  calculateShippingEur,
  formatPrice,
  formatPriceFromCents,
  FREE_SHIPPING_THRESHOLD,
} from "@/lib/utils/currency";

export default function CartSummary({ cart }: { cart: CartView }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [items, setItems] = useState(cart.items);
  const [totalCents, setTotalCents] = useState(cart.totalCents);

  const recalcTotal = (nextItems: typeof items) => {
    return nextItems.reduce(
      (sum, item) => sum + Math.round(item.price * 100) * item.quantity,
      0,
    );
  };

  const handleQuantityChange = async (cartItemId: string, quantity: number) => {
    setError(null);
    const nextItems = quantity <= 0
      ? items.filter((item) => item.id !== cartItemId)
      : items.map((item) =>
          item.id === cartItemId ? { ...item, quantity } : item,
        );
    setItems(nextItems);
    setTotalCents(recalcTotal(nextItems));

    if (quantity <= 0) {
      await removeCartItem(cartItemId);
    } else {
      await updateCartItemQuantity(cartItemId, quantity);
    }
    router.refresh();
  };

  const handleCheckout = async () => {
    if (!items.length) return;

    setLoading(true);
    setError(null);

    try {
      const { url } = await createStripeCheckoutSession(cart.id);
      window.location.href = url;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Checkout failed. Please try again.");
      setLoading(false);
    }
  };

  const shippingEur = calculateShippingEur(totalCents / 100);

  if (!items.length) {
    return (
      <section className="rounded-xl border border-light-300 bg-light-100 p-8 text-center">
        <ShoppingBag className="mx-auto h-10 w-10 text-dark-500" />
        <h2 className="mt-4 text-heading-3 text-dark-900">Your bag is empty</h2>
        <p className="mt-2 text-body text-dark-700">Add items before checking out.</p>
        <Link
          href="/products"
          className="mt-6 inline-block rounded-full bg-dark-900 px-6 py-3 text-body-medium text-light-100 hover:bg-dark-700"
        >
          Browse Products
        </Link>
      </section>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_360px]">
      <ul className="space-y-4">
        {items.map((item) => (
          <li
            key={item.id}
            className="flex gap-4 rounded-xl border border-light-300 bg-light-100 p-4"
          >
            <Link
              href={`/products/${item.productId}`}
              className="relative h-24 w-24 shrink-0 overflow-hidden rounded-lg bg-light-200"
              aria-label={`View ${item.name}`}
            >
              <ProductImage
                src={item.imageUrl}
                alt={item.name}
                fill
                className="object-cover"
                sizes="96px"
              />
            </Link>
            <div className="flex flex-1 flex-col gap-2">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <Link
                    href={`/products/${item.productId}`}
                    className="text-body-medium text-dark-900 hover:underline"
                  >
                    {item.name}
                  </Link>
                  {(item.size || item.color) && (
                    <p className="text-caption text-dark-700">
                      {[item.color, item.size ? `Size ${item.size}` : null]
                        .filter(Boolean)
                        .join(" · ")}
                    </p>
                  )}
                </div>
                <p className="text-body-medium text-dark-900">
                  {formatPriceFromCents(Math.round(item.price * 100) * item.quantity)}
                </p>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 rounded-lg border border-light-300">
                  <button
                    type="button"
                    onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                    className="p-2 text-dark-700 hover:text-dark-900"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="min-w-8 text-center text-body text-dark-900">
                    {item.quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                    className="p-2 text-dark-700 hover:text-dark-900"
                    aria-label="Increase quantity"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => handleQuantityChange(item.id, 0)}
                  className="p-2 text-dark-700 hover:text-[--color-red]"
                  aria-label="Remove item"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>

      <aside className="rounded-xl border border-light-300 bg-light-100 p-6 lg:sticky lg:top-24 lg:self-start">
        <h2 className="text-heading-3 text-dark-900">Summary</h2>
        <div className="mt-4 flex items-center justify-between border-b border-light-300 pb-4">
          <span className="text-body text-dark-700">Subtotal</span>
          <span className="text-body-medium text-dark-900">{formatPriceFromCents(totalCents)}</span>
        </div>
        <div className="mt-3 flex items-center justify-between">
          <span className="text-body text-dark-700">Shipping</span>
          <span className="text-body-medium text-dark-900">
            {shippingEur === 0 ? "Free" : formatPrice(shippingEur)}
          </span>
        </div>
        <p className="mt-3 text-caption text-dark-700">
          {shippingEur === 0
            ? "Free shipping applied on this order."
            : `Free shipping on orders over ${formatPrice(FREE_SHIPPING_THRESHOLD)}.`}
          {" "}Tax is calculated at checkout based on your shipping address.
        </p>
        {error && (
          <p className="mt-4 text-caption text-[--color-red]">{error}</p>
        )}
        <button
          type="button"
          onClick={handleCheckout}
          disabled={loading || !items.length}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-dark-900 px-6 py-4 text-body-medium text-light-100 transition hover:bg-dark-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              Redirecting…
            </>
          ) : (
            <>
              <ShoppingBag className="h-5 w-5" />
              Checkout
            </>
          )}
        </button>
      </aside>
    </div>
  );
}
