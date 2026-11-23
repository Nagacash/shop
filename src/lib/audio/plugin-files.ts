import { existsSync } from "node:fs";
import path from "node:path";

/** Local dev / server-served archives (gitignored) */
export const PLUGIN_DIST_DIR = path.join(process.cwd(), "private", "digital");

/** Deployed with the site — see public/downloads/plugins/README.md */
export const PLUGIN_PUBLIC_RELEASE_DIR = path.join(process.cwd(), "public", "downloads", "plugins");

export type HostedPluginArtifact = {
  slug: string;
  format: "macVst3Au" | "winVst3" | "standalone";
  filename: string;
  downloadName: string;
  /** Static URL served from public/ (works on Vercel when zip is committed or uploaded). */
  publicUrl: string;
};

export const HOSTED_PLUGIN_ARTIFACTS: readonly HostedPluginArtifact[] = [
  {
    slug: "naga-glue-vol-2",
    format: "macVst3Au",
    filename: "naga-glue-vol-2-macos-vst3-au.zip",
    downloadName: "Naga-Glue-Vol-2-macOS-VST3-AU.zip",
    publicUrl: "/downloads/plugins/naga-glue-vol-2-macos-vst3-au.zip",
  },
];

export function resolveHostedArtifact(slug: string, format: string): HostedPluginArtifact | null {
  return HOSTED_PLUGIN_ARTIFACTS.find((a) => a.slug === slug && a.format === format) ?? null;
}

function assertInsideRoot(filePath: string, root: string) {
  const resolved = path.resolve(filePath);
  const base = path.resolve(root);
  if (resolved !== base && !resolved.startsWith(base + path.sep)) {
    throw new Error("Invalid plugin artifact path");
  }
  return resolved;
}

export function hostedArtifactPrivatePath(artifact: HostedPluginArtifact): string {
  return assertInsideRoot(path.join(PLUGIN_DIST_DIR, artifact.filename), PLUGIN_DIST_DIR);
}

export function hostedArtifactPublicPath(artifact: HostedPluginArtifact): string {
  return assertInsideRoot(path.join(PLUGIN_PUBLIC_RELEASE_DIR, artifact.filename), PLUGIN_PUBLIC_RELEASE_DIR);
}

/** Prefer public release (deploy), then private (local dev). */
export function resolveHostedArtifactFile(artifact: HostedPluginArtifact): string | null {
  const publicPath = hostedArtifactPublicPath(artifact);
  if (existsSync(publicPath)) return publicPath;

  const privatePath = hostedArtifactPrivatePath(artifact);
  if (existsSync(privatePath)) return privatePath;

  return null;
}

export function hostedArtifactReady(slug: string, format: HostedPluginArtifact["format"]): boolean {
  const artifact = resolveHostedArtifact(slug, format);
  if (!artifact) return false;
  return resolveHostedArtifactFile(artifact) !== null;
}