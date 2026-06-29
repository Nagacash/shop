import { and, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { carts, cartItems, guests } from "@/lib/db/schema";

export async function mergeGuestCartWithUser(
  userId: string,
  guestSessionToken: string,
): Promise<string | null> {
  const [guest] = await db
    .select()
    .from(guests)
    .where(eq(guests.sessionToken, guestSessionToken))
    .limit(1);

  if (!guest) return null;

  const [guestCart] = await db
    .select()
    .from(carts)
    .where(eq(carts.guestId, guest.id))
    .limit(1);

  if (!guestCart) return null;

  const [userCart] = await db
    .select()
    .from(carts)
    .where(eq(carts.userId, userId))
    .limit(1);

  if (!userCart) {
    await db
      .update(carts)
      .set({ userId, guestId: null, updatedAt: new Date() })
      .where(eq(carts.id, guestCart.id));
    return guestCart.id;
  }

  const guestItems = await db
    .select()
    .from(cartItems)
    .where(eq(cartItems.cartId, guestCart.id));

  for (const item of guestItems) {
    const [existing] = await db
      .select()
      .from(cartItems)
      .where(
        and(
          eq(cartItems.cartId, userCart.id),
          eq(cartItems.productVariantId, item.productVariantId),
        ),
      )
      .limit(1);

    if (existing) {
      await db
        .update(cartItems)
        .set({ quantity: existing.quantity + item.quantity })
        .where(eq(cartItems.id, existing.id));
    } else {
      await db.insert(cartItems).values({
        cartId: userCart.id,
        productVariantId: item.productVariantId,
        quantity: item.quantity,
      });
    }
  }

  await db.delete(cartItems).where(eq(cartItems.cartId, guestCart.id));
  await db.delete(carts).where(eq(carts.id, guestCart.id));

  await db
    .update(carts)
    .set({ updatedAt: new Date() })
    .where(eq(carts.id, userCart.id));

  return userCart.id;
}
