import type { Metadata, Viewport } from "next";
import React from "react";
import "./globals.css";
import NavBar from "@/components/NavBar";
import NetworkStatusBanner from "@/components/NetworkStatusBanner";
import Footer from "@/components/Footer";
import ToastContainer from "@/components/ui/ToastContainer";
import { WixClientContextProvider } from "@/context/wixContext";
import { ENV } from "@/lib/env";
import { serializeJsonLd } from "@/lib/securityHelpers";

export const viewport: Viewport = {
  themeColor: "#0A1931",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(ENV.SITE_URL),
  title: {
    default: "Vistora Atelier | Modern Luxury E-Commerce",
    template: "%s | Vistora Atelier",
  },
  description:
    "Discover architectural silhouettes, Italian leather weekender bags, and precision timepieces built with Next.js 14, Wix Headless SDK, TypeScript, and Zustand.",
  keywords: ["Vistora Atelier", "luxury e-commerce", "Next.js 14", "TypeScript", "Wix Headless", "outerwear", "leather goods"],
  authors: [{ name: "Zyaad Moataz" }],
  icons: { icon: "/icon.svg", shortcut: "/favicon.ico", apple: "/icon.svg" },
  openGraph: {
    type: "website",
    siteName: "Vistora Atelier",
    title: "Vistora Atelier | Modern Luxury E-Commerce",
    description: "Architectural silhouettes, Italian leather goods, and enduring essentials.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Vistora Atelier | Modern Luxury E-Commerce",
    description: "Architectural silhouettes, Italian leather goods, and enduring essentials.",
  },
};

const ORG_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Vistora Atelier",
  url: ENV.SITE_URL,
  founder: "Zyaad Moataz",
  address: { "@type": "PostalAddress", addressLocality: "Cairo", addressCountry: "EG" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: serializeJsonLd(ORG_SCHEMA) }}
        />
      </head>
      <body id="top" className="font-sans antialiased min-h-screen flex flex-col">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:px-4 focus:py-2 focus:rounded-full focus:bg-navy-950 focus:text-white focus:text-xs focus:font-semibold"
        >
          Skip to main content
        </a>
        <WixClientContextProvider>
          <NavBar />
          <NetworkStatusBanner />
          <div id="main-content" tabIndex={-1} className="flex-1 outline-none">
            {children}
          </div>
          <Footer />
          <ToastContainer />
        </WixClientContextProvider>
      </body>
    </html>
  );
}
