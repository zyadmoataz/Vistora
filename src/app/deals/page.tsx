import ProductList from "@/components/ProductList";
import { ProductGridSkeleton } from "@/components/ui/Skeleton";
import { ALL_PRODUCTS_CATEGORY_ID } from "@/lib/env";
import type { Metadata } from "next";
import Link from "next/link";
import React, { Suspense } from "react";

export const revalidate = 120;

export const metadata: Metadata = {
  title: "Seasonal Deals Archive",
  description:
    "Explore limited-edition cashmere coats, Italian leather bags, and chronographs up to 35% off. Use code VISTORA20 for extra 20% savings.",
  alternates: { canonical: "/deals" },
};

export default function DealsPage() {
  return (
    <main className="container-shell py-10">
      <div className="rounded-3xl bg-gradient-to-r from-navy-950 via-navy-900 to-navy-800 text-white p-8 sm:p-12 flex flex-col lg:flex-row items-center justify-between gap-8 shadow-elevated">
        <div className="max-w-2xl flex flex-col gap-3 text-center lg:text-left">
          <span className="text-xs font-bold uppercase tracking-widest text-brand-300">
            Seasonal Archive Event
          </span>
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight">
            Curated Luxury Deals — Up to 35% Off
          </h1>
          <p className="text-slate-200 text-sm sm:text-base leading-relaxed">
            Limited-edition cashmere outerwear, vegetable-tanned leather bags, and automatic timepieces at special seasonal pricing. Combine with code{" "}
            <strong className="text-white underline">VISTORA20</strong> at checkout for an extra 20% off.
          </p>
        </div>

        <Link
          href="/cart"
          className="px-7 py-3.5 rounded-full bg-brand-600 text-white font-semibold text-sm hover:bg-brand-700 transition-colors shrink-0 shadow-sm"
        >
          Go to Bag & Apply VISTORA20
        </Link>
      </div>

      <section className="mt-12">
        <div className="flex items-baseline justify-between">
          <h2 className="text-2xl font-bold text-navy-950">Discounted Archive Pieces</h2>
          <Link href="/list" className="text-xs sm:text-sm font-semibold text-navy-950 hover:text-brand-600 transition-colors">
            View All Products →
          </Link>
        </div>

        <Suspense fallback={<ProductGridSkeleton count={8} />}>
          <ProductList categoryId={ALL_PRODUCTS_CATEGORY_ID} dealsOnly limit={8} />
        </Suspense>
      </section>
    </main>
  );
}
