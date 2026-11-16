import React from "react";
import { products } from "@wix/stores";
import Pagination from "./Pagination";
import ProductCard from "./ProductCard";
import EmptyState from "./ui/EmptyState";
import { ProductFilterParams, queryCatalogProducts } from "@/services/catalogService";

export default async function ProductList({
  categoryId,
  limit,
  searchParams,
  dealsOnly = false,
  showPagination = false,
}: {
  categoryId: string;
  limit?: number;
  searchParams?: ProductFilterParams;
  dealsOnly?: boolean;
  showPagination?: boolean;
}) {
  const result = await queryCatalogProducts({ ...searchParams, categoryId, limit, dealsOnly });

  if (result.items.length === 0) {
    return (
      <EmptyState
        title="No matching pieces found"
        description="We couldn't find any items matching your active filters or search query. Try broadening your selection."
        actionLabel="Reset All Filters"
        actionHref="/list"
      />
    );
  }

  const shouldPaginate =
    showPagination || Boolean(searchParams?.cat || searchParams?.name || searchParams?.page || searchParams?.sort);

  return (
    <div className="mt-8">
      {showPagination && (
        <p className="text-xs font-medium text-slate-600 mb-4">
          Showing <strong className="text-navy-950">{result.items.length}</strong> of{" "}
          <strong className="text-navy-950">{result.totalCount}</strong> curated pieces
        </p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-7 gap-y-12">
        {result.items.map((product: products.Product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>

      {shouldPaginate && (
        <Pagination
          currentPage={result.currentPage}
          totalPages={result.totalPages}
          hasPrev={result.hasPrev}
          hasNext={result.hasNext}
        />
      )}
    </div>
  );
}
