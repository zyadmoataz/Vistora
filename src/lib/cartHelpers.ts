import { NormalizedCart, NormalizedLineItem } from "./wixCartMapper";

export * from "./wixCartMapper";

const LEGACY_CART_KEY = "vistora_cart_v1";
const getCartStorageKey = (email?: string) =>
  email ? `vistora_cart_v2_${email.toLowerCase().trim()}` : null;

export const computeCartTotals = (
  items: NormalizedLineItem[]
): { cart: NormalizedCart; counter: number } => {
  const sum = items.reduce((acc, item) => {
    const unitPrice = Math.max(0, parseFloat(item.price?.amount || "0") || 0);
    const qty = Math.max(1, Math.min(99, item.quantity || 1));
    return acc + unitPrice * qty;
  }, 0);
  const totalQty = items.reduce((acc, item) => acc + Math.max(1, item.quantity || 1), 0);
  return { cart: { lineItems: items, subtotal: { amount: sum.toFixed(2) } }, counter: totalQty };
};

export const saveLocalCart = (items: NormalizedLineItem[], userEmail?: string) => {
  if (typeof window === "undefined") return;
  const key = getCartStorageKey(userEmail);
  if (key) localStorage.setItem(key, JSON.stringify(items));
};

export const loadLocalCart = (userEmail?: string): NormalizedLineItem[] => {
  if (typeof window === "undefined") return [];
  localStorage.removeItem(LEGACY_CART_KEY);
  const key = getCartStorageKey(userEmail);
  if (!key) return [];
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (i): i is NormalizedLineItem =>
        Boolean(i && typeof i._id === "string" && typeof i.quantity === "number" && i.quantity > 0)
    );
  } catch {
    return [];
  }
};

const remoteCartCache = new Set<string>();
const remoteCartFlagKey = (email: string) => `vistora_wix_cart_v2_${email.toLowerCase().trim()}`;

export const hasRemoteWixCart = (email: string): boolean => {
  const clean = email.toLowerCase().trim();
  if (remoteCartCache.has(clean)) return true;
  if (typeof window === "undefined") return false;
  return localStorage.getItem(remoteCartFlagKey(clean)) === "1";
};

export const setRemoteWixCart = (email: string | undefined, exists: boolean): void => {
  if (!email) {
    remoteCartCache.clear();
    return;
  }
  const clean = email.toLowerCase().trim();
  if (exists) {
    remoteCartCache.add(clean);
    if (typeof window !== "undefined") localStorage.setItem(remoteCartFlagKey(clean), "1");
    return;
  }
  remoteCartCache.delete(clean);
  if (typeof window !== "undefined") localStorage.removeItem(remoteCartFlagKey(clean));
};

export const mergeLocalCartLine = (
  items: NormalizedLineItem[],
  entry: { productId: string; variantId: string; quantity: number; name: string; price: number; image: string; slug?: string }
): NormalizedLineItem[] => {
  const next = [...items];
  const lineKey = `${entry.productId}__${entry.variantId || "default"}`;
  const idx = next.findIndex((i) => i._id === lineKey);
  if (idx > -1) {
    next[idx] = { ...next[idx], quantity: Math.min(99, next[idx].quantity + entry.quantity) };
    return next;
  }
  next.push({
    _id: lineKey,
    productId: entry.productId,
    slug: entry.slug,
    variantId: entry.variantId,
    productName: { original: entry.name },
    quantity: entry.quantity,
    price: { amount: entry.price.toFixed(2) },
    image: entry.image,
    availability: { status: "IN STOCK" },
  });
  return next;
};
