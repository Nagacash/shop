import "server-only";

import { cookies } from "next/headers";
import { CHECKOUT_SESSION_COOKIE } from "@/lib/checkout/constants";

export async function hasActiveCheckoutSession(): Promise<boolean> {
  const cookieStore = await cookies();
  return Boolean(cookieStore.get(CHECKOUT_SESSION_COOKIE)?.value);
}

/** Abandoned checkout — unlock cart edits when the shopper is back on /cart. */
export async function clearCheckoutSessionCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(CHECKOUT_SESSION_COOKIE);
}
