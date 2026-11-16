"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import useWixClient from "@/hooks/useWixClient";
import { useCartStore } from "@/hooks/useCartStore";
import { useAuthStore } from "@/hooks/useAuthStore";
import { useInventoryStore } from "@/hooks/useInventoryStore";
import { useToastStore } from "@/hooks/useToastStore";
import { resolveCartImageUrl } from "@/lib/cartHelpers";
import { buildOrderRecord, calculateCheckoutTotal, VALID_PROMO_CODE } from "@/lib/checkoutHelper";
import Button from "@/components/ui/Button";
import EmptyState from "@/components/ui/EmptyState";
import CustomSelect from "@/components/ui/CustomSelect";

const PAYMENT_OPTIONS = [
  { value: "Credit / Debit Card", label: "Credit / Debit Card (Instant)" },
  { value: "Cash on Delivery", label: "Cash on Delivery (Concierge)" },
  { value: "Bank Wire Transfer", label: "Direct Bank Transfer" },
];

export default function CartPage() {
  const wixClient = useWixClient();
  const router = useRouter();
  const { cart, isLoading, updateQuantity, removeItem, clearCart } = useCartStore();
  const { isAuthenticated, isHydrated, hydrateAuth, addOrderRecord } = useAuthStore();
  const recordPurchase = useInventoryStore((s) => s.recordPurchase);
  const { addToast } = useToastStore();

  const isLoggedIn = isAuthenticated || wixClient.auth.loggedIn();
  const [promoCode, setPromoCode] = useState("");
  const [discountApplied, setDiscountApplied] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("Credit / Debit Card");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => { hydrateAuth(wixClient); }, [hydrateAuth, wixClient]);

  const items = cart?.lineItems || [];
  const { rawSubtotal, discountAmount, finalTotal } = calculateCheckoutTotal(parseFloat(cart?.subtotal?.amount || "0"), discountApplied);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (promoCode.trim().toUpperCase() === VALID_PROMO_CODE) {
      setDiscountApplied(true);
      addToast(`Promo code ${VALID_PROMO_CODE} applied!`, "success", "20% off your order.");
    } else {
      addToast(`Try code ${VALID_PROMO_CODE} for 20% off`, "info");
    }
  };

  const handleCompleteCheckout = () => {
    if (items.length === 0 || !isLoggedIn) return;
    setSubmitting(true);
    const order = buildOrderRecord(items, finalTotal, paymentMethod);
    addOrderRecord(order);
    recordPurchase(items);
    clearCart(wixClient);
    setSubmitting(false);
    addToast("Order Confirmed!", "success", `Reference #${order.orderId}`);
    router.push(`/success?orderId=${order.orderId}`);
  };

  if (!isHydrated) {
    return (
      <main className="container-shell py-16">
        <div className="h-52 rounded-3xl bg-slate-100 animate-pulse" />
      </main>
    );
  }

  if (!isLoggedIn) {
    return (
      <main className="container-shell py-16">
        <EmptyState title="Sign In to Access Your Cart" description="Please log in or create an account to view your shopping bag and complete checkout." actionLabel="Log In / Sign Up" actionHref="/login?redirect=/cart" />
      </main>
    );
  }

  if (items.length === 0) {
    return (
      <main className="container-shell py-16">
        <EmptyState title="Your Shopping Bag is Empty" description="Explore our tailored outerwear, Italian calfskin leather bags, and minimalist footwear." actionLabel="Explore Collection" actionHref="/list" />
      </main>
    );
  }

  return (
    <main className="container-shell py-12">
      <h1 className="text-3xl font-bold text-navy-950 mb-8">Shopping Bag & Checkout</h1>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-7 flex flex-col gap-4">
          {items.map((item) => (
            <div key={item._id} className="p-5 rounded-3xl border border-slate-200 bg-white flex gap-5 items-center shadow-soft">
              <Image width={90} height={115} src={resolveCartImageUrl(item.image)} alt={item.productName?.original || "Product"} className="rounded-2xl object-cover w-[90px] h-[115px] bg-slate-100 shrink-0" />
              <div className="flex-1 min-w-0 flex flex-col justify-between h-[110px]">
                <div className="flex justify-between items-start gap-3">
                  <div>
                    {item.slug ? (
                      <Link href={`/${item.slug}`} className="font-bold text-base text-navy-950 hover:text-brand-600 truncate block">
                        {item.productName?.original}
                      </Link>
                    ) : (
                      <h2 className="font-bold text-base text-navy-950 truncate">{item.productName?.original}</h2>
                    )}
                    <span className="text-xs text-emerald-700 font-medium">In Stock • Ready to Dispatch</span>
                  </div>
                  <span className="font-bold text-base text-navy-950">${item.price?.amount}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="inline-flex items-center gap-3 bg-slate-100 rounded-full px-3.5 py-1.5">
                    <button type="button" aria-label="Decrease item quantity" onClick={() => updateQuantity(item._id, -1, wixClient)} className="font-bold text-navy-900 hover:text-brand-600">-</button>
                    <span className="text-xs font-bold text-navy-950">{item.quantity}</span>
                    <button type="button" aria-label="Increase item quantity" onClick={() => updateQuantity(item._id, 1, wixClient)} className="font-bold text-navy-900 hover:text-brand-600">+</button>
                  </div>
                  <button type="button" disabled={isLoading} onClick={() => removeItem(wixClient, item._id)} className="text-xs text-slate-600 hover:text-red-700 font-medium">Remove</button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="lg:col-span-5">
          <div className="p-6 sm:p-8 rounded-3xl border border-slate-200 bg-slate-50/80 flex flex-col gap-5 sticky top-28">
            <h2 className="text-xl font-bold text-navy-950">Order Summary</h2>
            <form onSubmit={handleApplyPromo} className="flex gap-2">
              <input type="text" value={promoCode} onChange={(e) => setPromoCode(e.target.value)} placeholder="Promo code (try VISTORA20)" aria-label="Promo code" className="flex-1 rounded-full px-4 py-2.5 text-xs bg-white ring-1 ring-slate-300 outline-none focus:ring-2 focus:ring-brand-600" />
              <button type="submit" className="px-5 py-2.5 rounded-full bg-navy-950 text-white text-xs font-semibold hover:bg-brand-600 transition-colors">Apply</button>
            </form>
            <div className="flex flex-col gap-2 text-sm border-y border-slate-200 py-4">
              <div className="flex justify-between text-slate-600"><span>Subtotal</span><span>${rawSubtotal.toFixed(2)}</span></div>
              {discountApplied && <div className="flex justify-between text-emerald-700 font-medium"><span>Promo (VISTORA20 - 20%)</span><span>-${discountAmount.toFixed(2)}</span></div>}
              <div className="flex justify-between text-slate-600"><span>Express Global Shipping</span><span className="text-emerald-700 font-medium">Complimentary</span></div>
              <div className="flex justify-between font-bold text-lg text-navy-950 pt-2"><span>Total</span><span>${finalTotal.toFixed(2)}</span></div>
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-xs font-semibold text-slate-700">Payment Method</span>
              <CustomSelect id="payment-method" variant="field" ariaLabel="Payment Method" value={paymentMethod} options={PAYMENT_OPTIONS} onChange={(val) => setPaymentMethod(val)} />
            </div>
            <Button type="button" size="lg" fullWidth isLoading={submitting} disabled={isLoading} onClick={handleCompleteCheckout}>
              {submitting ? "Processing Order..." : `Complete Order • $${finalTotal.toFixed(2)}`}
            </Button>
            <Link href="/list" className="text-center text-xs font-medium text-slate-600 hover:text-navy-950">← Continue Shopping</Link>
          </div>
        </div>
      </div>
    </main>
  );
}
