import type { Metadata } from "next";
import Link from "next/link";
import React from "react";
import Badge from "@/components/ui/Badge";

export const metadata: Metadata = {
  title: "Our Story & Atelier Philosophy",
  description:
    "Rooted between Cairo and Milan, Vistora Atelier creates architectural outerwear, vegetable-tanned Italian leather bags, and enduring wardrobe essentials.",
  alternates: { canonical: "/about" },
};

const BRAND_PILLARS = [
  {
    badge: "Provenance",
    title: "Italian Leathers & Virgin Cashmere",
    desc: "We source full-grain vegetable-tanned hides from Tuscan tanneries and double-faced wool-cashmere blends woven for breathable structure.",
  },
  {
    badge: "Tailoring",
    title: "Architectural Minimalist Silhouettes",
    desc: "Every coat, overshirt, and silhouette is pattern-cut for clean drape, restrained hardware, and seamless movement from studio to evening.",
  },
  {
    badge: "Craftsmanship",
    title: "Small-Batch Atelier Releases",
    desc: "Rather than seasonal overproduction, we partner with independent family-run ateliers producing numbered runs inspected stitch by stitch.",
  },
  {
    badge: "Longevity",
    title: "Designed Beyond Passing Trends",
    desc: "Timeless tonal palettes, sapphire timepiece crystals, and repair-friendly construction built to age with character year after year.",
  },
];

const ATELIER_METRICS = [
  { stat: "100%", label: "Certified Natural Fibers & Full-Grain Hides" },
  { stat: "2 Studios", label: "Design Heritage Across Cairo & Milan" },
  { stat: "30 Days", label: "Complimentary Express Exchanges & Returns" },
  { stat: "5-Year", label: "International Horology & Craft Guarantee" },
];

export default function AboutPage() {
  return (
    <main className="container-shell py-14 flex flex-col gap-16">
      <section className="max-w-3xl flex flex-col gap-4">
        <span className="text-xs font-bold uppercase tracking-widest text-brand-700">
          About Vistora Atelier
        </span>
        <h1 className="text-4xl sm:text-5xl font-bold text-navy-950 tracking-tight leading-tight">
          Crafted for Quiet Permanence & Everyday Precision.
        </h1>
        <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
          Vistora Atelier was established to bridge modern architectural tailoring with heritage material craft. Across refined outerwear, structured travel luggage, and Swiss-inspired chronographs, every piece honors clean form and tactile honesty.
        </p>
      </section>

      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {ATELIER_METRICS.map((m) => (
          <div key={m.label} className="p-6 rounded-3xl bg-slate-50 border border-slate-200/80 flex flex-col gap-1">
            <span className="text-2xl sm:text-3xl font-extrabold text-brand-600">{m.stat}</span>
            <span className="text-xs sm:text-sm font-medium text-slate-600">{m.label}</span>
          </div>
        ))}
      </section>

      <section id="craftsmanship" className="grid grid-cols-1 md:grid-cols-2 gap-6 scroll-mt-28">
        {BRAND_PILLARS.map((item) => (
          <div key={item.title} className="p-8 rounded-3xl border border-slate-200 bg-white shadow-soft flex flex-col gap-3">
            <Badge variant="brandSoft" className="w-max">{item.badge}</Badge>
            <h2 className="text-xl font-bold text-navy-950">{item.title}</h2>
            <p className="text-sm text-slate-600 leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </section>

      <section className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-navy-950 via-navy-900 to-navy-800 text-white flex flex-col md:flex-row items-center justify-between gap-8 shadow-elevated">
        <div className="max-w-xl flex flex-col gap-2">
          <h2 className="text-2xl sm:text-3xl font-bold">Explore the Seasonal Archive</h2>
          <p className="text-sm text-slate-200 leading-relaxed">
            Discover our latest small-batch releases in cashmere coats, weekender bags, and footwear—or visit our concierge desk for tailored sizing guidance.
          </p>
        </div>
        <div className="flex flex-wrap gap-3 shrink-0">
          <Link href="/list" className="px-6 py-3 rounded-full bg-brand-600 text-white text-xs sm:text-sm font-semibold hover:bg-brand-700 transition-colors">
            Shop Full Collection
          </Link>
          <Link href="/contact" className="px-6 py-3 rounded-full bg-white/15 text-white text-xs sm:text-sm font-semibold hover:bg-white/25 transition-colors">
            Contact Concierge
          </Link>
        </div>
      </section>
    </main>
  );
}
