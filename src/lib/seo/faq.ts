import { SUPPORT_EMAIL } from "./site";
import { BLACK_TEE_NAME, BRAND_SUBTAGLINE, BRAND_TAGLINE } from "@/lib/brand/manifesto";
import { SHIPPING_INCLUDED_MESSAGE } from "@/lib/utils/currency";

export const NAGA_FAQS = [
  {
    question: "What is Naga Apparel?",
    answer: `${BRAND_TAGLINE} Naga Apparel is streetwear rooted in the Amazon and inspired by ancient empires — Mexico, Egypt, Angkor Wat. The cobra symbolizes wisdom, power, and rebirth. We build for the hustle-minded, knowledge-loving, and unapologetic.`,
  },
  {
    question: "Where does Naga Apparel ship from?",
    answer: `Naga Apparel operates from Germany. ${SHIPPING_INCLUDED_MESSAGE} Order and shipping questions can be sent to ${SUPPORT_EMAIL} — we reply within 24 hours on business days.`,
  },
  {
    question: "Do you ship to the United States?",
    answer: `Yes. Standard shipping is included in every product price (based on DHL Paket 2 kg from Germany). US delivery typically takes 7–14 business days. Any import duties or local sales tax are calculated at checkout based on your address.`,
  },
  {
    question: "What products does Naga Apparel sell?",
    answer:
      `The current drop includes ${BLACK_TEE_NAME}, The Wisdom & Hustle Tee, The Angkor Heavyweight Crew, The Empire Roots Crew, The Cobra Wisdom Hoodie, The Golden Empire Hoodie, and The Amazonian Syndicate Set. Shop by category: Tees, Sweaters, Hoodies, or Sets.`,
  },
  {
    question: "Is The Amazonian Syndicate Set in stock?",
    answer:
      "The Amazonian Syndicate Set is sold out for now. You can still view product details on the site — check back for restocks or shop tees, sweaters, and hoodies.",
  },
] as const;

export const FAQ_INTRO = `${BRAND_SUBTAGLINE} Quick answers about Naga Apparel, shipping from Germany, and the current drop.`;
