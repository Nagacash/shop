const IMG = "/new/img";
const CLIPS = "/new/clips";

/** Internal paths — use this inside this module to avoid export TDZ issues. */
const LEGACY_IMAGES = {
  berlinLifestyle: "/hoodie/berlin-naga.jpeg",
  nagaTee: "/website-images/naga-tee.jpeg",
  hoodieFlatLay: "/website-images/website-naga.jpeg",
  logoDetail: "/website-images/website-naga2.jpeg",
  brandMood: "/website-images/naga-purse.jpeg",
} as const;

/** Original catalog photography — kept live on secondary pages & gallery strips. */
export const LEGACY_MARKETING_IMAGES = LEGACY_IMAGES;

export const LEGACY_MARKETING_ALT = {
  berlinLifestyle:
    "Model wearing a black Naga Original hoodie on a Berlin rooftop at sunset",
  nagaTee: "White Naga Original graphic tee flat lay on light concrete",
  hoodieFlatLay:
    "Black Naga Original hoodie with Hustle Hard graphic, flat lay on dark concrete",
  logoDetail: "Close-up of the Naga Original cobra logo print on black cotton",
  brandMood: "Naga brand mood flat lay with purse and streetwear accessories",
} as const;

/** Real product/collection covers — override generated brand assets where needed. */
export const COLLECTION_COVER_OVERRIDES: Record<string, string> = {
  "black-gold-edition": `${IMG}/naga-web.png`,
  "naga-original": `${IMG}/tee-black.png`,
  "naga-black": `${IMG}/hoodie.png`,
  "hustle-hard-drip": `${IMG}/hoodie-mannequin.png`,
  "naga-og": `${IMG}/naga-dust.jpeg`,
  "golden-drip": LEGACY_IMAGES.hoodieFlatLay,
  "naga-square": LEGACY_IMAGES.brandMood,
};

/** Brand photography & product visuals — `/public/new/img`. */
export const MARKETING_IMAGES = {
  /** Berlin rooftop golden hour — hood up, city skyline */
  berlinLifestyle: `${IMG}/cityscraper2.png`,
  /** Wide cityscape variant */
  berlinWide: `${IMG}/cityscraper.png`,
  /** Black tee product shot */
  nagaTee: `${IMG}/tee-black.png`,
  /** Black hoodie flat lay on white */
  hoodieFlatLay: `${IMG}/hoodie.png`,
  /** Hoodie on mannequin */
  hoodieMannequin: `${IMG}/hoodie-mannequin.png`,
  /** Macro logo + golden dust sparkle */
  logoDetail: `${IMG}/naga-web.png`,
  /** Split flat lay + macro editorial */
  productDust: `${IMG}/naga-dust.jpeg`,
  /** Grey crew sweater */
  sweaterFlat: `${IMG}/sweater.png`,
  /** Folded sweater stack */
  sweaterFolded: `${IMG}/sweater-folded.png`,
} as const;

export type BrandClipId = "goldDust" | "goldDustWide";

export type BrandClip = {
  id: BrandClipId;
  mp4: string;
  webm?: string;
  poster: string;
  objectPosition?: string;
};

/** Loopable product atmosphere clips — `/public/new/clips`. */
export const BRAND_CLIPS: Record<BrandClipId, BrandClip> = {
  goldDust: {
    id: "goldDust",
    mp4: `${CLIPS}/golden-dust.mp4`,
    webm: `${CLIPS}/golden-dust.webm`,
    poster: MARKETING_IMAGES.logoDetail,
    objectPosition: "center",
  },
  goldDustWide: {
    id: "goldDustWide",
    mp4: `${CLIPS}/golden-dust-2.mp4`,
    webm: `${CLIPS}/golden-dust-2.webm`,
    poster: MARKETING_IMAGES.productDust,
    objectPosition: "center",
  },
};

/** Which clip each page/section uses */
export const SECTION_CLIPS = {
  featuredDrop: "goldDustWide",
  balance: "goldDust",
  instagram: "goldDustWide",
  collections: "goldDust",
  shop: "goldDust",
  cart: "goldDustWide",
  contact: "goldDust",
} as const satisfies Record<string, BrandClipId>;

export const MARKETING_ALT = {
  berlinLifestyle:
    "Silhouette in Naga hoodie on a Berlin rooftop at golden hour, city skyline behind",
  berlinWide: "Wide golden-hour view over Berlin rooftops",
  nagaTee: "Black Naga Original graphic tee on clean studio background",
  hoodieFlatLay: "Black Naga Original hoodie flat lay with cobra chest graphic",
  hoodieMannequin: "Black Naga hoodie on mannequin, cobra logo on chest",
  logoDetail: "Macro close-up of gold Naga cobra logo with golden dust particles",
  productDust: "Naga hoodie flat lay and macro logo detail with golden dust",
  sweaterFlat: "Grey Naga Original crew sweater flat lay",
  sweaterFolded: "Folded stack of Naga crew sweaters",
} as const;

/** Homepage “real shots” strip — legacy flat-lay photography. */
export const LEGACY_GALLERY = [
  {
    src: LEGACY_IMAGES.nagaTee,
    alt: LEGACY_MARKETING_ALT.nagaTee,
    label: "Tees",
  },
  {
    src: LEGACY_IMAGES.hoodieFlatLay,
    alt: LEGACY_MARKETING_ALT.hoodieFlatLay,
    label: "Hoodies",
  },
  {
    src: LEGACY_IMAGES.logoDetail,
    alt: LEGACY_MARKETING_ALT.logoDetail,
    label: "Detail",
  },
  {
    src: LEGACY_IMAGES.brandMood,
    alt: LEGACY_MARKETING_ALT.brandMood,
    label: "Street",
  },
] as const;
