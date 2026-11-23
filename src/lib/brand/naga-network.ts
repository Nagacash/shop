/** Naga Codex — web design, AI, and security studio (built this store). */
export const NAGA_CODEX_URL = "https://www.nagacodex.cloud/";

/** Fascher Bros — Naga Films feature in production (Star-Club / Reeperbahn). */
export const FASCHER_BROS = {
  name: "Fascher Bros",
  url: "https://fascherbros.com",
  label: "Naga Films",
  status: "In production",
  tagline: "Könige von St. Pauli",
  description:
    "Feature film project on the Fascher brothers, the Star-Club, and the Reeperbahn — Beatles, Billy Preston, Little Richard. Currently working on getting the movie on board and made.",
} as const;

export type Woodland360Episode = {
  guest: string;
  title: string;
  part: string;
  youtubeId: string;
  watchUrl: string;
  /** When the round is hosted by someone other than the show default */
  episodeHost?: string;
};

export const WOODLAND360_EPISODES: readonly Woodland360Episode[] = [
  {
    guest: "Haji Brown",
    title: "Woodland 360 Podcast",
    part: "1st part · hosted by ShortLord",
    episodeHost: "ShortLord",
    youtubeId: "LaP3yBTWXhw",
    watchUrl: "https://www.youtube.com/watch?v=LaP3yBTWXhw",
  },
  {
    guest: "Lyn T",
    title: "Born in Liberia & Raised a Diplomat's Son",
    part: "The Untold Story — Part 1",
    episodeHost: "Maurice Holda",
    youtubeId: "kFymYp734yk",
    watchUrl: "https://www.youtube.com/watch?v=kFymYp734yk",
  },
] as const;

export const WOODLAND360_PODCAST = {
  name: "Woodland 360",
  tagline: "Urban culture · Hamburg frequency",
  description:
    "Street-level conversations on creative sovereignty, counter-culture, tech, and city life — recorded in the round, mixed for the night drive.",
  host: "Maurice Holda",
  studio: "Naga Codex",
  tags: ["Street culture", "Creative tech", "City life", "Night frequency"] as const,
  episodes: WOODLAND360_EPISODES,
  featuredEpisode: WOODLAND360_EPISODES[0],
} as const;

export function woodland360EmbedUrl(youtubeId: string): string {
  return `https://www.youtube-nocookie.com/embed/${youtubeId}?rel=0&modestbranding=1&playsinline=1`;
}
