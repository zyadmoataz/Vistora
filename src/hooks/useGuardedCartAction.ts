"use client";

import { useRouter } from "next/navigation";
import { CartItemMeta, NormalizedLineItem, useCartStore } from "./useCartStore";
import { useAuthStore } from "./useAuthStore";
import { useInventoryStore } from "./useInventoryStore";
import { useToastStore } from "./useToastStore";
import useWixClient from "./useWixClient";
import { buildOrderRecord } from "@/lib/checkoutHelper";
import { buildLoginHref, getBrowserRelativeUrl } from "@/lib/securityHelpers";

/**
 * Shared authenticated cart & checkout coordinator preventing duplicated guard, inventory, and redirect logic.
 */
export function useGuardedCartAction() {
  const wixClient = useWixClient();
  const router = useRouter();
  const { addItem, clearCart, isLoading } = useCartStore();
  const { isAuthenticated, addOrderRecord } = useAuthStore();
  const recordPurchase = useInventoryStore((s) => s.recordPurchase);
  const { addToast } = useToastStore();

  const addToBagSafely = async (
    productId: string,
    variantId: string,
    quantity: number,
    meta?: CartItemMeta
  ): Promise<boolean> => {
    if (!isAuthenticated && !wixClient.auth.loggedIn()) {
      addToast("Sign in required", "info", "Please log in or sign up to add items to your cart.");
      router.push(buildLoginHref(getBrowserRelativeUrl()));
      return false;
    }
    await addItem(wixClient, productId, variantId, quantity, meta);
    return true;
  };

  const completeCheckout = (
    items: NormalizedLineItem[],
    finalTotal: number,
    paymentMethod = "Express Checkout",
    onBeforeNavigate?: () => void
  ) => {
    if (items.length === 0) return;
    if (!isAuthenticated && !wixClient.auth.loggedIn()) {
      addToast("Sign in required", "info", "Please sign in before placing an order.");
      onBeforeNavigate?.();
      router.push(buildLoginHref("/cart"));
      return;
    }
    const order = buildOrderRecord(items, finalTotal, paymentMethod);
    addOrderRecord(order);
    recordPurchase(items);
    clearCart(wixClient);
    addToast("Order Confirmed!", "success", `Reference #${order.orderId}`);
    onBeforeNavigate?.();
    router.push(`/success?orderId=${order.orderId}`);
  };

  return { addToBagSafely, completeCheckout, isLoading };
}
