import dotenv from "dotenv";
import { z } from "zod";

// Plain `dotenv/config` only ever reads `.env` — NODE_ENV-based file
// switching (.env.production, etc.) is a Next.js convention, not a dotenv
// one, so it has to be done explicitly here. NODE_ENV itself must already
// be set in the real process environment before this runs (by your shell,
// or automatically by whatever host you deploy to) — it can't come from
// inside the file being chosen, that's a chicken-and-egg problem.
// On a real host (Railway/Render/Fly/etc.) you set env vars in its own
// dashboard, not by deploying an env file — .env.production is purely a
// local convenience for running `NODE_ENV=production node src/index.js`
// against production-like config without touching real env vars. It's
// gitignored and dotenv silently no-ops if the file isn't present, so this
// is harmless in an environment where it doesn't exist.
dotenv.config({ path: process.env.NODE_ENV === "production" ? ".env.production" : ".env" });

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  PORT: z.coerce.number().int().positive().default(4000),
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
  CORS_ORIGIN: z.string().default("http://localhost:3000"),
  // Optional: image uploads (POST /api/uploads/image) need all four set.
  // Server still boots without them — only that one route 503s until
  // configured. OAuth2 (not a service account key) — see server/README.md.
  GOOGLE_OAUTH_CLIENT_ID: z.string().optional(),
  GOOGLE_OAUTH_CLIENT_SECRET: z.string().optional(),
  GOOGLE_OAUTH_REFRESH_TOKEN: z.string().optional(),
  GOOGLE_DRIVE_FOLDER_ID: z.string().optional(),

  // Required — signs customer-account access tokens. Generate with:
  // node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
  JWT_SECRET: z.string().min(32, "JWT_SECRET must be at least 32 characters"),
  // Access tokens are short-lived JWTs; refresh tokens are opaque random
  // strings stored hashed in the Session table (revocable — see
  // src/lib/auth.js) and issued as an httpOnly cookie, not a JWT.
  JWT_ACCESS_EXPIRES_IN: z.string().default("15m"),
  REFRESH_TOKEN_EXPIRES_DAYS: z.coerce.number().int().positive().default(30),

  // Optional — caches read-heavy catalog queries (see src/lib/cache.js).
  // Server runs fine without these, just hits Postgres on every request.
  UPSTASH_REDIS_REST_URL: z.string().optional(),
  UPSTASH_REDIS_REST_TOKEN: z.string().optional(),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("Invalid environment variables:");
  console.error(JSON.stringify(parsed.error.flatten().fieldErrors, null, 2));
  process.exit(1);
}

export const env = {
  ...parsed.data,
  CORS_ORIGINS: parsed.data.CORS_ORIGIN.split(",").map((origin) => origin.trim()),
};
