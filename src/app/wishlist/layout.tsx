import type { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Saved Wishlist",
  description: "View and manage your bookmarked luxury pieces from the Vistora Atelier collection.",
  alternates: { canonical: "/wishlist" },
};

export default function WishlistLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
