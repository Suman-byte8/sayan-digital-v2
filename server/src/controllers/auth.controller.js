import { prisma } from "../lib/prisma.js";
import { ApiError } from "../utils/api-error.js";
import {
  hashPassword,
  verifyPassword,
  signAccessToken,
  generateRefreshToken,
  hashRefreshToken,
  setRefreshTokenCookie,
  clearRefreshTokenCookie,
  getRefreshTokenFromRequest,
} from "../lib/auth.js";

// Never send passwordHash back to a client, under any circumstance.
function serializeUser(user) {
  const { passwordHash: _passwordHash, ...safe } = user;
  return safe;
}

async function issueSession(res, userId, userAgent) {
  const accessToken = signAccessToken(userId);
  const { raw, hash, expiresAt } = generateRefreshToken();

  await prisma.session.create({
    data: { userId, refreshTokenHash: hash, expiresAt, userAgent: userAgent?.slice(0, 255) },
  });

  setRefreshTokenCookie(res, raw, expiresAt);
  return accessToken;
}

export async function signup(req, res) {
  const { name, email, password, phone } = req.validated.body;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    throw new ApiError(409, "An account with this email already exists.");
  }

  const passwordHash = await hashPassword(password);
  const user = await prisma.user.create({
    data: { name, email, passwordHash, phone },
  });

  const accessToken = await issueSession(res, user.id, req.headers["user-agent"]);
  res.status(201).json({ success: true, data: { user: serializeUser(user), accessToken } });
}

export async function login(req, res) {
  const { email, password } = req.validated.body;

  const user = await prisma.user.findUnique({ where: { email } });
  // Same error for "no such user" and "wrong password" - don't reveal
  // which one it was, that leaks whether an email is registered.
  if (!user || !(await verifyPassword(password, user.passwordHash))) {
    throw new ApiError(401, "Incorrect email or password.");
  }

  const accessToken = await issueSession(res, user.id, req.headers["user-agent"]);
  res.json({ success: true, data: { user: serializeUser(user), accessToken } });
}

export async function refresh(req, res) {
  const rawToken = getRefreshTokenFromRequest(req);
  if (!rawToken) {
    throw new ApiError(401, "Not signed in.");
  }

  const tokenHash = hashRefreshToken(rawToken);
  const session = await prisma.session.findUnique({ where: { refreshTokenHash: tokenHash } });

  if (!session || session.expiresAt < new Date()) {
    clearRefreshTokenCookie(res);
    throw new ApiError(401, "Your session has expired. Please sign in again.");
  }

  // Rotate on every refresh: the old refresh token stops working the
  // moment it's used, so a leaked-but-unused token has a shrinking window
  // of usefulness and reuse is detectable (a second use of the same old
  // token means it was stolen).
  await prisma.session.delete({ where: { id: session.id } });
  const accessToken = await issueSession(res, session.userId, req.headers["user-agent"]);

  res.json({ success: true, data: { accessToken } });
}

export async function logout(req, res) {
  const rawToken = getRefreshTokenFromRequest(req);
  if (rawToken) {
    await prisma.session.deleteMany({ where: { refreshTokenHash: hashRefreshToken(rawToken) } });
  }
  clearRefreshTokenCookie(res);
  res.status(204).send();
}

export async function me(req, res) {
  const user = await prisma.user.findUnique({ where: { id: req.userId } });
  if (!user) {
    throw new ApiError(401, "Account no longer exists.");
  }
  res.json({ success: true, data: serializeUser(user) });
}
