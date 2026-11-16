"use client";

import { CartItemMeta, useCartStore } from "@/hooks/useCartStore";
import { useGuardedCartAction } from "@/hooks/useGuardedCartAction";
import { computeRemainingStock, getInCartQuantity, useInventoryStore } from "@/hooks/useInventoryStore";
import { useToastStore } from "@/hooks/useToastStore";
import { useWishlistStore } from "@/hooks/useWishlistStore";
import React, { useEffect, useState } from "react";
import Button from "./ui/Button";
import { HeartIcon } from "./ui/Icons";

export default function Add({
  productId,
  variantId,
  stockNumber,
  meta,
}: {
  productId: string;
  variantId: string;
  stockNumber: number;
  meta?: CartItemMeta;
}) {
  const [quantity, setQuantity] = useState(1);
  const { addToBagSafely, isLoading } = useGuardedCartAction();
  const { items: wishlistItems, toggleItem } = useWishlistStore();
  const cartItems = useCartStore((s) => s.cart.lineItems);
  const { purchased, hydrateInventory } = useInventoryStore();
  const addToast = useToastStore((s) => s.addToast);

  useEffect(() => { hydrateInventory(); }, [hydrateInventory]);

  const remainingStock = computeRemainingStock(purchased, productId, variantId, stockNumber);
  const inBagQty = getInCartQuantity(cartItems, productId, variantId);
  const maxAddable = Math.max(0, remainingStock - inBagQty);
  const isSaved = wishlistItems.some((i) => i.id === productId);

  useEffect(() => {
    setQuantity(1);
  }, [variantId, remainingStock]);

  const handleQuantity = (type: "inc" | "dec") => {
    if (type === "dec" && quantity > 1) setQuantity((prev) => prev - 1);
    if (type === "inc" && quantity < Math.max(1, maxAddable)) setQuantity((prev) => prev + 1);
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-navy-950">Quantity</h2>
        {remainingStock < 1 ? (
          <span className="text-xs font-semibold text-red-700 bg-red-50 px-3 py-1 rounded-full">
            Currently Out of Stock
          </span>
        ) : (
          <span className="text-xs text-slate-600">
            Only <strong className="text-brand-700 font-semibold">{remainingStock} pieces</strong> available in atelier
          </span>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <div className="bg-slate-100 py-2.5 px-5 rounded-full flex items-center justify-between w-36 border border-slate-200/80">
          <button
            type="button"
            aria-label="Decrease quantity"
            className="cursor-pointer text-lg font-bold text-navy-950 hover:text-brand-600 disabled:opacity-40 px-1"
            onClick={() => handleQuantity("dec")}
            disabled={quantity <= 1 || remainingStock < 1}
          >
            -
          </button>
          <span className="font-semibold text-sm text-navy-950">{quantity}</span>
          <button
            type="button"
            aria-label="Increase quantity"
            className="cursor-pointer text-lg font-bold text-navy-950 hover:text-brand-600 disabled:opacity-40 px-1"
            onClick={() => handleQuantity("inc")}
            disabled={quantity >= maxAddable || remainingStock < 1}
          >
            +
          </button>
        </div>

        <Button
          size="lg"
          className="flex-1 min-w-[160px]"
          isLoading={isLoading}
          disabled={remainingStock < 1}
          onClick={() => {
            if (maxAddable < 1) {
              addToast("Stock Limit Reached", "info", `Only ${remainingStock} available — all already in your bag.`);
              return;
            }
            addToBagSafely(productId, variantId, Math.min(quantity, maxAddable), meta);
          }}
        >
          {isLoading ? "Adding to Bag..." : remainingStock < 1 ? "Out of Stock" : "Add to Shopping Bag"}
        </Button>

        <button
          type="button"
          aria-label={isSaved ? "Remove from Wishlist" : "Save to Wishlist"}
          onClick={() =>
            toggleItem({
              id: productId,
              slug: meta?.slug || productId,
              name: meta?.name || "Vistora Piece",
              price: meta?.price || 0,
              imageUrl: meta?.image || "/product.png",
            })
          }
          className={`p-3.5 rounded-full ring-1 transition-all ${
            isSaved ? "bg-brand-50 text-brand-600 ring-brand-600" : "bg-white text-navy-900 ring-slate-300 hover:ring-navy-900"
          }`}
        >
          <HeartIcon className="w-5 h-5" filled={isSaved} />
        </button>
      </div>
    </div>
  );
}
