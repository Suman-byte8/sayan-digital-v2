// Centralized client for every account-related call (auth + profile +
// addresses + wishlist + orders + payment methods + proofs) — separate
// from lib/api.js, which is the public, cacheable product-catalog reads.
// Account data is always fetched fresh (`cache: "no-store"`) and needs
// credentials (the httpOnly refresh-token cookie) and, for protected
// routes, a Bearer access token — neither of which the catalog client
// needs, hence the split.
const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api";

export class ApiRequestError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

async function request(path, { token, ...options } = {}) {
  let response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      ...options,
      credentials: "include",
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
      },
    });
  } catch {
    throw new ApiRequestError(`Could not reach the API at ${API_URL}.`, 0);
  }

  if (response.status === 204) return null;

  const isJson = response.headers.get("content-type")?.includes("application/json");
  const body = isJson ? await response.json().catch(() => null) : null;

  if (!response.ok) {
    throw new ApiRequestError(body?.error ?? `Request failed with status ${response.status}`, response.status);
  }

  return body;
}

export const authApi = {
  signup: (data) => request("/auth/signup", { method: "POST", body: JSON.stringify(data) }),
  login: (data) => request("/auth/login", { method: "POST", body: JSON.stringify(data) }),
  logout: () => request("/auth/logout", { method: "POST" }),
  refresh: () => request("/auth/refresh", { method: "POST" }),
  me: (token) => request("/auth/me", { token }),
};

export const profileApi = {
  get: (token) => request("/profile", { token }),
  update: (token, data) => request("/profile", { method: "PATCH", body: JSON.stringify(data), token }),
  changePassword: (token, data) =>
    request("/profile/password", { method: "PATCH", body: JSON.stringify(data), token }),

  listAddresses: (token) => request("/addresses", { token }),
  createAddress: (token, data) =>
    request("/addresses", { method: "POST", body: JSON.stringify(data), token }),
  updateAddress: (token, id, data) =>
    request(`/addresses/${id}`, { method: "PATCH", body: JSON.stringify(data), token }),
  deleteAddress: (token, id) => request(`/addresses/${id}`, { method: "DELETE", token }),

  listWishlist: (token) => request("/wishlist", { token }),
  addWishlistItem: (token, productId) =>
    request("/wishlist", { method: "POST", body: JSON.stringify({ productId }), token }),
  removeWishlistItem: (token, id) => request(`/wishlist/${id}`, { method: "DELETE", token }),

  listOrders: (token) => request("/orders", { token }),

  listPaymentMethods: (token) => request("/payment-methods", { token }),
  createPaymentMethod: (token, data) =>
    request("/payment-methods", { method: "POST", body: JSON.stringify(data), token }),
  setPrimaryPaymentMethod: (token, id) =>
    request(`/payment-methods/${id}/primary`, { method: "PATCH", token }),
  deletePaymentMethod: (token, id) => request(`/payment-methods/${id}`, { method: "DELETE", token }),

  listProofs: (token) => request("/proofs", { token }),
  approveProof: (token, id) => request(`/proofs/${id}/approve`, { method: "PATCH", token }),
};
