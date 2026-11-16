import type { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "My Account & Order History",
  description: "Manage your Vistora Atelier account preferences, saved wishlist, and private order history.",
  robots: { index: false, follow: false },
};

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
