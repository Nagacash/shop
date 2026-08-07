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
  /** Real-logo rooftop cover — black hoodie, golden hour skyline */
  berlinLifestyle: `${IMG}/Naga%20Cover%20_%20real%20logo%20hoodie%20rooftop.webp`,
  /** Wide cityscape variant (generated) */
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
  /** Lifestyle — Naga Original hoodie in the crowd */
  hoodieStreet1: `${IMG}/NAGA%20hoodie1.png`,
  hoodieStreet2: `${IMG}/NAGA%20hoddie2t.png`,
  /** Real-logo set still life — black crew + pants + hangtag */
  setStillLife: `${IMG}/Naga%20Set%20_%20real%20logo%20still%20life.webp`,
  /** Real-logo tees editorial — duo in concrete corridor */
  teesEditorial: `${IMG}/Naga%20Tees%20_%20real%20logo%20editorial.webp`,
  /** Real-logo Angkor crew editorial */
  angkorCrew: `${IMG}/Naga%20Crew%20_%20real%20logo%20Angkor%20editorial.webp`,
  /** Poster frame from the AI brand teaser reel */
  teaserPoster: `${IMG}/naga-teaser-poster.webp`,
} as const;

export type BrandClipId =
  | "goldDust"
  | "goldDustWide"
  | "nagaFashion"
  | "hoodie"
  | "teaser";

/** Native aspect ratios for brand photography (width / height). */
export const BRAND_IMAGE_ASPECT = {
  cinematic: "3104/1312",
  productDust: "1080/608",
  coverRooftop: "2752/1536",
  setStillLife: "2400/1792",
  teesEditorial: "2528/1696",
  angkorCrew: "1792/2400",
} as const;

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
  nagaFashion: {
    id: "nagaFashion",
    mp4: `${CLIPS}/Naga%20fashion.mp4`,
    poster: MARKETING_IMAGES.hoodieStreet1,
    objectPosition: "center",
  },
  hoodie: {
    id: "hoodie",
    mp4: `${CLIPS}/hoodie.mp4`,
    poster: MARKETING_IMAGES.hoodieFlatLay,
    objectPosition: "center",
  },
  teaser: {
    id: "teaser",
    mp4: `${CLIPS}/naga-teaser-15s.mp4`,
    poster: MARKETING_IMAGES.teaserPoster,
    objectPosition: "center",
  },
};

/** Which clip each page/section uses */
export const SECTION_CLIPS = {
  featuredDrop: "goldDustWide",
  balance: "goldDust",
  instagram: "goldDustWide",
  collections: "hoodie",
  shop: "nagaFashion",
  cart: "goldDustWide",
  contact: "goldDust",
  teaser: "teaser",
} as const satisfies Record<string, BrandClipId>;

export const MARKETING_ALT = {
  berlinLifestyle:
    "Model in a black Naga Original hoodie with real cobra logo on a rooftop at golden hour, city skyline behind",
  berlinWide: "Wide golden-hour view over Berlin rooftops",
  nagaTee: "Black Naga Original graphic tee on clean studio background",
  hoodieFlatLay: "Black Naga Original hoodie flat lay with cobra chest graphic",
  hoodieMannequin: "Black Naga hoodie on mannequin, cobra logo on chest",
  logoDetail: "Macro close-up of gold Naga cobra logo with golden dust particles",
  productDust: "Naga hoodie flat lay and macro logo detail with golden dust",
  sweaterFlat: "Grey Naga Original crew sweater flat lay",
  sweaterFolded: "Folded stack of Naga crew sweaters",
  hoodieStreet1:
    "Model wearing a black Naga Original hoodie with cobra chest logo in a dimly lit crowd",
  hoodieStreet2:
    "Editorial shot of Naga Original hoodie and cobra logo in a nightlife setting",
  setStillLife:
    "Black Naga Original crewneck and sweatpants still life with hangtag and gold hardware",
  teesEditorial:
    "Two models in black Naga Original graphic tees against raw concrete walls",
  angkorCrew:
    "Model in a tan Naga Original crewneck with real cobra logo at an Angkor temple",
} as const;

/** Homepage street editorial — Naga Original hoodie lifestyle photography. */
export const HOODIE_STREET_EDITORIAL = [
  {
    src: MARKETING_IMAGES.hoodieStreet1,
    alt: MARKETING_ALT.hoodieStreet1,
    label: "Night crowd",
    detail: "Naga Original in the room",
    aspect: "3/2",
    fit: "cover",
    backdrop: "#0a0a0a",
  },
  {
    src: MARKETING_IMAGES.hoodieStreet2,
    alt: MARKETING_ALT.hoodieStreet2,
    label: "Street frequency",
    detail: "Cobra mark, front and center",
    aspect: "3/2",
    fit: "cover",
    backdrop: "#0a0a0a",
  },
] as const;

/** Homepage editorial lookbook — real-logo brand photography. */
export const EDITORIAL_LOOKBOOK = [
  {
    src: MARKETING_IMAGES.berlinLifestyle,
    alt: MARKETING_ALT.berlinLifestyle,
    label: "Rooftop",
    detail: "Naga Original on the skyline",
    layout: "feature",
    aspect: BRAND_IMAGE_ASPECT.coverRooftop,
    fit: "cover",
    backdrop: "#0a0a0a",
  },
  {
    src: MARKETING_IMAGES.setStillLife,
    alt: MARKETING_ALT.setStillLife,
    label: "Black set",
    detail: "Crew + pants, hangtag sharp",
    layout: "product",
    aspect: BRAND_IMAGE_ASPECT.setStillLife,
    fit: "cover",
    backdrop: "#0a0a0a",
  },
  {
    src: MARKETING_IMAGES.teesEditorial,
    alt: MARKETING_ALT.teesEditorial,
    label: "Tees",
    detail: "Cobra mark, concrete frame",
    layout: "mood",
    aspect: BRAND_IMAGE_ASPECT.teesEditorial,
    fit: "cover",
    backdrop: "#121212",
  },
  {
    src: MARKETING_IMAGES.angkorCrew,
    alt: MARKETING_ALT.angkorCrew,
    label: "Angkor",
    detail: "Heritage crew, real logo",
    layout: "heritage",
    aspect: BRAND_IMAGE_ASPECT.angkorCrew,
    fit: "cover",
    backdrop: "#0a0a0a",
  },
] as const;

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

/** Ambient playlist — see `@/lib/ambient/catalog` (streams via signed `/api/ambient`). */
export {
  AMBIENT_TRACK,
  AMBIENT_TRACKS,
  type AmbientTrackId,
} from "@/lib/ambient/catalog";

/** Digital lookbook PDF — wholesale / press / business interest. */
export const LOOKBOOK_PDF = {
  href: "/new/naga-lookbook.pdf",
  filename: "naga-lookbook.pdf",
  label: "Download lookbook",
  detail: "PDF · for wholesale, press & partners",
} as const;

/** Default Open Graph / Twitter share image — JPG for broad crawler support. */
export const SOCIAL_SHARE_IMAGE =
  "/new/img/Naga Set _ real logo still life.jpg";
