/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  distDir: "build",
  reactCompiler: true,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "images.pexels.com" },
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
      { protocol: "https", hostname: "res.cloudinary.com" },
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
