import { NormalizedLineItem, resolveCartImageUrl } from "./cartHelpers";

export interface OrderRecord {
  orderId: string;
  createdAt: string;
  total: number;
  status: "Processing" | "Verified" | "Delivered";
  paymentMethod: string;
  items: { id: string; name: string; quantity: number; price: number; image?: string }[];
}

export const VALID_PROMO_CODE = "VISTORA20";

export function calculateCheckoutTotal(subtotal: number, promoApplied: boolean): {
  rawSubtotal: number;
  discountAmount: number;
  finalTotal: number;
} {
  const safeSub = Number.isFinite(subtotal) && subtotal > 0 ? subtotal : 0;
  const discountAmount = promoApplied ? safeSub * 0.2 : 0;
  return {
    rawSubtotal: Number(safeSub.toFixed(2)),
    discountAmount: Number(discountAmount.toFixed(2)),
    finalTotal: Number(Math.max(0, safeSub - discountAmount).toFixed(2)),
  };
}

export function buildOrderRecord(
  items: NormalizedLineItem[],
  finalTotal: number,
  paymentMethod = "Express Checkout"
): OrderRecord {
  const randomSuffix = Math.floor(100000 + Math.random() * 900000);
  return {
    orderId: `ORD-${randomSuffix}`,
    createdAt: new Date().toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }),
    total: Number(Math.max(0, finalTotal).toFixed(2)),
    status: "Processing",
    paymentMethod,
    items: items.map((item) => ({
      id: item._id,
      name: item.productName?.original || "Vistora Essential",
      quantity: Math.max(1, item.quantity),
      price: Math.max(0, parseFloat(item.price?.amount || "0") || 0),
      image: resolveCartImageUrl(item.image),
    })),
  };
}
