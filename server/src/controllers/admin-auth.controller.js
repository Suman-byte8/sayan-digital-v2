import { ApiError } from "../utils/api-error.js";
import { verifyPassword } from "../lib/auth.js";
import {
  checkLogin,
  getAdminAuth,
  setAdminCredentials,
  signAdminToken,
  ADMIN_COOKIE_MAX_AGE_SECONDS,
} from "../lib/admin-auth.js";
import { clearLoginFailures, recordLoginFailure } from "../middleware/login-rate-limit.js";

export async function login(req, res) {
  const { username, password } = req.validated.body;
  const result = await checkLogin(username, password);

  if (!result.ok) {
    if (result.reason === "not-configured") {
      throw new ApiError(
        503,
        "Admin account is not set up yet. Run `npm run admin:set-credentials` in server/.",
      );
    }
    recordLoginFailure(req.ip);
    // Same message for a wrong username and a wrong password.
    throw new ApiError(401, "Incorrect username or password.");
  }

  clearLoginFailures(req.ip);
  res.json({
    success: true,
    data: {
      token: signAdminToken(result.auth.tokenVersion),
      maxAge: ADMIN_COOKIE_MAX_AGE_SECONDS,
      username: result.auth.username,
    },
  });
}

export async function me(req, res) {
  res.json({ success: true, data: { username: req.admin.username } });
}

// Change the login username and/or password. Always requires the current
// password, even though the caller is already signed in.
export async function updateCredentials(req, res) {
  const { currentPassword, username, newPassword } = req.validated.body;
  const auth = await getAdminAuth();

  if (!auth || !(await verifyPassword(currentPassword, auth.passwordHash))) {
    throw new ApiError(400, "Current password is incorrect.", { currentPassword: ["Current password is incorrect."] });
  }

  const nextUsername = username?.trim() || auth.username;
  const nextPassword = newPassword || null;

  if (!nextPassword && nextUsername === auth.username) {
    throw new ApiError(400, "Nothing to change.");
  }

  // A new password revokes every other session (token version bump);
  // renaming alone does not.
  const updated = nextPassword
    ? await setAdminCredentials({ username: nextUsername, password: nextPassword, bumpVersion: true })
    : await setAdminCredentials({ username: nextUsername, password: currentPassword, bumpVersion: false });

  res.json({
    success: true,
    data: {
      // The caller's own session continues: hand back a fresh token.
      token: signAdminToken(updated.tokenVersion),
      maxAge: ADMIN_COOKIE_MAX_AGE_SECONDS,
      username: updated.username,
    },
  });
}
