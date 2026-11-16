import Filter from "@/components/Filter";
import ProductList from "@/components/ProductList";
import { ProductGridSkeleton } from "@/components/ui/Skeleton";
import { ALL_PRODUCTS_CATEGORY_ID } from "@/lib/env";
import { getCollectionBySlugSafe, ProductFilterParams } from "@/services/catalogService";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import React, { Suspense } from "react";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: ProductFilterParams;
}): Promise<Metadata> {
  const collection = await getCollectionBySlugSafe(searchParams.cat);
  const title = searchParams.name
    ? `Search "${searchParams.name}"`
    : collection.name || "Shop Collection";
  return {
    title,
    description:
      collection.description ||
      "Browse Vistora Atelier outerwear, Italian leather bags, footwear, and modern timepieces.",
    alternates: { canonical: "/list" },
  };
}

export default async function ListPage({ searchParams }: { searchParams: ProductFilterParams }) {
  const collection = await getCollectionBySlugSafe(searchParams.cat);

  return (
    <main className="container-shell py-8">
      <div className="bg-gradient-to-r from-brand-50 via-white to-navy-50 rounded-3xl px-6 sm:px-12 py-8 sm:py-0 sm:h-64 flex flex-col sm:flex-row items-center justify-between border border-brand-100 overflow-hidden shadow-soft">
        <div className="w-full sm:w-2/3 flex flex-col items-center sm:items-start justify-center gap-4 text-center sm:text-left">
          <span className="text-xs font-bold uppercase tracking-widest text-brand-700">
            Vistora Seasonal Edit
          </span>
          <h1 className="text-2xl sm:text-4xl font-bold leading-tight text-navy-950">
            Save up to 35% on <br className="hidden sm:inline" /> Curated Atelier Essentials
          </h1>
          <Link
            href="/deals"
            className="rounded-full bg-brand-600 text-white w-max py-2.5 px-6 text-xs sm:text-sm font-semibold hover:bg-brand-700 transition-colors shadow-sm"
          >
            Shop Archive Deals
          </Link>
        </div>

        <div className="relative w-40 h-44 sm:w-1/3 sm:h-full mt-4 sm:mt-0">
          <Image
            src="/woman.png"
            alt="Seasonal campaign model"
            className="object-contain object-bottom"
            fill
            sizes="(max-width: 640px) 160px, 33vw"
            priority
          />
        </div>
      </div>

      <Suspense fallback={<div className="mt-10 h-16 bg-slate-100 rounded-2xl animate-pulse" />}>
        <Filter />
      </Suspense>

      <div className="mt-12 flex items-baseline justify-between">
        <div>
          <h2 className="text-2xl font-bold text-navy-950">
            {searchParams.name
              ? `Search results for "${searchParams.name}"`
              : `${collection.name || "All Products"} For You`}
          </h2>
          {collection.description && !searchParams.name && (
            <p className="text-xs sm:text-sm text-slate-600 mt-1">{collection.description}</p>
          )}
        </div>
      </div>

      <Suspense fallback={<ProductGridSkeleton count={8} />}>
        <ProductList
          categoryId={collection._id || ALL_PRODUCTS_CATEGORY_ID}
          searchParams={searchParams}
          showPagination
        />
      </Suspense>
    </main>
  );
}
