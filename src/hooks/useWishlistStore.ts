import { create } from "zustand";
import { useToastStore } from "./useToastStore";

export interface WishlistItem {
  id: string;
  slug: string;
  name: string;
  price: number;
  imageUrl: string;
}

interface WishlistState {
  items: WishlistItem[];
  activeEmail?: string;
  hydrated: boolean;
  syncForUser: (userEmail?: string) => void;
  toggleItem: (item: WishlistItem, silent?: boolean) => void;
  isInWishlist: (id: string) => boolean;
  clearWishlist: () => void;
}

const LEGACY_WISHLIST_KEY = "vistora_wishlist_v1";
const GUEST_WISHLIST_KEY = "vistora_wishlist_guest_v2";
const getWishlistKey = (email?: string) =>
  email ? `vistora_wishlist_v2_${email.toLowerCase().trim()}` : GUEST_WISHLIST_KEY;

const readList = (key: string): WishlistItem[] => {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(key);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed)
      ? parsed.filter((i): i is WishlistItem => Boolean(i && typeof i.id === "string" && typeof i.name === "string"))
      : [];
  } catch {
    return [];
  }
};

const writeList = (key: string, items: WishlistItem[]) => {
  if (typeof window !== "undefined") localStorage.setItem(key, JSON.stringify(items));
};

export const useWishlistStore = create<WishlistState>((set, get) => ({
  items: [],
  activeEmail: undefined,
  hydrated: false,

  syncForUser: (userEmail) => {
    if (typeof window === "undefined") return;
    localStorage.removeItem(LEGACY_WISHLIST_KEY);
    const cleanEmail = userEmail?.toLowerCase().trim() || undefined;
    if (get().hydrated && get().activeEmail === cleanEmail) return;

    if (!cleanEmail) {
      set({ items: readList(GUEST_WISHLIST_KEY), activeEmail: undefined, hydrated: true });
      return;
    }

    const userKey = getWishlistKey(cleanEmail);
    const accountItems = readList(userKey);
    const guestItems = readList(GUEST_WISHLIST_KEY);
    const seen = new Set(accountItems.map((i) => i.id));
    const merged = [...accountItems, ...guestItems.filter((g) => !seen.has(g.id))];

    if (guestItems.length > 0) {
      writeList(userKey, merged);
      localStorage.removeItem(GUEST_WISHLIST_KEY);
    }
    set({ items: merged, activeEmail: cleanEmail, hydrated: true });
  },

  toggleItem: (item, silent = false) => {
    const current = get().items;
    const exists = current.some((i) => i.id === item.id);
    const updated = exists ? current.filter((i) => i.id !== item.id) : [...current, item];

    writeList(getWishlistKey(get().activeEmail), updated);
    set({ items: updated });
    if (!silent) {
      useToastStore.getState().addToast(exists ? "Removed from Wishlist" : "Saved to Wishlist", "info", item.name);
    }
  },

  isInWishlist: (id) => get().items.some((i) => i.id === id),

  clearWishlist: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem(getWishlistKey(get().activeEmail));
    }
    set({ items: [] });
  },
}));
