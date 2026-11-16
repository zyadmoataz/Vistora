"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { products } from "@wix/stores";
import useWixClient from "@/hooks/useWixClient";
import { ENV } from "@/lib/env";
import { ALL_FALLBACK_PRODUCTS, mergeWithFallbackCatalog } from "@/lib/wixProductNormalizer";
import { filterProductsByQuery } from "@/services/catalogFilterHelper";
import { CloseIcon, SearchIcon } from "./ui/Icons";

let cachedSearchPool: products.Product[] | null = null;
let inFlightSearchFetch: Promise<products.Product[]> | null = null;

export default function SearchBar({ onSearchDone }: { onSearchDone?: () => void }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const wixClient = useWixClient();

  const [query, setQuery] = useState(searchParams.get("name") || "");
  const [isOpen, setIsOpen] = useState(false);
  const [catalogPool, setCatalogPool] = useState<products.Product[]>(() => cachedSearchPool || ALL_FALLBACK_PRODUCTS);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => { setQuery(searchParams.get("name") || ""); }, [searchParams]);

  const ensureCatalogLoaded = () => {
    if (!ENV.IS_WIX_CONFIGURED) return;
    if (cachedSearchPool) { setCatalogPool(cachedSearchPool); return; }
    if (!inFlightSearchFetch) {
      inFlightSearchFetch = wixClient.products.queryProducts().limit(30).find().then((res) => {
        if (!res.items?.length) return ALL_FALLBACK_PRODUCTS;
        const merged = mergeWithFallbackCatalog(res.items);
        cachedSearchPool = merged;
        return merged;
      }).catch(() => ALL_FALLBACK_PRODUCTS);
    }
    inFlightSearchFetch.then(setCatalogPool);
  };

  useEffect(() => {
    const onOutside = (e: MouseEvent) => { if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) setIsOpen(false); };
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setIsOpen(false); };
    document.addEventListener("mousedown", onOutside);
    document.addEventListener("keydown", onKey);
    return () => { document.removeEventListener("mousedown", onOutside); document.removeEventListener("keydown", onKey); };
  }, []);

  const suggestions = useMemo(() => {
    if (!query.trim()) return [];
    return filterProductsByQuery(catalogPool, query).slice(0, 5);
  }, [query, catalogPool]);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmed = query.trim();
    setIsOpen(false);
    router.push(trimmed ? `/list?name=${encodeURIComponent(trimmed)}` : "/list");
    onSearchDone?.();
  };

  const handleClear = () => {
    setQuery("");
    setIsOpen(false);
    if (pathname === "/list" && searchParams.has("name")) {
      const params = new URLSearchParams(searchParams);
      params.delete("name");
      const qs = params.toString();
      router.replace(qs ? `/list?${qs}` : "/list");
    }
  };

  return (
    <div ref={wrapperRef} className="relative flex-1 max-w-md">
      <form className="flex bg-slate-100/90 hover:bg-slate-200/60 focus-within:bg-white ring-1 ring-slate-200/80 focus-within:ring-2 focus-within:ring-brand-600 transition-all justify-between items-center gap-2 px-4 py-2 rounded-full w-full" onSubmit={handleSearch} role="search">
        <input
          type="text"
          inputMode="search"
          name="name"
          autoComplete="off"
          value={query}
          onFocus={() => { ensureCatalogLoaded(); setIsOpen(true); }}
          onChange={(e) => { setQuery(e.target.value); setIsOpen(true); }}
          placeholder="Search coats, leather, watches..."
          aria-label="Search products"
          className="flex-1 bg-transparent text-sm text-navy-950 placeholder:text-slate-500 outline-none border-none focus:ring-0 min-w-0"
        />
        {query && (
          <button type="button" onClick={handleClear} aria-label="Clear search" className="w-5 h-5 rounded-full bg-slate-200/90 hover:bg-slate-300 text-slate-700 flex items-center justify-center transition-colors shrink-0">
            <CloseIcon className="w-3 h-3" />
          </button>
        )}
        <button type="submit" aria-label="Submit search" className="cursor-pointer p-1 rounded-full hover:bg-slate-200/60 text-navy-900 transition-colors shrink-0">
          <SearchIcon className="w-4 h-4" />
        </button>
      </form>

      {isOpen && query.trim().length > 0 && (
        <div className="absolute left-0 right-0 top-12 rounded-2xl bg-white border border-slate-200/90 shadow-elevated p-2 z-50 flex flex-col gap-1 animate-fade-in-up text-navy-950">
          {suggestions.length > 0 ? (
            <>
              {suggestions.map((item) => (
                <Link key={item._id} href={`/${item.slug}`} onClick={() => { setIsOpen(false); onSearchDone?.(); }} className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 transition-colors">
                  <Image width={40} height={48} src={item.media?.mainMedia?.image?.url || "/product.png"} alt={item.name || "Product"} className="w-10 h-12 rounded-lg object-cover bg-slate-100 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-navy-950 truncate">{item.name}</p>
                    <p className="text-[11px] text-slate-600">${item.price?.discountedPrice ?? item.price?.price ?? 0}</p>
                  </div>
                </Link>
              ))}
              <button type="button" onClick={() => { setIsOpen(false); router.push(`/list?name=${encodeURIComponent(query.trim())}`); onSearchDone?.(); }} className="w-full text-center text-xs font-semibold text-brand-600 hover:bg-brand-50 py-2 rounded-xl transition-colors border-t border-slate-100 mt-1">
                View all results for &ldquo;{query.trim()}&rdquo; →
              </button>
            </>
          ) : (
            <p className="text-xs text-slate-600 py-3 px-3 text-center">No matching pieces for &ldquo;{query.trim()}&rdquo;</p>
          )}
        </div>
      )}
    </div>
  );
}
