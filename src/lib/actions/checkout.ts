"use server";

import { getCartWithItems, getOrCreateCartId } from "@/lib/actions/cart";
import { getCurrentUser } from "@/lib/auth/actions";
import {
  CHECKOUT_COOKIE_MAX_AGE,
  CHECKOUT_SESSION_COOKIE,
} from "@/lib/checkout/constants";
import {
  CHECKOUT_RATE_LIMIT,
  CHECKOUT_RATE_WINDOW_MS,
} from "@/lib/checkout/rate-limit";
import { validateCartStock } from "@/lib/inventory/stock";
import { getSiteUrl } from "@/lib/seo/site";
import { rateLimit } from "@/lib/security/rate-limit";
import { getClientIpFromHeaders } from "@/lib/security/request-client";
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
import { mergeGuestCartWithUser } from "@/lib/utils/mergeSessions";
import { cookies } from "next/headers";

function absoluteImageUrl(imageUrl: string, baseUrl: string): string {
  if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) {
    return imageUrl;
  }
  return `${baseUrl}${imageUrl.startsWith("/") ? imageUrl : `/${imageUrl}`}`;
}

export async function createStripeCheckoutSession() {
  const ip = await getClientIpFromHeaders();
  if (!rateLimit(`checkout:${ip}`, CHECKOUT_RATE_LIMIT, CHECKOUT_RATE_WINDOW_MS)) {
    throw new Error("Too many checkout attempts. Please wait a few minutes and try again.");
  }

  const user = await getCurrentUser();
  const cookieStore = await cookies();
  const guestToken = cookieStore.get("guest_session")?.value;

  if (user && guestToken) {
    await mergeGuestCartWithUser(user.id, guestToken);
  }

  const cartId = await getOrCreateCartId();
  const cart = await getCartWithItems(cartId);

  if (!cart.items.length) {
    throw new Error("Your cart is empty.");
  }

  const stockCheck = await validateCartStock(cartId);
  if (!stockCheck.ok) {
    throw new Error(stockCheck.message);
  }

  const subtotalEur = cartSubtotalEur(cart.items);
  const requiresShipping = cartRequiresShipping(cart.items);
  const appUrl = getSiteUrl();

  const lineItems = cart.items.map((item) => ({
    price_data: {
      currency: STRIPE_CURRENCY,
      unit_amount: toMinorUnits(item.price),
      tax_behavior: "exclusive" as const,
      product_data: {
        name: item.name,
        images: item.imageUrl ? [absoluteImageUrl(item.imageUrl, appUrl)] : undefined,
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
    console.error("[createStripeCheckoutSession]", err);
    throw new Error("We couldn't start checkout. Please try again or contact support.");
  }

  if (!session.url) {
    throw new Error("Failed to create Stripe checkout session.");
  }

  cookieStore.set(CHECKOUT_SESSION_COOKIE, session.id, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: CHECKOUT_COOKIE_MAX_AGE,
  });

  return { url: session.url };
}
