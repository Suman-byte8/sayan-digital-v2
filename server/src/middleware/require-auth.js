import { verifyAccessToken } from "../lib/auth.js";
import { ApiError } from "../utils/api-error.js";

// Reads the access token from the Authorization header (not a cookie —
// access tokens are short-lived and held in memory client-side, only the
// long-lived refresh token is a cookie). Attaches req.userId on success.
export function requireAuth(req, res, next) {
  const header = req.headers.authorization ?? "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;

  if (!token) {
    throw new ApiError(401, "Sign in required.");
  }

  const payload = verifyAccessToken(token);
  if (!payload) {
    throw new ApiError(401, "Your session has expired. Please sign in again.");
  }

  req.userId = payload.sub;
  next();
}
