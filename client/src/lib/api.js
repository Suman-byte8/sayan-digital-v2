// Single source of truth for every call this app makes to the Sayan
// Digital backend API. No component/page should call fetch() against the
// API directly — go through the functions exported here, so there is one
// place that knows the base URL, error shape, and caching strategy.
const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api";

// How long a Server Component's fetch of this data stays in Next's Data
// Cache before being treated as stale and re-fetched (seconds). This is
// what keeps repeat page loads from hitting the database on every
// request — the actual "reduce stress on the server/DB" cache layer.
const REVALIDATE_SECONDS = 60;

export class ApiRequestError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

async function request(path, { params, ...options } = {}) {
  const query = params
    ? new URLSearchParams(
        Object.fromEntries(Object.entries(params).filter(([, v]) => v != null && v !== "")),
      ).toString()
    : "";

  let response;
  try {
    response = await fetch(`${API_URL}${path}${query ? `?${query}` : ""}`, {
      next: { revalidate: REVALIDATE_SECONDS },
      ...options,
    });
  } catch {
    throw new ApiRequestError(`Could not reach the API at ${API_URL}.`, 0);
  }

  const isJson = response.headers.get("content-type")?.includes("application/json");
  const body = isJson ? await response.json().catch(() => null) : null;

  if (!response.ok) {
    throw new ApiRequestError(
      body?.error ?? `Request failed with status ${response.status}`,
      response.status,
    );
  }

  return body;
}

export const api = {
  /** @param {{ type?: "PRINTING"|"STATIONERY", category?: string, search?: string, limit?: number }} [params] */
  listProducts: (params = {}) =>
    request("/products", { params: { limit: 100, isActive: true, ...params } }),
  getProductBySlug: (slug) => request(`/products/slug/${slug}`),
};
