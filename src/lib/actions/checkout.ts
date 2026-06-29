"use server";

import { getCartWithItems } from "@/lib/actions/cart";
import { getCurrentUser } from "@/lib/auth/actions";
import { mergeGuestCartWithUser } from "@/lib/utils/mergeSessions";
import { cookies } from "next/headers";
import { getStripeClient, dollarsToCents } from "@/lib/stripe/client";

const appUrl = process.env.BETTER_AUTH_URL ?? "http://localhost:3000";

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

  const lineItems = cart.items.map((item) => ({
    price_data: {
      currency: "usd",
      product_data: {
        name: item.name,
        images: item.imageUrl ? [`${appUrl}${item.imageUrl}`] : undefined,
        metadata: {
          variantId: item.variantId,
        },
      },
      unit_amount: dollarsToCents(item.price),
    },
    quantity: item.quantity,
  }));

  const session = await getStripeClient().checkout.sessions.create({
    mode: "payment",
    line_items: lineItems,
    success_url: `${appUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${appUrl}/cart`,
    metadata: {
      cartId,
      userId: user?.id ?? "",
    },
  });

  if (!session.url) {
    throw new Error("Failed to create Stripe checkout session.");
  }

  return { url: session.url };
}
