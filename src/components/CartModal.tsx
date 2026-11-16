"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useCartStore } from "@/hooks/useCartStore";
import { useAuthStore } from "@/hooks/useAuthStore";
import { useToastStore } from "@/hooks/useToastStore";
import { resolveCartImageUrl } from "@/lib/cartHelpers";
import { buildOrderRecord } from "@/lib/checkoutHelper";
import useWixClient from "@/hooks/useWixClient";
import Button from "./ui/Button";
import { CloseIcon } from "./ui/Icons";

export default function CartModal({ onClose }: { onClose?: () => void }) {
  const wixClient = useWixClient();
  const router = useRouter();
  const { cart, isLoading, removeItem, updateQuantity, clearCart } = useCartStore();
  const { isAuthenticated, addOrderRecord } = useAuthStore();
  const { addToast } = useToastStore();
  const [submitting, setSubmitting] = useState(false);

  const items = cart?.lineItems || [];

  const handleExpressCheckout = () => {
    if (items.length === 0) return;
    if (!isAuthenticated && !wixClient.auth.loggedIn()) {
      addToast("Sign in required", "info", "Please sign in before placing an order.");
      onClose?.();
      router.push("/login?redirect=/cart");
      return;
    }

    setSubmitting(true);
    const total = parseFloat(cart.subtotal?.amount || "0");
    const order = buildOrderRecord(items, total, "Express Checkout");
    addOrderRecord(order);
    clearCart(wixClient);
    setSubmitting(false);
    addToast("Order Confirmed!", "success", `Order #${order.orderId} placed.`);
    onClose?.();
    router.push(`/success?orderId=${order.orderId}`);
  };

  return (
    <div role="dialog" aria-label="Shopping Bag" className="w-[340px] sm:w-[400px] absolute p-6 rounded-3xl shadow-elevated bg-white border border-slate-200 top-14 right-0 z-40 flex flex-col gap-5 animate-fade-in-up">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <h2 className="text-lg font-bold text-navy-950">Shopping Bag</h2>
        {onClose && (
          <button type="button" onClick={onClose} aria-label="Close cart modal" className="text-slate-600 hover:text-navy-950 p-1 rounded-full hover:bg-slate-100 transition-colors">
            <CloseIcon className="w-4 h-4" />
          </button>
        )}
      </div>

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-10 text-center gap-3">
          <p className="text-slate-600 text-sm">Your shopping bag is currently empty.</p>
          <Link href="/list" onClick={onClose} className="text-xs font-semibold px-4 py-2 rounded-full bg-navy-950 text-white hover:bg-brand-600 transition-colors">
            Explore Collection
          </Link>
        </div>
      ) : (
        <>
          <div className="flex flex-col gap-4 max-h-[300px] overflow-y-auto pr-1">
            {items.map((item) => (
              <div className="flex gap-3.5 items-start" key={item._id}>
                <Image width={68} height={88} src={resolveCartImageUrl(item.image)} alt={item.productName?.original || "Product"} className="object-cover rounded-xl bg-slate-100 shrink-0 w-[68px] h-[88px]" />
                <div className="flex flex-col justify-between flex-1 min-w-0 h-[88px]">
                  <div>
                    <div className="flex justify-between items-start gap-2">
                      {item.slug ? (
                        <Link href={`/${item.slug}`} onClick={onClose} className="font-semibold text-sm text-navy-950 hover:text-brand-600 truncate">
                          {item.productName?.original}
                        </Link>
                      ) : (
                        <h3 className="font-semibold text-sm text-navy-950 truncate">{item.productName?.original}</h3>
                      )}
                      <span className="text-sm font-bold text-navy-950 shrink-0">${item.price?.amount}</span>
                    </div>
                    <p className="text-xs text-emerald-700 font-medium mt-0.5">{item.availability?.status || "In Stock"}</p>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <div className="inline-flex items-center gap-2 bg-slate-100 rounded-full px-2.5 py-1">
                      <button type="button" aria-label="Decrease quantity" onClick={() => updateQuantity(item._id, -1, wixClient)} className="font-bold text-navy-900 hover:text-brand-600 px-1">-</button>
                      <span className="font-semibold text-navy-950">{item.quantity}</span>
                      <button type="button" aria-label="Increase quantity" onClick={() => updateQuantity(item._id, 1, wixClient)} className="font-bold text-navy-900 hover:text-brand-600 px-1">+</button>
                    </div>
                    <button type="button" disabled={isLoading} onClick={() => removeItem(wixClient, item._id)} className="text-slate-600 hover:text-red-700 font-medium transition-colors">
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-slate-100 pt-4">
            <div className="flex items-center justify-between font-bold text-navy-950">
              <span>Subtotal</span>
              <span className="text-lg">${cart?.subtotal?.amount || "0.00"}</span>
            </div>
            <p className="text-slate-600 text-xs mt-1 mb-4">Complimentary express shipping applied at checkout.</p>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <Link href="/cart" onClick={onClose} className="rounded-full py-2.5 px-4 ring-1 ring-slate-300 text-center font-medium text-navy-900 hover:bg-slate-50 transition-colors">
                View Bag
              </Link>
              <Button size="sm" isLoading={submitting} disabled={isLoading} onClick={handleExpressCheckout}>
                {submitting ? "Processing..." : "Checkout"}
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
