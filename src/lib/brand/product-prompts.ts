export type ProductShotKind = "square" | "portrait";

export type LogoPlacement = {
  centerX: number;
  centerY: number;
  widthRatio: number;
};

export type ProductShotPrompt = {
  id: string;
  label: string;
  prompt: string;
  kind: ProductShotKind;
  placement: LogoPlacement;
};

const NO_PRINTS =
  "Plain blank fabric only — absolutely no graphics, no logos, no text, no prints, no embroidery on the garments.";

export const NAGA_GREEN_SHOTS: ProductShotPrompt[] = [
  {
    id: "flat-lay-dark",
    label: "Dark studio flat lay",
    prompt: [
      "Professional e-commerce flat lay product photo.",
      "Sage olive green cotton t-shirt and matching shorts set laid flat together, overhead view.",
      NO_PRINTS,
      "Dark warm charcoal studio surface, soft diffused lighting, luxury streetwear catalog style.",
    ].join(" "),
    kind: "square",
    placement: { centerX: 0.5, centerY: 0.27, widthRatio: 0.33 },
  },
  {
    id: "flat-lay-light",
    label: "Light studio flat lay",
    prompt: [
      "Clean e-commerce flat lay, sage olive green tee and shorts matching set.",
      "Garments arranged neatly on warm light grey seamless background, overhead shot.",
      NO_PRINTS,
      "Soft natural daylight, minimal shadows, premium apparel photography.",
    ].join(" "),
    kind: "square",
    placement: { centerX: 0.5, centerY: 0.26, widthRatio: 0.32 },
  },
  {
    id: "folded-stack",
    label: "Folded stack",
    prompt: [
      "Sage olive green streetwear tee folded and stacked with matching shorts beside it.",
      "Front-facing product still life on dark wood surface.",
      NO_PRINTS,
      "Editorial catalog lighting, shallow depth of field, no people.",
    ].join(" "),
    kind: "square",
    placement: { centerX: 0.42, centerY: 0.38, widthRatio: 0.28 },
  },
];
