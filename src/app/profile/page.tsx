"use client";

import React, { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import useWixClient from "@/hooks/useWixClient";
import { useAuthStore } from "@/hooks/useAuthStore";
import { useWishlistStore } from "@/hooks/useWishlistStore";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { ProfileOrdersTab, ProfileWishlistTab } from "@/components/ProfileSections";

function ProfileContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const wixClient = useWixClient();

  const { user, orders, isAuthenticated, isHydrated, hydrateAuth, updateProfileName, logoutUser } = useAuthStore();
  const { items: wishlist, syncForUser, toggleItem } = useWishlistStore();

  const isLoggedIn = isAuthenticated || wixClient.auth.loggedIn();
  const [activeTab, setActiveTab] = useState<"orders" | "wishlist" | "settings">(
    searchParams.get("tab") === "wishlist" ? "wishlist" : "orders"
  );
  const [nameInput, setNameInput] = useState("");

  useEffect(() => { hydrateAuth(wixClient); }, [wixClient, hydrateAuth]);
  useEffect(() => {
    if (isHydrated && isLoggedIn) syncForUser(user?.email || "member@vistora.shop");
  }, [isHydrated, isLoggedIn, user?.email, syncForUser]);
  useEffect(() => { if (isHydrated && !isLoggedIn) router.replace("/login?redirect=/profile"); }, [isHydrated, isLoggedIn, router]);
  useEffect(() => { if (searchParams.get("tab") === "wishlist") setActiveTab("wishlist"); }, [searchParams]);
  useEffect(() => { if (user?.name) setNameInput(user.name); }, [user]);

  if (!isHydrated) {
    return <main className="container-shell py-16"><div className="h-44 rounded-3xl bg-slate-100 animate-pulse" /></main>;
  }

  if (!isLoggedIn) {
    return (
      <main className="container-shell py-16 flex justify-center">
        <div className="max-w-md w-full p-8 rounded-3xl border border-slate-200 bg-white text-center flex flex-col items-center gap-4 shadow-soft">
          <h1 className="text-xl font-bold text-navy-950">Authentication Required</h1>
          <p className="text-xs text-slate-600">Please sign in to access your private profile, order history, and account preferences.</p>
          <Link href="/login?redirect=/profile" className="w-full py-3 rounded-full bg-brand-600 text-white text-xs font-semibold hover:bg-brand-700 transition-colors">
            Proceed to Sign In
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="container-shell py-12">
      <div className="bg-gradient-to-r from-navy-950 via-navy-900 to-navy-800 text-white rounded-3xl p-8 sm:p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-elevated">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 rounded-2xl bg-brand-600 text-white font-bold text-xl flex items-center justify-center shrink-0">
            {user?.avatarInitials || "VM"}
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-brand-300">
              {user?.role || "Verified Member"} • {user?.joinedAt || "2025"}
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold mt-0.5">{user?.name}</h1>
            <p className="text-xs sm:text-sm text-slate-200 mt-1">{user?.email}</p>
          </div>
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={async () => { await logoutUser(wixClient); router.replace("/login"); }}
          className="bg-white/15 text-white hover:bg-brand-600 hover:text-white"
        >
          Sign Out Securely
        </Button>
      </div>

      <div className="flex gap-3 border-b border-slate-200 mt-10 pb-4 overflow-x-auto">
        {[
          { id: "orders", label: `Order History (${orders.length})` },
          { id: "wishlist", label: `Saved Wishlist (${wishlist.length})` },
          { id: "settings", label: "Account Preferences" },
        ].map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setActiveTab(t.id as "orders" | "wishlist" | "settings")}
            className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all shrink-0 ${
              activeTab === t.id ? "bg-navy-950 text-white shadow-sm" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="mt-8">
        {activeTab === "orders" && <ProfileOrdersTab orders={orders} />}
        {activeTab === "wishlist" && (
          <ProfileWishlistTab wishlist={wishlist} toggleItem={toggleItem} />
        )}
        {activeTab === "settings" && (
          <form
            onSubmit={(e) => { e.preventDefault(); updateProfileName(nameInput || "Vistora Member"); }}
            className="max-w-lg p-6 sm:p-8 rounded-3xl border border-slate-200 bg-white flex flex-col gap-5"
          >
            <h2 className="text-lg font-bold text-navy-950">Profile Details</h2>
            <Input id="display-name" label="Display Name" type="text" required maxLength={60} value={nameInput} onChange={(e) => setNameInput(e.target.value)} placeholder="Your full name" />
            <Button type="submit" size="sm" className="w-max px-6">Save Preferences</Button>
          </form>
        )}
      </div>
    </main>
  );
}

export default function ProfilePage() {
  return (
    <Suspense fallback={<div className="container-shell py-16">Loading account...</div>}>
      <ProfileContent />
    </Suspense>
  );
}
