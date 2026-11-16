import type { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Shopping Bag & Checkout",
  description: "Review your Vistora Atelier shopping bag, apply promo code VISTORA20, and complete your order.",
  robots: { index: false, follow: false },
};

export default function CartLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
