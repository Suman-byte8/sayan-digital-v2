const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api";

export class ApiRequestError extends Error {
  constructor(message, status, details) {
    super(message);
    this.status = status;
    this.details = details;
  }
}

async function request(path, options = {}) {
  let response;

  try {
    response = await fetch(`${API_URL}${path}`, {
      ...options,
      headers: { "Content-Type": "application/json", ...options.headers },
      cache: "no-store",
    });
  } catch {
    throw new ApiRequestError(
      `Could not reach the API at ${API_URL}. Is the backend server running?`,
      0,
    );
  }

  const isJson = response.headers.get("content-type")?.includes("application/json");
  const body = isJson ? await response.json().catch(() => null) : null;

  if (!response.ok) {
    throw new ApiRequestError(
      body?.error ?? `Request failed with status ${response.status}`,
      response.status,
      body?.details,
    );
  }

  return body;
}

async function uploadImage(file) {
  const formData = new FormData();
  formData.append("file", file);

  let response;
  try {
    response = await fetch(`${API_URL}/uploads/image`, { method: "POST", body: formData });
  } catch {
    throw new ApiRequestError(
      `Could not reach the API at ${API_URL}. Is the backend server running?`,
      0,
    );
  }

  const body = await response.json().catch(() => null);

  if (!response.ok) {
    throw new ApiRequestError(body?.error ?? `Upload failed with status ${response.status}`, response.status);
  }

  return body;
}

// Multipart (not JSON), so it can't go through request() - that forces a
// JSON content-type, which would break the multipart boundary.
async function uploadInvoicePdf(id, blob, filename) {
  const formData = new FormData();
  formData.append("file", blob, filename);
  formData.append("filename", filename);

  let response;
  try {
    response = await fetch(`${API_URL}/admin/invoices/${id}/pdf`, { method: "POST", body: formData });
  } catch {
    throw new ApiRequestError(
      `Could not reach the API at ${API_URL}. Is the backend server running?`,
      0,
    );
  }

  const body = await response.json().catch(() => null);
  if (!response.ok) {
    throw new ApiRequestError(body?.error ?? `Upload failed with status ${response.status}`, response.status);
  }
  return body;
}

function withQuery(path, params = {}) {
  const query = new URLSearchParams(
    Object.fromEntries(Object.entries(params).filter(([, v]) => v != null && v !== "")),
  ).toString();
  return `${path}${query ? `?${query}` : ""}`;
}

export const api = {
  uploadImage,
  listProducts: (params = {}) => request(withQuery("/products", params)),
  getProduct: (id) => request(`/products/${id}`),
  createProduct: (data) => request("/products", { method: "POST", body: JSON.stringify(data) }),
  updateProduct: (id, data) =>
    request(`/products/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  deleteProduct: (id) => request(`/products/${id}`, { method: "DELETE" }),

  listCategories: () => request("/categories"),
  createCategory: (data) => request("/categories", { method: "POST", body: JSON.stringify(data) }),
  deleteCategory: (id) => request(`/categories/${id}`, { method: "DELETE" }),
  searchTaxonomy: (q) => request(withQuery("/categories/taxonomy/search", { q })),

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

  listTasks: (params = {}) => request(withQuery("/admin/tasks", params)),
  getTask: (id) => request(`/admin/tasks/${id}`),
  createTask: (data) => request("/admin/tasks", { method: "POST", body: JSON.stringify(data) }),
  updateTask: (id, data) =>
    request(`/admin/tasks/${id}`, { method: "PATCH", body: JSON.stringify(data) }),
  deleteTask: (id) => request(`/admin/tasks/${id}`, { method: "DELETE" }),
};
