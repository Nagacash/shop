import "server-only";

import { createHmac, timingSafeEqual } from "node:crypto";
import { and, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { orderItems, orders, payments, productVariants, products } from "@/lib/db/schema";
import { isProducerPackSku } from "@/lib/digital/pack";
import { openPackStream, readProducerPackFile } from "@/lib/digital/files";
import { getStripeClient } from "@/lib/stripe/client";

const TOKEN_TTL_MS = 30 * 24 * 60 * 60 * 1000;

function mediaSecret(): string {
  const secret =
    process.env.AMBIENT_MEDIA_SECRET?.trim() ||
    process.env.BETTER_AUTH_SECRET?.trim();

  if (secret && secret.length >= 16) return secret;

  if (process.env.NODE_ENV === "production") {
    throw new Error("AMBIENT_MEDIA_SECRET or BETTER_AUTH_SECRET is required");
  }

  return "dev-digital-download-secret";
}

function signPayload(payload: string): string {
  return createHmac("sha256", mediaSecret()).update(payload).digest("base64url");
}

function safeEqual(a: string, b: string): boolean {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  if (left.length !== right.length) return false;
  return timingSafeEqual(left, right);
}

export function createProducerPackDownloadToken(
  orderId: string,
  variantId: string,
  now = Date.now(),
): string {
  const exp = now + TOKEN_TTL_MS;
  const payload = `${orderId}.${variantId}.${exp}`;
  return `${payload}.${signPayload(payload)}`;
}

export function verifyProducerPackDownloadToken(
  token: string,
  orderId: string,
  variantId: string,
  now = Date.now(),
): boolean {
  const parts = token.split(".");
  if (parts.length !== 4) return false;

  const [tokenOrderId, tokenVariantId, expRaw, sig] = parts;
  if (!tokenOrderId || !tokenVariantId || !expRaw || !sig) return false;
  if (tokenOrderId !== orderId || tokenVariantId !== variantId) return false;

  const exp = Number(expRaw);
  if (!Number.isFinite(exp) || now > exp) return false;

  const payload = `${tokenOrderId}.${tokenVariantId}.${expRaw}`;
  return safeEqual(sig, signPayload(payload));
}

export function producerPackDownloadPath(orderId: string, variantId: string): string {
  const token = createProducerPackDownloadToken(orderId, variantId);
  const params = new URLSearchParams({ variant: variantId, t: token });
  return `/api/downloads/${orderId}?${params.toString()}`;
}

export type PaidDownload =
  | {
      ok: true;
      filename: string;
      size: number;
      stream: ReadableStream<Uint8Array>;
    }
  | { ok: false; status: number; message: string };

/** Serve the pack only when the signed link matches an order Stripe has marked paid. */
export async function openPaidProducerPackDownload(input: {
  orderId: string;
  variantId: string;
  token: string;
}): Promise<PaidDownload> {
  if (!verifyProducerPackDownloadToken(input.token, input.orderId, input.variantId)) {
    return { ok: false, status: 403, message: "This download link is not valid." };
  }

  const [row] = await db
    .select({
      orderStatus: orders.status,
      paymentStatus: payments.status,
      stripeSessionId: payments.transactionId,
      sku: productVariants.sku,
      isDigital: products.isDigital,
    })
    .from(orderItems)
    .innerJoin(orders, eq(orders.id, orderItems.orderId))
    .innerJoin(productVariants, eq(productVariants.id, orderItems.productVariantId))
    .innerJoin(products, eq(products.id, productVariants.productId))
    .leftJoin(payments, eq(payments.orderId, orders.id))
    .where(
      and(eq(orderItems.orderId, input.orderId), eq(orderItems.productVariantId, input.variantId)),
    )
    .limit(1);

  if (
    !row ||
    !row.isDigital ||
    !isProducerPackSku(row.sku) ||
    row.orderStatus !== "paid" ||
    row.paymentStatus !== "completed" ||
    !row.stripeSessionId
  ) {
    return { ok: false, status: 403, message: "This order is not paid." };
  }

  const session = await getStripeClient().checkout.sessions.retrieve(row.stripeSessionId);
  if (session.payment_status !== "paid") {
    return { ok: false, status: 403, message: "Stripe has not marked this order paid." };
  }

  const file = readProducerPackFile();
  if (!file.ok) {
    return { ok: false, status: 404, message: file.message };
  }

  return {
    ok: true,
    filename: "naga-producer-pack-volume1.zip",
    size: file.size,
    stream: openPackStream(file.absolutePath),
  };
}
