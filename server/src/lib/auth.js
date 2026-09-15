import crypto from "node:crypto";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

const BCRYPT_ROUNDS = 12;

export function hashPassword(password) {
  return bcrypt.hash(password, BCRYPT_ROUNDS);
}

export function verifyPassword(password, passwordHash) {
  return bcrypt.compare(password, passwordHash);
}

export function signAccessToken(userId) {
  return jwt.sign({ sub: userId }, env.JWT_SECRET, { expiresIn: env.JWT_ACCESS_EXPIRES_IN });
}

/** Returns the decoded payload, or null if the token is missing/invalid/expired. */
export function verifyAccessToken(token) {
  try {
    return jwt.verify(token, env.JWT_SECRET);
  } catch {
    return null;
  }
}

// Refresh tokens are opaque random strings (NOT JWTs) — the whole point is
// that they're looked up against the Session table, so a token can be
// revoked (logout, or an admin flushing sessions) before its natural
// expiry, unlike a stateless JWT which stays valid until it expires no
// matter what. Only the SHA-256 hash is ever persisted; the raw value
// exists just long enough to hand to the client as an httpOnly cookie.
export function generateRefreshToken() {
  const raw = crypto.randomBytes(48).toString("hex");
  const hash = hashRefreshToken(raw);
  const expiresAt = new Date(Date.now() + env.REFRESH_TOKEN_EXPIRES_DAYS * 24 * 60 * 60 * 1000);
  return { raw, hash, expiresAt };
}

export function hashRefreshToken(raw) {
  return crypto.createHash("sha256").update(raw).digest("hex");
}

const REFRESH_COOKIE_NAME = "sd_refresh_token";

export function setRefreshTokenCookie(res, rawToken, expiresAt) {
  res.cookie(REFRESH_COOKIE_NAME, rawToken, {
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    // "lax" covers this app's actual deployment shape (client and API as
    // same-site, different-port localhost in dev; same-site subdomains in
    // any realistic production setup) without the extra exposure of "none".
    sameSite: "lax",
    expires: expiresAt,
    path: "/api/auth",
  });
}

export function clearRefreshTokenCookie(res) {
  res.clearCookie(REFRESH_COOKIE_NAME, { path: "/api/auth" });
}

export function getRefreshTokenFromRequest(req) {
  return req.cookies?.[REFRESH_COOKIE_NAME] ?? null;
}
