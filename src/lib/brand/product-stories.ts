import { BLACK_TEE_NAME, FEATURED_SET_NAME } from "@/lib/brand/manifesto";

export type ProductStoryBeat = {
  label: string;
  title: string;
  body: string;
};

export type ProductCraftSpec = {
  fabric: string;
  fit: string;
  print: string;
};

const DEFAULT_BEATS: ProductStoryBeat[] = [
  {
    label: "Roots",
    title: "Ancient serpent wisdom",
    body:
      "From the Amazon to Angkor Wat, the cobra has always marked knowledge, power, and rebirth. Naga Apparel carries that lineage into modern street culture.",
  },
  {
    label: "Symbol",
    title: "Wear the cobra",
    body:
      "Every graphic is deliberate — not decoration, but declaration. The serpent on your chest says you think critically and move with purpose.",
  },
  {
    label: "Street",
    title: "Built for the hustle",
    body:
      "Heavyweight cotton, relaxed cuts, and prints that hold up night after night. Designed for those who refuse to bow to a broken system.",
  },
];

const PRODUCT_BEATS: Record<string, ProductStoryBeat[]> = {
  [BLACK_TEE_NAME]: [
    {
      label: "Roots",
      title: "Get Smart",
      body:
        "The black tee is the foundation — unapologetic, direct, impossible to ignore. The cobra chest graphic turns a staple into a statement.",
    },
    {
      label: "Symbol",
      title: "Knowledge on cotton",
      body:
        "Get Smart isn't a slogan. It's a posture. Wear it when you want the room to know you move with intention.",
    },
    {
      label: "Street",
      title: "Everyday heavyweight",
      body:
        "Premium cotton, relaxed street fit, print that survives the wash cycle and the night out.",
    },
  ],
  [FEATURED_SET_NAME]: [
    {
      label: "Roots",
      title: "The Amazonian Syndicate",
      body:
        "A complete look drawn from jungle myth and empire craft — tee and shorts matched as one syndicate uniform.",
    },
    {
      label: "Symbol",
      title: "Chest and leg story",
      body:
        "Get Smart on the chest. Hustle Hard and cobra patch on the leg. Two messages, one identity.",
    },
    {
      label: "Street",
      title: "Drop-ready set",
      body:
        "Black jersey tee and shorts — soft cotton-blend, relaxed fit, built to move from rooftop to studio to night drive.",
    },
  ],
  "The Wisdom & Hustle Tee": [
    {
      label: "Roots",
      title: "Clean contrast",
      body:
        "White canvas, cobra graphic, zero noise. The Wisdom & Hustle tee is for days when clarity is the flex.",
    },
    {
      label: "Symbol",
      title: "Dual energy",
      body:
        "Wisdom and hustle aren't opposites — they're the same serpent. Knowledge fuels the grind.",
    },
    {
      label: "Street",
      title: "Premium cotton cut",
      body:
        "Clean street silhouette, crisp print, everyday rotation piece that still reads premium.",
    },
  ],
  "The Cobra Wisdom Hoodie": [
    {
      label: "Roots",
      title: "Fleece temple",
      body:
        "The hoodie is modern armor — cream fleece, cobra chest, drawstring hood. Ancient wisdom in a silhouette everyone understands.",
    },
    {
      label: "Symbol",
      title: "Cobra on the chest",
      body:
        "The serpent sits over the heart. Warmth outside, conviction inside.",
    },
    {
      label: "Street",
      title: "Layer for any season",
      body:
        "Heavy fleece interior, structured hood, built for Berlin rooftops and Hamburg night frequency alike.",
    },
  ],
  "The Golden Empire Hoodie": [
    {
      label: "Roots",
      title: "Empire gold",
      body:
        "Gold cobra on premium fleece — a nod to the empires that understood power as both craft and symbol.",
    },
    {
      label: "Symbol",
      title: "Unapologetic presence",
      body:
        "This isn't subtle streetwear. The Golden Empire Hoodie announces before you speak.",
    },
    {
      label: "Street",
      title: "Statement layer",
      body:
        "Premium fleece, gold graphic, presence that holds from day to night.",
    },
  ],
};

const CATEGORY_CRAFT: Record<string, ProductCraftSpec> = {
  tees: {
    fabric: "Heavyweight cotton jersey",
    fit: "Relaxed street cut",
    print: "Screen-printed cobra graphic",
  },
  hoodies: {
    fabric: "Premium fleece interior",
    fit: "Structured hood, relaxed body",
    print: "Chest cobra graphic",
  },
  sweaters: {
    fabric: "Premium knit heavyweight",
    fit: "Crew silhouette, street drape",
    print: "Embroidered / knit cobra mark",
  },
  sets: {
    fabric: "Cotton-blend jersey tee & shorts",
    fit: "Matching relaxed set",
    print: "Chest + leg graphics, cobra patch",
  },
  headwear: {
    fabric: "Structured cotton twill",
    fit: "Adjustable street fit",
    print: "Embroidered cobra mark",
  },
};

const DEFAULT_CRAFT: ProductCraftSpec = {
  fabric: "Premium cotton blend",
  fit: "Relaxed street fit",
  print: "Cobra brand graphic",
};

export function getProductStoryBeats(productName: string): ProductStoryBeat[] {
  return PRODUCT_BEATS[productName] ?? DEFAULT_BEATS;
}

export function getProductCraftSpec(categorySlug?: string | null): ProductCraftSpec {
  if (!categorySlug) return DEFAULT_CRAFT;
  return CATEGORY_CRAFT[categorySlug] ?? DEFAULT_CRAFT;
}
