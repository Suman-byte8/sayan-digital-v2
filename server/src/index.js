import app from "./app.js";
import { env } from "./config/env.js";
import { prisma } from "./lib/prisma.js";
import { startDbKeepAlive, stopDbKeepAlive } from "./lib/db-keepalive.js";

const server = app.listen(env.PORT, () => {
  console.log(`Sayan Digital API listening on http://localhost:${env.PORT}`);
});

startDbKeepAlive();

// Graceful shutdown: stop the keep-alive timer, let in-flight requests
// finish, then release the DB pool.
function shutdown(signal) {
  console.log(`${signal} received, shutting down`);
  stopDbKeepAlive();
  server.close(async () => {
    await prisma.$disconnect().catch(() => {});
    process.exit(0);
  });
  // Safety net if a connection refuses to close.
  setTimeout(() => process.exit(1), 10_000).unref();
}

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));
