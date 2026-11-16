"use client";

import Image from "next/image";
import React, { useState } from "react";

interface MediaItem {
  _id?: string;
  image?: { url?: string };
}

export default function ProductImages({
  items,
  productName = "Product image",
}: {
  items?: MediaItem[];
  productName?: string;
}) {
  const safeItems: MediaItem[] =
    Array.isArray(items) && items.length > 0
      ? items
      : [{ _id: "fallback-0", image: { url: "/product.png" } }];

  const [index, setIndex] = useState(0);
  const currentUrl =
    safeItems[index]?.image?.url || safeItems[0]?.image?.url || "/product.png";

  return (
    <div className="flex flex-col gap-4">
      {/* Main Image */}
      <div className="h-[440px] sm:h-[540px] relative rounded-3xl overflow-hidden bg-slate-100 border border-slate-100 shadow-soft">
        <Image
          src={currentUrl}
          sizes="(max-width: 1024px) 100vw, 50vw"
          alt={`${productName} - View ${index + 1}`}
          fill
          priority
          className="object-cover transition-all duration-500"
        />
        {safeItems.length > 1 && (
          <div className="absolute bottom-4 right-4 bg-slate-900/75 backdrop-blur-md text-white text-xs font-semibold px-3 py-1.5 rounded-full">
            {index + 1} / {safeItems.length}
          </div>
        )}
      </div>

      {/* Thumbnail Strip */}
      {safeItems.length > 1 && (
        <div className="grid grid-cols-4 gap-3 sm:gap-4">
          {safeItems.map((item, i) => {
            const thumbUrl = item.image?.url || "/product.png";
            const isSelected = i === index;
            return (
              <button
                type="button"
                key={item._id || i}
                onClick={() => setIndex(i)}
                aria-label={`View image ${i + 1}`}
                className={`h-24 sm:h-28 relative rounded-2xl overflow-hidden transition-all ${
                  isSelected
                    ? "ring-2 ring-brand-600 ring-offset-2 opacity-100"
                    : "opacity-70 hover:opacity-100"
                }`}
              >
                <Image
                  src={thumbUrl}
                  sizes="20vw"
                  alt={`${productName} thumbnail ${i + 1}`}
                  fill
                  className="object-cover"
                />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
