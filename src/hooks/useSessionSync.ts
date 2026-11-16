"use client";

import { useEffect } from "react";
import useWixClient from "./useWixClient";
import { useAuthStore } from "./useAuthStore";
import { useCartStore } from "./useCartStore";
import { useWishlistStore } from "./useWishlistStore";

/**
 * Coordinates auth, wishlist, and user-scoped cart hydration across header navigation bars.
 */
export function useSessionSync() {
  const wixClient = useWixClient();
  const { counter, getCart } = useCartStore();
  const { isAuthenticated, isHydrated, user, hydrateAuth, logoutUser } = useAuthStore();
  const { items: wishlistItems, syncForUser } = useWishlistStore();

  const isLoggedIn = isHydrated && (isAuthenticated || wixClient.auth.loggedIn());

  useEffect(() => {
    hydrateAuth(wixClient);
  }, [wixClient, hydrateAuth]);

  useEffect(() => {
    if (!isHydrated) return;
    const memberEmail = isLoggedIn ? user?.email || "member@vistora.shop" : undefined;
    getCart(wixClient, isLoggedIn ? user?.email : undefined);
    syncForUser(memberEmail);
  }, [isHydrated, isLoggedIn, user?.email, wixClient, getCart, syncForUser]);

  return {
    wixClient,
    isLoggedIn,
    user,
    counter,
    wishlistItems,
    logoutUser,
  };
}
