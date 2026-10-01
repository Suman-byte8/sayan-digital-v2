// Session cookie shared by the login actions, the /proxy route, the server
// API client and the route-protection proxy.
export const ADMIN_COOKIE = "sd_admin_session";

export function sessionCookieOptions(maxAgeSeconds) {
  return {
    httpOnly: true, // not readable from page JavaScript
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax", // not sent on cross-site POSTs -> CSRF protection
    path: "/",
    maxAge: maxAgeSeconds,
  };
}

// Reads the expiry out of a JWT WITHOUT verifying it. Only used for UX
// (send an expired session to the login page); the API verifies the token's
// signature on every real request.
export function jwtExpiry(token) {
  try {
    const payload = JSON.parse(atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")));
    return typeof payload.exp === "number" ? payload.exp * 1000 : 0;
  } catch {
    return 0;
  }
}

export function hasLiveSession(token) {
  return Boolean(token) && jwtExpiry(token) > Date.now();
}
