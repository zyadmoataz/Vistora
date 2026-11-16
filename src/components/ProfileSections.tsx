"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import EmptyState from "@/components/ui/EmptyState";
import { useGuardedCartAction } from "@/hooks/useGuardedCartAction";
import { useCartStore } from "@/hooks/useCartStore";
import { OrderRecord } from "@/hooks/useAuthStore";
import { computeRemainingStock, getInCartQuantity, resolveBaseStock, useInventoryStore } from "@/hooks/useInventoryStore";
import { useToastStore } from "@/hooks/useToastStore";
import { WishlistItem } from "@/hooks/useWishlistStore";
import { resolveDefaultProductSelection } from "@/lib/wixCartMapper";
import { ALL_FALLBACK_PRODUCTS } from "@/lib/wixProductNormalizer";

export function ProfileOrdersTab({ orders }: { orders: OrderRecord[] }) {
  if (orders.length === 0) {
    return (
      <EmptyState
        title="No orders placed yet"
        description="When you complete a checkout, your order reference, status timeline, and itemized receipt will appear here."
        actionLabel="Start Shopping"
        actionHref="/list"
      />
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {orders.map((ord) => (
        <div key={ord.orderId} className="p-6 rounded-3xl border border-slate-200 bg-white shadow-soft flex flex-col gap-4">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <span className="text-xs text-slate-600 font-medium">Order Reference</span>
              <h3 className="text-lg font-bold text-navy-950">#{ord.orderId}</h3>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <span className="text-slate-600">{ord.createdAt}</span>
              <Badge variant="success">{ord.status}</Badge>
              <span className="text-base font-bold text-navy-950">${ord.total.toFixed(2)}</span>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {ord.items.map((item) => (
              <div key={item.id} className="flex items-center gap-3 bg-slate-50 p-3 rounded-2xl">
                <Image width={48} height={60} src={item.image || "/product.png"} alt={item.name} className="rounded-xl object-cover w-12 h-14 bg-white" />
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-navy-950 truncate">{item.name}</p>
                  <p className="text-xs text-slate-600">Qty: {item.quantity} × ${item.price}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export function ProfileWishlistTab({
  wishlist,
  toggleItem,
}: {
  wishlist: WishlistItem[];
  toggleItem: (item: WishlistItem) => void;
}) {
  const { addToBagSafely } = useGuardedCartAction();
  const cartItems = useCartStore((s) => s.cart.lineItems);
  const purchased = useInventoryStore((s) => s.purchased);
  const addToast = useToastStore((s) => s.addToast);

  if (wishlist.length === 0) {
    return (
      <EmptyState
        title="Your wishlist is empty"
        description="Tap the heart icon on any piece across our catalog to save it here for quick access."
        actionLabel="Explore Collection"
        actionHref="/list"
      />
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {wishlist.map((item) => {
        const matchedProd = ALL_FALLBACK_PRODUCTS.find((p) => p._id === item.id);
        const sel = resolveDefaultProductSelection(matchedProd || {});
        const pickedVariant = matchedProd?.variants?.find((v) => v._id === sel.variantId);
        const maxStock = resolveBaseStock(matchedProd?.stock, pickedVariant?.stock);
        const remaining = computeRemainingStock(purchased, item.id, sel.variantId, maxStock);
        const isSoldOut = remaining < 1;

        return (
          <div key={item.id} className="p-4 rounded-3xl border border-slate-200 bg-white flex flex-col gap-3 shadow-soft">
            <Link href={`/${item.slug}`} className="relative h-64 w-full rounded-2xl overflow-hidden bg-slate-100">
              <Image src={item.imageUrl} alt={item.name} fill sizes="25vw" className="object-cover hover:scale-105 transition-transform" />
            </Link>
            <div className="flex justify-between items-start gap-2">
              <Link href={`/${item.slug}`} className="font-semibold text-sm text-navy-950 hover:text-brand-600 truncate">{item.name}</Link>
              <span className="font-bold text-sm text-navy-950">${item.price}</span>
            </div>
            <div className="flex gap-2 pt-1">
              <Button
                variant="secondary"
                size="sm"
                className="flex-1"
                disabled={isSoldOut}
                onClick={() => {
                  if (getInCartQuantity(cartItems, item.id, sel.variantId) >= remaining) {
                    addToast("Stock Limit Reached", "info", `Only ${remaining} available in stock.`);
                    return;
                  }
                  addToBagSafely(item.id, sel.variantId, 1, {
                    name: item.name,
                    price: item.price,
                    image: item.imageUrl,
                    slug: item.slug,
                    options: sel.options,
                    maxStock,
                  });
                }}
              >
                {isSoldOut ? "Sold Out" : "Move to Bag"}
              </Button>
              <Button variant="outline" size="sm" onClick={() => toggleItem(item)} className="px-3 hover:text-red-700 hover:border-red-300">
                Remove
              </Button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
