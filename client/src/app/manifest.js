import { BRAND } from "@/constants/brand";

// Next.js App Router convention — compiles into /manifest.webmanifest and
// is auto-linked in <head>. Icons here are referenced by URL (public/icons)
// rather than the app/icon*.png files, since those are for the browser-tab
// favicon set, not installable-app icons.
export default function manifest() {
  return {
    name: `${BRAND.name} — ${BRAND.tagline}`,
    short_name: BRAND.name,
    description: `${BRAND.tagline} in ${BRAND.location}.`,
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#15398a",
    icons: [
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
