"use client";

import { products } from "@wix/stores";
import React, { useEffect, useState } from "react";
import Add from "./Add";
import { CartItemMeta } from "@/hooks/useCartStore";
import { DEFAULT_VARIANT_ID } from "@/lib/env";

const isVariantAvailable = (variant: products.Variant): boolean => {
  if (!variant.stock) return true;
  if (variant.stock.trackQuantity === false) return Boolean(variant.stock.inStock);
  return Boolean(
    variant.stock.inStock && (variant.stock.quantity == null || variant.stock.quantity > 0)
  );
};

export default function CustomizeProducts({
  productId,
  variants,
  productOptions,
  meta,
}: {
  productId: string;
  variants: products.Variant[];
  productOptions: products.ProductOption[];
  meta?: CartItemMeta & { slug?: string };
}) {
  const [selectOptions, setSelectOptions] = useState<{ [key: string]: string }>(() => {
    const firstValid = variants.find((v) => isVariantAvailable(v) && v.choices);
    if (firstValid?.choices) return { ...firstValid.choices };
    const defaults: { [key: string]: string } = {};
    productOptions.forEach((opt) => {
      if (opt.name && opt.choices?.[0]?.description) {
        defaults[opt.name] = opt.choices[0].description;
      }
    });
    return defaults;
  });

  const [selectedVariant, setSelectedVariant] = useState<products.Variant>();

  useEffect(() => {
    const variant = variants.find((v) => {
      if (!v.choices) return false;
      return Object.entries(selectOptions).every(([k, val]) => v.choices![k] === val);
    });
    setSelectedVariant(variant);
  }, [selectOptions, variants]);

  const isChoiceInStock = (choices: { [key: string]: string }) => {
    if (variants.length === 0) return true;
    return variants.some((v) => {
      if (!v.choices) return false;
      return (
        Object.entries(choices).every(([k, val]) => v.choices![k] === val) &&
        isVariantAvailable(v)
      );
    });
  };

  const effectiveStock = selectedVariant
    ? isVariantAvailable(selectedVariant)
      ? selectedVariant.stock?.quantity ?? 10
      : 0
    : 10;

  return (
    <div className="flex flex-col gap-6">
      {productOptions.map((option) => (
        <div className="flex flex-col gap-3" key={option.name}>
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-navy-950">Select {option.name}</h2>
            {selectOptions[option.name!] && (
              <span className="text-xs font-medium text-slate-600">{selectOptions[option.name!]}</span>
            )}
          </div>
          <ul className="flex items-center gap-3 flex-wrap">
            {option.choices?.map((choice) => {
              const disabled = !isChoiceInStock({ ...selectOptions, [option.name!]: choice.description! });
              const selected = selectOptions[option.name!] === choice.description;
              const onClick = disabled
                ? undefined
                : () => setSelectOptions((prev) => ({ ...prev, [option.name!]: choice.description! }));

              return option.name === "Color" ? (
                <li key={choice.description}>
                  <button
                    type="button"
                    disabled={disabled}
                    aria-label={`Color ${choice.description}`}
                    onClick={onClick}
                    className={`w-9 h-9 rounded-full ring-1 ring-slate-300 relative transition-transform ${
                      selected ? "scale-110 ring-2 ring-brand-600 ring-offset-2" : ""
                    } ${disabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer"}`}
                    style={{ backgroundColor: choice.value }}
                  >
                    {disabled && (
                      <span className="absolute w-10 h-[2px] bg-red-500 rotate-45 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                    )}
                  </button>
                </li>
              ) : (
                <li key={choice.description}>
                  <button
                    type="button"
                    disabled={disabled}
                    onClick={onClick}
                    className={`rounded-full py-2 px-5 text-xs font-semibold transition-all ${
                      selected
                        ? "bg-navy-900 text-white shadow-sm"
                        : disabled
                        ? "bg-slate-100 text-slate-500 cursor-not-allowed line-through"
                        : "bg-white text-navy-900 ring-1 ring-slate-300 hover:ring-navy-900"
                    }`}
                  >
                    {choice.description}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      ))}

      <Add
        productId={productId}
        variantId={selectedVariant?._id || DEFAULT_VARIANT_ID}
        stockNumber={effectiveStock}
        meta={meta}
      />
    </div>
  );
}
