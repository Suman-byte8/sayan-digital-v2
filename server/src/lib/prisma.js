import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client.js";
import { env } from "../config/env.js";

// Prisma 7 requires an explicit driver adapter instead of a schema-level
// datasource url — see prisma.config.js for the CLI/migrate side of this.
//
// Pool tuning below exists because of a real prod issue: Render (host) <->
// Postgres (a separate host, e.g. Supabase) over the public internet can
// have an idle connection silently dropped by either side or by something
// in between, and plain `pg` defaults (no keepalive, no idle recycling)
// leave a dead socket sitting in the pool until some unlucky request tries
// to reuse it and gets "Connection terminated unexpectedly". `keepAlive`
// stops the OS from letting a quiet TCP connection go stale in the first
// place; `idleTimeoutMillis` proactively closes+replaces idle clients
// before they get old enough to be at risk either way.
const adapter = new PrismaPg({
  connectionString: env.DATABASE_URL,
  keepAlive: true,
  max: 10,
  idleTimeoutMillis: 30_000,
  connectionTimeoutMillis: 10_000,
});

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
