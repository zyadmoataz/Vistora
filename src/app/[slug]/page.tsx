import Add from "@/components/Add";
import CustomizeProducts from "@/components/CustomizeProducts";
import ProductImages from "@/components/ProductImages";
import ProductList from "@/components/ProductList";
import ProductReviews from "@/components/ProductReviews";
import ShareProductButton from "@/components/ShareProductButton";
import Badge from "@/components/ui/Badge";
import { ProductGridSkeleton } from "@/components/ui/Skeleton";
import { RotateCcwIcon, ShieldCheckIcon, TruckIcon } from "@/components/ui/Icons";
import { ALL_PRODUCTS_CATEGORY_ID, DEFAULT_VARIANT_ID } from "@/lib/env";
import { resolveBaseStock } from "@/hooks/useInventoryStore";
import { sanitizeHtml } from "@/lib/sanitizeHtml";
import { sanitizePlainText, serializeJsonLd } from "@/lib/securityHelpers";
import { ALL_FALLBACK_PRODUCTS, getProductBySlugSafe } from "@/services/catalogService";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";

export async function generateStaticParams() {
  return ALL_FALLBACK_PRODUCTS.filter((p) => Boolean(p.slug)).map((p) => ({ slug: p.slug! }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const product = await getProductBySlugSafe(params.slug);
  if (!product) return { title: "Product Not Found" };
  const desc = sanitizePlainText(product.description?.replace(/<[^>]*>/g, " ") || "", 155) || "Shop Vistora Atelier.";
  const img = product.media?.mainMedia?.image?.url || "/product.png";
  return {
    title: product.name || "Vistora Piece",
    description: desc,
    alternates: { canonical: `/${params.slug}` },
    openGraph: { title: product.name || "Vistora Atelier", description: desc, images: [img] },
  };
}

export default async function SinglePage({ params }: { params: { slug: string } }) {
  const product = await getProductBySlugSafe(params.slug);
  if (!product) return notFound();

  const basePrice = product.price?.price ?? 0;
  const finalPrice = product.price?.discountedPrice ?? basePrice;
  const hasDiscount = finalPrice < basePrice && basePrice > 0;
  const primaryImage = product.media?.mainMedia?.image?.url || "/product.png";

  const defaultStock = resolveBaseStock(product.stock);

  const itemMeta = { name: product.name || "Vistora Essential", price: finalPrice, image: primaryImage, slug: product.slug || params.slug };

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: itemMeta.name,
    image: primaryImage,
    description: sanitizePlainText(product.description?.replace(/<[^>]*>/g, " "), 200),
    offers: {
      "@type": "Offer",
      priceCurrency: "USD",
      price: finalPrice,
      availability: defaultStock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
    },
  };

  return (
    <main className="container-shell py-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(productSchema) }} />

      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-slate-600 mb-8">
        <Link href="/" className="hover:text-navy-950 transition-colors">Home</Link>
        <span>/</span>
        <Link href="/list" className="hover:text-navy-950 transition-colors">Collection</Link>
        <span>/</span>
        <span className="text-navy-950 font-semibold truncate">{product.name}</span>
      </nav>

      <div className="flex flex-col lg:flex-row gap-12 xl:gap-16">
        <div className="w-full lg:w-1/2 lg:sticky lg:top-28 h-max">
          <ProductImages items={product.media?.items} productName={product.name || "Product"} />
        </div>

        <div className="w-full lg:w-1/2 flex flex-col gap-6">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <Badge variant="brandSoft">Verified Atelier Piece</Badge>
            <ShareProductButton title={itemMeta.name} />
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold text-navy-950 tracking-tight">{product.name}</h1>

          <div className="flex items-baseline gap-4">
            <span className="text-3xl font-bold text-navy-950">${finalPrice}</span>
            {hasDiscount && (
              <>
                <span className="text-lg line-through text-slate-600">${basePrice}</span>
                <Badge variant="brandSoft">Save ${basePrice - finalPrice}</Badge>
              </>
            )}
          </div>

          {product.description && (
            <div className="text-slate-600 text-sm sm:text-base leading-relaxed" dangerouslySetInnerHTML={{ __html: sanitizeHtml(product.description) }} />
          )}

          <div className="h-px bg-slate-200/80" />

          {product.variants?.length && product.productOptions?.length ? (
            <CustomizeProducts productId={product._id!} variants={product.variants} productOptions={product.productOptions} fallbackStock={defaultStock} meta={itemMeta} />
          ) : (
            <Add productId={product._id!} variantId={DEFAULT_VARIANT_ID} stockNumber={defaultStock} meta={itemMeta} />
          )}

          <div className="h-px bg-slate-200/80" />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-600 bg-slate-50 p-4 rounded-2xl border border-slate-200/70">
            <div className="flex items-start gap-2.5"><TruckIcon className="w-4 h-4 text-brand-600 shrink-0 mt-0.5" /><div><strong className="text-navy-950 block">Express Delivery</strong>Free shipping over $150</div></div>
            <div className="flex items-start gap-2.5"><RotateCcwIcon className="w-4 h-4 text-brand-600 shrink-0 mt-0.5" /><div><strong className="text-navy-950 block">30-Day Returns</strong>Complimentary exchanges</div></div>
            <div className="flex items-start gap-2.5"><ShieldCheckIcon className="w-4 h-4 text-brand-600 shrink-0 mt-0.5" /><div><strong className="text-navy-950 block">Authenticity</strong>100% certified materials</div></div>
          </div>

          {product.additionalInfoSections && product.additionalInfoSections.length > 0 && (
            <div className="flex flex-col gap-4 pt-2">
              {product.additionalInfoSections.filter((sec) => sec.title !== "shortDesc").map((section) => (
                <div className="p-4 rounded-2xl border border-slate-200/80 bg-white text-sm" key={section.title}>
                  <h2 className="font-semibold text-navy-950 mb-1.5 text-sm">{section.title}</h2>
                  <div className="text-slate-600 text-xs sm:text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: sanitizeHtml(section.description) }} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <ProductReviews productName={itemMeta.name} slug={itemMeta.slug} />

      <section aria-labelledby="related-heading" className="mt-20 pt-14 border-t border-slate-200">
        <div className="flex items-end justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-brand-700">Curated Pairing</span>
            <h2 id="related-heading" className="text-2xl sm:text-3xl font-bold text-navy-950 mt-1">You Might Also Like</h2>
          </div>
          <Link href="/list" className="text-xs sm:text-sm font-semibold text-navy-950 hover:text-brand-600 transition-colors">View All →</Link>
        </div>
        <Suspense fallback={<ProductGridSkeleton count={4} />}>
          <ProductList categoryId={ALL_PRODUCTS_CATEGORY_ID} limit={4} searchParams={{ excludeId: product._id }} />
        </Suspense>
      </section>
    </main>
  );
}
