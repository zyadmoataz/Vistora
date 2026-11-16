"use client";

import React from "react";
import { useToastStore } from "@/hooks/useToastStore";
import { ShareIcon } from "./ui/Icons";

export default function ShareProductButton({ title }: { title: string }) {
  const { addToast } = useToastStore();

  const handleShare = async () => {
    if (typeof window === "undefined") return;
    const shareUrl = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title, url: shareUrl });
        return;
      } catch {
        // Fallback to copy
      }
    }
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(shareUrl);
      addToast("Link copied", "info", "Ready to share with others.");
    }
  };

  return (
    <button
      type="button"
      onClick={handleShare}
      aria-label={`Share ${title}`}
      className="inline-flex items-center gap-1.5 text-xs font-semibold text-navy-900 hover:text-brand-600 px-3 py-1.5 rounded-full bg-slate-100 hover:bg-brand-50 transition-colors"
    >
      <ShareIcon className="w-3.5 h-3.5" />
      <span>Share</span>
    </button>
  );
}
