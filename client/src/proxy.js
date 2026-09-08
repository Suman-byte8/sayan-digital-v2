import { NextResponse } from "next/server";

// Gates the whole site behind /coming-soon until a visitor explicitly clicks
// through ("visit anyway"), which sets this cookie client-side.
const ACCESS_COOKIE = "sd_preview_access";

export function proxy(request) {
  const hasAccess = request.cookies.get(ACCESS_COOKIE)?.value === "true";
  if (hasAccess) {
    return NextResponse.next();
  }

  const url = request.nextUrl.clone();
  url.pathname = "/coming-soon";
  return NextResponse.redirect(url);
}

export const config = {
  // Runs on every route except Next.js internals, the favicon, public
  // assets, and the coming-soon page itself (avoids a redirect loop).
  matcher: ["/((?!_next/static|_next/image|favicon.ico|assets|coming-soon).*)"],
};
