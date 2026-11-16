"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useSessionSync } from "@/hooks/useSessionSync";
import { buildLoginHref } from "@/lib/securityHelpers";
import { BagIcon, CloseIcon, HeartIcon, MenuIcon, UserIcon } from "./ui/Icons";
import SearchBar from "./SearchBar";

const NAV_LINKS = [
  { href: "/", label: "Homepage" },
  { href: "/list", label: "Shop Collection" },
  { href: "/deals", label: "Seasonal Deals" },
  { href: "/about", label: "Our Story" },
  { href: "/faq", label: "Shipping & FAQ" },
  { href: "/contact", label: "Contact" },
];

export default function Menu() {
  const [open, setOpen] = useState(false);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const triggerBtnRef = useRef<HTMLButtonElement>(null);
  const wasOpenRef = useRef(false);
  const pathname = usePathname();
  const { wixClient, isLoggedIn, user, counter, wishlistItems, logoutUser, openAuthPage } = useSessionSync();

  useEffect(() => { setOpen(false); }, [pathname]);

  useEffect(() => {
    if (open) {
      wasOpenRef.current = true;
      document.body.style.overflow = "hidden";
      closeBtnRef.current?.focus();
      const onEsc = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
      document.addEventListener("keydown", onEsc);
      return () => { document.body.style.overflow = ""; document.removeEventListener("keydown", onEsc); };
    }
    if (wasOpenRef.current) {
      wasOpenRef.current = false;
      triggerBtnRef.current?.focus();
    }
  }, [open]);

  const drawer = open && typeof document !== "undefined" ? createPortal(
    <div className="fixed inset-0 z-50 md:hidden flex justify-end" role="dialog" aria-modal="true" aria-label="Mobile navigation menu">
      <div className="fixed inset-0 bg-navy-950/60 backdrop-blur-sm" onClick={() => setOpen(false)} aria-hidden="true" />
      <div className="relative z-10 w-full max-w-sm h-full bg-navy-950 text-white p-6 flex flex-col justify-between gap-6 overflow-y-auto shadow-elevated">
        <div className="flex flex-col gap-5">
          <div className="flex items-center justify-between pb-3 border-b border-white/15">
            <span className="text-base font-extrabold tracking-widest uppercase">Vistora Atelier</span>
            <button ref={closeBtnRef} type="button" onClick={() => setOpen(false)} aria-label="Close navigation menu" className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors">
              <CloseIcon className="w-5 h-5" />
            </button>
          </div>
          <SearchBar onSearchDone={() => setOpen(false)} />
          <nav className="flex flex-col gap-1.5" aria-label="Mobile Navigation">
            {NAV_LINKS.map((link) => {
              const active = link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
              return (
                <Link key={link.href} href={link.href} onClick={() => setOpen(false)} aria-current={active ? "page" : undefined} className={`text-base font-medium py-2.5 px-4 rounded-xl transition-colors ${active ? "bg-brand-600 text-white font-semibold" : "text-slate-100 hover:bg-white/10"}`}>
                  {link.label}
                </Link>
              );
            })}
            <Link href="/wishlist" onClick={() => setOpen(false)} aria-current={pathname === "/wishlist" ? "page" : undefined} className={`text-base font-medium py-2.5 px-4 rounded-xl flex justify-between items-center ${pathname === "/wishlist" ? "bg-brand-600 text-white" : "text-slate-100 hover:bg-white/10"}`}>
              <span>Saved Wishlist</span>
              <span className="text-xs bg-white/15 px-2.5 py-0.5 rounded-full">{wishlistItems.length}</span>
            </Link>
            {isLoggedIn && (
              <Link href="/cart" onClick={() => setOpen(false)} aria-current={pathname === "/cart" ? "page" : undefined} className={`text-base font-medium py-2.5 px-4 rounded-xl flex justify-between items-center ${pathname === "/cart" ? "bg-brand-600 text-white" : "text-slate-100 hover:bg-white/10"}`}>
                <span>Shopping Cart</span>
                <span className="text-xs bg-brand-600 px-2.5 py-0.5 rounded-full">{counter}</span>
              </Link>
            )}
          </nav>
        </div>
        <div className="border-t border-white/15 pt-5 flex flex-col gap-3">
          {isLoggedIn ? (
            <div className="flex items-center justify-between gap-3 bg-white/10 p-3.5 rounded-2xl">
              <Link href="/profile" onClick={() => setOpen(false)} className="text-sm font-semibold truncate">{user?.name || "My Account"}</Link>
              <button type="button" onClick={() => { logoutUser(wixClient); setOpen(false); }} className="text-xs px-3.5 py-1.5 rounded-full bg-white/15 hover:bg-brand-600 transition-colors">Sign Out</button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              <Link href={buildLoginHref(pathname)} onClick={(e) => { e.preventDefault(); setOpen(false); openAuthPage("login", pathname); }} className="py-3 rounded-full bg-white/15 text-center font-semibold text-sm hover:bg-white/25 transition-colors">Log In</Link>
              <Link href={buildLoginHref(pathname, "register")} onClick={(e) => { e.preventDefault(); setOpen(false); openAuthPage("register", pathname); }} className="py-3 rounded-full bg-brand-600 text-center font-semibold text-sm hover:bg-brand-700 transition-colors">Sign Up</Link>
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  ) : null;

  return (
    <div className="flex items-center gap-1.5">
      <Link href="/wishlist" aria-label={`Saved wishlist (${wishlistItems.length} items)`} aria-current={pathname === "/wishlist" ? "page" : undefined} className={`relative p-2.5 rounded-full transition-colors ${pathname === "/wishlist" ? "bg-brand-50 text-brand-600" : "text-navy-900 hover:bg-slate-100"}`}>
        <HeartIcon className="w-5 h-5" filled={wishlistItems.length > 0} />
        {wishlistItems.length > 0 && <span className="absolute top-0 right-0 min-w-[17px] h-[17px] px-1 bg-brand-600 rounded-full text-white text-[10px] font-bold flex items-center justify-center">{wishlistItems.length}</span>}
      </Link>
      {isLoggedIn ? (
        <>
          <Link href="/profile" aria-label="My Account" aria-current={pathname.startsWith("/profile") ? "page" : undefined} className="p-1.5 rounded-full hover:bg-slate-100 text-navy-900">
            {user?.avatarInitials ? <span className="w-7 h-7 rounded-full bg-navy-950 text-white text-[11px] font-bold flex items-center justify-center">{user.avatarInitials}</span> : <UserIcon className="w-5 h-5" />}
          </Link>
          <Link href="/cart" aria-label={`Shopping cart with ${counter} items`} aria-current={pathname === "/cart" ? "page" : undefined} className="relative p-2.5 rounded-full hover:bg-slate-100 text-navy-900 transition-colors">
            <BagIcon className="w-5 h-5" />
            <span className="absolute top-0 right-0 min-w-[18px] h-[18px] px-1 bg-brand-600 rounded-full text-white text-[10px] font-bold flex items-center justify-center">{counter}</span>
          </Link>
        </>
      ) : (
        <Link href={buildLoginHref(pathname)} onClick={(e) => { e.preventDefault(); openAuthPage("login", pathname); }} className="px-3.5 py-2 rounded-full text-xs font-semibold bg-brand-600 text-white hover:bg-brand-700 transition-colors">Log In</Link>
      )}
      <button ref={triggerBtnRef} type="button" aria-label={open ? "Close navigation menu" : "Open navigation menu"} aria-expanded={open} onClick={() => setOpen((prev) => !prev)} className="p-2.5 rounded-full hover:bg-slate-100 text-navy-900 transition-colors">
        {open ? <CloseIcon className="w-5 h-5" /> : <MenuIcon className="w-5 h-5" />}
      </button>
      {drawer}
    </div>
  );
}
