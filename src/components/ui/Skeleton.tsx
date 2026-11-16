import React from "react";

export function ProductGridSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div
      className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
      aria-busy="true"
      aria-label="Loading products"
    >
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="flex flex-col gap-4 rounded-2xl p-3 border border-slate-100 bg-white animate-pulse"
        >
          <div className="w-full h-80 bg-slate-200/70 rounded-xl" />
          <div className="flex justify-between items-center mt-1">
            <div className="h-5 bg-slate-200 rounded w-2/3" />
            <div className="h-5 bg-slate-200 rounded w-16" />
          </div>
          <div className="h-4 bg-slate-100 rounded w-full" />
          <div className="h-10 bg-slate-200/80 rounded-full w-36 mt-2" />
        </div>
      ))}
    </div>
  );
}

export function CategoryRowSkeleton() {
  return (
    <div
      className="container-shell grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6 animate-pulse"
      aria-busy="true"
      aria-label="Loading categories"
    >
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="flex flex-col gap-3">
          <div className="w-full h-72 bg-slate-200/70 rounded-2xl" />
          <div className="h-5 bg-slate-200 rounded w-3/4 mx-auto" />
        </div>
      ))}
    </div>
  );
}
