"use server";

import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { db } from "@/lib/db";
import { orders, payments } from "@/lib/db/schema";
import { CHECKOUT_SESSION_COOKIE } from "@/lib/checkout/constants";
import { getCurrentUser } from "@/lib/auth/actions";
import {
  createOrderFromStripeSession,
  getOrderByStripeSessionId,
} from "@/lib/orders/service";
import type { OrderView } from "@/lib/orders/types";

export type { OrderItemView, OrderView } from "@/lib/orders/types";

async function canAccessCheckoutOrder(stripeSessionId: string): Promise<boolean> {
  const cookieStore = await cookies();
  const checkoutCookie = cookieStore.get(CHECKOUT_SESSION_COOKIE)?.value;
  if (checkoutCookie === stripeSessionId) {
    return true;
  }

  const user = await getCurrentUser();
  if (!user) {
    return false;
  }

  const [row] = await db
    .select({ userId: orders.userId })
    .from(orders)
    .innerJoin(payments, eq(payments.orderId, orders.id))
    .where(eq(payments.transactionId, stripeSessionId))
    .limit(1);

  return row?.userId === user.id;
}

/** Load or create order for checkout success — only if session belongs to this browser/user. */
export async function getOrderForCheckoutSuccess(
  stripeSessionId: string,
): Promise<OrderView | null> {
  if (!(await canAccessCheckoutOrder(stripeSessionId))) {
    return null;
  }

  let order = await getOrderByStripeSessionId(stripeSessionId);

  if (!order) {
    try {
      order = await createOrderFromStripeSession(stripeSessionId);
    } catch {
      return null;
    }
  }

  const cookieStore = await cookies();
  cookieStore.delete(CHECKOUT_SESSION_COOKIE);

  return order;
}
