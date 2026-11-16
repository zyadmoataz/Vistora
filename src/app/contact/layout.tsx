import type { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Contact Client Concierge",
  description: "Get in touch with the Vistora Atelier concierge team for tailored garment sizing, shipping updates, or private showroom appointments.",
  alternates: { canonical: "/contact" },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
