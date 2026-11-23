import { createReadStream, statSync } from "node:fs";
import { Readable } from "node:stream";
import { NextResponse } from "next/server";
import { getNagaPlugin } from "@/lib/audio/plugins";
import {
  hostedArtifactPath,
  resolveHostedArtifact,
  type HostedPluginArtifact,
} from "@/lib/audio/plugin-files";
import { rateLimit } from "@/lib/security/rate-limit";
import { getClientIpFromHeaders } from "@/lib/security/request-client";

export const dynamic = "force-dynamic";

const FORMATS = new Set<HostedPluginArtifact["format"]>(["macVst3Au", "winVst3", "standalone"]);

export async function GET(
  request: Request,
  context: { params: Promise<{ slug: string }> },
) {
  const ip = await getClientIpFromHeaders();
  if (!rateLimit(`plugin-download:${ip}`, 20, 60_000)) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const { slug } = await context.params;
  const plugin = getNagaPlugin(slug);
  if (!plugin || plugin.pricing.kind !== "free") {
    return new NextResponse("Not found", { status: 404 });
  }

  const url = new URL(request.url);
  const format = url.searchParams.get("format") ?? "";
  if (!FORMATS.has(format as HostedPluginArtifact["format"])) {
    return new NextResponse("Invalid format", { status: 400 });
  }

  const artifact = resolveHostedArtifact(slug, format);
  if (!artifact) {
    return new NextResponse("This format is not available yet.", { status: 404 });
  }

  const filePath = hostedArtifactPath(artifact);
  let size: number;
  try {
    size = statSync(filePath).size;
  } catch {
    return new NextResponse(
      "The macOS build has not been uploaded to the server yet. Run scripts/package-naga-glue-vol2-mac.ts locally or set NEXT_PUBLIC_NAGA_GLUE_V2_DOWNLOAD_MAC_VST3AU.",
      { status: 503 },
    );
  }

  const nodeStream = createReadStream(filePath);
  const webStream = Readable.toWeb(nodeStream) as ReadableStream;

  return new NextResponse(webStream, {
    status: 200,
    headers: {
      "Content-Type": "application/zip",
      "Content-Length": String(size),
      "Content-Disposition": `attachment; filename="${artifact.downloadName}"`,
      "Cache-Control": "private, no-store",
      "X-Robots-Tag": "noindex, nofollow",
      "X-Content-Type-Options": "nosniff",
    },
  });
}