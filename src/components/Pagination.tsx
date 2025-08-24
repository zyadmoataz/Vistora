"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const Pagination = ({
  currentPage,
  hasPrev,
  hasNext: initialHasNext,
}: {
  currentPage: number;
  hasPrev: boolean;
  hasNext: boolean;
}) => {
  // State to track if there are more products
  const [hasNext, setHasNext] = useState(initialHasNext);
  
  // we will change the url on pagination
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { replace } = useRouter();
  
  // Check if we should show the Next button by looking at pagination data
  useEffect(() => {
    // Get the pagination data element
    const paginationDataEl = document.getElementById('pagination-data');
    if (paginationDataEl) {
      const hasMore = paginationDataEl.getAttribute('data-has-more') === 'true';
      const totalItems = parseInt(paginationDataEl.getAttribute('data-total-items') || '0');
      
      // If there are no items or fewer items than the limit, don't show next button
      setHasNext(hasMore && totalItems > 0);
    }
  }, []);

  const createPageUrl = (pageNumber: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", pageNumber.toString());
    replace(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="mt-12 flex justify-between w-full">
      <button
        className="rounded-md bg-myred text-white p-2 text-sm w-24 cursor-pointer disabled:cursor-not-allowed disabled:bg-pink-200"
        disabled={!hasPrev}
        onClick={() => createPageUrl(currentPage - 1)}
      >
        Previous
      </button>
      <button
        className="rounded-md bg-myred text-white p-2 text-sm w-24 cursor-pointer disabled:cursor-not-allowed disabled:bg-pink-200"
        disabled={!hasNext}
        onClick={() => createPageUrl(currentPage + 1)}
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;