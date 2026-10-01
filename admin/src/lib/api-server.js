// API client for SERVER components and server actions. Reads the session
// cookie from the incoming request and calls the real API directly with the
// admin's token. (Client components use lib/api.js and the /proxy route.)
import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { API_URL } from "@/lib/api-url";
import { ADMIN_COOKIE } from "@/lib/session";
import { ApiRequestError, buildApi, parseResponse } from "@/lib/api-core";

async function request(path, options = {}) {
  const token = (await cookies()).get(ADMIN_COOKIE)?.value;

  let response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
      },
      cache: "no-store",
    });
  } catch {
    throw new ApiRequestError(
      `Could not reach the API at ${API_URL}. Is the backend server running?`,
      0,
    );
  }

  try {
    return await parseResponse(response);
  } catch (error) {
    // Session ended (expired, or the password was changed elsewhere): send
    // the visitor to sign in again. Pages let this redirect pass through.
    if (error instanceof ApiRequestError && error.status === 401) {
      redirect("/login?reason=session");
    }
    throw error;
  }
}

const unsupported = () => {
  throw new Error("File uploads run in the browser - use lib/api.js.");
};

export const api = buildApi({ request, uploadImage: unsupported, uploadInvoicePdf: unsupported });
