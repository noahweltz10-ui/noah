import type { MetadataRoute } from "next";
import { FALLBACK_PRODUCTS } from "@/lib/shopify-fallback";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://shiftcultr.com";
  return [
    { url: `${base}/`, lastModified: new Date(), priority: 1 },
    ...FALLBACK_PRODUCTS.map((p) => ({
      url: `${base}/products/${p.handle}`,
      lastModified: new Date(),
      priority: 0.8,
    })),
    { url: `${base}/legal`, lastModified: new Date(), priority: 0.2 },
  ];
}
