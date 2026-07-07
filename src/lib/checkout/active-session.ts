import "server-only";

import { cookies } from "next/headers";
import { CHECKOUT_SESSION_COOKIE } from "@/lib/checkout/constants";

export async function hasActiveCheckoutSession(): Promise<boolean> {
  const cookieStore = await cookies();
  return Boolean(cookieStore.get(CHECKOUT_SESSION_COOKIE)?.value);
}
