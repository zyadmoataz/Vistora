import FaqAccordion from "@/components/FaqAccordion";
import type { Metadata } from "next";
import Link from "next/link";
import React from "react";

export const metadata: Metadata = {
  title: "Shipping, Returns & Security FAQ",
  description:
    "Explore Vistora Atelier express shipping, 30-day complimentary returns, authenticity certification, and client data security practices.",
  alternates: { canonical: "/faq" },
};

const FAQ_ITEMS = [
  {
    q: "How fast is complimentary express shipping?",
    a: "All orders over $150 qualify for complimentary tracked express courier delivery (2–4 business days across Europe, North America, and MENA hubs).",
  },
  {
    q: "What is your 30-day return & exchange policy?",
    a: "Unworn items with original atelier tags may be returned or exchanged free of charge within 30 days using the prepaid courier return label included in every box.",
  },
  {
    q: "How do I apply seasonal promo codes like VISTORA20?",
    a: "Sign in to your account, add your pieces to the Shopping Bag, open View Bag (/cart), enter VISTORA20 in the promo box, and click Apply for an instant 20% discount.",
  },
  {
    q: "How is account data, XSS & session security handled?",
    a: "All rich product HTML is sanitized through strict DOMPurify allowlists, session cookies enforce SameSite attributes, order histories are isolated per authenticated account, and strict CSP/HSTS/X-Frame-Options security headers protect every route.",
  },
];

export default function FaqPage() {
  return (
    <main className="container-shell py-14 flex flex-col gap-12 max-w-4xl">
      <section className="flex flex-col gap-3">
        <span className="text-xs font-bold uppercase tracking-widest text-brand-700">Client Care & Policies</span>
        <h1 className="text-3xl sm:text-5xl font-bold text-navy-950 tracking-tight">
          Shipping, Returns & Security
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          Everything you need to know about global fulfillment, size exchanges, and how Vistora Atelier protects your browsing and account data.
        </p>
      </section>

      <FaqAccordion items={FAQ_ITEMS} />

      <section id="legal" className="p-6 sm:p-8 rounded-3xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="flex flex-col gap-1.5">
          <h2 className="text-lg font-bold text-navy-950">Privacy, Security & Terms Notice</h2>
          <p className="text-xs sm:text-sm text-slate-600 max-w-xl leading-relaxed">
            Vistora stores user session records scoped to your active account locally and honors Wix Headless OAuth standards without third-party tracking ad pixels.
          </p>
        </div>
        <Link href="/contact" className="px-6 py-3 rounded-full bg-navy-950 text-white text-xs font-semibold hover:bg-brand-600 transition-colors shrink-0">
          Contact Concierge
        </Link>
      </section>
    </main>
  );
}
