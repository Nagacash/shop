import Link from "next/link";
import { CheckCircle2, Package } from "lucide-react";
import type { OrderView } from "@/lib/actions/orders";

import { formatPriceFromCents } from "@/lib/utils/currency";

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
        <div className="mt-4 flex items-center justify-between border-t border-light-300 pt-4">
          <span className="text-body-medium text-dark-900">Total paid</span>
          <span className="text-lead text-dark-900">{formatPriceFromCents(order.totalCents)}</span>
        </div>
      </div>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
        <Link
          href="/products"
          className="rounded-full bg-dark-900 px-6 py-3 text-center text-body-medium text-light-100 hover:bg-dark-700"
        >
          Continue Shopping
        </Link>
        <Link
          href="/"
          className="rounded-full border border-light-300 px-6 py-3 text-center text-body-medium text-dark-900 hover:border-dark-500"
        >
          Back to Home
        </Link>
      </div>
    </section>
  );
}
