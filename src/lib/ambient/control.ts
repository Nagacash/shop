export const STOP_SITE_MUSIC_EVENT = "naga:stop-site-music";

export function stopSiteMusic() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(STOP_SITE_MUSIC_EVENT));
}
