"use client";

import React from "react";
import { useGuardedCartAction } from "@/hooks/useGuardedCartAction";
import { useCartStore } from "@/hooks/useCartStore";
import { computeRemainingStock, getInCartQuantity, useInventoryStore } from "@/hooks/useInventoryStore";
import { useToastStore } from "@/hooks/useToastStore";
import { useWishlistStore } from "@/hooks/useWishlistStore";
import { DEFAULT_VARIANT_ID } from "@/lib/env";
import { HeartIcon } from "./ui/Icons";

interface ProductCardActionsProps {
  productId: string;
  slug: string;
  name: string;
  price: number;
  imageUrl: string;
  variantId?: string;
  options?: Record<string, string>;
  stockNumber?: number;
  mode: "wishlist-icon" | "add-button";
}

export default function ProductCardActions({
  productId,
  slug,
  name,
  price,
  imageUrl,
  variantId = DEFAULT_VARIANT_ID,
  options,
  stockNumber,
  mode,
}: ProductCardActionsProps) {
  const { addToBagSafely, isLoading } = useGuardedCartAction();
  const { items, toggleItem } = useWishlistStore();
  const purchased = useInventoryStore((s) => s.purchased);
  const cartItems = useCartStore((s) => s.cart.lineItems);
  const addToast = useToastStore((s) => s.addToast);
  const isSaved = items.some((i) => i.id === productId);
  const remaining = stockNumber !== undefined ? computeRemainingStock(purchased, productId, variantId, stockNumber) : undefined;
  const isSoldOut = remaining !== undefined && remaining < 1;

  if (mode === "wishlist-icon") {
    return (
      <button
        type="button"
        aria-label={isSaved ? `Remove ${name} from wishlist` : `Save ${name} to wishlist`}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          toggleItem({ id: productId, slug, name, price, imageUrl });
        }}
        className={`w-9 h-9 rounded-full flex items-center justify-center backdrop-blur-md transition-all shadow-sm ${
          isSaved
            ? "bg-brand-600 text-white"
            : "bg-white/95 text-navy-900 hover:bg-white hover:text-brand-600"
        }`}
      >
        <HeartIcon className="w-4 h-4" filled={isSaved} />
      </button>
    );
  }

  return (
    <button
      type="button"
      disabled={isLoading || isSoldOut}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        if (remaining !== undefined && getInCartQuantity(cartItems, productId, variantId) >= remaining) {
          addToast("Stock Limit Reached", "info", `Only ${remaining} available in stock.`);
          return;
        }
        addToBagSafely(productId, variantId, 1, {
          name,
          price,
          image: imageUrl,
          slug,
          options,
        });
      }}
      className="w-max rounded-full ring-1 ring-slate-300 py-2 px-4 text-navy-950 font-semibold text-xs hover:bg-brand-600 hover:text-white hover:ring-brand-600 transition-all active:scale-95 disabled:opacity-50"
    >
      {isSoldOut ? "Sold Out" : "+ Quick Add"}
    </button>
  );
}
