import React from "react";

export default function ProductDetailLoading() {
  return (
    <main className="container-shell py-10 animate-pulse" aria-busy="true" aria-label="Loading product details">
      <div className="h-4 w-48 rounded bg-slate-100 mb-8" />
      <div className="flex flex-col lg:flex-row gap-12 xl:gap-16">
        <div className="w-full lg:w-1/2 flex flex-col gap-4">
          <div className="h-[440px] sm:h-[540px] rounded-3xl bg-slate-100" />
          <div className="grid grid-cols-4 gap-4">
            <div className="h-24 rounded-2xl bg-slate-100" />
            <div className="h-24 rounded-2xl bg-slate-100" />
            <div className="h-24 rounded-2xl bg-slate-100" />
            <div className="h-24 rounded-2xl bg-slate-100" />
          </div>
        </div>
        <div className="w-full lg:w-1/2 flex flex-col gap-6">
          <div className="h-7 w-40 rounded-full bg-slate-100" />
          <div className="h-10 w-3/4 rounded-xl bg-slate-100" />
          <div className="h-8 w-32 rounded-xl bg-slate-100" />
          <div className="h-24 w-full rounded-xl bg-slate-100" />
          <div className="h-12 w-full rounded-full bg-slate-100" />
        </div>
      </div>
    </main>
  );
}
