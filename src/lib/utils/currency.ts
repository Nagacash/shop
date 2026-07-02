export const CURRENCY_CODE = "EUR";
export const STRIPE_CURRENCY = "eur";
export const FREE_SHIPPING_THRESHOLD = 75;
export const SHIPPING_FLAT_RATE_EUR = 4.99;

/** Stripe Tax code: clothing & footwear */
export const STRIPE_TAX_CODE_APPAREL = "txcd_30011000";
/** Stripe Tax code: shipping */
export const STRIPE_TAX_CODE_SHIPPING = "txcd_92010001";
/** Stripe Tax code: digitally supplied services */
export const STRIPE_TAX_CODE_DIGITAL = "txcd_10000000";

const priceFormatter = new Intl.NumberFormat("de-DE", {
  style: "currency",
  currency: CURRENCY_CODE,
});

export function formatPrice(amount: number | null | undefined): string | undefined {
  if (amount === null || amount === undefined) return undefined;
  return priceFormatter.format(amount);
}

export function formatPriceRange(min: number, max: number): string {
  if (min === max) return formatPrice(min)!;
  return `${formatPrice(min)} – ${formatPrice(max)}`;
}

export function formatPriceFromCents(cents: number): string {
  return priceFormatter.format(cents / 100);
}

export function toMinorUnits(amount: number): number {
  return Math.round(amount * 100);
}

export function formatPriceFilterLabel(min?: number, max?: number): string {
  if (min !== undefined && max !== undefined) {
    return `${formatPrice(min)} – ${formatPrice(max)}`;
  }
  if (min !== undefined) return `Over ${formatPrice(min)}`;
  if (max !== undefined) return `Up to ${formatPrice(max)}`;
  return "";
}

export function fromMinorUnits(cents: number): number {
  return cents / 100;
}

export function calculateShippingEur(subtotalEur: number, requiresShipping = true): number {
  if (!requiresShipping) return 0;
  return subtotalEur >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FLAT_RATE_EUR;
}

export function calculateShippingCents(subtotalEur: number, requiresShipping = true): number {
  return toMinorUnits(calculateShippingEur(subtotalEur, requiresShipping));
}

/** @deprecated Use toMinorUnits */
export const dollarsToCents = toMinorUnits;

/** @deprecated Use formatPriceFromCents */
export const centsToDollars = (cents: number) => cents / 100;
