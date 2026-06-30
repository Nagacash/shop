import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { orders } from "@/lib/db/schema";
import type { OrderView } from "@/lib/actions/orders";
import { formatPrice, formatPriceFromCents } from "@/lib/utils/currency";
import { formatShippingAddress } from "@/lib/stripe/shipping";
import { getResendClient, getResendFromAddress } from "@/lib/email/resend";
import { SITE_NAME, SUPPORT_EMAIL, absoluteUrl } from "@/lib/seo/site";

function buildOrderConfirmationHtml(order: OrderView): string {
  const itemsHtml = order.items
    .map(
      (item) => `
        <tr>
          <td style="padding:8px 0;border-bottom:1px solid #e5e5e5;">
            ${item.name}${item.size || item.color ? ` (${[item.color, item.size ? `Size ${item.size}` : null].filter(Boolean).join(", ")})` : ""}
          </td>
          <td style="padding:8px 0;border-bottom:1px solid #e5e5e5;text-align:center;">${item.quantity}</td>
          <td style="padding:8px 0;border-bottom:1px solid #e5e5e5;text-align:right;">
            ${formatPriceFromCents(Math.round(item.priceAtPurchase * 100) * item.quantity)}
          </td>
        </tr>`,
    )
    .join("");

  const shippingLines = order.shippingAddress
    ? formatShippingAddress(order.shippingAddress)
        .map((line) => `<div>${line}</div>`)
        .join("")
    : "<div>—</div>";

  return `
<!DOCTYPE html>
<html>
<body style="font-family:Jost,Arial,sans-serif;background:#f5f5f5;margin:0;padding:24px;color:#111111;">
  <div style="max-width:560px;margin:0 auto;background:#ffffff;border:1px solid #e5e5e5;border-radius:12px;padding:32px;">
    <p style="margin:0 0 8px;font-size:12px;letter-spacing:0.18em;text-transform:uppercase;color:#c9a227;">Order confirmed</p>
    <h1 style="margin:0 0 16px;font-size:24px;">Thank you for your order</h1>
    <p style="margin:0 0 24px;color:#757575;line-height:1.6;">
      Your ${SITE_NAME} order <strong>#${order.id.slice(0, 8).toUpperCase()}</strong> is confirmed.
      We'll email you when it ships.
    </p>

    <table style="width:100%;border-collapse:collapse;margin-bottom:24px;">
      <thead>
        <tr>
          <th style="text-align:left;padding-bottom:8px;font-size:12px;color:#757575;">Item</th>
          <th style="text-align:center;padding-bottom:8px;font-size:12px;color:#757575;">Qty</th>
          <th style="text-align:right;padding-bottom:8px;font-size:12px;color:#757575;">Total</th>
        </tr>
      </thead>
      <tbody>${itemsHtml}</tbody>
    </table>

    <div style="margin-bottom:24px;padding:16px;background:#f5f5f5;border-radius:8px;">
      ${order.subtotalAmount != null ? `<div style="display:flex;justify-content:space-between;margin-bottom:8px;"><span>Subtotal</span><span>${formatPrice(order.subtotalAmount)}</span></div>` : ""}
      ${order.shippingAmount != null ? `<div style="display:flex;justify-content:space-between;margin-bottom:8px;"><span>Shipping</span><span>${order.shippingAmount === 0 ? "Free" : formatPrice(order.shippingAmount)}</span></div>` : ""}
      ${order.taxAmount != null && order.taxAmount > 0 ? `<div style="display:flex;justify-content:space-between;margin-bottom:8px;"><span>Tax</span><span>${formatPrice(order.taxAmount)}</span></div>` : ""}
      <div style="display:flex;justify-content:space-between;font-weight:600;font-size:18px;padding-top:8px;border-top:1px solid #e5e5e5;">
        <span>Total paid</span><span>${formatPriceFromCents(order.totalCents)}</span>
      </div>
    </div>

    <div style="margin-bottom:24px;">
      <p style="margin:0 0 8px;font-weight:600;">Shipping to</p>
      <div style="color:#757575;line-height:1.6;">${shippingLines}</div>
    </div>

    <a href="${absoluteUrl("/products")}" style="display:inline-block;background:#111111;color:#ffffff;text-decoration:none;padding:12px 24px;border-radius:999px;font-weight:500;">
      Continue shopping
    </a>

    <p style="margin:24px 0 0;font-size:12px;color:#757575;line-height:1.6;">
      Questions? Reply to this email or contact us at
      <a href="mailto:${SUPPORT_EMAIL}" style="color:#111111;">${SUPPORT_EMAIL}</a>.
    </p>
  </div>
</body>
</html>`;
}

export async function sendOrderConfirmationEmail(order: OrderView): Promise<boolean> {
  if (!order.customerEmail) {
    console.warn("[email] No customer email for order", order.id);
    return false;
  }

  const resend = getResendClient();
  if (!resend) {
    console.warn("[email] RESEND_API_KEY not configured");
    return false;
  }

  const { error } = await resend.emails.send({
    from: getResendFromAddress(),
    to: order.customerEmail,
    subject: `${SITE_NAME} order confirmed — #${order.id.slice(0, 8).toUpperCase()}`,
    html: buildOrderConfirmationHtml(order),
    replyTo: SUPPORT_EMAIL,
  });

  if (error) {
    console.error("[email] Order confirmation failed:", error);
    return false;
  }

  await db
    .update(orders)
    .set({ confirmationEmailSentAt: new Date() })
    .where(eq(orders.id, order.id));

  return true;
}

export async function maybeSendOrderConfirmationEmail(order: OrderView): Promise<void> {
  const [row] = await db
    .select({ sentAt: orders.confirmationEmailSentAt })
    .from(orders)
    .where(eq(orders.id, order.id))
    .limit(1);

  if (row?.sentAt) return;

  await sendOrderConfirmationEmail(order);
}
