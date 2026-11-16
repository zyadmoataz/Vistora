import React from "react";
import { ProductGridSkeleton } from "@/components/ui/Skeleton";

export default function DealsLoading() {
  return (
    <main className="container-shell py-10" aria-busy="true" aria-label="Loading seasonal deals">
      <div className="h-48 sm:h-52 rounded-3xl bg-slate-100 animate-pulse" />
      <div className="mt-12 h-8 w-64 rounded-xl bg-slate-100 animate-pulse" />
      <ProductGridSkeleton count={8} />
    </main>
  );
}
