import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Vistora Atelier | Modern Luxury E-Commerce",
    short_name: "Vistora",
    description:
      "Architectural silhouettes, fine Italian leathers, and precision timepieces engineered with Next.js 14.",
    start_url: "/",
    display: "standalone",
    background_color: "#FFFFFF",
    theme_color: "#0A1931",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
    ],
  };
}
