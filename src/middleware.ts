import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { rateLimit } from "@/lib/security/rate-limit";

const CANONICAL_HOST = "www.nagaclub.de";
const APEX_HOST = "nagaclub.de";
const AUTH_RATE_LIMIT = 20;
const AUTH_RATE_WINDOW_MS = 15 * 60 * 1000;

function clientIp(request: NextRequest): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    "unknown"
  );
}

export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith("/api/auth")) {
    const ip = clientIp(request);
    if (!rateLimit(`auth:${ip}`, AUTH_RATE_LIMIT, AUTH_RATE_WINDOW_MS)) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }
  }

  const host = request.headers.get("host")?.split(":")[0]?.toLowerCase() ?? "";
  const proto = request.headers.get("x-forwarded-proto");
  const isLocal =
    host === "localhost" ||
    host === "127.0.0.1" ||
    host.endsWith(".local") ||
    process.env.NODE_ENV === "development";

  if (isLocal) {
    return NextResponse.next();
  }

  const url = request.nextUrl.clone();
  let needsRedirect = false;

  if (proto === "http") {
    url.protocol = "https:";
    needsRedirect = true;
  }

  if (host === APEX_HOST) {
    url.protocol = "https:";
    url.host = CANONICAL_HOST;
    needsRedirect = true;
  }

  if (!needsRedirect) {
    const response = NextResponse.next();
    response.headers.set(
      "Strict-Transport-Security",
      "max-age=63072000; includeSubDomains; preload",
    );
    return response;
  }

  return NextResponse.redirect(url, 308);
}

export const config = {
  matcher: [
    /*
     * All routes except Next static assets and common static files.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|txt|xml)$).*)",
  ],
};
