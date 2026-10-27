import { ApiError } from "../utils/api-error.js";

// Fixed-window request limiter for the customer auth endpoints (signup,
// login, refresh). Counts every request, not just failures, which is what
// makes bcrypt-heavy endpoints safe from CPU exhaustion as well as password
// guessing. In-memory like login-rate-limit.js: one API instance, and a
// restart merely resets the counters.
//
// Limits are deliberately generous per IP — many Indian mobile users share
// one carrier IP (CGNAT) — and tighter per IP+account where a key is given.
export function rateLimit({ windowMs, max, key = (req) => req.ip, message }) {
  const hits = new Map(); // key -> { count, resetAt }

  // Drop expired windows so the map can't grow without bound.
  const sweep = setInterval(() => {
    const now = Date.now();
    for (const [k, entry] of hits) if (now > entry.resetAt) hits.delete(k);
  }, windowMs);
  sweep.unref();

  return function rateLimitMiddleware(req, res, next) {
    const now = Date.now();
    const k = key(req);
    let entry = hits.get(k);
    if (!entry || now > entry.resetAt) {
      entry = { count: 0, resetAt: now + windowMs };
      hits.set(k, entry);
    }
    entry.count += 1;

    if (entry.count > max) {
      res.set("Retry-After", String(Math.max(Math.ceil((entry.resetAt - now) / 1000), 1)));
      return next(new ApiError(429, message ?? "Too many requests. Please try again in a few minutes."));
    }
    next();
  };
}

const FIFTEEN_MINUTES = 15 * 60 * 1000;

const emailKey = (req) => `${req.ip}|${String(req.body?.email ?? "").trim().toLowerCase()}`;

export const loginLimiters = [
  rateLimit({ windowMs: FIFTEEN_MINUTES, max: 60 }),
  rateLimit({
    windowMs: FIFTEEN_MINUTES,
    max: 10,
    key: emailKey,
    message: "Too many sign-in attempts for this account. Try again in a few minutes.",
  }),
];

export const signupLimiter = rateLimit({ windowMs: 60 * 60 * 1000, max: 20 });

// Refresh runs on every storefront page load, so this only stops abuse.
export const refreshLimiter = rateLimit({ windowMs: FIFTEEN_MINUTES, max: 300 });
