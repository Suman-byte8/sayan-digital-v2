import { prisma } from "./prisma.js";

// Some hosted Postgres tiers suspend the database after ~15 minutes without
// activity. A trivial query every 14 minutes keeps it awake. Uses the app's
// existing Prisma client/pool - no extra connection is opened.
const PING_INTERVAL_MS = 14 * 60 * 1000;

let timer = null;

async function ping() {
  const startedAt = Date.now();
  try {
    await prisma.$queryRaw`SELECT 1`;
    console.log(`[db-keepalive] ping ok (${Date.now() - startedAt}ms)`);
  } catch (error) {
    // Never let a failed ping take the server down - the next tick retries.
    console.error(`[db-keepalive] ping failed: ${error.message}`);
  }
}

export function startDbKeepAlive() {
  if (timer) return;
  timer = setInterval(ping, PING_INTERVAL_MS);
  // Don't let this timer alone keep the process alive during shutdown.
  timer.unref();
}

export function stopDbKeepAlive() {
  if (!timer) return;
  clearInterval(timer);
  timer = null;
}
