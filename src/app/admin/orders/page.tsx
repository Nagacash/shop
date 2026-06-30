import Link from "next/link";
import { listAdminOrders, formatShippingAddress } from "@/lib/actions/admin-orders";
import { formatPrice, formatPriceFromCents } from "@/lib/utils/currency";
import AdminOrderStatusSelect from "@/components/AdminOrderStatusSelect";

export default async function AdminOrdersPage() {
  const orders = await listAdminOrders();

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-caption uppercase tracking-[0.18em] text-[--color-naga-gold]">Admin</p>
          <h1 className="mt-1 text-heading-3 text-dark-900">Orders</h1>
          <p className="mt-2 text-body text-dark-700">
            {orders.length} recent order{orders.length === 1 ? "" : "s"}
          </p>
        </div>
        <Link
          href="/"
          className="focus-ring rounded-full border border-light-300 px-4 py-2 text-body-medium text-dark-900 hover:border-dark-500 focus-visible:outline-none"
        >
          Back to store
        </Link>
      </div>

      {orders.length === 0 ? (
        <div className="rounded-xl border border-light-300 bg-light-100 p-10 text-center text-body text-dark-700">
          No orders yet.
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <article
              key={order.id}
              className="overflow-hidden rounded-xl border border-light-300 bg-light-100"
            >
              <div className="flex flex-wrap items-start justify-between gap-4 border-b border-light-300 px-5 py-4">
                <div>
                  <p className="text-body-medium text-dark-900">
                    Order #{order.id.slice(0, 8).toUpperCase()}
                  </p>
                  <p className="mt-1 text-caption text-dark-700">
                    {order.createdAt.toLocaleString("de-DE")}
                    {order.customerEmail ? ` · ${order.customerEmail}` : ""}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <AdminOrderStatusSelect orderId={order.id} status={order.status} />
                  <p className="text-body-medium text-dark-900">
                    {formatPriceFromCents(order.totalCents)}
                  </p>
                </div>
              </div>

              <div className="grid gap-6 px-5 py-4 lg:grid-cols-[1fr_280px]">
                <div>
                  <h2 className="text-caption uppercase tracking-[0.12em] text-dark-700">Items</h2>
                  <ul className="mt-3 space-y-2">
                    {order.items.map((item, index) => (
                      <li
                        key={`${order.id}-${index}`}
                        className="flex items-start justify-between gap-4 text-body"
                      >
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
                          {formatPriceFromCents(
                            Math.round(item.priceAtPurchase * 100) * item.quantity,
                          )}
                        </p>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-4 space-y-1 border-t border-light-300 pt-4 text-caption text-dark-700">
                    {order.subtotalAmount != null && (
                      <div className="flex justify-between">
                        <span>Subtotal</span>
                        <span>{formatPrice(order.subtotalAmount)}</span>
                      </div>
                    )}
                    {order.shippingAmount != null && (
                      <div className="flex justify-between">
                        <span>Shipping</span>
                        <span>
                          {order.shippingAmount === 0 ? "Free" : formatPrice(order.shippingAmount)}
                        </span>
                      </div>
                    )}
                    {order.taxAmount != null && order.taxAmount > 0 && (
                      <div className="flex justify-between">
                        <span>Tax</span>
                        <span>{formatPrice(order.taxAmount)}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="rounded-lg border border-light-300 bg-light-200/40 p-4">
                  <h2 className="text-caption uppercase tracking-[0.12em] text-dark-700">
                    Ship to
                  </h2>
                  {order.shippingAddress ? (
                    <address className="mt-3 space-y-0.5 not-italic text-body text-dark-900">
                      {formatShippingAddress(order.shippingAddress).map((line) => (
                        <p key={line}>{line}</p>
                      ))}
                    </address>
                  ) : (
                    <p className="mt-3 text-body text-dark-700">No shipping address saved.</p>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
