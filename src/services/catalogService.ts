import { collections, products } from "@wix/stores";
import { wixClientServer } from "@/lib/wixClientServer";
import { ALL_PRODUCTS_CATEGORY_ID, ENV } from "@/lib/env";
import { FALLBACK_COLLECTIONS } from "@/lib/fallbackCategories";
import { withTimeout } from "@/lib/securityHelpers";
import { ALL_FALLBACK_PRODUCTS, mergeWithFallbackCatalog, normalizeWixProduct } from "@/lib/wixProductNormalizer";
import {
  filterAndSortLocalProducts,
  PaginatedProductsResult,
  ProductFilterParams,
} from "./catalogFilterHelper";

export { ALL_FALLBACK_PRODUCTS };
export type { PaginatedProductsResult, ProductFilterParams };

const CACHE_TTL_MS = 1000 * 60 * 5;

interface CatalogMemoryStore {
  collectionsCache: { data: collections.Collection[]; ts: number } | null;
  mergedPoolCache: { data: products.Product[]; ts: number } | null;
  productsQueryCache: Map<string, { data: PaginatedProductsResult; ts: number }>;
  slugProductCache: Map<string, { data: products.Product; ts: number }>;
}

const g = globalThis as unknown as { __vistoraCatalogStore?: CatalogMemoryStore };
const store: CatalogMemoryStore = g.__vistoraCatalogStore ?? {
  collectionsCache: null,
  mergedPoolCache: null,
  productsQueryCache: new Map(),
  slugProductCache: new Map(),
};
g.__vistoraCatalogStore = store;

const getMergedCatalogPool = async (): Promise<products.Product[]> => {
  if (store.mergedPoolCache && Date.now() - store.mergedPoolCache.ts < CACHE_TTL_MS) {
    return store.mergedPoolCache.data;
  }
  if (ENV.IS_WIX_CONFIGURED) {
    try {
      const wixClient = await wixClientServer();
      const res = await withTimeout(wixClient.products.queryProducts().limit(50).find(), 450);
      if (res.items && res.items.length > 0) {
        const combined = mergeWithFallbackCatalog(res.items);
        store.mergedPoolCache = { data: combined, ts: Date.now() };
        return combined;
      }
    } catch {
      // Fallback to curated catalog
    }
  }
  store.mergedPoolCache = { data: ALL_FALLBACK_PRODUCTS, ts: Date.now() };
  return ALL_FALLBACK_PRODUCTS;
};

export const queryCatalogProducts = async (params: ProductFilterParams): Promise<PaginatedProductsResult> => {
  const pageSize = params.limit || 8;
  const cacheKey = JSON.stringify({ ...params, pageSize });
  const cached = store.productsQueryCache.get(cacheKey);
  if (cached && Date.now() - cached.ts < CACHE_TTL_MS) return cached.data;

  const pool = await getMergedCatalogPool();
  const result = filterAndSortLocalProducts(pool, params, pageSize);
  store.productsQueryCache.set(cacheKey, { data: result, ts: Date.now() });
  return result;
};

export const getCatalogCollections = async (): Promise<collections.Collection[]> => {
  if (store.collectionsCache && Date.now() - store.collectionsCache.ts < CACHE_TTL_MS) {
    return store.collectionsCache.data;
  }
  if (ENV.IS_WIX_CONFIGURED) {
    try {
      const wixClient = await wixClientServer();
      const res = await withTimeout(wixClient.collections.queryCollections().find(), 450);
      if (res.items && res.items.length > 1) {
        store.collectionsCache = { data: res.items, ts: Date.now() };
        return res.items;
      }
    } catch {
      // Fast fallback to curated collections
    }
  }
  store.collectionsCache = { data: FALLBACK_COLLECTIONS, ts: Date.now() };
  return FALLBACK_COLLECTIONS;
};

export const getCollectionBySlugSafe = async (slug?: string): Promise<collections.Collection> => {
  const targetSlug = slug || "all-products";
  const localMatch = FALLBACK_COLLECTIONS.find((c) => c.slug === targetSlug);
  if (localMatch) return localMatch;

  if (ENV.IS_WIX_CONFIGURED) {
    try {
      const wixClient = await wixClientServer();
      const res = await withTimeout(wixClient.collections.getCollectionBySlug(targetSlug), 400);
      if (res.collection) return res.collection;
    } catch {
      // Fallback
    }
  }
  return {
    _id: ALL_PRODUCTS_CATEGORY_ID,
    name: targetSlug.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" "),
    slug: targetSlug,
  };
};

export const getProductBySlugSafe = async (slug: string): Promise<products.Product | null> => {
  const pool = await getMergedCatalogPool();
  const poolMatch = pool.find((p) => p.slug === slug);
  if (poolMatch) return poolMatch;

  const cached = store.slugProductCache.get(slug);
  if (cached && Date.now() - cached.ts < CACHE_TTL_MS) return cached.data;

  if (ENV.IS_WIX_CONFIGURED) {
    try {
      const wixClient = await wixClientServer();
      const res = await withTimeout(wixClient.products.queryProducts().eq("slug", slug).find(), 450);
      if (res.items && res.items[0]) {
        const normalized = normalizeWixProduct(res.items[0]);
        store.slugProductCache.set(slug, { data: normalized, ts: Date.now() });
        return normalized;
      }
    } catch {
      // Fallback
    }
  }
  return null;
};
