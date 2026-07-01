import Link from "next/link";
import { CheckCircle2, MapPin, Package } from "lucide-react";
import type { OrderView } from "@/lib/actions/orders";
import { formatShippingAddress } from "@/lib/stripe/shipping";

import { formatPrice, formatPriceFromCents } from "@/lib/utils/currency";

export default function OrderSuccess({ order }: { order: OrderView }) {
  return (
    <section className="mx-auto max-w-2xl rounded-xl border border-light-300 bg-light-100 p-8">
      <div className="flex flex-col items-center text-center">
        <CheckCircle2 className="h-12 w-12 text-[--color-green]" />
        <h1 className="mt-4 text-heading-3 text-dark-900">Order confirmed</h1>
        <p className="mt-2 text-body text-dark-700">
          Thank you for your purchase. Your order{" "}
          <span className="font-medium text-dark-900">#{order.id.slice(0, 8)}</span> has been
          placed successfully.
        </p>
      </div>

      <div className="mt-8 rounded-xl border border-light-300 p-4">
        <div className="flex items-center gap-2 text-body-medium text-dark-900">
          <Package className="h-5 w-5" />
          Order details
        </div>
        <ul className="mt-4 space-y-3">
          {order.items.map((item) => (
            <li key={item.id} className="flex items-start justify-between gap-4 text-body">
              <div>
                <p className="text-dark-900">{item.name}</p>
                <p className="text-caption text-dark-700">
                  Qty {item.quantity}
                  {item.color || item.size
                    ? ` · ${[item.color, item.size ? `Size ${item.size}` : null]
                        .filter(Boolean)
                        .join(" · ")}`
                    : ""}
                </p>
              </div>
              <p className="text-dark-900">
                {formatPriceFromCents(Math.round(item.priceAtPurchase * 100) * item.quantity)}
              </p>
            </li>
          ))}
        </ul>
        <div className="mt-4 space-y-2 border-t border-light-300 pt-4 text-body">
          {order.subtotalAmount != null && (
            <div className="flex items-center justify-between text-dark-700">
              <span>Subtotal</span>
              <span>{formatPrice(order.subtotalAmount)}</span>
            </div>
          )}
          {order.shippingAmount != null && (
            <div className="flex items-center justify-between text-dark-700">
              <span>Shipping</span>
              <span>{order.shippingAmount === 0 ? "Free" : formatPrice(order.shippingAmount)}</span>
            </div>
          )}
          {order.taxAmount != null && order.taxAmount > 0 && (
            <div className="flex items-center justify-between text-dark-700">
              <span>Tax</span>
              <span>{formatPrice(order.taxAmount)}</span>
            </div>
          )}
          <div className="flex items-center justify-between pt-2 text-body-medium text-dark-900">
            <span>Total paid</span>
            <span className="text-lead">{formatPriceFromCents(order.totalCents)}</span>
          </div>
        </div>
      </div>

      {order.shippingAddress && (
        <div className="mt-6 rounded-xl border border-light-300 p-4">
          <div className="flex items-center gap-2 text-body-medium text-dark-900">
            <MapPin className="h-5 w-5" />
            Shipping to
          </div>
          <address className="mt-3 space-y-0.5 not-italic text-body text-dark-700">
            {formatShippingAddress(order.shippingAddress).map((line) => (
              <p key={line}>{line}</p>
            ))}
          </address>
          {order.customerEmail && (
            <p className="mt-3 text-caption text-dark-700">
              Confirmation sent to{" "}
              <span className="text-dark-900">{order.customerEmail}</span>
            </p>
          )}
        </div>
      )}

      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
        <Link
          href="/products"
          className="naga-btn naga-btn-dark text-center"
        >
          Continue Shopping
        </Link>
        <Link
          href="/"
          className="naga-btn naga-btn-ghost text-center"
        >
          Back to Home
        </Link>
      </div>
    </section>
  );
}
