import { create } from "zustand";
import { WixClient } from "@/context/wixContext";
import { DEFAULT_VARIANT_ID, ENV } from "@/lib/env";
import { FALLBACK_PRODUCTS } from "@/lib/fallbackProducts";
import { EXTRA_FALLBACK_PRODUCTS } from "@/lib/fallbackProductsExtra";
import { buildCatalogReferenceOptions, CartItemMeta, computeCartTotals, countRawWixProductQuantity, countRemoteProductQuantity, hasRemoteWixCart, isRemoteWixLineItemId, loadLocalCart, mapWixLineItems, mergeLocalCartLine, mergeRemoteAndLocalItems, NormalizedCart, NormalizedLineItem, saveLocalCart, setRemoteWixCart } from "@/lib/cartHelpers";
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
  updateQuantity: (itemId: string, delta: number, wixClient?: WixClient) => void;
  removeItem: (wixClient: WixClient, itemId: string) => Promise<void>;
  clearCart: (wixClient?: WixClient) => void;
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
          const merged = mergeRemoteAndLocalItems(mapWixLineItems(remote.lineItems), localItems);
          saveLocalCart(merged, emailKey);
          set({ ...computeCartTotals(merged), activeEmail: emailKey, isLoading: false });
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
    if (ENV.IS_WIX_CONFIGURED && !productId.startsWith("prod-vistora-")) {
      try {
        const prevRemoteQty = countRemoteProductQuantity(get().cart.lineItems, productId);
        const optionsPayload = buildCatalogReferenceOptions(variantId, meta?.options);
        const res = await wixClient.currentCart.addToCurrentCart({
          lineItems: [{ catalogReference: { appId: ENV.WIX_APP_ID, catalogItemId: productId, ...(optionsPayload && { options: optionsPayload }) }, quantity }],
        });
        const rawRemote = Array.isArray(res?.cart?.lineItems) ? res.cart.lineItems : [];
        const nextRemoteQty = countRawWixProductQuantity(rawRemote, productId);
        if (rawRemote.length > 0 && rawRemote.some((li) => li.catalogReference?.catalogItemId === productId)) {
          setRemoteWixCart(emailKey, true);
          syncedThisLoad.add(emailKey);
          const merged = mergeRemoteAndLocalItems(mapWixLineItems(rawRemote, productId, meta), get().cart.lineItems);
          saveLocalCart(merged, emailKey);
          set({ ...computeCartTotals(merged), activeEmail: emailKey, isLoading: false });
          const msg = nextRemoteQty > prevRemoteQty ? ["Added to Cart", "success", `${quantity}x ${meta?.name || "Item"}`] : ["Bag Updated", "info", `${meta?.name || "Item"} (${nextRemoteQty} in bag)`];
          useToastStore.getState().addToast(msg[0], msg[1] as "success" | "info", msg[2]);
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

  updateQuantity: (itemId, delta, wixClient) => {
    const target = get().cart.lineItems.find((i) => i._id === itemId);
    if (!target) return;
    const nextQty = Math.max(0, Math.min(99, target.quantity + delta));
    const items = get().cart.lineItems.map((i) => (i._id === itemId ? { ...i, quantity: nextQty } : i)).filter((i) => i.quantity > 0);
    if (!items.some((i) => isRemoteWixLineItemId(i._id))) setRemoteWixCart(get().activeEmail, false);
    saveLocalCart(items, get().activeEmail);
    set({ ...computeCartTotals(items) });
    if (wixClient && ENV.IS_WIX_CONFIGURED && isRemoteWixLineItemId(itemId)) {
      const req = nextQty === 0 ? wixClient.currentCart.removeLineItemsFromCurrentCart([itemId]) : wixClient.currentCart.updateCurrentCartLineItemQuantity([{ _id: itemId, quantity: nextQty }]);
      req.catch(() => undefined);
    }
  },

  removeItem: async (wixClient, itemId) => {
    set({ isLoading: true });
    try {
      if (ENV.IS_WIX_CONFIGURED && isRemoteWixLineItemId(itemId)) await wixClient.currentCart.removeLineItemsFromCurrentCart([itemId]);
    } catch {
      // Proceed with local removal
    }
    const filtered = get().cart.lineItems.filter((i) => i._id !== itemId);
    if (!filtered.some((i) => isRemoteWixLineItemId(i._id))) setRemoteWixCart(get().activeEmail, false);
    saveLocalCart(filtered, get().activeEmail);
    set({ ...computeCartTotals(filtered), isLoading: false });
    useToastStore.getState().addToast("Removed from Cart", "info");
  },

  clearCart: (wixClient) => {
    if (wixClient && ENV.IS_WIX_CONFIGURED) wixClient.currentCart.deleteCurrentCart().catch(() => undefined);
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
