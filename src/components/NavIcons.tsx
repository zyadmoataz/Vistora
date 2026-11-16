"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { useSessionSync } from "@/hooks/useSessionSync";
import { buildLoginHref } from "@/lib/securityHelpers";
import { BagIcon, HeartIcon, UserIcon } from "./ui/Icons";

const CartModal = dynamic(() => import("./CartModal"), { ssr: false });

export default function NavIcons() {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const pathname = usePathname();
  const router = useRouter();
  const { wixClient, isLoggedIn, user, counter, wishlistItems, logoutUser, openAuthPage } = useSessionSync();

  useEffect(() => {
    const onOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
        setIsCartOpen(false);
      }
    };
    const onEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsProfileOpen(false);
        setIsCartOpen(false);
      }
    };
    document.addEventListener("mousedown", onOutside);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onOutside);
      document.removeEventListener("keydown", onEsc);
    };
  }, []);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await logoutUser(wixClient);
    setIsLoggingOut(false);
    setIsProfileOpen(false);
    setIsCartOpen(false);
    router.push("/");
  };

  return (
    <div ref={containerRef} className="flex gap-2 xl:gap-3 items-center relative shrink-0">
      <Link
        href="/wishlist"
        aria-label={`Saved wishlist (${wishlistItems.length} items)`}
        aria-current={pathname === "/wishlist" ? "page" : undefined}
        className={`relative px-2.5 py-2 rounded-full transition-colors flex items-center gap-1.5 ${
          pathname === "/wishlist" ? "bg-brand-50 text-brand-600" : "text-navy-900 hover:bg-slate-100 hover:text-brand-600"
        }`}
        title="Saved Wishlist"
      >
        <HeartIcon className="w-[20px] h-[20px] shrink-0" filled={wishlistItems.length > 0} />
        <span className="hidden xl:inline text-xs font-semibold">Wishlist</span>
        {wishlistItems.length > 0 && (
          <span className="min-w-[18px] h-[18px] px-1 bg-brand-600 rounded-full text-white text-[10px] font-bold flex items-center justify-center">
            {wishlistItems.length}
          </span>
        )}
      </Link>

      {isLoggedIn ? (
        <>
          <button
            type="button"
            onClick={() => { setIsCartOpen(false); setIsProfileOpen((prev) => !prev); }}
            aria-label="My Account menu"
            aria-expanded={isProfileOpen}
            className={`relative p-1.5 rounded-full transition-colors flex items-center ${
              pathname.startsWith("/profile") ? "bg-brand-50 ring-2 ring-brand-600/30" : "hover:bg-slate-100 text-navy-900"
            }`}
            title="My Account"
          >
            {user?.avatarInitials ? (
              <span className="w-8 h-8 rounded-full bg-navy-950 text-white text-xs font-bold flex items-center justify-center ring-2 ring-brand-600/20">
                {user.avatarInitials}
              </span>
            ) : (
              <UserIcon className="w-5 h-5" />
            )}
          </button>

          {isProfileOpen && (
            <div className="absolute p-4 rounded-2xl top-12 right-10 w-60 bg-white border border-slate-200 shadow-elevated z-30 flex flex-col gap-1.5 animate-fade-in-up">
              {user && (
                <div className="pb-2.5 mb-1 border-b border-slate-100">
                  <p className="text-sm font-semibold text-navy-950 truncate">{user.name}</p>
                  <p className="text-xs text-slate-600 truncate">{user.email}</p>
                </div>
              )}
              <Link href="/profile" onClick={() => setIsProfileOpen(false)} className="text-xs font-semibold text-slate-700 hover:text-brand-600 hover:bg-slate-50 px-3 py-2 rounded-xl transition-colors">
                My Account & Orders
              </Link>
              <Link href="/wishlist" onClick={() => setIsProfileOpen(false)} className="text-xs font-semibold text-slate-700 hover:text-brand-600 hover:bg-slate-50 px-3 py-2 rounded-xl transition-colors">
                Saved Wishlist ({wishlistItems.length})
              </Link>
              <Link href="/cart" onClick={() => setIsProfileOpen(false)} className="text-xs font-semibold text-slate-700 hover:text-brand-600 hover:bg-slate-50 px-3 py-2 rounded-xl transition-colors">
                Shopping Cart ({counter})
              </Link>
              <button type="button" onClick={handleLogout} disabled={isLoggingOut} className="text-left text-xs font-semibold text-red-700 hover:bg-red-50 px-3 py-2 rounded-xl transition-colors mt-1">
                {isLoggingOut ? "Signing out..." : "Sign Out"}
              </button>
            </div>
          )}

          <button
            type="button"
            aria-label={`Shopping cart with ${counter} items`}
            aria-expanded={isCartOpen}
            className={`relative p-2 rounded-full transition-colors ${
              pathname === "/cart" ? "bg-brand-50 text-brand-600" : "text-navy-900 hover:bg-slate-100 hover:text-brand-600"
            }`}
            title="Shopping Cart"
            onClick={() => { setIsProfileOpen(false); setIsCartOpen((prev) => !prev); }}
          >
            <BagIcon className="w-[21px] h-[21px]" />
            <span className="absolute -top-0.5 -right-0.5 min-w-[20px] h-5 px-1 bg-brand-600 rounded-full text-white text-[11px] font-bold flex items-center justify-center">
              {counter}
            </span>
          </button>

          {isCartOpen && <CartModal onClose={() => setIsCartOpen(false)} />}
        </>
      ) : (
        <div className="flex items-center gap-2">
          <Link href={buildLoginHref(pathname)} onClick={(e) => { e.preventDefault(); openAuthPage("login", pathname); }} aria-current={pathname === "/login" ? "page" : undefined} className="px-3.5 py-2 rounded-full text-xs font-semibold text-navy-900 hover:text-brand-600 hover:bg-slate-100 transition-colors">
            Log In
          </Link>
          <Link href={buildLoginHref(pathname, "register")} onClick={(e) => { e.preventDefault(); openAuthPage("register", pathname); }} className="px-4 py-2 rounded-full text-xs font-semibold bg-brand-600 text-white hover:bg-brand-700 transition-colors shadow-sm">
            Sign Up
          </Link>
        </div>
      )}
    </div>
  );
}
