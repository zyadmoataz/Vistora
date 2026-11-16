import { media as wixMedia } from "@wix/sdk";
import { products } from "@wix/stores";
import { DEFAULT_VARIANT_ID } from "./env";
import { sanitizeProductTitle } from "./wixProductNormalizer";

export interface CartItemMeta {
  name?: string;
  price?: number;
  image?: string;
  slug?: string;
  variantLabel?: string;
  options?: Record<string, string>;
  maxStock?: number;
}

export interface NormalizedLineItem {
  _id: string;
  productId: string;
  slug?: string;
  variantId?: string;
  productName?: { original?: string };
  quantity: number;
  price?: { amount?: string };
  image?: string;
  maxStock?: number;
  availability?: { status?: string };
}

export interface NormalizedCart {
  lineItems: NormalizedLineItem[];
  subtotal: { amount: string };
}

export interface WixRawLineItem {
  id?: string | null;
  _id?: string | null;
  catalogReference?: { catalogItemId?: string | null; options?: Record<string, unknown> | null } | null;
  productName?: { original?: string | null; translated?: string | null } | null;
  url?: string | { relativePath?: string | null } | null;
  quantity?: number | null;
  price?: { amount?: string | null } | null;
  image?: string | { url?: string | null } | null;
  availability?: { status?: string | null } | null;
}

export interface DefaultProductSelection { variantId: string; options?: Record<string, string>; }

export const isRemoteWixLineItemId = (itemId?: string): boolean =>
  Boolean(itemId && !itemId.includes("__") && !itemId.startsWith("wix-li-"));

export const resolveCartImageUrl = (img?: string | { url?: string | null } | null): string => {
  const raw = typeof img === "string" ? img : img?.url;
  if (!raw) return "/product.png";
  if (raw.startsWith("wix:image")) {
    try {
      return wixMedia.getScaledToFillImageUrl(raw, 72, 96, {});
    } catch {
      return "/product.png";
    }
  }
  return raw;
};

const extractSlugFromPath = (rawUrl?: string | { relativePath?: string | null } | null): string | undefined => {
  const path = typeof rawUrl === "string" ? rawUrl : rawUrl?.relativePath;
  return path?.split("/").filter(Boolean).pop() || undefined;
};

/** Maps Wix eCom line items safely without letting newly-added metadata overwrite existing items. */
export const mapWixLineItems = (
  items: WixRawLineItem[],
  addedProductId?: string,
  fallbackMeta?: CartItemMeta
): NormalizedLineItem[] =>
  items.map((li, idx) => {
    const catalogId = li.catalogReference?.catalogItemId || "";
    const isAddedMatch = Boolean(fallbackMeta && (!addedProductId || catalogId === addedProductId));
    const optVariant = li.catalogReference?.options?.variantId;
    const rawImg = typeof li.image === "string" ? li.image : li.image?.url || undefined;
    const rawName =
      li.productName?.original || li.productName?.translated || (isAddedMatch ? fallbackMeta?.name : undefined);
    const serverPrice = li.price?.amount ? li.price.amount : undefined;
    const rawPrice = serverPrice ?? (isAddedMatch && fallbackMeta?.price !== undefined ? String(fallbackMeta.price) : "0");

    return {
      _id: li._id || li.id || `wix-li-${catalogId || idx}-${idx}`,
      productId: catalogId,
      slug: extractSlugFromPath(li.url) || (isAddedMatch ? fallbackMeta?.slug : undefined),
      variantId: typeof optVariant === "string" ? optVariant : undefined,
      productName: { original: sanitizeProductTitle(rawName, idx) },
      quantity: Math.max(1, li.quantity || 1),
      price: { amount: String(rawPrice) },
      image: rawImg || (isAddedMatch ? fallbackMeta?.image : undefined),
      maxStock: isAddedMatch ? fallbackMeta?.maxStock : undefined,
      availability: { status: li.availability?.status || "IN STOCK" },
    };
  });

/** Preserves curated local-only cart items when syncing or mutating the remote Wix cart. */
export const mergeRemoteAndLocalItems = (
  remoteItems: NormalizedLineItem[],
  existingItems: NormalizedLineItem[]
): NormalizedLineItem[] => {
  const existingStockMap = new Map(existingItems.filter((i) => i.maxStock !== undefined).map((i) => [i.productId, i.maxStock]));
  const enrichedRemote = remoteItems.map((r) => ({ ...r, maxStock: r.maxStock ?? existingStockMap.get(r.productId) }));
  const remoteProductIds = new Set(enrichedRemote.map((i) => i.productId).filter(Boolean));
  const localOnly = existingItems.filter((i) => !isRemoteWixLineItemId(i._id) && !remoteProductIds.has(i.productId));
  return [...enrichedRemote, ...localOnly];
};

export const buildCatalogReferenceOptions = (
  variantId?: string,
  options?: Record<string, string>
): Record<string, unknown> | undefined => {
  if (variantId && variantId !== DEFAULT_VARIANT_ID) return { variantId };
  if (options && Object.keys(options).length > 0) return { options };
  return undefined;
};

/** Resolves the first available variant ID or default option map so Quick Add works on optioned SKUs. */
export const resolveDefaultProductSelection = (
  product: Pick<products.Product, "variants" | "productOptions">
): DefaultProductSelection => {
  const variants = (product.variants || []).filter((v) => v._id && v._id !== DEFAULT_VARIANT_ID);
  const available = variants.find(
    (v) => v.variant?.visible !== false && v.stock?.inStock !== false && (!v.stock?.trackQuantity || (v.stock.quantity ?? 0) > 0)
  );
  const picked = available || variants[0];
  if (picked?._id) return { variantId: picked._id, options: picked.choices };

  const optionMap: Record<string, string> = {};
  for (const opt of product.productOptions || []) {
    if (!opt.name || !opt.choices?.length) continue;
    const choice = opt.choices.find((c) => c.visible !== false && c.inStock !== false) || opt.choices[0];
    const val = choice?.description || choice?.value;
    if (val) optionMap[opt.name] = val;
  }
  return { variantId: DEFAULT_VARIANT_ID, options: Object.keys(optionMap).length > 0 ? optionMap : undefined };
};

export const countRemoteProductQuantity = (items: NormalizedLineItem[], productId: string): number =>
  items.filter((i) => isRemoteWixLineItemId(i._id) && i.productId === productId).reduce((sum, i) => sum + i.quantity, 0);

export const countRawWixProductQuantity = (items: WixRawLineItem[], productId: string): number =>
  items.filter((li) => li.catalogReference?.catalogItemId === productId).reduce((sum, li) => sum + Math.max(0, li.quantity || 0), 0);
