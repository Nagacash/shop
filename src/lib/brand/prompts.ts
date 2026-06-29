import { PAGE_HERO_KEYS, type PageHeroKey } from "./page-heroes";

export const BRAND_SUFFIX =
  "No text, no watermark, no brand logos or symbols, no readable words. High-fashion editorial, cinematic, ultra high contrast, 8k detail.";

/** Wide background — masculine grit + feminine glamour in one frame (diptych energy). */
export const HERO_PROMPT = [
  "Wide cinematic streetwear campaign, split visual energy in one frame.",
  "Left third: brutal masculine hustle — wet concrete, chain-link, gold neon smoke, urban night grit.",
  "Right third: feminine glamour zone — magenta-gold rim light, organic gold curves, silk shadow, warm bronze tones.",
  "Center blends both worlds in black and gold luxury streetwear mood, tropical city night heat.",
  BRAND_SUFFIX,
].join(" ");

/** Portrait panel — glamour + street balance (Instagram campaign crop). */
export const HERO_GLAMOUR_PROMPT = [
  "Vertical high-fashion streetwear campaign crop, 4:5 editorial portrait.",
  "Model in black oversized hoodie and gold chain jewelry, back view only, no face.",
  "Warm bronze skin tones in champagne gold rim light, bold feminine presence, ultra-fine magazine glamour.",
  "Balanced with raw street attitude, soft magenta accent glow, luxury trap-luxe mood.",
  BRAND_SUFFIX,
].join(" ");

export type CollectionPrompt = {
  slug: string;
  name: string;
  prompt: string;
};

export const COLLECTION_PROMPTS: CollectionPrompt[] = [
  {
    slug: "hustle-hard-drip",
    name: "Hustle Hard Drip",
    prompt: [
      "Raw gritty street editorial background, in-your-face low angle.",
      "Motion blur, spray paint texture, cracked concrete, gold graffiti glow.",
      "Fashion model in streetwear from behind walking through steam, bold feminine presence, ultra-fine editorial.",
      "Hustle energy with glamorous balance, neon gold on wet pavement.",
      BRAND_SUFFIX,
    ].join(" "),
  },
  {
    slug: "naga-original",
    name: "Naga Original",
    prompt: [
      "Iconic OG streetwear studio shot, confrontational symmetry.",
      "Deep charcoal void with brutal gold spotlight, hard shadows.",
      "Fashion editorial — feminine silhouette in oversized tee, side profile, timeless OG composure.",
      BRAND_SUFFIX,
    ].join(" "),
  },
  {
    slug: "black-gold-edition",
    name: "Black & Gold Edition",
    prompt: [
      "Luxury noir studio, black velvet and molten gold rim light, in-your-face drama.",
      "High-fashion feminine glamour silhouette in silk and gold jewelry, back view, warm bronze rim light.",
      "Opulent street royalty, champagne gold highlights on black.",
      BRAND_SUFFIX,
    ].join(" "),
  },
  {
    slug: "naga-square",
    name: "Naga Square",
    prompt: [
      "Geometric urban backdrop, harsh square light panels and blade-like shadows.",
      "Black and gold architectural editorial, graceful feminine fashion form against rigid grid.",
      "Trap-luxe precision meets soft glamour curves in light and shadow only.",
      BRAND_SUFFIX,
    ].join(" "),
  },
  {
    slug: "golden-drip",
    name: "Golden Drip",
    prompt: [
      "Macro liquid gold dripping over matte black, organic feminine curves as abstract molten metal shapes.",
      "Glossy heat, luxury street art drip culture, ultra-fine glamour abstraction no people.",
      BRAND_SUFFIX,
    ].join(" "),
  },
  {
    slug: "naga-og",
    name: "NAGA OG",
    prompt: [
      "Vintage brick wall at golden hour, gritty warm city summer heat, dust and film grain.",
      "Fashion model in OG hoodie from behind against chain fence, bold feminine street glamour.",
      "Gold sunset rim light, authentic hustle roots.",
      BRAND_SUFFIX,
    ].join(" "),
  },
];

export const PAGE_HERO_PROMPTS: { page: PageHeroKey; prompt: string }[] = [
  {
    page: "shop",
    prompt: [
      "Wide shop campaign banner, streetwear retail energy.",
      "Hoodies and tees on hangers in dark gold-lit studio, hustle grit meets glamour lighting.",
      BRAND_SUFFIX,
    ].join(" "),
  },
  {
    page: "cart",
    prompt: [
      "Luxury shopping mood, black and gold gift boxes and streetwear flat lay on marble.",
      "Premium checkout anticipation, champagne gold accents, editorial product still life no logos.",
      BRAND_SUFFIX,
    ].join(" "),
  },
  {
    page: "collections",
    prompt: [
      "Museum gallery wall of streetwear campaigns, multiple gold-lit panels, curated drops mood.",
      "Black and gold exhibition energy, hustle and glamour balanced.",
      BRAND_SUFFIX,
    ].join(" "),
  },
  {
    page: "contact",
    prompt: [
      "Warm editorial studio, gold desk lamp on black surface, invitation to connect.",
      "Feminine glamour light spill, bronze tones, luxury street brand customer care mood.",
      BRAND_SUFFIX,
    ].join(" "),
  },
  {
    page: "checkout",
    prompt: [
      "Celebration confetti and gold light burst on black, order complete victory mood.",
      "Streetwear success energy, champagne gold particles, premium triumph editorial.",
      BRAND_SUFFIX,
    ].join(" "),
  },
  {
    page: "auth",
    prompt: [
      "Sign-in campaign backdrop, split hustle and glamour energy, cobra gold aesthetic without logos.",
      "Dark studio with gold neon frame, welcoming streetwear community mood.",
      BRAND_SUFFIX,
    ].join(" "),
  },
  {
    page: "product",
    prompt: [
      "Minimal product detail banner, macro black fabric texture with gold thread stitch.",
      "Premium streetwear craftsmanship close-up, ultra-fine material editorial.",
      BRAND_SUFFIX,
    ].join(" "),
  },
];

export const PAGE_HERO_KEY_LIST = PAGE_HERO_KEYS;

