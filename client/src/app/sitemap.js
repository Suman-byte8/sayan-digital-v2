import { PRODUCT_CATALOG } from "@/constants/products-catalog";
import { STATIONERY_CATALOG } from "@/constants/stationery-catalog";
import { SITE_URL } from "@/lib/seo";

// Next.js App Router convention — this file is compiled into the real
// /sitemap.xml at build/request time (no separate static file needed).
// Only real, public, indexable routes: excludes /profile (private account
// area), /coming-soon (temporary gate page, noindex), and the not-found route.
export default function sitemap() {
  const staticRoutes = [
    { path: "/", changeFrequency: "weekly", priority: 1 },
    { path: "/about", changeFrequency: "monthly", priority: 0.7 },
    { path: "/products", changeFrequency: "weekly", priority: 0.9 },
    { path: "/services", changeFrequency: "monthly", priority: 0.8 },
    { path: "/stationery", changeFrequency: "weekly", priority: 0.9 },
    { path: "/contact", changeFrequency: "monthly", priority: 0.6 },
  ].map(({ path, changeFrequency, priority }) => ({
    url: new URL(path, SITE_URL).toString(),
    changeFrequency,
    priority,
  }));

  const productRoutes = [...PRODUCT_CATALOG, ...STATIONERY_CATALOG].map(
    (product) => ({
      url: new URL(`/products/${product.key}`, SITE_URL).toString(),
      changeFrequency: "monthly",
      priority: 0.6,
    }),
  );

  return [...staticRoutes, ...productRoutes];
}
