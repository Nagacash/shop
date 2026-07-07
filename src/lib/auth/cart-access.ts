import "server-only";

import { cookies } from "next/headers";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { carts, cartItems, guests } from "@/lib/db/schema";
import { getCurrentUser } from "@/lib/auth/actions";

type CartScope = {
  userId: string | null;
  guestId: string | null;
};

export async function getSessionCartScope(): Promise<CartScope> {
  const user = await getCurrentUser();
  if (user) {
    return { userId: user.id, guestId: null };
  }

  const cookieStore = await cookies();
  const guestToken = cookieStore.get("guest_session")?.value;
  if (!guestToken) {
    return { userId: null, guestId: null };
  }

  const [guest] = await db
    .select({ id: guests.id })
    .from(guests)
    .where(eq(guests.sessionToken, guestToken))
    .limit(1);

  return { userId: null, guestId: guest?.id ?? null };
}

function cartMatchesScope(
  cart: { userId: string | null; guestId: string | null },
  scope: CartScope,
): boolean {
  if (scope.userId && cart.userId === scope.userId) return true;
  if (scope.guestId && cart.guestId === scope.guestId) return true;
  return false;
}

export async function assertCartOwnedBySession(cartId: string): Promise<void> {
  const scope = await getSessionCartScope();
  if (!scope.userId && !scope.guestId) {
    throw new Error("Unauthorized");
  }

  const [cart] = await db
    .select({ userId: carts.userId, guestId: carts.guestId })
    .from(carts)
    .where(eq(carts.id, cartId))
    .limit(1);

  if (!cart || !cartMatchesScope(cart, scope)) {
    throw new Error("Unauthorized");
  }
}

export async function assertCartItemOwnedBySession(cartItemId: string): Promise<void> {
  const [row] = await db
    .select({ cartId: cartItems.cartId })
    .from(cartItems)
    .where(eq(cartItems.id, cartItemId))
    .limit(1);

  if (!row) {
    throw new Error("Cart item not found.");
  }

  await assertCartOwnedBySession(row.cartId);
}
