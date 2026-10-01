import { ApiError } from "../utils/api-error.js";

// Brute-force protection for the single admin login: at most MAX_FAILURES
// wrong attempts per IP in WINDOW_MS (then that IP is locked out until the
// window passes), plus a looser global cap so rotating IPs can't be used to
// grind through passwords. In-memory is fine here - one API instance, and
// a restart merely resets the counters.
const WINDOW_MS = 15 * 60 * 1000;
const MAX_FAILURES_PER_IP = 6;
const MAX_FAILURES_GLOBAL = 60;

const byIp = new Map(); // ip -> { count, resetAt }
let global = { count: 0, resetAt: 0 };

function bucket(ip) {
  const now = Date.now();
  const existing = byIp.get(ip);
  if (!existing || now > existing.resetAt) {
    const fresh = { count: 0, resetAt: now + WINDOW_MS };
    byIp.set(ip, fresh);
    return fresh;
  }
  return existing;
}

function currentGlobal() {
  if (Date.now() > global.resetAt) global = { count: 0, resetAt: Date.now() + WINDOW_MS };
  return global;
}

export function loginRateLimit(req, res, next) {
  const entry = bucket(req.ip);
  const overall = currentGlobal();
  if (entry.count >= MAX_FAILURES_PER_IP || overall.count >= MAX_FAILURES_GLOBAL) {
    const retryAfter = Math.ceil((entry.resetAt - Date.now()) / 1000);
    res.set("Retry-After", String(Math.max(retryAfter, 1)));
    return next(new ApiError(429, "Too many failed sign-in attempts. Try again in a few minutes."));
  }
  next();
}

export function recordLoginFailure(ip) {
  bucket(ip).count += 1;
  currentGlobal().count += 1;
}

export function clearLoginFailures(ip) {
  byIp.delete(ip);
}
