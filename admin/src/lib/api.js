// API client for CLIENT components. Every call goes to the same-origin
// /proxy route (app/proxy/[...path]/route.js), which reads the httpOnly
// session cookie and forwards the request to the real API with the admin's
// token - so the token is never exposed to page JavaScript, and no CORS
// setup is needed. Server components use lib/api-server.js instead.
import { ApiRequestError, buildApi, parseResponse } from "@/lib/api-core";

export { ApiRequestError };

const BASE = "/proxy";

// A 401 means the session ended (expired, or the password was changed
// elsewhere): go to the login page instead of leaving a broken screen.
function handleUnauthorized(error) {
  if (error instanceof ApiRequestError && error.status === 401 && typeof window !== "undefined") {
    // Deliberate full reload: drops every cached page and in-memory state.
    // eslint-disable-next-line @next/next/no-location-assign-relative-destination
    window.location.href = "/login?reason=session";
  }
  throw error;
}

async function send(path, init, fallbackMessage) {
  let response;
  try {
    response = await fetch(`${BASE}${path}`, { ...init, cache: "no-store" });
  } catch {
    throw new ApiRequestError("Could not reach the server. Check your connection and try again.", 0);
  }
  try {
    return await parseResponse(response, fallbackMessage);
  } catch (error) {
    return handleUnauthorized(error);
  }
}

function request(path, options = {}) {
  return send(path, { ...options, headers: { "Content-Type": "application/json", ...options.headers } });
}

// Multipart bodies must NOT get a JSON content-type (it would break the
// multipart boundary), so they skip request().
function uploadImage(file) {
  const formData = new FormData();
  formData.append("file", file);
  return send("/uploads/image", { method: "POST", body: formData }, "Upload failed");
}

function uploadInvoicePdf(id, blob, filename) {
  const formData = new FormData();
  formData.append("file", blob, filename);
  formData.append("filename", filename);
  return send(`/admin/invoices/${id}/pdf`, { method: "POST", body: formData }, "Upload failed");
}

export const api = buildApi({ request, uploadImage, uploadInvoicePdf });
