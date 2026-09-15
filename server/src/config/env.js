import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  PORT: z.coerce.number().int().positive().default(4000),
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
  CORS_ORIGIN: z.string().default("http://localhost:3000"),
  // Optional: image uploads (POST /api/uploads/image) need both set. Server
  // still boots without them — only that one route 503s until configured.
  // See server/README.md for how to create these.
  GOOGLE_SERVICE_ACCOUNT_KEY: z.string().optional(),
  GOOGLE_DRIVE_FOLDER_ID: z.string().optional(),
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
