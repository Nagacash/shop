/**
 * Dropship inventory: `product_variants.in_stock` is a storefront cap so checkout can
 * run. It is not warehouse on-hand count. Adjust after supplier sync or orders.
 */
export const DROPSHIP_STOCK_ADMIN_NOTE =
  "Dropship items: in_stock is a placeholder cap for checkout, not warehouse inventory. Update after supplier sync.";

export const DROPSHIP_DEFAULT_PLACEHOLDER_STOCK = 30;