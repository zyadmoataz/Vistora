import React from "react";
import { ProductGridSkeleton } from "@/components/ui/Skeleton";

export default function ListLoading() {
  return (
    <main className="container-shell py-8" aria-busy="true" aria-label="Loading catalog">
      <div className="h-44 sm:h-64 rounded-3xl bg-slate-100 animate-pulse" />
      <div className="mt-10 h-16 rounded-2xl bg-slate-100 animate-pulse" />
      <div className="mt-12 h-8 w-56 rounded-xl bg-slate-100 animate-pulse" />
      <ProductGridSkeleton count={8} />
    </main>
  );
}
