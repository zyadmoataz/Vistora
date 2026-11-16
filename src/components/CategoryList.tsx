import { getCatalogCollections } from "@/services/catalogService";
import Image from "next/image";
import Link from "next/link";
import React from "react";

export default async function CategoryList() {
  const categories = await getCatalogCollections();

  return (
    <div className="container-shell overflow-x-auto scrollbar-hide pb-4">
      <div className="flex gap-6 min-w-max sm:min-w-0 sm:grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
        {categories.slice(0, 6).map((item) => (
          <Link
            href={`/list?cat=${item.slug}`}
            className="group flex flex-col w-60 sm:w-auto shrink-0"
            key={item._id || item.slug}
          >
            <div className="relative bg-slate-100 w-full h-80 rounded-2xl overflow-hidden shadow-soft border border-slate-100">
              <Image
                src={item.media?.mainMedia?.image?.url || "/category.png"}
                alt={item.name || "Category"}
                fill
                sizes="(max-width: 640px) 60vw, (max-width: 1024px) 33vw, 16vw"
                className="object-cover group-hover:scale-105 transition-transform duration-500 ease-spring"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy-950/75 via-navy-950/20 to-transparent opacity-85 group-hover:opacity-95 transition-opacity" />
              <div className="absolute bottom-4 inset-x-4 flex items-end justify-between text-white">
                <div>
                  <span className="text-[11px] uppercase tracking-widest text-slate-200 font-medium block">
                    Explore
                  </span>
                  <h3 className="text-lg font-semibold tracking-tight leading-snug">
                    {item.name}
                  </h3>
                </div>
                <span className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-xs group-hover:bg-brand-600 transition-colors">
                  →
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
