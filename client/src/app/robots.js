import { SITE_URL } from "@/lib/seo";

// Next.js App Router convention — compiled into the real /robots.txt.
export default function robots() {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/profile", "/cart", "/checkout", "/coming-soon"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
