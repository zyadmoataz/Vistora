import React from "react";

interface BrandLogoProps {
  compact?: boolean;
  tone?: "dark" | "light";
  className?: string;
}

export default function BrandLogo({
  compact = false,
  tone = "dark",
  className = "",
}: BrandLogoProps) {
  const primaryFill = tone === "light" ? "#FFFFFF" : "#0A1931";
  const subTextClass = tone === "light" ? "text-slate-300" : "text-slate-600";
  const mainTextClass = tone === "light" ? "text-white" : "text-navy-950";

  return (
    <span className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      <svg
        width="36"
        height="36"
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        className="shrink-0"
      >
        <rect
          x="1.5"
          y="1.5"
          width="37"
          height="37"
          rx="11"
          fill={tone === "light" ? "#0F2952" : "#FFFFFF"}
          stroke={tone === "light" ? "#334155" : "#E2E8F0"}
          strokeWidth="1.5"
        />
        <path
          d="M11 11.5L19.4 29.5H15.2L7 11.5H11Z"
          fill={primaryFill}
        />
        <path
          d="M29 11.5L20.6 29.5H24.8L33 11.5H29Z"
          fill="#C81E51"
        />
        <path
          d="M20 9.5L22.2 12L20 14.5L17.8 12L20 9.5Z"
          fill="#C81E51"
        />
      </svg>

      {!compact && (
        <span className="flex flex-col leading-none">
          <span
            className={`text-lg font-extrabold tracking-[0.18em] uppercase ${mainTextClass}`}
          >
            Vistora
          </span>
          <span
            className={`text-[9px] font-bold tracking-[0.34em] uppercase mt-0.5 ${subTextClass}`}
          >
            Atelier
          </span>
        </span>
      )}
    </span>
  );
}
