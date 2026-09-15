import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client.js";
import { env } from "../config/env.js";

// Prisma 7 requires an explicit driver adapter instead of a schema-level
// datasource url — see prisma.config.js for the CLI/migrate side of this.
const adapter = new PrismaPg({ connectionString: env.DATABASE_URL });

// Reuse a single PrismaClient across hot-reloads in dev (nodemon restarts
// the whole process anyway, but this also protects against accidental
// double-imports opening extra connection pools).
const globalForPrisma = globalThis;

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
    log: env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });

if (env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
