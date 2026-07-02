import type Stripe from "stripe";
import {
  STRIPE_CURRENCY,
  STRIPE_TAX_CODE_SHIPPING,
  calculateShippingCents,
  calculateShippingEur,
} from "@/lib/utils/currency";

type CartLine = { price: number; quantity: number; isDigital?: boolean };

export function cartSubtotalEur(items: CartLine[]): number {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

export function cartRequiresShipping(items: Pick<CartLine, "isDigital">[]): boolean {
  return items.some((item) => !item.isDigital);
}

export function buildCheckoutShippingOptions(
  subtotalEur: number,
  requiresShipping = true,
): Stripe.Checkout.SessionCreateParams.ShippingOption[] {
  const shippingCents = calculateShippingCents(subtotalEur, requiresShipping);
  const isFree = calculateShippingEur(subtotalEur, requiresShipping) === 0;

  return [
    {
      shipping_rate_data: {
        type: "fixed_amount",
        fixed_amount: {
          amount: shippingCents,
          currency: STRIPE_CURRENCY,
        },
        display_name: isFree ? "Free shipping" : "Standard shipping",
        delivery_estimate: {
          minimum: { unit: "business_day", value: 3 },
          maximum: { unit: "business_day", value: 7 },
        },
        tax_behavior: "exclusive",
        tax_code: STRIPE_TAX_CODE_SHIPPING,
      },
    },
  ];
}

export function parseSessionAmounts(session: Stripe.Checkout.Session) {
  const totalCents = session.amount_total ?? 0;
  const subtotalCents = session.amount_subtotal ?? 0;
  const taxCents = session.total_details?.amount_tax ?? 0;
  const shippingCents = session.total_details?.amount_shipping ?? 0;

  return {
    totalCents,
    subtotalCents,
    taxCents,
    shippingCents,
  };
}
