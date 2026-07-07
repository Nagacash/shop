/**
 * DHL Paket — online franking rates from Germany (Paket bis 2 kg).
 * Source: https://www.dhl.de/de/privatkunden/pakete-versenden/weltweit-versenden/preise-international.html
 * Effective: 1 July 2025 (current DHL price list).
 *
 * All Naga apparel variants weigh ≤ 0.75 kg — Paket 2 kg tier applies.
 */

/** Previous checkout add-on (removed — now included in product prices). */
export const LEGACY_CHECKOUT_SHIPPING_EUR = 4.99;

/** DHL Zone 1 — EU, Paket bis 2 kg, online */
export const DHL_PAKET_2KG_EU_EUR = 14.49;

/** DHL Zone 5 — USA / Americas, Paket bis 2 kg, online */
export const DHL_PAKET_2KG_US_EUR = 26.49;

/** DHL national — Germany, Paket 2 kg, online */
export const DHL_PAKET_2KG_DE_EUR = 6.19;

/** DHL Zone 2 — UK / CH / IE, Paket bis 2 kg, online */
export const DHL_PAKET_2KG_UK_CH_EUR = 15.99;

export type ShippingZoneId = "de" | "eu" | "uk_ch" | "us";

export const SHIPPING_ZONE_RATES: Record<ShippingZoneId, number> = {
  de: DHL_PAKET_2KG_DE_EUR,
  eu: DHL_PAKET_2KG_EU_EUR,
  uk_ch: DHL_PAKET_2KG_UK_CH_EUR,
  us: DHL_PAKET_2KG_US_EUR,
};

/**
 * Amount baked into every product price so checkout shows €0 shipping worldwide.
 * Uses the highest standard DHL 2 kg tier (US) so EU/DE orders are not surcharged at checkout.
 */
export const SHIPPING_INCLUDED_EUR = DHL_PAKET_2KG_US_EUR;

export function shippingInclusivePrice(currentProductPriceEur: number): number {
  return Math.round(currentProductPriceEur + SHIPPING_INCLUDED_EUR);
}

export function formatShippingRateSource(): string {
  return `DHL Paket 2 kg online (DE→US €${DHL_PAKET_2KG_US_EUR}, DE→EU €${DHL_PAKET_2KG_EU_EUR}, DE domestic €${DHL_PAKET_2KG_DE_EUR})`;
}
