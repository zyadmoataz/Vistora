"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { buildLoginHref, getBrowserRelativeUrl } from "@/lib/securityHelpers";
import useWixClient from "./useWixClient";
import { useAuthStore } from "./useAuthStore";
import { useCartStore } from "./useCartStore";
import { useInventoryStore } from "./useInventoryStore";
import { useWishlistStore } from "./useWishlistStore";

/**
 * Coordinates auth, wishlist, and user-scoped cart hydration across header navigation bars.
 */
export function useSessionSync() {
  const router = useRouter();
  const wixClient = useWixClient();
  const { counter, getCart } = useCartStore();
  const { isAuthenticated, isHydrated, user, hydrateAuth, logoutUser } = useAuthStore();
  const hydrateInventory = useInventoryStore((s) => s.hydrateInventory);
  const { items: wishlistItems, syncForUser } = useWishlistStore();

  const isLoggedIn = isHydrated && (isAuthenticated || wixClient.auth.loggedIn());

  useEffect(() => {
    hydrateAuth(wixClient);
    hydrateInventory();
  }, [wixClient, hydrateAuth, hydrateInventory]);

  useEffect(() => {
    if (!isHydrated) return;
    const memberEmail = isLoggedIn ? user?.email || "member@vistora.shop" : undefined;
    getCart(wixClient, isLoggedIn ? user?.email : undefined);
    syncForUser(memberEmail);
  }, [isHydrated, isLoggedIn, user?.email, wixClient, getCart, syncForUser]);

  const openAuthPage = (mode: "login" | "register" = "login", fallbackPath = "/") => {
    router.push(buildLoginHref(getBrowserRelativeUrl(fallbackPath), mode));
  };

  return {
    wixClient,
    isLoggedIn,
    user,
    counter,
    wishlistItems,
    logoutUser,
    openAuthPage,
  };
}
