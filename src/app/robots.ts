import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/profile", "/cart", "/success"],
    },
    sitemap: "https://vistora.shop/sitemap.xml",
  };
}
