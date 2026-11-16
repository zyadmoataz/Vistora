import { ENV } from "@/lib/env";
import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/profile", "/cart", "/success"],
    },
    sitemap: `${ENV.SITE_URL}/sitemap.xml`,
  };
}
