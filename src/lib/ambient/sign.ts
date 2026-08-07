import { createHmac, timingSafeEqual } from "node:crypto";

const TOKEN_TTL_MS = 90_000;

function mediaSecret(): string {
  const secret =
    process.env.AMBIENT_MEDIA_SECRET?.trim() ||
    process.env.BETTER_AUTH_SECRET?.trim();

  if (secret && secret.length >= 16) return secret;

  if (process.env.NODE_ENV === "production") {
    throw new Error("AMBIENT_MEDIA_SECRET or BETTER_AUTH_SECRET is required");
  }

  return "dev-ambient-media-secret";
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

export type AmbientTokenClaims = {
  id: string;
  exp: number;
  sid: string;
};

export function createAmbientToken(id: string, sid: string, now = Date.now()): {
  token: string;
  exp: number;
} {
  const exp = now + TOKEN_TTL_MS;
  const payload = `${id}.${exp}.${sid}`;
  return { token: `${payload}.${signPayload(payload)}`, exp };
}

export function verifyAmbientToken(
  token: string,
  expectedId: string,
  sid: string,
  now = Date.now(),
): boolean {
  const parts = token.split(".");
  if (parts.length !== 4) return false;

  const [id, expRaw, tokenSid, sig] = parts;
  if (!id || !expRaw || !tokenSid || !sig) return false;
  if (id !== expectedId || tokenSid !== sid) return false;

  const exp = Number(expRaw);
  if (!Number.isFinite(exp) || now > exp) return false;

  const payload = `${id}.${expRaw}.${tokenSid}`;
  const expected = signPayload(payload);
  return safeEqual(sig, expected);
}

export const AMBIENT_SESSION_COOKIE = "naga_ambient_sid";
export const AMBIENT_TOKEN_TTL_MS = TOKEN_TTL_MS;
