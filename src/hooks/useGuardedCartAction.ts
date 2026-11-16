"use client";

import { useRouter } from "next/navigation";
import { CartItemMeta, useCartStore } from "./useCartStore";
import { useAuthStore } from "./useAuthStore";
import { useToastStore } from "./useToastStore";
import useWixClient from "./useWixClient";
import { buildLoginHref, getBrowserRelativeUrl } from "@/lib/securityHelpers";

/**
 * Shared authenticated add-to-bag guard preventing duplicated login redirects across components.
 */
export function useGuardedCartAction() {
  const wixClient = useWixClient();
  const router = useRouter();
  const { addItem, isLoading } = useCartStore();
  const { isAuthenticated } = useAuthStore();
  const { addToast } = useToastStore();

  const addToBagSafely = async (
    productId: string,
    variantId: string,
    quantity: number,
    meta?: CartItemMeta
  ) => {
    if (!isAuthenticated && !wixClient.auth.loggedIn()) {
      addToast("Sign in required", "info", "Please log in or sign up to add items to your cart.");
      router.push(buildLoginHref(getBrowserRelativeUrl()));
      return;
    }
    await addItem(wixClient, productId, variantId, quantity, meta);
  };

  return { addToBagSafely, isLoading };
}
