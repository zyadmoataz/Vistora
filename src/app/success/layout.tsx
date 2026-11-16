import type { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Order Confirmed",
  description: "Thank you for your Vistora Atelier order.",
  robots: { index: false, follow: false },
};

export default function SuccessLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
