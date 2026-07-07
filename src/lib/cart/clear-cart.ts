import "server-only";

import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { cartItems } from "@/lib/db/schema";

/** Internal — only call after order fulfillment. Not a server action. */
export async function clearCartItems(cartId: string): Promise<void> {
  await db.delete(cartItems).where(eq(cartItems.cartId, cartId));
}
