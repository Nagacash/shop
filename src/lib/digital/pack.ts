/** Naga Producer Pack Volume1 — owner patches and one-shots, not Google's player. */
export const PRODUCER_PACK_NAME = "Naga Producer Pack Volume1";
export const PRODUCER_PACK_SKU = "NAGA-PRODUCER-PACK-V1";
export const PRODUCER_PACK_PRICE = "20.00";
export const PRODUCER_PACK_FILENAME = "naga-producer-pack-volume1.zip";
export const PRODUCER_PACK_PROMO_SRC = "/uploads/naga/naga-producer-pack-promo.mp4";
export const PRODUCER_PACK_PROMO_POSTER = "/uploads/naga/naga-producer-pack-promo.jpg";

export const FLOW_PLAYER_HELP_URL =
  "https://support.google.com/flow/answer/18631279";

export const PRODUCER_PACK_TITLE = "NAGA Producer Pack Vol. 1";
export const PRODUCER_PACK_TAGLINE =
  "Five creative tools. Royalty-free drums. One NAGA sound.";

export const PRODUCER_PACK_TOOLS = [
  {
    name: "NAGA NPC2026",
    detail:
      "An MPC-inspired drum sampler built for authentic urban beats. Load your drums, chop samples, and turn your ideas into grooves.",
  },
  {
    name: "NAGA 808",
    detail:
      "Shape your low end your way. Drag in your own 808 sample or start with an included preset, then sculpt the sound to fit your beat.",
  },
  {
    name: "NAGA Clip",
    detail:
      "Fatten up your sound with clipping that adds edge and punch to drums, bass, and other tracks.",
  },
  {
    name: "Naga-EQ",
    detail:
      "Shape your tone, balance frequencies, and give each track its place in the mix.",
  },
  {
    name: "Soundsystem Control Tower",
    detail:
      "Add soundsystem character with dub preamp controls, space echo, and a dub siren.",
  },
] as const;

export const PRODUCER_PACK_PATCHES = PRODUCER_PACK_TOOLS.map((tool) => tool.name);

export const PRODUCER_PACK_DESCRIPTION = [
  PRODUCER_PACK_TITLE,
  PRODUCER_PACK_TAGLINE,
  "Built for real urban beatmakers chasing weight, groove, and character—not that flat, straight-out-of-the-DAW feel. From gritty drums and heavy 808s to warm dub textures and hard-clipped punch, this pack helps you give your beats a raw, full-bodied sound with attitude.",
  "Get five custom .fmx patches created in Google Flow Music, plus royalty-free drum-kit one-shots—all for €20.",
  ...PRODUCER_PACK_TOOLS.map((tool) => `${tool.name} — ${tool.detail}`),
  "What’s included: all five NAGA .fmx patches, royalty-free drum-kit one-shots, and the installation guide inside the ZIP.",
  "The patches were created in Google Flow Music. They are not standalone VST/AU plugins: compatible .fmx files load inside Google’s Flow Instrument or Flow Effect host. Google’s host installer is not included. Download it directly from Google Flow Music via Use in DAW → Download plugin: https://support.google.com/flow/answer/18631279. Once installed, open the appropriate Flow host in your DAW and drag your .fmx file onto its window.",
  "Google’s current plugin support is macOS only. Sample-based instruments are subject to export limitations. DAW compatibility for NPC2026 and the sample-loading features in NAGA 808 has not been confirmed here—check the included installation guide and confirm support for your intended workflow before purchasing.",
].join("\n\n");

export function isProducerPackSku(sku: string | null | undefined): boolean {
  return sku === PRODUCER_PACK_SKU;
}
