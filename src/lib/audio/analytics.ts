/**
 * Plugin download click tracking — wire to your analytics provider here.
 * (No analytics SDK is installed in this project today.)
 */
export type PluginDownloadEvent = {
  pluginSlug: string;
  format: string;
  free: boolean;
};

export function trackPluginDownload(event: PluginDownloadEvent): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent("naga:plugin-download", {
      detail: event,
    }),
  );
}