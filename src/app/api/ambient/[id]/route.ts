import { NextRequest, NextResponse } from "next/server";
import { isAmbientTrackId } from "@/lib/ambient/catalog";
import { openAmbientStream, resolveAmbientFile } from "@/lib/ambient/files";
import { isAllowedAmbientRequest } from "@/lib/ambient/request-guard";
import {
  AMBIENT_SESSION_COOKIE,
  verifyAmbientToken,
} from "@/lib/ambient/sign";
import { rateLimit } from "@/lib/security/rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const STREAM_LIMIT = 120;
const STREAM_WINDOW_MS = 60_000;

type RouteContext = {
  params: Promise<{ id: string }>;
};

function clientIp(request: NextRequest): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    "unknown"
  );
}

function parseRange(
  header: string | null,
  size: number,
): { start: number; end: number } | null {
  if (!header?.startsWith("bytes=")) return null;
  const [startRaw, endRaw] = header.slice(6).split("-", 2);
  const start = Number(startRaw);
  const end = endRaw ? Number(endRaw) : size - 1;
  if (!Number.isFinite(start) || !Number.isFinite(end)) return null;
  if (start < 0 || end < start || end >= size) return null;
  return { start, end };
}

/** Stream a protected ambient track — requires signed token + session cookie. */
export async function GET(request: NextRequest, context: RouteContext) {
  if (!isAllowedAmbientRequest(request)) {
    return new NextResponse("Forbidden", { status: 403 });
  }

  const ip = clientIp(request);
  if (!rateLimit(`ambient-stream:${ip}`, STREAM_LIMIT, STREAM_WINDOW_MS)) {
    return new NextResponse("Too many requests", { status: 429 });
  }

  const { id: rawId } = await context.params;
  const id = rawId?.trim() ?? "";
  if (!isAmbientTrackId(id)) {
    return new NextResponse("Not found", { status: 404 });
  }

  const token = request.nextUrl.searchParams.get("t")?.trim() ?? "";
  const sid = request.cookies.get(AMBIENT_SESSION_COOKIE)?.value ?? "";
  if (!token || !sid || !verifyAmbientToken(token, id, sid)) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const file = resolveAmbientFile(id);
  if (!file) {
    return new NextResponse("Not found", { status: 404 });
  }

  const range = parseRange(request.headers.get("range"), file.size);
  const commonHeaders: HeadersInit = {
    "Content-Type": "audio/mpeg",
    "Accept-Ranges": "bytes",
    "Cache-Control": "private, no-store, no-transform",
    "X-Content-Type-Options": "nosniff",
    "X-Robots-Tag": "noindex, nofollow",
    // Opaque filename — discourage Save As with track titles
    "Content-Disposition": 'inline; filename="naga-ambient.mp3"',
    "Cross-Origin-Resource-Policy": "same-origin",
  };

  if (range) {
    const { start, end } = range;
    const chunkSize = end - start + 1;
    return new NextResponse(openAmbientStream(file.absolutePath, start, end), {
      status: 206,
      headers: {
        ...commonHeaders,
        "Content-Length": String(chunkSize),
        "Content-Range": `bytes ${start}-${end}/${file.size}`,
      },
    });
  }

  return new NextResponse(openAmbientStream(file.absolutePath), {
    status: 200,
    headers: {
      ...commonHeaders,
      "Content-Length": String(file.size),
    },
  });
}

/** Headers-only probe — no body (blocks casual HEAD scrapers from tying up streams). */
export async function HEAD(request: NextRequest, context: RouteContext) {
  if (!isAllowedAmbientRequest(request)) {
    return new NextResponse(null, { status: 403 });
  }

  const { id: rawId } = await context.params;
  const id = rawId?.trim() ?? "";
  if (!isAmbientTrackId(id)) {
    return new NextResponse(null, { status: 404 });
  }

  const token = request.nextUrl.searchParams.get("t")?.trim() ?? "";
  const sid = request.cookies.get(AMBIENT_SESSION_COOKIE)?.value ?? "";
  if (!token || !sid || !verifyAmbientToken(token, id, sid)) {
    return new NextResponse(null, { status: 401 });
  }

  const file = resolveAmbientFile(id);
  if (!file) {
    return new NextResponse(null, { status: 404 });
  }

  return new NextResponse(null, {
    status: 200,
    headers: {
      "Content-Type": "audio/mpeg",
      "Accept-Ranges": "bytes",
      "Content-Length": String(file.size),
      "Cache-Control": "private, no-store, no-transform",
      "X-Content-Type-Options": "nosniff",
      "X-Robots-Tag": "noindex, nofollow",
      "Content-Disposition": 'inline; filename="naga-ambient.mp3"',
      "Cross-Origin-Resource-Policy": "same-origin",
    },
  });
}
