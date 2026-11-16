"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { reportClientError } from "@/lib/logger";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    reportClientError("GlobalErrorBoundary", error);
  }, [error]);

  return (
    <main className="container-shell py-24 flex flex-col items-center justify-center text-center gap-6">
      <Badge variant="warning" className="uppercase tracking-widest">
        Temporary Interruption
      </Badge>
      <h1 className="text-3xl sm:text-4xl font-bold text-navy-950">
        Something Unexpected Happened
      </h1>
      <p className="text-sm text-slate-600 max-w-md">
        Our error boundary prevented the page from crashing. You can retry loading this view or return to the main collection.
      </p>
      <div className="flex items-center gap-4">
        <Button onClick={() => reset()}>Try Again</Button>
        <Link href="/" className="px-6 py-3 rounded-full ring-1 ring-slate-300 text-navy-950 text-sm font-semibold hover:bg-slate-50 transition-colors">
          Back to Home
        </Link>
      </div>
    </main>
  );
}
