import { NextRequest } from "next/server";
import { getSiteUrl } from "@/lib/seo/site";

/** Block hotlinks / address-bar downloads; allow <audio> and same-origin fetch. */
export function isAllowedAmbientRequest(request: NextRequest): boolean {
  const dest = request.headers.get("sec-fetch-dest");
  if (dest === "document" || dest === "embed" || dest === "iframe" || dest === "object") {
    return false;
  }

  const site = safeOrigin(getSiteUrl());
  const origin = request.headers.get("origin");
  if (origin) {
    return safeOrigin(origin) === site || isLocalOrigin(origin);
  }

  const referer = request.headers.get("referer");
  if (referer) {
    try {
      const refOrigin = new URL(referer).origin;
      return safeOrigin(refOrigin) === site || isLocalOrigin(refOrigin);
    } catch {
      return false;
    }
  }

  // <audio> often omits Origin; Sec-Fetch-Site same-origin is enough
  const siteFetch = request.headers.get("sec-fetch-site");
  if (siteFetch === "same-origin" || siteFetch === "none") return true;

  // Local / older browsers without Fetch Metadata
  if (process.env.NODE_ENV !== "production") return true;

  return false;
}

function safeOrigin(value: string): string {
  try {
    return new URL(value).origin;
  } catch {
    return value.replace(/\/$/, "");
  }
}

function isLocalOrigin(origin: string): boolean {
  try {
    const host = new URL(origin).hostname;
    return host === "localhost" || host === "127.0.0.1" || host.endsWith(".local");
  } catch {
    return false;
  }
}
