"use client";

import { usePathname, useSearchParams, useRouter } from "next/navigation";
import React, { useEffect, useRef, useState, useTransition } from "react";
import CustomSelect, { SelectOption } from "./ui/CustomSelect";

const CATEGORY_OPTIONS: SelectOption[] = [
  { value: "", label: "All Categories" },
  { value: "featured", label: "Featured Collection" },
  { value: "apparel", label: "Outerwear & Apparel" },
  { value: "accessories", label: "Leather & Accessories" },
  { value: "footwear", label: "Artisan Footwear" },
  { value: "watches", label: "Modern Timepieces" },
];

const TYPE_OPTIONS: SelectOption[] = [
  { value: "", label: "All Product Types" },
  { value: "physical", label: "Physical Goods" },
  { value: "digital", label: "Digital Passes" },
];

const SORT_OPTIONS: SelectOption[] = [
  { value: "", label: "Featured Curated" },
  { value: "asc price", label: "Price: Low to High" },
  { value: "desc price", label: "Price: High to Low" },
  { value: "asc lastUpdated", label: "Newest Releases" },
  { value: "desc lastUpdated", label: "Classic Archive" },
];

export default function Filter() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { replace } = useRouter();
  const [isPending, startTransition] = useTransition();

  const [minPrice, setMinPrice] = useState(searchParams.get("min") || "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("max") || "");
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setMinPrice(searchParams.get("min") || "");
    setMaxPrice(searchParams.get("max") || "");
  }, [searchParams]);

  useEffect(() => () => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
  }, []);

  const updateParam = (name: string, value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value && value.trim() !== "") {
      params.set(name, value.trim());
    } else {
      params.delete(name);
    }
    params.delete("page");
    startTransition(() => {
      const qs = params.toString();
      replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    });
  };

  const handlePriceChange = (field: "min" | "max", val: string) => {
    if (field === "min") setMinPrice(val);
    else setMaxPrice(val);

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => updateParam(field, val), 320);
  };

  const handleReset = () => {
    setMinPrice("");
    setMaxPrice("");
    startTransition(() => replace(pathname, { scroll: false }));
  };

  const hasActiveFilters =
    searchParams.has("type") ||
    searchParams.has("min") ||
    searchParams.has("max") ||
    searchParams.has("sort") ||
    searchParams.has("name") ||
    (searchParams.has("cat") && searchParams.get("cat") !== "all-products");

  return (
    <div aria-busy={isPending} className={`mt-10 p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col lg:flex-row lg:items-center justify-between gap-4 transition-opacity ${isPending ? "opacity-75" : ""}`}>
      <div className="flex gap-3 flex-wrap items-center">
        <CustomSelect name="cat" ariaLabel="Filter by category" value={searchParams.get("cat") || ""} options={CATEGORY_OPTIONS} onChange={(val) => updateParam("cat", val)} />
        <CustomSelect name="type" ariaLabel="Filter by product type" value={searchParams.get("type") || ""} options={TYPE_OPTIONS} onChange={(val) => updateParam("type", val)} />

        <div className="flex items-center gap-2 bg-white px-3.5 py-2 rounded-full ring-1 ring-slate-200 focus-within:ring-2 focus-within:ring-brand-600 transition-all">
          <span className="text-[11px] text-slate-600 font-semibold">$</span>
          <input type="number" name="min" min={0} value={minPrice} placeholder="Min price" aria-label="Minimum price" className="text-xs w-20 outline-none bg-transparent text-navy-950 placeholder:text-slate-500" onChange={(e) => handlePriceChange("min", e.target.value)} />
          <span className="text-slate-400">—</span>
          <input type="number" name="max" min={0} value={maxPrice} placeholder="Max price" aria-label="Maximum price" className="text-xs w-20 outline-none bg-transparent text-navy-950 placeholder:text-slate-500" onChange={(e) => handlePriceChange("max", e.target.value)} />
        </div>

        {hasActiveFilters && (
          <button type="button" onClick={handleReset} className="text-xs font-semibold text-brand-700 hover:text-brand-800 px-3.5 py-2 rounded-full hover:bg-brand-50 transition-colors">
            Reset Filters ✕
          </button>
        )}
      </div>

      <div className="flex items-center gap-3 self-end lg:self-auto">
        <span className="text-xs text-slate-600 font-medium">{isPending ? "Updating..." : "Sort by:"}</span>
        <CustomSelect id="sort-select" name="sort" ariaLabel="Sort products by" value={searchParams.get("sort") || ""} options={SORT_OPTIONS} onChange={(val) => updateParam("sort", val)} />
      </div>
    </div>
  );
}
