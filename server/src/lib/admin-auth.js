import crypto from "node:crypto";
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { prisma } from "./prisma.js";
import { hashPassword, verifyPassword } from "./auth.js";

// The admin panel has exactly one account (no sign-up). Its username and
// bcrypt password hash live in admin_settings under AUTH_KEY; the plain
// password is never stored. `tokenVersion` is bumped whenever the password
// changes, which instantly invalidates every other signed-in session.
const AUTH_KEY = "admin_auth";
const TOKEN_TTL = "7d";
export const ADMIN_COOKIE_MAX_AGE_SECONDS = 7 * 24 * 60 * 60;

// Admin tokens are signed with a key derived from JWT_SECRET, so a customer
// access token (signed with JWT_SECRET itself) can never pass as an admin
// token, and the other way round.
const ADMIN_SECRET = crypto.createHmac("sha256", env.JWT_SECRET).update("sayan-admin-panel").digest("hex");

// Real hash of a random value, compared against when the username is wrong,
// so a wrong username and a wrong password take the same time to reject.
const dummyHash = hashPassword(crypto.randomBytes(16).toString("hex"));

let memo = { value: null, expires: 0 };

export async function getAdminAuth() {
  if (memo.value && Date.now() < memo.expires) return memo.value;
  const row = await prisma.adminSetting.findUnique({ where: { key: AUTH_KEY } });
  memo = { value: row?.value ?? null, expires: Date.now() + 10_000 };
  return memo.value;
}

export async function saveAdminAuth(value) {
  await prisma.adminSetting.upsert({
    where: { key: AUTH_KEY },
    create: { key: AUTH_KEY, value },
    update: { value },
  });
  memo = { value, expires: Date.now() + 10_000 };
}

export async function setAdminCredentials({ username, password, bumpVersion = true }) {
  const current = await getAdminAuth();
  const next = {
    username,
    passwordHash: await hashPassword(password),
    tokenVersion: (current?.tokenVersion ?? 0) + (bumpVersion ? 1 : 0),
  };
  await saveAdminAuth(next);
  return next;
}

export async function checkLogin(username, password) {
  const auth = await getAdminAuth();
  if (!auth) return { ok: false, reason: "not-configured" };
  const userMatches = username.trim().toLowerCase() === auth.username.toLowerCase();
  const passwordMatches = await verifyPassword(password, userMatches ? auth.passwordHash : await dummyHash);
  return userMatches && passwordMatches ? { ok: true, auth } : { ok: false, reason: "invalid" };
}

export function signAdminToken(tokenVersion) {
  return jwt.sign({ sub: "admin", typ: "admin", ver: tokenVersion }, ADMIN_SECRET, { expiresIn: TOKEN_TTL });
}

export async function verifyAdminToken(token) {
  try {
    const payload = jwt.verify(token, ADMIN_SECRET);
    if (payload.typ !== "admin") return null;
    const auth = await getAdminAuth();
    // Password changed since this token was issued -> session is revoked.
    if (!auth || payload.ver !== auth.tokenVersion) return null;
    return { username: auth.username };
  } catch {
    return null;
  }
}
