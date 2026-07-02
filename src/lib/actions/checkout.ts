"use server";

import { getCartWithItems } from "@/lib/actions/cart";
import { getCurrentUser } from "@/lib/auth/actions";
import { mergeGuestCartWithUser } from "@/lib/utils/mergeSessions";
import { cookies } from "next/headers";
import { getStripeClient, toMinorUnits } from "@/lib/stripe/client";
import {
  buildCheckoutShippingOptions,
  cartRequiresShipping,
  cartSubtotalEur,
} from "@/lib/stripe/checkout-amounts";
import { SHIPPING_COUNTRIES } from "@/lib/stripe/shipping";
import {
  STRIPE_CURRENCY,
  STRIPE_TAX_CODE_APPAREL,
  STRIPE_TAX_CODE_DIGITAL,
} from "@/lib/utils/currency";

const appUrl = process.env.BETTER_AUTH_URL ?? "http://localhost:3000";

function absoluteImageUrl(imageUrl: string): string {
  if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) {
    return imageUrl;
  }
  return `${appUrl}${imageUrl.startsWith("/") ? imageUrl : `/${imageUrl}`}`;
}

export async function createStripeCheckoutSession(cartId: string) {
  const user = await getCurrentUser();
  const cookieStore = await cookies();
  const guestToken = cookieStore.get("guest_session")?.value;

  if (user && guestToken) {
    await mergeGuestCartWithUser(user.id, guestToken);
  }

  const cart = await getCartWithItems(cartId);

  if (!cart.items.length) {
    throw new Error("Your cart is empty.");
  }

  const subtotalEur = cartSubtotalEur(cart.items);
  const requiresShipping = cartRequiresShipping(cart.items);

  const lineItems = cart.items.map((item) => ({
    price_data: {
      currency: STRIPE_CURRENCY,
      unit_amount: toMinorUnits(item.price),
      tax_behavior: "exclusive" as const,
      product_data: {
        name: item.name,
        images: item.imageUrl ? [absoluteImageUrl(item.imageUrl)] : undefined,
        tax_code: item.isDigital ? STRIPE_TAX_CODE_DIGITAL : STRIPE_TAX_CODE_APPAREL,
        metadata: {
          variantId: item.variantId,
        },
      },
    },
    quantity: item.quantity,
  }));

  let session;
  try {
    session = await getStripeClient().checkout.sessions.create({
      mode: "payment",
      line_items: lineItems,
      success_url: `${appUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/cart`,
      customer_email: user?.email ?? undefined,
      ...(requiresShipping
        ? {
            shipping_address_collection: {
              allowed_countries: [...SHIPPING_COUNTRIES],
            },
            shipping_options: buildCheckoutShippingOptions(subtotalEur, true),
            phone_number_collection: {
              enabled: true,
            },
          }
        : {
            billing_address_collection: "auto" as const,
          }),
      automatic_tax: {
        enabled: true,
      },
      metadata: {
        cartId,
        userId: user?.id ?? "",
      },
    });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Could not start Stripe checkout.";
    throw new Error(message);
  }

  if (!session.url) {
    throw new Error("Failed to create Stripe checkout session.");
  }

  return { url: session.url };
}
