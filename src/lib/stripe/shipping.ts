import type Stripe from "stripe";
import { db } from "@/lib/db";
import { addresses } from "@/lib/db/schema";

/** EU + CH — common shipping destinations from Germany */
export const SHIPPING_COUNTRIES = [
  "DE",
  "AT",
  "CH",
  "NL",
  "BE",
  "FR",
  "IT",
  "PL",
  "CZ",
  "DK",
  "SE",
  "LU",
  "IE",
  "ES",
  "PT",
  "GB",
] as const;

export type ShippingAddressView = {
  recipientName: string | null;
  line1: string;
  line2: string | null;
  city: string;
  state: string;
  country: string;
  postalCode: string;
};

function normalizeState(state: string | null | undefined, country: string): string {
  const trimmed = state?.trim();
  if (trimmed) return trimmed;
  return country || "—";
}

type CheckoutSessionShipping = {
  name?: string | null;
  address?: Stripe.Address | null;
};

function getSessionShipping(session: Stripe.Checkout.Session): CheckoutSessionShipping | null {
  const extended = session as Stripe.Checkout.Session & {
    shipping_details?: CheckoutSessionShipping | null;
  };
  return extended.shipping_details ?? null;
}

export function parseStripeShippingAddress(
  session: Stripe.Checkout.Session,
): ShippingAddressView | null {
  const shipping = getSessionShipping(session);
  const address = shipping?.address;

  if (!address?.line1?.trim()) {
    return null;
  }

  const country = (address.country ?? "DE").toUpperCase();

  return {
    recipientName: shipping?.name?.trim() || session.customer_details?.name?.trim() || null,
    line1: address.line1.trim(),
    line2: address.line2?.trim() || null,
    city: address.city?.trim() || "—",
    state: normalizeState(address.state, country),
    country,
    postalCode: address.postal_code?.trim() || "—",
  };
}

export async function saveShippingAddressFromSession(
  session: Stripe.Checkout.Session,
  userId: string | null,
): Promise<string | null> {
  const parsed = parseStripeShippingAddress(session);
  if (!parsed) return null;

  const [row] = await db
    .insert(addresses)
    .values({
      userId,
      type: "shipping",
      recipientName: parsed.recipientName,
      line1: parsed.line1,
      line2: parsed.line2,
      city: parsed.city,
      state: parsed.state,
      country: parsed.country,
      postalCode: parsed.postalCode,
    })
    .returning({ id: addresses.id });

  return row.id;
}

export function formatShippingAddress(address: ShippingAddressView): string[] {
  const lines = [
    address.recipientName,
    address.line1,
    address.line2,
    `${address.postalCode} ${address.city}`,
    address.state !== address.country && address.state !== "—" ? address.state : null,
    address.country,
  ].filter((line): line is string => Boolean(line?.trim()));

  return lines;
}
