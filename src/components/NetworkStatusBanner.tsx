"use client";

import React, { useEffect, useState } from "react";
import { WifiOffIcon } from "./ui/Icons";

export default function NetworkStatusBanner() {
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    setIsOffline(!window.navigator.onLine);
    const goOffline = () => setIsOffline(true);
    const goOnline = () => setIsOffline(false);

    window.addEventListener("offline", goOffline);
    window.addEventListener("online", goOnline);
    return () => {
      window.removeEventListener("offline", goOffline);
      window.removeEventListener("online", goOnline);
    };
  }, []);

  if (!isOffline) return null;

  return (
    <div
      role="status"
      aria-live="assertive"
      className="bg-amber-600 text-white text-xs font-semibold py-2 px-4 flex items-center justify-center gap-2"
    >
      <WifiOffIcon className="w-3.5 h-3.5 shrink-0" />
      <span>Offline mode active — displaying cached curated catalog. Live checkout pauses until reconnected.</span>
    </div>
  );
}
