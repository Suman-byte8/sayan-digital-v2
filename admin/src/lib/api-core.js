// Shared pieces of the admin's API client. Two wrappers build on this:
//   lib/api.js        - used by client components (calls go through the
//                       same-origin /proxy route, which attaches the session)
//   lib/api-server.js - used by server components/actions (reads the session
//                       cookie itself and calls the API directly)
// Nothing here touches cookies or the network.

export class ApiRequestError extends Error {
  constructor(message, status, details) {
    super(message);
    this.status = status;
    this.details = details;
  }
}

export function withQuery(path, params = {}) {
  const query = new URLSearchParams(
    Object.fromEntries(Object.entries(params).filter(([, v]) => v != null && v !== "")),
  ).toString();
  return `${path}${query ? `?${query}` : ""}`;
}

// Turns a fetch Response into the parsed body, or throws ApiRequestError.
export async function parseResponse(response, fallbackMessage) {
  const isJson = response.headers.get("content-type")?.includes("application/json");
  const body = isJson ? await response.json().catch(() => null) : null;

  if (!response.ok) {
    throw new ApiRequestError(
      body?.error ?? `${fallbackMessage ?? "Request failed"} with status ${response.status}`,
      response.status,
      body?.details,
    );
  }
  return body;
}

// Browser-only memo for rarely-changing GETs (category list, taxonomy
// search): repeat calls within the TTL resolve instantly and concurrent
// calls share one in-flight request. Skipped on the server on purpose - a
// module-level Map there would be shared across every request.
const memoStore = new Map();
function memo(key, ttlMs, fn) {
  if (typeof window === "undefined") return fn();
  const hit = memoStore.get(key);
  if (hit && Date.now() < hit.expires) return hit.promise;
  const promise = fn().catch((error) => {
    memoStore.delete(key); // never cache a failure
    throw error;
  });
  memoStore.set(key, { promise, expires: Date.now() + ttlMs });
  return promise;
}
function clearMemo(prefix) {
  for (const key of memoStore.keys()) if (key.startsWith(prefix)) memoStore.delete(key);
}

export function buildApi({ request, uploadImage, uploadInvoicePdf }) {
  return {
    uploadImage,
    listProducts: (params = {}) => request(withQuery("/products", params)),
    getProduct: (id) => request(`/products/${id}`),
    createProduct: (data) => request("/products", { method: "POST", body: JSON.stringify(data) }),
    updateProduct: (id, data) =>
      request(`/products/${id}`, { method: "PUT", body: JSON.stringify(data) }),
    deleteProduct: (id) => request(`/products/${id}`, { method: "DELETE" }),

    listCategories: () => memo("categories", 5 * 60_000, () => request("/categories")),
    createCategory: (data) =>
      request("/categories", { method: "POST", body: JSON.stringify(data) }).finally(() =>
        clearMemo("categories"),
      ),
    deleteCategory: (id) =>
      request(`/categories/${id}`, { method: "DELETE" }).finally(() => clearMemo("categories")),
    searchTaxonomy: (q) =>
      memo(`taxonomy:${q.toLowerCase()}`, 10 * 60_000, () =>
        request(withQuery("/categories/taxonomy/search", { q })),
      ),

    listUsers: (params = {}) => request(withQuery("/admin/users", params)),
    getUser: (id) => request(`/admin/users/${id}`),
    updateUser: (id, data) =>
      request(`/admin/users/${id}`, { method: "PATCH", body: JSON.stringify(data) }),
    deleteUser: (id) => request(`/admin/users/${id}`, { method: "DELETE" }),

    listOrders: (params = {}) => request(withQuery("/admin/orders", params)),
    getOrder: (id) => request(`/admin/orders/${id}`),
    updateOrder: (id, data) =>
      request(`/admin/orders/${id}`, { method: "PATCH", body: JSON.stringify(data) }),

    listInvoices: (params = {}) => request(withQuery("/admin/invoices", params)),
    getInvoiceDefaults: () => request("/admin/invoices/defaults"),
    getInvoice: (id) => request(`/admin/invoices/${id}`),
    createInvoice: (data) => request("/admin/invoices", { method: "POST", body: JSON.stringify(data) }),
    updateInvoice: (id, data) =>
      request(`/admin/invoices/${id}`, { method: "PUT", body: JSON.stringify(data) }),
    deleteInvoice: (id) => request(`/admin/invoices/${id}`, { method: "DELETE" }),
    uploadInvoicePdf,

    getInvoiceSettings: () => request("/admin/settings/invoice"),
    updateInvoiceSettings: (data) =>
      request("/admin/settings/invoice", { method: "PUT", body: JSON.stringify(data) }),

    getAdminMe: () => request("/admin/auth/me"),

    listTasks: (params = {}) => request(withQuery("/admin/tasks", params)),
    getTask: (id) => request(`/admin/tasks/${id}`),
    createTask: (data) => request("/admin/tasks", { method: "POST", body: JSON.stringify(data) }),
    updateTask: (id, data) =>
      request(`/admin/tasks/${id}`, { method: "PATCH", body: JSON.stringify(data) }),
    deleteTask: (id) => request(`/admin/tasks/${id}`, { method: "DELETE" }),
  };
}
