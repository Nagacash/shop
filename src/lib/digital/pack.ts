/** Naga Producer Pack Volume1 — owner patches and one-shots, not Google's player. */
export const PRODUCER_PACK_NAME = "Naga Producer Pack Volume1";
export const PRODUCER_PACK_SKU = "NAGA-PRODUCER-PACK-V1";
export const PRODUCER_PACK_PRICE = "20.00";
export const PRODUCER_PACK_FILENAME = "naga-producer-pack-volume1.zip";

export const FLOW_PLAYER_HELP_URL =
  "https://support.google.com/flow/answer/18631279";

export const PRODUCER_PACK_PATCHES = [
  "Soundsystem Control Tower",
  "Naga-EQ",
  "NAGA 808",
  "NAGA NPC2026",
  "NAGA Clip",
] as const;

export const PRODUCER_PACK_DESCRIPTION =
  "€20 is for the NAGA .fmx patches and the royalty-free drum-kit one-shots: Soundsystem Control Tower, Naga-EQ, NAGA 808, NAGA NPC2026, and NAGA Clip. The patches were made in Google Flow Music. The zip includes the installation guide. Google's Flow Instrument / Flow Effect installer is not included. Install that player yourself from Google Flow Music (Use in DAW → Download plugin): https://support.google.com/flow/answer/18631279 — then drag each .fmx onto Flow Instrument or Flow Effect.";

export function isProducerPackSku(sku: string | null | undefined): boolean {
  return sku === PRODUCER_PACK_SKU;
}
