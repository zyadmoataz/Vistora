import { ENV } from "@/lib/env";
import { ALL_FALLBACK_PRODUCTS } from "@/services/catalogService";
import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = ["", "/list", "/deals", "/about", "/faq", "/contact", "/wishlist"];
  const productRoutes = ALL_FALLBACK_PRODUCTS.filter((p) => Boolean(p.slug)).map((p) => `/${p.slug}`);

  return [...staticRoutes, ...productRoutes].map((route) => ({
    url: `${ENV.SITE_URL}${route}`,
    lastModified: new Date(),
    changeFrequency: route.startsWith("/") && route.length > 1 ? "weekly" : "daily",
    priority: route === "" ? 1 : 0.8,
  }));
}
