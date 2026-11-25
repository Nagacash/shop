import { SUPPORT_EMAIL } from "./site";
import { BLACK_TEE_NAME, BRAND_SUBTAGLINE, BRAND_TAGLINE } from "@/lib/brand/manifesto";
import { SHIPPING_INCLUDED_MESSAGE } from "@/lib/utils/currency";

export const NAGA_FAQS = [
  {
    question: "What is Naga Apparel?",
    answer: `${BRAND_TAGLINE} Naga Apparel is streetwear rooted in the Amazon and inspired by ancient empires — Mexico, Egypt, Angkor Wat, India. The cobra symbolizes wisdom, power, and rebirth. We build for the hustle-minded, knowledge-loving, and unapologetic.`,
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
      `The current drop includes ${BLACK_TEE_NAME}, Naga Original Hoodie, Naga Original Sweater, Naga Golden Edition Hoodie, Naga Golden Edition Sweater, and Cuban link chains. Shop by category: Tees, Sweaters, Hoodies, or Chains.`,
  },
  {
    question: "Verkauft Naga Cuban Link Ketten in Deutschland?",
    answer:
      "Ja — Miami Cuban Link Ketten bei Naga Apparel: goldfarben plattiertes Edelstahl, Versand aus Hamburg. Im Shop unter Chains / Ketten: nagaclub.de/products?category=chains. Weitere Kettenstile kommen dazu, sobald sie lieferbar sind.",
  },
  {
    question: "Does Naga sell Cuban link chains from Germany?",
    answer:
      "Yes. Naga Apparel ships Miami Cuban link chains from Hamburg, Germany — gold-plated stainless steel (KRKC-style Miami Cuban). Shop the Chains category at nagaclub.de/products?category=chains; more link styles land in the same section.",
  },
  {
    question: "Does Naga offer free VST or AU audio plugins?",
    answer:
      "Yes — Naga Audio DSP publishes mix tools at nagaclub.de/plugins. Naga Glue Vol. 2 is a free VCA bus compressor for macOS (VST3 and AU) and Standalone, with harmonic drive, sidechain HPF, wide mode, and 20 factory presets. Windows VST3 builds roll out as they ship.",
  },
  {
    question: "What is the Woodland 360 podcast?",
    answer:
      "Woodland 360 is Naga's urban-culture podcast — street-level conversations on creative sovereignty, counter-culture, tech, and Hamburg life. Watch episodes in-page at nagaclub.de/podcast (including guests such as Haji Brown and Lyn T) or on YouTube through Naga Codex.",
  },
  {
    question: "Is The Amazonian Syndicate Set in stock?",
    answer:
      "The Amazonian Syndicate Set is sold out for now. You can still view product details on the site — check back for restocks or shop tees, sweaters, and hoodies.",
  },
] as const;

export const FAQ_INTRO = `${BRAND_SUBTAGLINE} Quick answers about Naga Apparel, shipping from Germany, the current drop, Naga Glue plugins, and Woodland 360.`;
