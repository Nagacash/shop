/** Ambient playlist — files live in `/private/ambient` (not publicly downloadable). */
export const AMBIENT_TRACK_IDS = ["viby", "sombra"] as const;

export type AmbientTrackId = (typeof AMBIENT_TRACK_IDS)[number];

export type AmbientTrack = {
  id: AmbientTrackId;
  title: string;
  artist: string;
  /** Filename under private/ambient — never expose publicly */
  file: string;
};

export const AMBIENT_TRACK_CATALOG: Record<AmbientTrackId, AmbientTrack> = {
  viby: {
    id: "viby",
    title: "Viby",
    artist: "ShortLord · 95bpm",
    file: "viby.mp3",
  },
  sombra: {
    id: "sombra",
    title: "Sombra de Tambora",
    artist: "ShortLord",
    file: "sombra.mp3",
  },
};

/** Public client metadata only — no file paths. */
export const AMBIENT_TRACKS = AMBIENT_TRACK_IDS.map((id) => {
  const track = AMBIENT_TRACK_CATALOG[id];
  return {
    id: track.id,
    title: track.title,
    artist: track.artist,
  };
});

export function isAmbientTrackId(value: string): value is AmbientTrackId {
  return (AMBIENT_TRACK_IDS as readonly string[]).includes(value);
}

/** @deprecated Prefer AMBIENT_TRACKS */
export const AMBIENT_TRACK = AMBIENT_TRACKS[0];
