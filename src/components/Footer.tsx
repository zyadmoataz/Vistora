"use client";

import Link from "next/link";
import React, { useState } from "react";
import { useToastStore } from "@/hooks/useToastStore";
import { isValidEmail } from "@/lib/securityHelpers";
import BrandLogo from "./ui/BrandLogo";
import { PaymentBadges, SocialMediaLinks } from "./ui/BrandSVGs";

const FOOTER_SECTIONS = [
  {
    title: "Company",
    links: [
      { label: "Our Story", href: "/about" },
      { label: "Craftsmanship", href: "/about#craftsmanship" },
      { label: "Seasonal Archive", href: "/deals" },
      { label: "Contact Atelier", href: "/contact" },
    ],
  },
  {
    title: "Collections",
    links: [
      { label: "Featured", href: "/list?cat=featured" },
      { label: "Outerwear", href: "/list?cat=apparel" },
      { label: "Accessories", href: "/list?cat=accessories" },
      { label: "Footwear", href: "/list?cat=footwear" },
      { label: "All Products", href: "/list" },
    ],
  },
  {
    title: "Client Care",
    links: [
      { label: "My Account", href: "/profile" },
      { label: "Saved Wishlist", href: "/wishlist" },
      { label: "Shipping & Returns", href: "/faq" },
      { label: "Privacy & Security", href: "/faq#legal" },
      { label: "Concierge Help", href: "/contact" },
    ],
  },
];

export default function Footer() {
  const [email, setEmail] = useState("");
  const { addToast } = useToastStore();

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValidEmail(email)) {
      addToast("Please enter a valid email address", "error");
      return;
    }
    addToast("Welcome to Vistora Inner Circle!", "success", `Subscribed ${email.trim()} to exclusive previews.`);
    setEmail("");
  };

  return (
    <footer className="py-16 sm:py-20 bg-gradient-to-b from-slate-50 to-slate-100/90 text-slate-700 text-sm mt-24 border-t border-slate-200/90">
      <div className="container-shell">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 pb-14 border-b border-slate-200">
          <div className="lg:col-span-4 flex flex-col gap-5">
            <Link href="/" aria-label="Vistora Atelier Home" className="w-max">
              <BrandLogo />
            </Link>
            <p className="text-slate-600 leading-relaxed max-w-sm">
              Architectural silhouettes, fine Italian leathers, and enduring modern essentials crafted for discerning wardrobes.
            </p>
            <div className="flex flex-col gap-1 text-slate-700">
              <span>Heliopolis (Misr El Gedida), Cairo, Egypt</span>
              <a href="mailto:ziaadmoataz@gmail.com" className="font-semibold text-navy-950 hover:text-brand-600 transition-colors w-max">ziaadmoataz@gmail.com</a>
              <a href="tel:+201012766890" className="font-semibold text-navy-950 hover:text-brand-600 transition-colors w-max">+20 101 276 6890</a>
            </div>
            <SocialMediaLinks />
          </div>

          <div className="lg:col-span-5 grid grid-cols-2 sm:grid-cols-3 gap-8">
            {FOOTER_SECTIONS.map((sec) => (
              <div key={sec.title} className="flex flex-col gap-4">
                <h2 className="font-bold text-navy-950 tracking-wider text-xs uppercase">{sec.title}</h2>
                <div className="flex flex-col gap-3 text-slate-600">
                  {sec.links.map((l) => (
                    <Link key={l.label} href={l.href} className="hover:text-brand-600 transition-colors w-max">{l.label}</Link>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="lg:col-span-3 flex flex-col gap-5">
            <h2 className="font-bold text-navy-950 tracking-wider text-xs uppercase">Private Dispatch</h2>
            <p className="text-slate-600 leading-relaxed">Receive early access to limited capsule releases and private seasonal invitations.</p>
            <form onSubmit={handleSubscribe} className="flex rounded-full overflow-hidden bg-white ring-1 ring-slate-300 focus-within:ring-2 focus-within:ring-brand-600 p-1 shadow-sm">
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email" aria-label="Email address for newsletter" className="px-4 py-2 bg-transparent text-navy-950 placeholder:text-slate-500 outline-none flex-1 min-w-0 text-sm" />
              <button type="submit" className="px-5 py-2.5 rounded-full bg-brand-600 text-white font-semibold text-xs hover:bg-brand-700 transition-colors shrink-0">Join</button>
            </form>
            <span className="font-bold text-xs text-navy-950 uppercase tracking-wider mt-1">Verified Global Payments</span>
            <PaymentBadges />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 text-xs text-slate-600">
          <div>© {new Date().getFullYear()} Vistora Atelier. Engineered by <strong className="text-navy-950 font-semibold">Zyaad Moataz</strong>.</div>
          <div className="flex items-center gap-6">
            <div><span className="text-slate-600 mr-2">Region:</span><span className="font-semibold text-navy-950">United States | English</span></div>
            <div><span className="text-slate-600 mr-2">Currency:</span><span className="font-semibold text-navy-950">$ USD</span></div>
          </div>
        </div>
      </div>
    </footer>
  );
}
