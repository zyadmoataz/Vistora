"use client";

import React from "react";
import { useGuardedCartAction } from "@/hooks/useGuardedCartAction";
import { useWishlistStore } from "@/hooks/useWishlistStore";
import { DEFAULT_VARIANT_ID } from "@/lib/env";
import { HeartIcon } from "./ui/Icons";

interface ProductCardActionsProps {
  productId: string;
  slug: string;
  name: string;
  price: number;
  imageUrl: string;
  mode: "wishlist-icon" | "add-button";
}

export default function ProductCardActions({
  productId,
  slug,
  name,
  price,
  imageUrl,
  mode,
}: ProductCardActionsProps) {
  const { addToBagSafely, isLoading } = useGuardedCartAction();
  const { items, toggleItem } = useWishlistStore();
  const isSaved = items.some((i) => i.id === productId);

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
      disabled={isLoading}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        addToBagSafely(productId, DEFAULT_VARIANT_ID, 1, {
          name,
          price,
          image: imageUrl,
          slug,
        });
      }}
      className="w-max rounded-full ring-1 ring-slate-300 py-2 px-4 text-navy-950 font-semibold text-xs hover:bg-brand-600 hover:text-white hover:ring-brand-600 transition-all active:scale-95 disabled:opacity-50"
    >
      + Quick Add
    </button>
  );
}
