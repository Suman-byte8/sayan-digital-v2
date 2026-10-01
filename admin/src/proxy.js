import { NextResponse } from "next/server";
import { ADMIN_COOKIE, hasLiveSession } from "@/lib/session";

// Route protection: every admin page needs a live session, otherwise the
// visitor is sent to /login (and back to where they were headed afterwards).
// This only checks that a non-expired session cookie exists - it cannot
// verify the signature (the signing key lives only on the API server). That
// is deliberate and safe: every piece of DATA comes from the API, which
// verifies the token on each request, so a forged cookie shows an empty
// shell at most. (/proxy does its own check and answers with JSON, so it is
// excluded from the matcher below.)
export function proxy(request) {
  const { pathname, search } = request.nextUrl;
  const live = hasLiveSession(request.cookies.get(ADMIN_COOKIE)?.value);

  if (pathname === "/login") {
    // Already signed in -> no need to see the form, unless the API has just
    // told us the session is no longer valid (?reason=session).
    if (live && !request.nextUrl.searchParams.has("reason")) {
      return NextResponse.redirect(new URL("/products", request.url));
    }
    return NextResponse.next();
  }

  if (!live) {
    const loginUrl = new URL("/login", request.url);
    if (pathname !== "/") loginUrl.searchParams.set("next", `${pathname}${search}`);
    const response = NextResponse.redirect(loginUrl);
    if (request.cookies.has(ADMIN_COOKIE)) response.cookies.delete(ADMIN_COOKIE); // expired/garbage
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|proxy).*)"],
};
