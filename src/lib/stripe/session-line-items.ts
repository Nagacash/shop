import "server-only";

import { getStripeClient } from "@/lib/stripe/client";

export type FulfillmentLineItem = {
  variantId: string;
  quantity: number;
  unitPriceCents: number;
};

/** Line items the customer actually paid for — source of truth for fulfillment. */
export async function loadFulfillmentLineItems(
  stripeSessionId: string,
): Promise<FulfillmentLineItem[]> {
  const stripe = getStripeClient();
  const items: FulfillmentLineItem[] = [];
  let startingAfter: string | undefined;

  while (true) {
    const page = await stripe.checkout.sessions.listLineItems(stripeSessionId, {
      limit: 100,
      starting_after: startingAfter,
      expand: ["data.price.product"],
    });

    for (const line of page.data) {
      const product = line.price?.product;
      const variantId =
        product && typeof product === "object" && "metadata" in product
          ? product.metadata?.variantId
          : undefined;

      if (!variantId) {
        throw new Error("Missing variantId in Stripe line item metadata.");
      }

      items.push({
        variantId,
        quantity: line.quantity ?? 1,
        unitPriceCents: line.price?.unit_amount ?? 0,
      });
    }

    if (!page.has_more) break;
    startingAfter = page.data[page.data.length - 1]?.id;
  }

  if (!items.length) {
    throw new Error("No line items in Stripe session.");
  }

  return items;
}
