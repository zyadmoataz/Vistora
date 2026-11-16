"use client";

import Button from "@/components/ui/Button";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";

const Pagination = ({
  currentPage,
  totalPages = 1,
  hasPrev,
  hasNext,
}: {
  currentPage: number;
  totalPages?: number;
  hasPrev: boolean;
  hasNext: boolean;
}) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { replace } = useRouter();
  const [isPending, startTransition] = useTransition();

  const createPageUrl = (pageNumber: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", pageNumber.toString());
    startTransition(() => {
      replace(`${pathname}?${params.toString()}`);
    });
  };

  return (
    <nav
      aria-label="Pagination"
      className="mt-14 pt-6 border-t border-slate-200/80 flex items-center justify-between w-full"
    >
      <Button variant="secondary" size="sm" isLoading={isPending} disabled={!hasPrev || isPending} onClick={() => createPageUrl(currentPage - 1)}>
        ← Previous
      </Button>

      <span className="text-xs font-medium text-slate-600">
        Page <strong className="text-navy-950">{currentPage + 1}</strong> of{" "}
        <strong className="text-navy-950">{Math.max(1, totalPages)}</strong>
      </span>

      <Button variant="secondary" size="sm" isLoading={isPending} disabled={!hasNext || isPending} onClick={() => createPageUrl(currentPage + 1)}>
        Next →
      </Button>
    </nav>
  );
};

export default Pagination;
