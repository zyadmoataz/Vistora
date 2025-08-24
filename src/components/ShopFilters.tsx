"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

// Accept any category/collection object that has at least an _id and name property
interface ShopFiltersProps {
  categories: Array<{ _id?: string; id?: string; name?: string }>;
  searchParams: any;
}

const ShopFilters = ({ categories, searchParams }: ShopFiltersProps) => {
  const router = useRouter();
  const params = useSearchParams();

  // Create a new search params string with updated values
  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams);
      params.set(name, value);
      return params.toString();
    },
    [searchParams]
  );

  // Update URL to reflect filter changes
  const handleFilterChange = (filterName: string, value: string) => {
    const query = createQueryString(filterName, value);
    router.push(`/shop?${query}`);
  };

  // Handle price filter which needs to split into min and max
  const handlePriceFilter = (value: string) => {
    const [min, max] = value.split("-");
    const params = new URLSearchParams(searchParams);
    params.set("min", min);
    params.set("max", max || "99999");
    router.push(`/shop?${params.toString()}`);
  };

  // Clear a specific filter
  const clearFilter = (filterName: string) => {
    const params = new URLSearchParams(searchParams);
    params.delete(filterName);
    router.push(`/shop?${params.toString()}`);
  };

  // Clear all filters
  const clearAllFilters = () => {
    router.push("/shop");
  };

  return (
    <>
      {/* Filter and Sort Section */}
      <div className="flex flex-col md:flex-row justify-between mb-8 gap-4">
        <div className="flex flex-wrap gap-3">
          <div className="relative">
            <select 
              className="block appearance-none w-full bg-white border border-gray-300 hover:border-gray-400 px-4 py-2 pr-8 rounded-md focus:outline-none focus:ring-2 focus:ring-black" 
              defaultValue={searchParams?.type || ""}
              onChange={(e) => handleFilterChange("type", e.target.value)}
            >
              <option value="">All Types</option>
              <option value="physical">Physical</option>
              <option value="digital">Digital</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
              </svg>
            </div>
          </div>
          
          <div className="relative">
            <select 
              className="block appearance-none w-full bg-white border border-gray-300 hover:border-gray-400 px-4 py-2 pr-8 rounded-md focus:outline-none focus:ring-2 focus:ring-black" 
              defaultValue={searchParams?.category || ""}
              onChange={(e) => handleFilterChange("category", e.target.value)}
            >
              <option value="">All Categories</option>
              {categories.map((category) => {
                // Handle different possible id field names
                const categoryId = category._id || category.id || '';
                return (
                  <option key={categoryId} value={categoryId}>
                    {category.name || 'Unnamed Category'}
                  </option>
                );
              })}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
              </svg>
            </div>
          </div>
          
          <div className="relative">
            <select 
              className="block appearance-none w-full bg-white border border-gray-300 hover:border-gray-400 px-4 py-2 pr-8 rounded-md focus:outline-none focus:ring-2 focus:ring-black" 
              defaultValue={searchParams?.min && searchParams?.max ? `${searchParams.min}-${searchParams.max}` : "0-99999"}
              onChange={(e) => handlePriceFilter(e.target.value)}
            >
              <option value="0-99999">Price: All</option>
              <option value="0-50">Under $50</option>
              <option value="50-100">$50 - $100</option>
              <option value="100-200">$100 - $200</option>
              <option value="200-99999">$200+</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
              </svg>
            </div>
          </div>
        </div>
        
        <div className="relative">
          <select 
            className="block appearance-none w-full bg-white border border-gray-300 hover:border-gray-400 px-4 py-2 pr-8 rounded-md focus:outline-none focus:ring-2 focus:ring-black" 
            defaultValue={searchParams?.sort || ""}
            onChange={(e) => handleFilterChange("sort", e.target.value)}
          >
            <option value="">Sort By: Featured</option>
            <option value="asc price">Price: Low to High</option>
            <option value="desc price">Price: High to Low</option>
            <option value="asc name">Name: A to Z</option>
            <option value="desc name">Name: Z to A</option>
            <option value="desc lastUpdated">Newest</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
            </svg>
          </div>
        </div>
      </div>
      
      {/* Active Filters */}
      {(searchParams?.type || searchParams?.min || searchParams?.category) && (
        <div className="flex flex-wrap gap-2 mb-6">
          <div className="text-sm font-medium mr-2 py-1">Active filters:</div>
          {searchParams?.type && (
            <div className="text-sm bg-gray-100 py-1 px-3 rounded-full flex items-center gap-2">
              Type: {searchParams.type}
              <button 
                onClick={() => clearFilter("type")}
                className="ml-1 text-gray-500 hover:text-black"
              >
                ×
              </button>
            </div>
          )}
          {(searchParams?.min || searchParams?.max) && (
            <div className="text-sm bg-gray-100 py-1 px-3 rounded-full flex items-center gap-2">
              Price: ${searchParams.min || 0} - ${searchParams.max || "∞"}
              <button 
                onClick={() => {
                  clearFilter("min");
                  clearFilter("max");
                }}
                className="ml-1 text-gray-500 hover:text-black"
              >
                ×
              </button>
            </div>
          )}
          {searchParams?.category && (
            <div className="text-sm bg-gray-100 py-1 px-3 rounded-full flex items-center gap-2">
              Category: {categories.find(cat => (cat._id || cat.id) === searchParams.category)?.name || 'Selected'}
              <button 
                onClick={() => clearFilter("category")}
                className="ml-1 text-gray-500 hover:text-black"
              >
                ×
              </button>
            </div>
          )}
          <button 
            onClick={clearAllFilters}
            className="text-sm underline text-gray-500 hover:text-black py-1"
          >
            Clear all
          </button>
        </div>
      )}
    </>
  );
};

export default ShopFilters;
