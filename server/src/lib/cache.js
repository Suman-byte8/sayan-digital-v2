import { getRedis } from "./redis.js";

// Wraps a DB-hitting function with a Redis-backed cache. On any Redis
// failure (unreachable, free-tier quota exceeded, not configured) this
// silently falls through to calling fn() directly — a caching layer going
// down should degrade to "same as before we had a cache", never break the
// API. Free-tier Upstash is a monthly *command* budget (one GET/SET/DEL
// each counts), so this does exactly one read and, on a miss, one write —
// no extra round-trips (no separate "check a version key" step; see the
// per-resource cache-key comments for why each TTL was chosen instead).
export async function cached(key, ttlSeconds, fn) {
  const redis = getRedis();
  if (!redis) return fn();

  try {
    const hit = await redis.get(key);
    if (hit !== null && hit !== undefined) return hit;
  } catch (error) {
    console.error(`Redis GET failed for "${key}":`, error.message);
  }

  const value = await fn();

  // A cache hit is checked with `!== null`, so writing a null result (e.g.
  // a 404 lookup) here would never register as a hit anyway — it'd just
  // burn a SET command every time the same miss happens. Skip it.
  if (value !== null && value !== undefined) {
    try {
      await redis.set(key, value, { ex: ttlSeconds });
    } catch (error) {
      console.error(`Redis SET failed for "${key}":`, error.message);
    }
  }

  return value;
}

// Fire-and-forget invalidation after a write — awaited so callers can rely
// on it having happened before responding, but a failure here only means
// that key's TTL takes over instead of it being invalidated on the spot.
export async function invalidate(...keys) {
  const redis = getRedis();
  if (!redis || keys.length === 0) return;

  try {
    await redis.del(...keys);
  } catch (error) {
    console.error(`Redis DEL failed for [${keys.join(", ")}]:`, error.message);
  }
}

// Versioned cache for list endpoints that have many query-string
// permutations (page/limit/type/category/...). Every list key embeds a
// per-namespace version number; bumping the version on any write makes all
// of that namespace's old list keys unreachable at once (they just expire
// by TTL), so lists can use a long TTL AND still show an admin's edit
// immediately. Costs one extra Redis GET per read and one INCR per write.
async function getVersion(redis, namespace) {
  try {
    return (await redis.get(`ver:${namespace}`)) ?? 0;
  } catch (error) {
    console.error(`Redis GET failed for version "${namespace}":`, error.message);
    return 0;
  }
}

export async function cachedVersioned(namespace, keyPart, ttlSeconds, fn) {
  const redis = getRedis();
  if (!redis) return fn();
  const version = await getVersion(redis, namespace);
  return cached(`${namespace}:v${version}:${keyPart}`, ttlSeconds, fn);
}

export async function bumpVersion(namespace) {
  const redis = getRedis();
  if (!redis) return;
  try {
    await redis.incr(`ver:${namespace}`);
  } catch (error) {
    console.error(`Redis INCR failed for version "${namespace}":`, error.message);
  }
}
