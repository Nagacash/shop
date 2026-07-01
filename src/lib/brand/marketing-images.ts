/** Real product/collection covers — override generated brand assets where needed. */
export const COLLECTION_COVER_OVERRIDES: Record<string, string> = {
  "black-gold-edition": "/hoodie/gold-front.jpg",
};

/** Real marketing photography — used on homepage, contact, and brand sections. */
export const MARKETING_IMAGES = {
  /** Model in Naga Original hoodie, Berlin TV Tower, golden hour */
  berlinLifestyle: "/hoodie/berlin-naga.jpeg",
  /** White Naga Original tee flat lay — homepage hero background */
  nagaTee: "/website-images/naga-tee.jpeg",
  /** Black hoodie flat lay — Naga Original + Hustle Hard */
  hoodieFlatLay: "/website-images/website-naga.jpeg",
  /** Macro cobra logo print on black fabric */
  logoDetail: "/website-images/website-naga2.jpeg",
  /** Brand mood visual — not a catalog product */
  nagaPurse: "/website-images/naga-purse.jpeg",
} as const;

export type BrandClipId = "templeFront" | "templeBack" | "flatLay" | "cinematic";

export type BrandClip = {
  id: BrandClipId;
  mp4: string;
  webm?: string;
  poster: string;
  objectPosition?: string;
};

/** All brand video clips — assigned to sections across the app. */
export const BRAND_CLIPS: Record<BrandClipId, BrandClip> = {
  templeFront: {
    id: "templeFront",
    mp4: "/hero-clips/hero1.mp4",
    webm: "/hero-clips/hero1.webm",
    poster: MARKETING_IMAGES.berlinLifestyle,
    objectPosition: "center",
  },
  templeBack: {
    id: "templeBack",
    mp4: "/hero-clips/hero2.mp4",
    webm: "/hero-clips/hero2.webm",
    poster: MARKETING_IMAGES.hoodieFlatLay,
    objectPosition: "center",
  },
  flatLay: {
    id: "flatLay",
    mp4: "/website-images/hero-bg.mp4",
    webm: "/website-images/hero-bg.webm",
    poster: MARKETING_IMAGES.hoodieFlatLay,
    objectPosition: "center",
  },
  cinematic: {
    id: "cinematic",
    mp4: "/hero-clips/hero4.mp4",
    webm: "/hero-clips/hero4.webm",
    poster: MARKETING_IMAGES.hoodieFlatLay,
    objectPosition: "center",
  },
};

/** Which clip each page/section uses */
export const SECTION_CLIPS = {
  featuredDrop: "cinematic",
  balance: "templeFront",
  instagram: "templeBack",
  collections: "flatLay",
  shop: "templeFront",
  cart: "templeBack",
  contact: "cinematic",
} as const satisfies Record<string, BrandClipId>;

export const MARKETING_ALT = {
  berlinLifestyle:
    "Model wearing a black Naga Original hoodie on a Berlin rooftop at sunset",
  nagaTee: "White Naga Original graphic tee flat lay on light concrete",
  hoodieFlatLay:
    "Black Naga Original hoodie with Hustle Hard graphic, flat lay on dark concrete",
  logoDetail: "Close-up of the Naga Original cobra logo print on black cotton",
} as const;
