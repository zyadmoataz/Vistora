import React from "react";

type BadgeVariant = "brand" | "brandSoft" | "navy" | "success" | "warning" | "neutral";

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

const badgeStyles: Record<BadgeVariant, string> = {
  brand: "bg-brand-600 text-white",
  brandSoft: "bg-brand-50 text-brand-700 ring-1 ring-brand-200",
  navy: "bg-navy-950 text-white",
  success: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/20",
  warning: "bg-amber-50 text-amber-800 ring-1 ring-amber-600/20",
  neutral: "bg-slate-100 text-slate-700",
};

export default function Badge({ children, variant = "neutral", className = "" }: BadgeProps) {
  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold tracking-wide ${badgeStyles[variant]} ${className}`}>
      {children}
    </span>
  );
}
