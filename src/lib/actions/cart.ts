"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { and, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import {
  carts,
  cartItems,
  guests,
  productVariants,
  products,
  productImages,
  sizes,
  colors,
} from "@/lib/db/schema";
import {
  createGuestSession,
  getCurrentUser,
  guestSession,
} from "@/lib/auth/actions";
import { mergeGuestCartWithUser } from "@/lib/utils/mergeSessions";
import { normalizeImageUrl } from "@/lib/utils/images";

export type CartItemView = {
  id: string;
  variantId: string;
  productId: string;
  quantity: number;
  name: string;
  price: number;
  imageUrl: string | null;
  size?: string | null;
  color?: string | null;
  isDigital: boolean;
};

export type CartView = {
  id: string;
  items: CartItemView[];
  totalCents: number;
  requiresShipping: boolean;
};

async function resolveCartContext() {
  const user = await getCurrentUser();
  let guestToken: string | null = null;

  if (!user) {
    const guest = await guestSession();
    if (guest.sessionToken) {
      guestToken = guest.sessionToken;
    } else {
      const created = await createGuestSession();
      guestToken = created.sessionToken;
    }
  } else {
    const cookieStore = await cookies();
    guestToken = cookieStore.get("guest_session")?.value ?? null;
    if (guestToken) {
      await mergeGuestCartWithUser(user.id, guestToken);
    }
  }

  return { userId: user?.id ?? null, guestToken };
}

export async function getOrCreateCartId(): Promise<string> {
  const { userId, guestToken } = await resolveCartContext();

  if (userId) {
    const [existing] = await db
      .select()
      .from(carts)
      .where(eq(carts.userId, userId))
      .limit(1);

    if (existing) return existing.id;

    const [newCart] = await db.insert(carts).values({ userId }).returning();
    return newCart.id;
  }

  const [guest] = await db
    .select()
    .from(guests)
    .where(eq(guests.sessionToken, guestToken!))
    .limit(1);

  if (!guest) {
    const created = await createGuestSession();
    const [newGuest] = await db
      .select()
      .from(guests)
      .where(eq(guests.sessionToken, created.sessionToken))
      .limit(1);
    if (!newGuest) throw new Error("Failed to create guest session");

    const [newCart] = await db.insert(carts).values({ guestId: newGuest.id }).returning();
    return newCart.id;
  }

  const [existing] = await db
    .select()
    .from(carts)
    .where(eq(carts.guestId, guest.id))
    .limit(1);

  if (existing) return existing.id;

  const [newCart] = await db.insert(carts).values({ guestId: guest.id }).returning();
  return newCart.id;
}

const EMPTY_CART: CartView = { id: "", items: [], totalCents: 0, requiresShipping: false };

/** Read cart without creating guest sessions or empty carts (faster for /cart page loads). */
async function getCartIdIfExists(): Promise<string | null> {
  const cookieStore = await cookies();
  const guestToken = cookieStore.get("guest_session")?.value ?? null;

  if (!guestToken) {
    if (cookieStore.getAll().length === 0) return null;
    const user = await getCurrentUser();
    if (!user) return null;
    const [existing] = await db
      .select({ id: carts.id })
      .from(carts)
      .where(eq(carts.userId, user.id))
      .limit(1);
    return existing?.id ?? null;
  }

  const user = await getCurrentUser();
  if (user) {
    await mergeGuestCartWithUser(user.id, guestToken);
    const [existing] = await db
      .select({ id: carts.id })
      .from(carts)
      .where(eq(carts.userId, user.id))
      .limit(1);
    return existing?.id ?? null;
  }

  const [guest] = await db
    .select({ id: guests.id })
    .from(guests)
    .where(eq(guests.sessionToken, guestToken))
    .limit(1);

  if (!guest) return null;

  const [existing] = await db
    .select({ id: carts.id })
    .from(carts)
    .where(eq(carts.guestId, guest.id))
    .limit(1);

  return existing?.id ?? null;
}

export async function getCartWithItems(cartId: string): Promise<CartView> {
  const rows = await db
    .select({
      id: cartItems.id,
      variantId: cartItems.productVariantId,
      productId: products.id,
      quantity: cartItems.quantity,
      price: productVariants.salePrice,
      basePrice: productVariants.price,
      productName: products.name,
      isDigital: products.isDigital,
      sizeName: sizes.name,
      colorName: colors.name,
      imageUrl: productImages.url,
    })
    .from(cartItems)
    .innerJoin(productVariants, eq(productVariants.id, cartItems.productVariantId))
    .innerJoin(products, eq(products.id, productVariants.productId))
    .leftJoin(sizes, eq(sizes.id, productVariants.sizeId))
    .leftJoin(colors, eq(colors.id, productVariants.colorId))
    .leftJoin(
      productImages,
      and(eq(productImages.productId, products.id), eq(productImages.isPrimary, true)),
    )
    .where(eq(cartItems.cartId, cartId));

  const items: CartItemView[] = rows.map((row) => ({
    id: row.id,
    variantId: row.variantId,
    productId: row.productId,
    quantity: row.quantity,
    name: row.productName,
    price: Number(row.price ?? row.basePrice),
    imageUrl: normalizeImageUrl(row.imageUrl),
    size: row.sizeName,
    color: row.colorName,
    isDigital: row.isDigital,
  }));

  const totalCents = items.reduce(
    (sum, item) => sum + Math.round(item.price * 100) * item.quantity,
    0,
  );

  return {
    id: cartId,
    items,
    totalCents,
    requiresShipping: items.some((item) => !item.isDigital),
  };
}

export async function getCurrentCart(): Promise<CartView> {
  const cartId = await getCartIdIfExists();
  if (!cartId) return EMPTY_CART;
  return getCartWithItems(cartId);
}

export async function addToCart(variantId: string, quantity = 1) {
  const cartId = await getOrCreateCartId();

  const [variant] = await db
    .select({ inStock: productVariants.inStock })
    .from(productVariants)
    .where(eq(productVariants.id, variantId))
    .limit(1);

  if (!variant || (variant.inStock ?? 0) <= 0) {
    return { ok: false, error: "This item is sold out." };
  }

  const [existing] = await db
    .select()
    .from(cartItems)
    .where(
      and(
        eq(cartItems.cartId, cartId),
        eq(cartItems.productVariantId, variantId),
      ),
    )
    .limit(1);

  const nextQuantity = (existing?.quantity ?? 0) + quantity;
  if (nextQuantity > (variant.inStock ?? 0)) {
    return { ok: false, error: "Not enough stock available." };
  }

  if (existing) {
    await db
      .update(cartItems)
      .set({ quantity: existing.quantity + quantity })
      .where(eq(cartItems.id, existing.id));
  } else {
    await db.insert(cartItems).values({
      cartId,
      productVariantId: variantId,
      quantity,
    });
  }

  await db.update(carts).set({ updatedAt: new Date() }).where(eq(carts.id, cartId));

  revalidatePath("/cart");
  revalidatePath("/", "layout");

  return { ok: true, cartId };
}

export async function updateCartItemQuantity(cartItemId: string, quantity: number) {
  if (quantity <= 0) {
    await db.delete(cartItems).where(eq(cartItems.id, cartItemId));
    return { ok: true };
  }

  await db.update(cartItems).set({ quantity }).where(eq(cartItems.id, cartItemId));
  return { ok: true };
}

export async function removeCartItem(cartItemId: string) {
  await db.delete(cartItems).where(eq(cartItems.id, cartItemId));
  return { ok: true };
}

export async function clearCart(cartId: string) {
  await db.delete(cartItems).where(eq(cartItems.cartId, cartId));
  return { ok: true };
}
