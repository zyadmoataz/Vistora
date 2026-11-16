import { create } from "zustand";
import Cookies from "js-cookie";
import { WixClient } from "@/context/wixContext";
import { sanitizePlainText } from "@/lib/securityHelpers";
import { OrderRecord } from "@/lib/checkoutHelper";
import { useToastStore } from "./useToastStore";
import { useCartStore } from "./useCartStore";
import { useWishlistStore } from "./useWishlistStore";

export type { OrderRecord };

export interface UserProfile {
  name: string;
  email: string;
  role: "Member" | "VIP Reviewer";
  avatarInitials: string;
  joinedAt: string;
}

interface AuthState {
  user: UserProfile | null;
  orders: OrderRecord[];
  isAuthenticated: boolean;
  isHydrated: boolean;
  hydrateAuth: (wixClient?: WixClient) => void;
  setLoggedInUser: (profile: UserProfile) => void;
  loginAsDemoReviewer: () => void;
  updateProfileName: (name: string) => void;
  addOrderRecord: (order: OrderRecord) => void;
  logoutUser: (wixClient?: WixClient) => Promise<void>;
}

const USER_STORAGE_KEY = "vistora_user_v2";
const getUserOrdersKey = (email: string) => `vistora_orders_v2_${email.toLowerCase().trim()}`;

const loadOrdersForUser = (email: string): OrderRecord[] => {
  if (typeof window === "undefined" || !email) return [];
  try {
    const raw = localStorage.getItem(getUserOrdersKey(email));
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  orders: [],
  isAuthenticated: false,
  isHydrated: false,

  hydrateAuth: (wixClient) => {
    if (typeof window === "undefined") return;
    try {
      localStorage.removeItem("vistora_user_v1");
      localStorage.removeItem("vistora_orders_v1");

      const savedUser = localStorage.getItem(USER_STORAGE_KEY);
      if (savedUser) {
        const parsed: UserProfile = JSON.parse(savedUser);
        if (parsed?.email) {
          set({ user: parsed, isAuthenticated: true, orders: loadOrdersForUser(parsed.email), isHydrated: true });
          return;
        }
      }

      if (wixClient?.auth.loggedIn()) {
        const wixProfile: UserProfile = {
          name: "Vistora Member",
          email: "member@vistora.shop",
          role: "Member",
          avatarInitials: "VM",
          joinedAt: "2025",
        };
        set({ user: wixProfile, isAuthenticated: true, orders: loadOrdersForUser(wixProfile.email), isHydrated: true });
        return;
      }
    } catch {
      // Ignore storage parse error
    }
    set({ user: null, isAuthenticated: false, orders: [], isHydrated: true });
  },

  setLoggedInUser: (profile) => {
    if (typeof window !== "undefined") {
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(profile));
    }
    set({ user: profile, isAuthenticated: true, orders: loadOrdersForUser(profile.email), isHydrated: true });
  },

  loginAsDemoReviewer: () => {
    get().setLoggedInUser({
      name: "Alex Morgan (Demo)",
      email: "alex.morgan@vistora.shop",
      role: "VIP Reviewer",
      avatarInitials: "AM",
      joinedAt: "Nov 2025",
    });
    useToastStore.getState().addToast("Welcome back, Alex!", "success", "Signed in with Demo VIP account.");
  },

  updateProfileName: (name) => {
    const current = get().user;
    if (!current || !get().isAuthenticated) return;
    const clean = sanitizePlainText(name, 60);
    if (!clean) return;
    const initials = clean.split(" ").map((p) => p[0]).join("").toUpperCase().slice(0, 2) || "VM";
    const updated: UserProfile = { ...current, name: clean, avatarInitials: initials };
    if (typeof window !== "undefined") localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(updated));
    set({ user: updated });
    useToastStore.getState().addToast("Profile updated", "success");
  },

  addOrderRecord: (order) => {
    const current = get().user;
    if (!current?.email || !get().isAuthenticated) return;
    const updated = [order, ...get().orders];
    if (typeof window !== "undefined") {
      localStorage.setItem(getUserOrdersKey(current.email), JSON.stringify(updated));
    }
    set({ orders: updated });
  },

  logoutUser: async (wixClient) => {
    Cookies.remove("refreshToken", { path: "/" });
    if (typeof window !== "undefined") localStorage.removeItem(USER_STORAGE_KEY);
    useCartStore.getState().resetSessionCart();
    set({ user: null, isAuthenticated: false, orders: [], isHydrated: true });
    useWishlistStore.getState().syncForUser(undefined);
    useToastStore.getState().addToast("Signed out securely", "info");
    try {
      if (wixClient?.auth.loggedIn()) await wixClient.auth.logout(window.location.origin);
    } catch {
      // Ignore Wix logout redirect failure in demo mode
    }
  },
}));
