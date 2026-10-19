import { NextResponse } from "next/server";
import { PRODUCER_PACK_FILENAME } from "@/lib/digital/pack";
import { openPaidProducerPackDownload } from "@/lib/digital/grant";
import { rateLimit } from "@/lib/security/rate-limit";
import { getClientIpFromHeaders } from "@/lib/security/request-client";

export const dynamic = "force-dynamic";

const UUID =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function GET(
  request: Request,
  context: { params: Promise<{ orderId: string }> },
) {
  const ip = await getClientIpFromHeaders();
  if (!rateLimit(`download:${ip}`, 30, 60_000)) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const { orderId } = await context.params;
  const url = new URL(request.url);
  const variantId = url.searchParams.get("variant") ?? "";
  const token = url.searchParams.get("t") ?? "";

  if (!UUID.test(orderId) || !UUID.test(variantId) || !token) {
    return new NextResponse("This download link is not valid.", { status: 403 });
  }

  try {
    const result = await openPaidProducerPackDownload({ orderId, variantId, token });
    if (!result.ok) {
      return new NextResponse(result.message, {
        status: result.status,
        headers: { "Cache-Control": "private, no-store", "X-Robots-Tag": "noindex, nofollow" },
      });
    }

    return new NextResponse(result.stream, {
      status: 200,
      headers: {
        "Content-Type": "application/zip",
        "Content-Length": String(result.size),
        "Content-Disposition": `attachment; filename="${PRODUCER_PACK_FILENAME}"`,
        "Cache-Control": "private, no-store",
        "X-Robots-Tag": "noindex, nofollow",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (err) {
    console.error("[download] paid pack failed", err);
    return new NextResponse("We could not prepare this download.", { status: 500 });
  }
}
