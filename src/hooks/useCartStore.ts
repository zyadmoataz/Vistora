import { create } from "zustand";
import { WixClient } from "@/context/wixContext";
import { DEFAULT_VARIANT_ID, ENV } from "@/lib/env";
import { FALLBACK_PRODUCTS } from "@/lib/fallbackProducts";
import { EXTRA_FALLBACK_PRODUCTS } from "@/lib/fallbackProductsExtra";
import { CartItemMeta, computeCartTotals, hasRemoteWixCart, loadLocalCart, mapWixLineItems, mergeLocalCartLine, NormalizedCart, NormalizedLineItem, saveLocalCart, setRemoteWixCart } from "@/lib/cartHelpers";
import { useToastStore } from "./useToastStore";

export type { CartItemMeta, NormalizedCart, NormalizedLineItem };

const LOCAL_CATALOG = [...FALLBACK_PRODUCTS, ...EXTRA_FALLBACK_PRODUCTS];
const EMPTY_CART: NormalizedCart = { lineItems: [], subtotal: { amount: "0.00" } };
let inFlightSyncKey: string | null = null;
const syncedThisLoad = new Set<string>();

type CartState = {
  cart: NormalizedCart;
  activeEmail?: string;
  isLoading: boolean;
  counter: number;
  getCart: (wixClient: WixClient, userEmail?: string) => Promise<void>;
  addItem: (wixClient: WixClient, productId: string, variantId: string, quantity: number, meta?: CartItemMeta) => Promise<void>;
  updateQuantity: (itemId: string, delta: number) => void;
  removeItem: (wixClient: WixClient, itemId: string) => Promise<void>;
  clearCart: () => void;
  resetSessionCart: () => void;
};

export const useCartStore = create<CartState>((set, get) => ({
  cart: EMPTY_CART,
  activeEmail: undefined,
  isLoading: false,
  counter: 0,

  getCart: async (wixClient, userEmail) => {
    const isMember = Boolean(userEmail || wixClient.auth.loggedIn());
    if (!isMember) {
      set({ cart: EMPTY_CART, counter: 0, activeEmail: undefined, isLoading: false });
      return;
    }

    const emailKey = (userEmail || "member@vistora.shop").toLowerCase().trim();
    const localItems = loadLocalCart(emailKey);
    const shouldFetchRemote = ENV.IS_WIX_CONFIGURED && wixClient.auth.loggedIn() && hasRemoteWixCart(emailKey) && !syncedThisLoad.has(emailKey);
    if (inFlightSyncKey === emailKey || (get().activeEmail === emailKey && !shouldFetchRemote)) return;

    if (shouldFetchRemote) {
      inFlightSyncKey = emailKey;
      try {
        const remote = await wixClient.currentCart.getCurrentCart();
        syncedThisLoad.add(emailKey);
        if (remote?.lineItems && remote.lineItems.length > 0) {
          const mapped = mapWixLineItems(remote.lineItems);
          saveLocalCart(mapped, emailKey);
          set({ ...computeCartTotals(mapped), activeEmail: emailKey, isLoading: false });
          return;
        }
        setRemoteWixCart(emailKey, false);
      } catch {
        syncedThisLoad.add(emailKey);
        setRemoteWixCart(emailKey, false);
      } finally {
        inFlightSyncKey = null;
      }
    }
    set({ ...computeCartTotals(localItems), activeEmail: emailKey, isLoading: false });
  },

  addItem: async (wixClient, productId, variantId, quantity, meta) => {
    set({ isLoading: true });
    const emailKey = get().activeEmail || "member@vistora.shop";
    if (!productId.startsWith("prod-vistora-")) {
      try {
        const hasVar = variantId && variantId !== DEFAULT_VARIANT_ID;
        const res = await wixClient.currentCart.addToCurrentCart({
          lineItems: [{ catalogReference: { appId: ENV.WIX_APP_ID, catalogItemId: productId, ...(hasVar && { options: { variantId } }) }, quantity }],
        });
        if (res?.cart?.lineItems) {
          setRemoteWixCart(emailKey, true);
          syncedThisLoad.add(emailKey);
          const mapped = mapWixLineItems(res.cart.lineItems, meta);
          saveLocalCart(mapped, emailKey);
          set({ ...computeCartTotals(mapped), activeEmail: emailKey, isLoading: false });
          useToastStore.getState().addToast("Added to Cart", "success", `${quantity}x ${meta?.name || "Item"}`);
          return;
        }
      } catch {
        // Fallback to local cart handling
      }
    }

    const catalogItem = LOCAL_CATALOG.find((p) => p._id === productId);
    const itemName = meta?.name || catalogItem?.name || "Vistora Essential";
    const itemPrice = meta?.price ?? catalogItem?.price?.discountedPrice ?? catalogItem?.price?.price ?? 120;
    const itemImage = meta?.image || catalogItem?.media?.mainMedia?.image?.url || "/product.png";
    const currentItems = mergeLocalCartLine(get().cart.lineItems, { productId, variantId, quantity, name: itemName, price: itemPrice, image: itemImage, slug: meta?.slug || catalogItem?.slug });

    saveLocalCart(currentItems, emailKey);
    set({ ...computeCartTotals(currentItems), activeEmail: emailKey, isLoading: false });
    useToastStore.getState().addToast("Added to Cart", "success", `${quantity}x ${itemName}`);
  },

  updateQuantity: (itemId, delta) => {
    const items = get().cart.lineItems.map((i) => (i._id === itemId ? { ...i, quantity: Math.max(0, Math.min(99, i.quantity + delta)) } : i)).filter((i) => i.quantity > 0);
    saveLocalCart(items, get().activeEmail);
    set({ ...computeCartTotals(items) });
  },

  removeItem: async (wixClient, itemId) => {
    set({ isLoading: true });
    try {
      if (!itemId.includes("__")) await wixClient.currentCart.removeLineItemsFromCurrentCart([itemId]);
    } catch {
      // Proceed with local removal
    }
    const filtered = get().cart.lineItems.filter((i) => i._id !== itemId);
    if (filtered.length === 0) setRemoteWixCart(get().activeEmail, false);
    saveLocalCart(filtered, get().activeEmail);
    set({ ...computeCartTotals(filtered), isLoading: false });
    useToastStore.getState().addToast("Removed from Cart", "info");
  },

  clearCart: () => {
    setRemoteWixCart(get().activeEmail, false);
    saveLocalCart([], get().activeEmail);
    set({ cart: EMPTY_CART, counter: 0, isLoading: false });
  },

  resetSessionCart: () => {
    inFlightSyncKey = null;
    syncedThisLoad.clear();
    set({ cart: EMPTY_CART, activeEmail: undefined, counter: 0, isLoading: false });
  },
}));
