import React from "react";
import Link from "next/link";
import Button from "./Button";
import { BagIcon } from "./Icons";

interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
}

export default function EmptyState({
  title,
  description,
  actionLabel,
  actionHref,
  onAction,
}: EmptyStateProps) {
  return (
    <div className="w-full py-16 px-6 rounded-3xl bg-slate-50 border border-dashed border-slate-200 flex flex-col items-center justify-center text-center max-w-xl mx-auto my-8">
      <div className="w-14 h-14 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center mb-4">
        <BagIcon className="w-7 h-7" />
      </div>
      <h2 className="text-xl font-bold text-navy-950">{title}</h2>
      <p className="text-sm text-slate-600 mt-2 max-w-md leading-relaxed">
        {description}
      </p>
      {actionLabel && actionHref && (
        <Link
          href={actionHref}
          className="mt-6 inline-flex items-center justify-center px-6 py-2.5 rounded-full bg-navy-950 text-white text-sm font-semibold hover:bg-brand-600 transition-colors"
        >
          {actionLabel}
        </Link>
      )}
      {actionLabel && onAction && !actionHref && (
        <Button variant="secondary" onClick={onAction} className="mt-6">
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
