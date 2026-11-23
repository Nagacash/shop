import { existsSync } from "node:fs";
import path from "node:path";

/** Hosted plugin archives live here — never commit binaries; see .gitignore */
export const PLUGIN_DIST_DIR = path.join(process.cwd(), "private", "digital");

export type HostedPluginArtifact = {
  slug: string;
  format: "macVst3Au" | "winVst3" | "standalone";
  filename: string;
  downloadName: string;
};

export const HOSTED_PLUGIN_ARTIFACTS: readonly HostedPluginArtifact[] = [
  {
    slug: "naga-glue-vol-2",
    format: "macVst3Au",
    filename: "naga-glue-vol-2-macos-vst3-au.zip",
    downloadName: "Naga-Glue-Vol-2-macOS-VST3-AU.zip",
  },
];

export function resolveHostedArtifact(slug: string, format: string): HostedPluginArtifact | null {
  return HOSTED_PLUGIN_ARTIFACTS.find((a) => a.slug === slug && a.format === format) ?? null;
}

export function hostedArtifactPath(artifact: HostedPluginArtifact): string {
  const absolute = path.join(PLUGIN_DIST_DIR, artifact.filename);
  if (!absolute.startsWith(PLUGIN_DIST_DIR + path.sep)) {
    throw new Error("Invalid plugin artifact path");
  }
  return absolute;
}

export function hostedArtifactReady(slug: string, format: HostedPluginArtifact["format"]): boolean {
  const artifact = resolveHostedArtifact(slug, format);
  if (!artifact) return false;
  return existsSync(hostedArtifactPath(artifact));
}