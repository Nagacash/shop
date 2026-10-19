import type { ShippingAddressView } from "@/lib/stripe/shipping";

export type OrderItemView = {
  id: string;
  name: string;
  quantity: number;
  priceAtPurchase: number;
  size?: string | null;
  color?: string | null;
  isDigital?: boolean;
  /** Relative path. Present only after the order is paid. */
  downloadUrl?: string | null;
};

export type OrderView = {
  id: string;
  status: string;
  subtotalAmount: number | null;
  shippingAmount: number | null;
  taxAmount: number | null;
  totalAmount: number;
  totalCents: number;
  createdAt: Date;
  items: OrderItemView[];
  shippingAddress: ShippingAddressView | null;
  customerEmail: string | null;
};
