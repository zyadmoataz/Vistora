import ProductList from "@/components/ProductList"
import Pagination from "@/components/Pagination"
import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { wixClientServer } from "@/lib/wixClientServer";
import FallbackImage from "@/components/FallbackImage";

const DealsPage = async ({ searchParams }: { searchParams: any }) => {
  // Determine if we're showing a specific sale type
  const currentFilter = searchParams?.saleType || "all";
  
  // Set up search parameters for filtering
  const saleParams: {
    onSale: boolean;
    page: number | string;
    tag?: string;
  } = { 
    onSale: true,
    page: searchParams?.page || 0
  };
  
  // Add tag parameter if we're filtering by sale type
  if (currentFilter !== "all") {
    saleParams.tag = currentFilter;
  }
  
  // Set the title based on the current filter
  let saleTitle = "Hot Deals";
  if (currentFilter === "flash") {
    saleTitle = "Flash Sales";
  } else if (currentFilter === "clearance") {
    saleTitle = "Clearance Items";
  } else if (currentFilter === "bundle") {
    saleTitle = "Bundle Offers";
  }
  
  // For pagination
  const currentPage = searchParams?.page ? parseInt(searchParams.page) : 0;
  const ITEMS_PER_PAGE = 20; // Show more items per page for better browsing
  return (
    <div className="mt-12 px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64 min-h-[70vh]">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Special Deals</h1>
        <p className="text-gray-600">Discover our limited-time offers and exclusive discounts</p>
      </div>

      {/* Featured Deals Banner */}
      <div className="w-full bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-8 mb-12">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 p-4">
            <h2 className="text-2xl font-semibold mb-2">Summer Sale</h2>
            <p className="text-lg mb-4">Up to 40% off on selected items</p>
            <p className="mb-6 text-gray-600">Limited time offer. Don't miss out on these amazing deals!</p>
            <Link href="/shop" className="bg-black text-white px-6 py-3 rounded-md hover:bg-gray-800 transition">
              Shop Now
            </Link>
          </div>
          <div className="md:w-1/2 flex justify-center">
            <div className="relative h-[300px] w-[300px]">
              <FallbackImage 
                src="/summer-sale.jpg"
                fallbackSrc="https://img.freepik.com/free-vector/summer-sale-background_23-2148520287.jpg"
                alt="Summer Sale"
                fill
                className="object-contain rounded-md"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Discounted Products */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold mb-6">{saleTitle}</h2>
        <Suspense fallback={
          <div className="flex justify-center items-center min-h-[50vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
          </div>
        }>
          <ProductList 
            categoryId="" 
            limit={ITEMS_PER_PAGE} 
            searchParams={saleParams} 
          />
        </Suspense>
        
        {/* Pagination */}
        <div className="mt-12 mb-8 flex justify-center">
          <Pagination 
            currentPage={currentPage} 
            hasPrev={currentPage > 0}
            hasNext={true} 
          />
        </div>
      </div>

      {/* Deal Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        <div className={`p-6 rounded-lg hover:shadow-md transition ${currentFilter === 'flash' ? 'bg-blue-50 border border-blue-200' : 'bg-gray-50'}`}>
          <h3 className="text-xl font-medium mb-2">Flash Sales</h3>
          <p className="text-gray-600 mb-4">24-hour deals that you don't want to miss</p>
          <Link href="/deals?saleType=flash" className="text-black font-medium hover:underline">
            View Flash Sales →
          </Link>
        </div>
        <div className={`p-6 rounded-lg hover:shadow-md transition ${currentFilter === 'clearance' ? 'bg-blue-50 border border-blue-200' : 'bg-gray-50'}`}>
          <h3 className="text-xl font-medium mb-2">Clearance</h3>
          <p className="text-gray-600 mb-4">Last chance to grab these items at amazing prices</p>
          <Link href="/deals?saleType=clearance" className="text-black font-medium hover:underline">
            View Clearance →
          </Link>
        </div>
        <div className={`p-6 rounded-lg hover:shadow-md transition ${currentFilter === 'bundle' ? 'bg-blue-50 border border-blue-200' : 'bg-gray-50'}`}>
          <h3 className="text-xl font-medium mb-2">Bundle Offers</h3>
          <p className="text-gray-600 mb-4">Save more when you buy multiple items together</p>
          <Link href="/deals?saleType=bundle" className="text-black font-medium hover:underline">
            View Bundle Offers →
          </Link>
        </div>
      </div>
    </div>
  )
}

export default DealsPage
