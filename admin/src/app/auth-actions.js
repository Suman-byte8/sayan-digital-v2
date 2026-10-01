"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { API_URL } from "@/lib/api-url";
import { ADMIN_COOKIE, sessionCookieOptions } from "@/lib/session";

async function callApi(path, { method = "POST", body, token } = {}) {
  let response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      method,
      headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      body: body ? JSON.stringify(body) : undefined,
      cache: "no-store",
    });
  } catch {
    return { ok: false, status: 0, error: "Could not reach the server. Try again in a moment." };
  }
  const json = await response.json().catch(() => null);
  return response.ok
    ? { ok: true, data: json?.data }
    : { ok: false, status: response.status, error: json?.error ?? "Something went wrong.", details: json?.details };
}

// Only ever redirect to a path inside this app (blocks //evil.com and the like).
function safeNext(value) {
  return typeof value === "string" && value.startsWith("/") && !value.startsWith("//") && !value.startsWith("/login")
    ? value
    : "/products";
}

export async function login(_previousState, formData) {
  const username = String(formData.get("username") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  if (!username || !password) return { error: "Enter your username and password.", username };

  const result = await callApi("/admin/auth/login", { body: { username, password } });
  if (!result.ok) return { error: result.error, username };

  (await cookies()).set(ADMIN_COOKIE, result.data.token, sessionCookieOptions(result.data.maxAge));
  redirect(safeNext(formData.get("next")));
}

export async function logout() {
  (await cookies()).delete(ADMIN_COOKIE);
  redirect("/login");
}

// Settings page: change the login username and/or password.
export async function changeCredentials(_previousState, formData) {
  const token = (await cookies()).get(ADMIN_COOKIE)?.value;
  const currentPassword = String(formData.get("currentPassword") ?? "");
  const username = String(formData.get("username") ?? "").trim();
  const newPassword = String(formData.get("newPassword") ?? "");
  const confirmPassword = String(formData.get("confirmPassword") ?? "");

  // `username` is echoed back so the form keeps it after a failed attempt
  // (React clears uncontrolled inputs once an action returns).
  if (!currentPassword) return { error: "Enter your current password to make changes.", fields: { currentPassword: "Required" }, username };
  if (newPassword && newPassword !== confirmPassword) {
    return { error: "The new passwords don't match.", fields: { confirmPassword: "Does not match" }, username };
  }

  const result = await callApi("/admin/auth/credentials", {
    method: "PUT",
    token,
    body: { currentPassword, ...(username ? { username } : {}), ...(newPassword ? { newPassword } : {}) },
  });

  if (!result.ok) {
    if (result.status === 401) redirect("/login?reason=session");
    const fields = Object.fromEntries(Object.entries(result.details ?? {}).map(([k, v]) => [k, v?.[0]]));
    return { error: result.error, fields, username };
  }

  // The API issues a fresh token so this browser stays signed in (every
  // other session is signed out when the password changes).
  (await cookies()).set(ADMIN_COOKIE, result.data.token, sessionCookieOptions(result.data.maxAge));
  return {
    ok: true,
    username: result.data.username,
    message: newPassword ? "Login details updated. Other devices have been signed out." : "Username updated.",
  };
}
