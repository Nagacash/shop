import { SUPPORT_EMAIL } from "./site";

export const NAGA_FAQS = [
  {
    question: "What is Naga Apparel?",
    answer:
      "Naga Apparel is an urban streetwear brand offering Naga Original graphic tees, sweaters, hoodies, and matching sets. Pieces feature the Naga cobra logo, premium cotton fabrics, and real flat-lay product photography.",
  },
  {
    question: "Where does Naga Apparel ship from?",
    answer:
      `Naga Apparel operates from Germany. Order and shipping questions can be sent to ${SUPPORT_EMAIL} — we reply within 24 hours on business days.`,
  },
  {
    question: "What products does Naga Apparel sell?",
    answer:
      "The current drop includes Naga Original black and white tees, grey and light brown sweaters, cream and golden hoodies, and the Naga Black tee-and-shorts set. Browse by category: Tees, Sweaters, Hoodies, or Sets.",
  },
  {
    question: "Is the Naga Black Set in stock?",
    answer:
      "The Naga Black Set is sold out for now. You can still view product details on the site — check back for restocks or shop Naga Original tees, sweaters, and hoodies.",
  },
] as const;
