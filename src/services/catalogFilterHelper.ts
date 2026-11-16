import { products } from "@wix/stores";
import { ALL_PRODUCTS_CATEGORY_ID } from "../lib/env";

export interface ProductFilterParams {
  categoryId?: string;
  cat?: string;
  name?: string;
  type?: string;
  min?: string;
  max?: string;
  sort?: string;
  page?: string;
  limit?: number;
  dealsOnly?: boolean;
  excludeId?: string;
}

export interface PaginatedProductsResult {
  items: products.Product[];
  currentPage: number;
  totalPages: number;
  totalCount: number;
  hasPrev: boolean;
  hasNext: boolean;
}

/**
 * Shared case-insensitive search matcher used by both server listing and live search suggestions.
 */
export const filterProductsByQuery = (
  items: products.Product[],
  rawQuery?: string
): products.Product[] => {
  const q = (rawQuery || "").toLowerCase().trim();
  if (!q) return items;

  const isGenericProductQuery = "products".startsWith(q) && q.length >= 2;
  const matched = items.filter((p) => {
    const searchable = `${p.name || ""} ${p.description || ""} ${p.slug || ""} ${p.productType || ""}`
      .replace(/<[^>]*>/g, " ")
      .toLowerCase();
    return searchable.includes(q);
  });

  if (matched.length > 0) return matched;
  return isGenericProductQuery ? items : [];
};

export const filterAndSortLocalProducts = (
  source: products.Product[],
  params: ProductFilterParams,
  pageSize: number
): PaginatedProductsResult => {
  let list = [...source];

  if (params.excludeId) {
    list = list.filter((p) => p._id !== params.excludeId);
  }

  if (params.categoryId && params.categoryId !== ALL_PRODUCTS_CATEGORY_ID) {
    const byId = list.filter((p) => p.collectionIds?.includes(params.categoryId!));
    if (byId.length > 0) list = byId;
  }

  if (params.name) {
    list = filterProductsByQuery(list, params.name);
  }

  if (params.type === "physical" || params.type === "digital") {
    list = list.filter((p) => p.productType === params.type);
  }

  const minPrice = params.min ? parseFloat(params.min) : 0;
  const maxPrice = params.max ? parseFloat(params.max) : 999999;
  list = list.filter((p) => {
    const val = p.price?.discountedPrice ?? p.price?.price ?? 0;
    return val >= (isNaN(minPrice) ? 0 : minPrice) && val <= (isNaN(maxPrice) ? 999999 : maxPrice);
  });

  if (params.dealsOnly) {
    list = list.filter((p) => (p.price?.discountedPrice ?? p.price?.price ?? 0) < (p.price?.price ?? 0));
  }

  if (params.sort) {
    const [dir, field] = params.sort.split(" ");
    list.sort((a, b) => {
      if (field === "price") {
        const pa = a.price?.discountedPrice ?? a.price?.price ?? 0;
        const pb = b.price?.discountedPrice ?? b.price?.price ?? 0;
        return dir === "asc" ? pa - pb : pb - pa;
      }
      if (field === "lastUpdated") {
        const ta = a.lastUpdated ? new Date(a.lastUpdated).getTime() : 0;
        const tb = b.lastUpdated ? new Date(b.lastUpdated).getTime() : 0;
        if (ta !== tb) return dir === "asc" ? tb - ta : ta - tb;
        return dir === "asc"
          ? (b._id || "").localeCompare(a._id || "")
          : (a._id || "").localeCompare(b._id || "");
      }
      return dir === "asc"
        ? (a.name || "").localeCompare(b.name || "")
        : (b.name || "").localeCompare(a.name || "");
    });
  }

  const currentPage = Math.max(0, parseInt(params.page || "0", 10) || 0);
  const totalCount = list.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const start = currentPage * pageSize;

  return {
    items: list.slice(start, start + pageSize),
    currentPage,
    totalPages,
    totalCount,
    hasPrev: currentPage > 0,
    hasNext: currentPage + 1 < totalPages,
  };
};
