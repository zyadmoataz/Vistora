import React from "react";
import Link from "next/link";
import Badge from "@/components/ui/Badge";

export default function NotFound() {
  return (
    <main className="container-shell py-24 flex flex-col items-center justify-center text-center gap-6">
      <Badge variant="brandSoft" className="uppercase tracking-widest">
        404 • Page Not Found
      </Badge>
      <h1 className="text-4xl sm:text-5xl font-bold text-navy-950 tracking-tight">
        This Piece Has Left the Archive
      </h1>
      <p className="text-sm sm:text-base text-slate-600 max-w-md leading-relaxed">
        The page or collection you are looking for may have moved or is no longer available. Let us guide you back to our curated collection.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
        <Link href="/" className="px-7 py-3.5 rounded-full bg-navy-950 text-white text-sm font-semibold hover:bg-brand-600 transition-colors">
          Return to Homepage
        </Link>
        <Link href="/list" className="px-7 py-3.5 rounded-full ring-1 ring-slate-300 text-navy-950 text-sm font-semibold hover:bg-slate-50 transition-colors">
          Browse Collection
        </Link>
      </div>
    </main>
  );
}
