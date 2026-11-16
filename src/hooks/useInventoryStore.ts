import { create } from "zustand";
import { DEFAULT_VARIANT_ID } from "@/lib/env";

const INVENTORY_STORAGE_KEY = "vistora_purchased_stock_v1";

export const getStockKey = (productId: string, variantId?: string): string =>
  `${productId}__${variantId || DEFAULT_VARIANT_ID}`;

export const resolveBaseStock = (
  productStock?: { trackInventory?: boolean; quantity?: number | null; inStock?: boolean } | null,
  variantStock?: { trackQuantity?: boolean; quantity?: number | null; inStock?: boolean } | null
): number => {
  if (variantStock) {
    if (variantStock.trackQuantity === false) return variantStock.inStock ? 10 : 0;
    return variantStock.quantity ?? (variantStock.inStock !== false ? 10 : 0);
  }
  if (!productStock) return 10;
  if (productStock.trackInventory === false) return productStock.inStock ? 10 : 0;
  return productStock.quantity ?? (productStock.inStock !== false ? 10 : 0);
};

export const computeRemainingStock = (
  purchased: Record<string, number>,
  productId: string,
  variantId: string | undefined,
  baseStock: number
): number => {
  const sold = purchased[getStockKey(productId, variantId)] || 0;
  return Math.max(0, baseStock - sold);
};

export const resolveItemMaxStock = (
  item: { productId: string; variantId?: string; maxStock?: number },
  catalog: { _id?: string; stock?: { trackInventory?: boolean; quantity?: number | null; inStock?: boolean } | null; variants?: { _id?: string; stock?: { trackQuantity?: boolean; quantity?: number | null; inStock?: boolean } | null }[] }[]
): number => {
  if (item.maxStock !== undefined) return item.maxStock;
  const prod = catalog.find((p) => p._id === item.productId);
  if (!prod) return 10;
  const variant = item.variantId ? prod.variants?.find((v) => v._id === item.variantId) : undefined;
  return resolveBaseStock(prod.stock, variant?.stock);
};

export const getInCartQuantity = (
  items: { productId: string; variantId?: string; quantity: number }[],
  productId: string,
  variantId?: string
): number => {
  const targetVar = variantId || DEFAULT_VARIANT_ID;
  return items
    .filter((i) => i.productId === productId && (i.variantId || DEFAULT_VARIANT_ID) === targetVar)
    .reduce((sum, i) => sum + Math.max(0, i.quantity || 0), 0);
};

const readStoredInventory = (): Record<string, number> => {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(INVENTORY_STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : {};
    return parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed : {};
  } catch {
    return {};
  }
};

interface InventoryState {
  purchased: Record<string, number>;
  hydrated: boolean;
  hydrateInventory: () => void;
  recordPurchase: (items: { _id: string; productId: string; variantId?: string; quantity: number }[]) => void;
}

export const useInventoryStore = create<InventoryState>((set, get) => ({
  purchased: {},
  hydrated: false,

  hydrateInventory: () => {
    if (typeof window === "undefined" || get().hydrated) return;
    set({ purchased: readStoredInventory(), hydrated: true });
  },

  recordPurchase: (items) => {
    if (!items.length) return;
    const base = get().hydrated ? get().purchased : readStoredInventory();
    const next = { ...base };
    for (const item of items) {
      const prodId = item.productId || (item._id.includes("__") ? item._id.split("__")[0] : "");
      if (!prodId) continue;
      const varId = item.variantId || (item._id.includes("__") ? item._id.split("__")[1] : undefined);
      const key = getStockKey(prodId, varId);
      next[key] = (next[key] || 0) + Math.max(1, item.quantity || 1);
    }
    if (typeof window !== "undefined") {
      localStorage.setItem(INVENTORY_STORAGE_KEY, JSON.stringify(next));
    }
    set({ purchased: next, hydrated: true });
  },
}));
