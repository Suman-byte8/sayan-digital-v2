import { verifyAdminToken } from "../lib/admin-auth.js";
import { ApiError } from "../utils/api-error.js";

// Guards admin-only routes. The admin panel's server attaches the signed-in
// admin's token as `Authorization: Bearer <token>`.
export async function requireAdmin(req, res, next) {
  const header = req.headers.authorization ?? "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  const admin = token ? await verifyAdminToken(token) : null;

  if (!admin) {
    return next(new ApiError(401, "Admin sign-in required."));
  }
  req.admin = admin;
  next();
}
