import { Redis } from "@upstash/redis";
import { env } from "../config/env.js";

let client = null;
let warned = false;

// Optional, like Drive uploads — the server runs fine without Redis
// configured, every cache read/write below just becomes a no-op and every
// request falls straight through to Postgres.
export function getRedis() {
  if (!env.UPSTASH_REDIS_REST_URL || !env.UPSTASH_REDIS_REST_TOKEN) {
    if (!warned) {
      console.warn("Redis not configured (UPSTASH_REDIS_REST_URL/TOKEN) — running without a cache.");
      warned = true;
    }
    return null;
  }

  if (!client) {
    client = new Redis({
      url: env.UPSTASH_REDIS_REST_URL,
      token: env.UPSTASH_REDIS_REST_TOKEN,
    });
  }
  return client;
}
