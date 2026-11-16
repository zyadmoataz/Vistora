"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import useWixClient from "@/hooks/useWixClient";
import { useWishlistStore } from "@/hooks/useWishlistStore";
import { useAuthStore } from "@/hooks/useAuthStore";
import { ProfileWishlistTab } from "@/components/ProfileSections";

export default function WishlistPage() {
  const wixClient = useWixClient();
  const { items: wishlist, syncForUser, toggleItem, clearWishlist } = useWishlistStore();
  const { user, isAuthenticated, isHydrated, hydrateAuth } = useAuthStore();
  const isLoggedIn = isHydrated && (isAuthenticated || wixClient.auth.loggedIn());

  useEffect(() => {
    hydrateAuth(wixClient);
  }, [hydrateAuth, wixClient]);

  useEffect(() => {
    if (!isHydrated) return;
    syncForUser(isLoggedIn ? user?.email || "member@vistora.shop" : undefined);
  }, [isHydrated, isLoggedIn, user?.email, syncForUser]);

  return (
    <main className="container-shell py-12">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200 pb-6 mb-8">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-brand-700">
            Curated Favorites
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold text-navy-950 mt-1">
            Saved Wishlist ({wishlist.length})
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            {isLoggedIn && user?.email
              ? `Saved to your account (${user.email}).`
              : "Guest session — sign in anytime to transfer these pieces to your account."}
          </p>
        </div>

        {wishlist.length > 0 && (
          <div className="flex items-center gap-3">
            <Link
              href="/list"
              className="px-4 py-2 rounded-full ring-1 ring-slate-300 text-xs font-semibold text-navy-950 hover:bg-slate-50 transition-colors"
            >
              Continue Shopping
            </Link>
            <button
              type="button"
              onClick={clearWishlist}
              className="px-4 py-2 rounded-full text-xs font-semibold text-red-700 hover:bg-red-50 transition-colors"
            >
              Clear All
            </button>
          </div>
        )}
      </div>

      <ProfileWishlistTab wishlist={wishlist} toggleItem={toggleItem} />
    </main>
  );
}
