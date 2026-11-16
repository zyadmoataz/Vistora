import Image from "next/image";
import Link from "next/link";
import React from "react";
import { products } from "@wix/stores";
import { sanitizeHtml } from "@/lib/sanitizeHtml";
import ProductCardActions from "./ProductCardActions";
import { resolveDefaultProductSelection } from "@/lib/wixCartMapper";
import Badge from "./ui/Badge";

export default function ProductCard({ product }: { product: products.Product }) {
  const primaryImage = product.media?.mainMedia?.image?.url || "/product.png";
  const secondaryImage =
    product.media?.items && product.media.items.length > 1 ? product.media.items[1]?.image?.url : null;

  const basePrice = product.price?.price ?? 0;
  const finalPrice = product.price?.discountedPrice ?? basePrice;
  const hasDiscount = finalPrice < basePrice && basePrice > 0;
  const discountPct = hasDiscount ? Math.round(((basePrice - finalPrice) / basePrice) * 100) : 0;

  const rawShortDesc =
    product.additionalInfoSections?.find((s) => s.title === "shortDesc")?.description ||
    product.description ||
    "";

  return (
    <Link href={`/${product.slug}`} className="group flex flex-col gap-3.5">
      <div className="relative w-full h-80 rounded-2xl overflow-hidden bg-slate-100 border border-slate-100 shadow-soft">
        <Image
          src={primaryImage}
          alt={product.name || "Product"}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className={`object-cover transition-all duration-500 ${
            secondaryImage ? "z-10 group-hover:opacity-0" : "group-hover:scale-105"
          }`}
        />
        {secondaryImage && (
          <Image
            src={secondaryImage}
            alt={`${product.name || "Product"} alternate view`}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        )}
        <div className="absolute top-3 inset-x-3 z-20 flex items-center justify-between">
          <div>
            {hasDiscount && (
              <Badge variant="brand" className="text-[11px] px-2.5 py-1 shadow-sm">
                -{discountPct}%
              </Badge>
            )}
          </div>
          <ProductCardActions
            productId={product._id!}
            slug={product.slug!}
            name={product.name || "Vistora Piece"}
            price={finalPrice}
            imageUrl={primaryImage}
            mode="wishlist-icon"
          />
        </div>
      </div>

      <div className="flex justify-between items-start gap-2 pt-0.5">
        <h3 className="font-semibold text-navy-950 group-hover:text-brand-600 transition-colors line-clamp-1">
          {product.name}
        </h3>
        <div className="flex items-center gap-1.5 shrink-0">
          {hasDiscount && <span className="text-xs text-slate-600 line-through">${basePrice}</span>}
          <span className="font-bold text-navy-950">${finalPrice}</span>
        </div>
      </div>

      <div
        className="text-xs text-slate-600 line-clamp-2 min-h-[32px]"
        dangerouslySetInnerHTML={{ __html: sanitizeHtml(rawShortDesc) }}
      />

      <div className="flex items-center justify-between pt-1">
        <ProductCardActions
          productId={product._id!}
          slug={product.slug!}
          name={product.name || "Vistora Piece"}
          price={finalPrice}
          imageUrl={primaryImage}
          variantId={resolveDefaultProductSelection(product).variantId}
          options={resolveDefaultProductSelection(product).options}
          mode="add-button"
        />
        <span className="text-xs font-semibold text-slate-600 group-hover:text-brand-600 transition-colors">
          Details →
        </span>
      </div>
    </Link>
  );
}
