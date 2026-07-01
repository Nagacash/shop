/** Real product/collection covers — override generated brand assets where needed. */
export const COLLECTION_COVER_OVERRIDES: Record<string, string> = {
  "black-gold-edition": "/hoodie/gold-front.jpg",
};

/** Real marketing photography — used on homepage, contact, and brand sections. */
export const MARKETING_IMAGES = {
  /** Model in Naga Original hoodie, Berlin TV Tower, golden hour */
  berlinLifestyle: "/hoodie/berlin-naga.jpeg",
  /** Black hoodie flat lay — Naga Original + Hustle Hard */
  hoodieFlatLay: "/website-images/website-naga.jpeg",
  /** Macro cobra logo print on black fabric */
  logoDetail: "/website-images/website-naga2.jpeg",
  /** Brand mood visual — not a catalog product */
  nagaPurse: "/website-images/naga-purse.jpeg",
} as const;

export type HeroBackgroundClip = {
  mp4: string;
  webm?: string;
  objectPosition: string;
  /** Tailwind translate class for asymmetric vertical offset */
  offsetClass?: string;
};

/** Homepage hero — temple clips left/center, flat lay right (under portrait card). */
export const HERO_BACKGROUND_CLIPS: HeroBackgroundClip[] = [
  {
    mp4: "/hero-clips/hero1.mp4",
    webm: "/hero-clips/hero1.webm",
    objectPosition: "center",
    offsetClass: "lg:translate-y-4",
  },
  {
    mp4: "/hero-clips/hero2.mp4",
    webm: "/hero-clips/hero2.webm",
    objectPosition: "center",
    offsetClass: "lg:-translate-y-6",
  },
  {
    mp4: "/website-images/hero-bg.mp4",
    webm: "/website-images/hero-bg.webm",
    objectPosition: "center",
    offsetClass: "lg:translate-y-3",
  },
];

export const HERO_BACKGROUND_VIDEO = {
  poster: MARKETING_IMAGES.hoodieFlatLay,
  clips: HERO_BACKGROUND_CLIPS,
} as const;

export const MARKETING_ALT = {
  berlinLifestyle:
    "Model wearing a black Naga Original hoodie on a Berlin rooftop at sunset",
  hoodieFlatLay:
    "Black Naga Original hoodie with Hustle Hard graphic, flat lay on dark concrete",
  logoDetail: "Close-up of the Naga Original cobra logo print on black cotton",
} as const;
