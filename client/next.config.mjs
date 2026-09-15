/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  distDir: "build",
  reactCompiler: true,
  images: {
    // next/image hard-rejects any src whose host isn't listed here. Product
    // photos uploaded through the admin panel go through Google Drive
    // (lh3.googleusercontent.com) and are always safe, but the admin form's
    // "paste an image URL directly" fallback accepts any host — if a future
    // product uses one not listed here, add it (this is why i.pinimg.com
    // is here: a real product was created with a pasted Pinterest URL).
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "images.pexels.com" },
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "i.pinimg.com" },
    ],
  },
  async headers() {
    return [
      {
        // Safe, generic security headers site-wide. A Content-Security-Policy
        // is intentionally NOT added here — this app pulls scripts/images from
        // Google Analytics, Unsplash/Pexels/Cloudinary/Google-hosted photos,
        // and any future embeds, so a CSP written without a full audit of
        // every external resource risks silently breaking them.
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
      {
        // Product/brand images under public/assets. Filenames aren't
        // content-hashed, so a long *immutable* cache would risk serving a
        // stale image if a file is ever swapped in place under the same
        // name — a week-long cache with revalidation is a safer middle
        // ground that still meaningfully cuts repeat-visit requests.
        source: "/assets/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=604800, stale-while-revalidate=86400",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
