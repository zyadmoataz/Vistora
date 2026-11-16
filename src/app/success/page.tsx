"use client";

import React, { Suspense, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import useWixClient from "@/hooks/useWixClient";
import { useAuthStore } from "@/hooks/useAuthStore";
import { useToastStore } from "@/hooks/useToastStore";
import Button from "@/components/ui/Button";
import { CheckIcon } from "@/components/ui/Icons";

function SuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const wixClient = useWixClient();
  const orderId = searchParams.get("orderId") || "";
  const { orders, isAuthenticated, isHydrated, hydrateAuth } = useAuthStore();
  const { addToast } = useToastStore();

  const isLoggedIn = isAuthenticated || wixClient.auth.loggedIn();
  const matchedOrder = orders.find((o) => o.orderId === orderId) || orders[0];

  useEffect(() => {
    hydrateAuth(wixClient);
  }, [hydrateAuth, wixClient]);

  useEffect(() => {
    if (isHydrated && !isLoggedIn) {
      router.replace("/login");
    }
  }, [isHydrated, isLoggedIn, router]);

  if (!isHydrated || !isLoggedIn) {
    return (
      <main className="container-shell py-16 flex justify-center">
        <div className="max-w-md w-full h-64 rounded-3xl bg-slate-100 animate-pulse" />
      </main>
    );
  }

  const displayOrderId = matchedOrder?.orderId || orderId || "ORD-VERIFIED";

  const handleCopyId = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(displayOrderId);
      addToast("Order ID copied to clipboard", "info", `#${displayOrderId}`);
    }
  };

  return (
    <main className="container-shell py-16 flex items-center justify-center">
      <div className="max-w-xl w-full bg-white p-8 sm:p-12 rounded-3xl border border-slate-200 shadow-elevated text-center flex flex-col items-center gap-6 animate-fade-in-up">
        <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center ring-8 ring-emerald-50/50">
          <CheckIcon className="w-8 h-8" />
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-600">
            Order Confirmed
          </span>
          <h1 className="text-3xl font-bold text-navy-950">
            Thank You for Your Order
          </h1>
          <p className="text-sm text-slate-600 max-w-md">
            Our atelier team has received your order and is preparing your pieces for priority dispatch.
          </p>
        </div>

        <div className="w-full bg-slate-50 p-5 rounded-2xl border border-slate-200/80 flex items-center justify-between">
          <div className="text-left">
            <span className="text-xs text-slate-600 block">Order Reference</span>
            <strong className="text-base font-bold text-navy-950">#{displayOrderId}</strong>
          </div>
          <Button type="button" variant="outline" size="sm" onClick={handleCopyId}>
            Copy ID
          </Button>
        </div>

        {matchedOrder && (
          <div className="w-full text-left border-t border-slate-100 pt-4 flex flex-col gap-2 text-xs text-slate-600">
            <div className="flex justify-between">
              <span>Payment Method:</span>
              <strong className="text-navy-950">{matchedOrder.paymentMethod}</strong>
            </div>
            <div className="flex justify-between">
              <span>Total Charged:</span>
              <strong className="text-navy-950 text-sm">${matchedOrder.total.toFixed(2)}</strong>
            </div>
          </div>
        )}

        <div className="flex flex-wrap items-center justify-center gap-3 w-full pt-2">
          <Link
            href="/profile"
            className="flex-1 py-3.5 px-6 rounded-full bg-navy-900 text-white text-xs sm:text-sm font-semibold hover:bg-brand-600 transition-colors"
          >
            View Order History
          </Link>
          <Link
            href="/list"
            className="flex-1 py-3.5 px-6 rounded-full ring-1 ring-slate-300 text-navy-900 text-xs sm:text-sm font-semibold hover:bg-slate-50 transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </main>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<div className="container-shell py-16 text-center">Loading confirmation...</div>}>
      <SuccessContent />
    </Suspense>
  );
}
