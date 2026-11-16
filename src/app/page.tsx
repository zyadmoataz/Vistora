import CategoryList from "@/components/CategoryList";
import ProductList from "@/components/ProductList";
import Slider from "@/components/Slider";
import { CategoryRowSkeleton, ProductGridSkeleton } from "@/components/ui/Skeleton";
import { ALL_PRODUCTS_CATEGORY_ID, ENV } from "@/lib/env";
import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";

export const revalidate = 120;

export const metadata: Metadata = {
  title: "Vistora Atelier | Modern Luxury E-Commerce",
  description:
    "Explore tailored double-faced cashmere outerwear, full-grain Italian leather bags, and Swiss-movement chronographs crafted with architectural precision.",
  alternates: { canonical: "/" },
};

const VALUE_PILLARS = [
  { title: "Complimentary Shipping", desc: "Express global courier on orders $150+" },
  { title: "Certified Craftsmanship", desc: "Italian full-grain leather & virgin wool" },
  { title: "30-Day Effortless Returns", desc: "Instant prepaid return label included" },
  { title: "Dedicated Concierge", desc: "Personal styling & sizing assistance" },
];

export default function HomePage() {
  return (
    <main>
      <Slider />

      <section className="border-b border-slate-200/80 bg-slate-50/80 py-8">
        <div className="container-shell grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {VALUE_PILLARS.map((p) => (
            <div key={p.title} className="flex flex-col gap-1 text-center sm:text-left">
              <h2 className="text-sm font-bold text-navy-950">{p.title}</h2>
              <p className="text-xs text-slate-600">{p.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-20 container-shell">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-brand-700">Curated Edit</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-navy-950 mt-1">Featured Products</h2>
          </div>
          <Link href="/list?cat=featured" className="text-sm font-semibold text-navy-950 hover:text-brand-600 transition-colors">
            View Featured Collection →
          </Link>
        </div>
        <Suspense fallback={<ProductGridSkeleton count={4} />}>
          <ProductList categoryId={ENV.FEATURED_CATEGORY_ID} limit={4} />
        </Suspense>
      </section>

      <section className="mt-24">
        <div className="container-shell flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-brand-700">Departments</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-navy-950 mt-1">Shop by Category</h2>
          </div>
          <Link href="/list" className="text-sm font-semibold text-navy-950 hover:text-brand-600 transition-colors">
            Browse Full Catalog →
          </Link>
        </div>
        <Suspense fallback={<CategoryRowSkeleton />}>
          <CategoryList />
        </Suspense>
      </section>

      <section className="mt-24 container-shell">
        <div className="rounded-3xl bg-gradient-to-r from-navy-950 via-navy-900 to-navy-800 text-white p-8 sm:p-12 lg:p-16 flex flex-col lg:flex-row items-center justify-between gap-8 relative overflow-hidden shadow-elevated">
          <div className="max-w-xl flex flex-col gap-4 z-10 text-center lg:text-left">
            <span className="text-xs font-bold uppercase tracking-widest text-brand-300">Limited Edition Archive</span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">Private Seasonal Sale — Up to 35% Off Selected Pieces</h2>
            <p className="text-slate-200 text-sm sm:text-base leading-relaxed">
              Invest in timeless outerwear, hand-stitched weekender bags, and sapphire chronographs before the seasonal archive closes.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-4 z-10 shrink-0">
            <Link href="/deals" className="px-7 py-3.5 rounded-full bg-brand-600 text-white font-semibold text-sm hover:bg-brand-700 transition-colors shadow-sm">
              Explore Archive Deals
            </Link>
            <Link href="/about" className="px-7 py-3.5 rounded-full bg-white/15 text-white font-semibold text-sm hover:bg-white/25 transition-colors">
              Our Story
            </Link>
          </div>
        </div>
      </section>

      <section className="mt-24 container-shell">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-brand-700">Latest Drop</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-navy-950 mt-1">New Arrivals</h2>
          </div>
          <Link href="/list?sort=asc+lastUpdated" className="text-sm font-semibold text-navy-950 hover:text-brand-600 transition-colors">
            Explore All New Arrivals →
          </Link>
        </div>
        <Suspense fallback={<ProductGridSkeleton count={4} />}>
          <ProductList categoryId={ALL_PRODUCTS_CATEGORY_ID} searchParams={{ sort: "desc price" }} limit={4} />
        </Suspense>
      </section>
    </main>
  );
}
