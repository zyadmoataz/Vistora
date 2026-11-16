"use client";

import React from "react";
import { useToastStore } from "@/hooks/useToastStore";

export default function ToastContainer() {
  const { toasts, removeToast } = useToastStore();

  if (toasts.length === 0) return null;

  return (
    <div
      aria-live="polite"
      aria-atomic="true"
      className="fixed bottom-5 right-5 z-50 flex flex-col gap-3 max-w-sm w-full pointer-events-none px-4 sm:px-0"
    >
      {toasts.map((t) => {
        const accent =
          t.variant === "error"
            ? "border-l-4 border-l-red-500"
            : t.variant === "info"
            ? "border-l-4 border-l-slate-900"
            : "border-l-4 border-l-emerald-500";

        return (
          <div
            key={t.id}
            role="status"
            className={`pointer-events-auto bg-white/95 backdrop-blur-md border border-slate-200/80 ${accent} rounded-xl p-4 shadow-elevated flex items-start justify-between gap-3 animate-slide-in-right`}
          >
            <div className="flex flex-col gap-0.5">
              <span className="text-sm font-semibold text-navy-950">
                {t.title}
              </span>
              {t.description && (
                <span className="text-xs text-slate-600">{t.description}</span>
              )}
            </div>
            <button
              type="button"
              onClick={() => removeToast(t.id)}
              aria-label="Dismiss notification"
              className="text-slate-600 hover:text-navy-950 text-xs p-1"
            >
              ✕
            </button>
          </div>
        );
      })}
    </div>
  );
}
