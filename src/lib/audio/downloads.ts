import type { NagaPlugin, NagaPluginDownloads, PluginDownloadKey } from "@/lib/audio/plugins";
import { hostedArtifactReady } from "@/lib/audio/plugin-files";

function envUrl(key: string | undefined): string | null {
  if (!key) return null;
  const value = process.env[key]?.trim();
  return value && value.length > 0 ? value : null;
}

function hostedDownloadPath(slug: string, format: PluginDownloadKey): string {
  return `/api/plugins/${slug}/download?format=${format}`;
}

export function resolvePluginDownloads(plugin: NagaPlugin): NagaPluginDownloads {
  const out: NagaPluginDownloads = {};
  for (const [slot, envKey] of Object.entries(plugin.downloadEnvKeys) as [
    PluginDownloadKey,
    string,
  ][]) {
    const url = envUrl(envKey);
    if (url) out[slot] = url;
  }

  if (plugin.pricing.kind === "free") {
    for (const slot of Object.keys(plugin.downloadEnvKeys) as PluginDownloadKey[]) {
      if (out[slot]) continue;
      if (hostedArtifactReady(plugin.slug, slot)) {
        out[slot] = hostedDownloadPath(plugin.slug, slot);
      }
    }
  }

  return out;
}

export function resolvePluginPurchaseUrl(plugin: NagaPlugin): string | null {
  const key = plugin.purchaseEnvKey ?? (plugin.pricing.kind === "paid" ? plugin.pricing.purchaseEnvKey : undefined);
  return envUrl(key);
}

export function downloadsReady(downloads: NagaPluginDownloads): boolean {
  return Object.values(downloads).some(Boolean);
}