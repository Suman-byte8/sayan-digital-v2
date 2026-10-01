import { cookies } from "next/headers";
import { API_URL } from "@/lib/api-url";
import { ADMIN_COOKIE } from "@/lib/session";

// Same-origin gateway for the admin UI's browser-side API calls. It adds the
// signed-in admin's token (from the httpOnly cookie, which page scripts can't
// read) and forwards the request to the real API. With no session cookie
// nothing is forwarded.
export const dynamic = "force-dynamic";

async function forward(request, { params }) {
  const { path } = await params;

  if (path.some((segment) => segment === ".." || segment === ".")) {
    return Response.json({ success: false, error: "Bad path." }, { status: 400 });
  }

  const token = (await cookies()).get(ADMIN_COOKIE)?.value;
  if (!token) {
    return Response.json({ success: false, error: "Admin sign-in required." }, { status: 401 });
  }

  const search = new URL(request.url).search;
  const target = `${API_URL}/${path.map(encodeURIComponent).join("/")}${search}`;
  const hasBody = request.method !== "GET" && request.method !== "HEAD";

  let upstream;
  try {
    upstream = await fetch(target, {
      method: request.method,
      headers: {
        Authorization: `Bearer ${token}`,
        ...(request.headers.get("content-type") ? { "Content-Type": request.headers.get("content-type") } : {}),
      },
      body: hasBody ? request.body : undefined,
      duplex: "half", // required to stream a request body
      redirect: "manual",
      cache: "no-store",
    });
  } catch {
    return Response.json({ success: false, error: "Could not reach the API." }, { status: 502 });
  }

  const headers = new Headers();
  const type = upstream.headers.get("content-type");
  if (type) headers.set("Content-Type", type);
  headers.set("Cache-Control", "no-store");

  // 204/205 must have no body.
  const noBody = upstream.status === 204 || upstream.status === 205;
  return new Response(noBody ? null : upstream.body, { status: upstream.status, headers });
}

export { forward as GET, forward as POST, forward as PUT, forward as PATCH, forward as DELETE };
