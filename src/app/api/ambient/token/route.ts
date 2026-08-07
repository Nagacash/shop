import { randomBytes } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { isAmbientTrackId } from "@/lib/ambient/catalog";
import { isAllowedAmbientRequest } from "@/lib/ambient/request-guard";
import {
  AMBIENT_SESSION_COOKIE,
  createAmbientToken,
} from "@/lib/ambient/sign";
import { rateLimit } from "@/lib/security/rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const TOKEN_LIMIT = 40;
const TOKEN_WINDOW_MS = 60_000;

function clientIp(request: NextRequest): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    "unknown"
  );
}

function readOrCreateSession(request: NextRequest): {
  sid: string;
  setCookie: boolean;
} {
  const existing = request.cookies.get(AMBIENT_SESSION_COOKIE)?.value;
  if (existing && /^[a-zA-Z0-9_-]{16,64}$/.test(existing)) {
    return { sid: existing, setCookie: false };
  }
  return { sid: randomBytes(24).toString("base64url"), setCookie: true };
}

/** Mint a short-lived, session-bound stream URL for one ambient track. */
export async function GET(request: NextRequest) {
  if (!isAllowedAmbientRequest(request)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const ip = clientIp(request);
  if (!rateLimit(`ambient-token:${ip}`, TOKEN_LIMIT, TOKEN_WINDOW_MS)) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const id = request.nextUrl.searchParams.get("id")?.trim() ?? "";
  if (!isAmbientTrackId(id)) {
    return NextResponse.json({ error: "Unknown track" }, { status: 404 });
  }

  const { sid, setCookie } = readOrCreateSession(request);
  const { token, exp } = createAmbientToken(id, sid);
  const src = `/api/ambient/${id}?t=${encodeURIComponent(token)}`;

  const response = NextResponse.json(
    { src, exp },
    {
      headers: {
        "Cache-Control": "private, no-store",
        "X-Robots-Tag": "noindex, nofollow",
      },
    },
  );

  if (setCookie) {
    response.cookies.set({
      name: AMBIENT_SESSION_COOKIE,
      value: sid,
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
      path: "/api/ambient",
      maxAge: 60 * 60 * 12,
    });
  }

  return response;
}
