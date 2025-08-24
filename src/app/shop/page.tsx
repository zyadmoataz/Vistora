import ProductList from "@/components/ProductList"
import Pagination from "@/components/Pagination"
import ShopFilters from "@/components/ShopFilters"
import { Suspense } from "react";
import { wixClientServer } from "@/lib/wixClientServer";

const ShopPage = async ({ searchParams }: { searchParams: any }) => {
  // Fetch categories for filter
  const wixClient = await wixClientServer();
  // Using collections API to get categories
  const categories = await wixClient.collections.queryCollections().find();
  
  // Calculate pagination
  const currentPage = searchParams?.page ? parseInt(searchParams.page) : 0;
  const ITEMS_PER_PAGE = 20; // Show more items per page
  
  return (
    <div className="mt-12 px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64 min-h-[70vh]">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Shop All Products</h1>
        <p className="text-gray-600">Browse our complete collection of high-quality products</p>
      </div>
      
      {/* Shop Filters - Client Component */}
      <ShopFilters categories={categories.items} searchParams={searchParams} />
      
      <Suspense fallback={
        <div className="flex justify-center items-center min-h-[50vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
        </div>
      }>
        <ProductList 
          categoryId={searchParams?.category || ""} 
          limit={ITEMS_PER_PAGE}
          searchParams={searchParams}
        />
      </Suspense>
      
      {/* Pagination */}
      <div className="mt-12 mb-8 flex justify-center">
        <Pagination 
          currentPage={currentPage} 
          hasPrev={currentPage > 0}
          hasNext={true} // We'll assume there's always a next page unless we implement a specific check
        />
      </div>
    </div>
  )
}

export default ShopPage
