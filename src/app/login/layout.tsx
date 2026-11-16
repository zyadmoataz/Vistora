import type { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Sign In or Create Account",
  description: "Access your Vistora Atelier member portal, order history, and express checkout.",
  alternates: { canonical: "/login" },
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
