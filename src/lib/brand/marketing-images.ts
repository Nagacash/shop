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
} as const;

export const MARKETING_ALT = {
  berlinLifestyle:
    "Model wearing a black Naga Original hoodie on a Berlin rooftop at sunset",
  hoodieFlatLay:
    "Black Naga Original hoodie with Hustle Hard graphic, flat lay on dark concrete",
  logoDetail: "Close-up of the Naga Original cobra logo print on black cotton",
} as const;
