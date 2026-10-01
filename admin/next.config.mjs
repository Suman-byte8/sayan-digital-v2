/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  reactCompiler: true,
  experimental: {
    // Keep already-visited dynamic pages in the client router cache for 30s
    // so back/forward and quick revisits are instant. Every admin write calls
    // the refreshAdminData server action, which clears this cache.
    staleTimes: { dynamic: 30 },
  },
  // Build output in <root>/dist instead of the Next.js default <root>/.next
  // — but NOT on Netlify: its Next.js Runtime plugin specifically looks for
  // .next to wire up routing/functions, and silently produces a blank
  // "Page not found" for every route if that folder isn't there. Netlify
  // sets process.env.NETLIFY during its own builds, so this only affects
  // local dev/builds.
  ...(process.env.NETLIFY ? {} : { distDir: "dist" }),
};

export default nextConfig;
