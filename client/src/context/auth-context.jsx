"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { authApi, ApiRequestError } from "@/lib/auth-api";

const AuthContext = createContext(null);

// Access tokens expire in 15 minutes (server default) — refresh a bit
// before that so an active session never silently drops mid-use.
const SILENT_REFRESH_INTERVAL_MS = 12 * 60 * 1000;

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  // "loading" until the initial silent-refresh check resolves, so the
  // profile page doesn't flash the login form for an already-signed-in
  // visitor before the httpOnly cookie has been checked.
  const [status, setStatus] = useState("loading");
  const refreshTimerRef = useRef(null);

  const clearSession = useCallback(() => {
    setUser(null);
    setAccessToken(null);
    setStatus("unauthenticated");
    clearInterval(refreshTimerRef.current);
  }, []);

  const establishSession = useCallback(async (token) => {
    const { data: me } = await authApi.me(token);
    setUser(me);
    setAccessToken(token);
    setStatus("authenticated");

    clearInterval(refreshTimerRef.current);
    refreshTimerRef.current = setInterval(async () => {
      try {
        const { data } = await authApi.refresh();
        setAccessToken(data.accessToken);
      } catch {
        clearSession();
      }
    }, SILENT_REFRESH_INTERVAL_MS);
  }, [clearSession]);

  useEffect(() => {
    authApi
      .refresh()
      .then((result) => establishSession(result.data.accessToken))
      .catch(() => setStatus("unauthenticated"));

    return () => clearInterval(refreshTimerRef.current);
    // Runs once on mount only — establishSession/clearSession are stable
    // (useCallback), and re-running this on every render would re-trigger
    // the silent-refresh check needlessly.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function login(email, password) {
    const { data } = await authApi.login({ email, password });
    setUser(data.user);
    await establishSession(data.accessToken);
  }

  async function signup(payload) {
    const { data } = await authApi.signup(payload);
    setUser(data.user);
    await establishSession(data.accessToken);
  }

  async function logout() {
    try {
      await authApi.logout();
    } finally {
      clearSession();
    }
  }

  function updateUser(patch) {
    setUser((prev) => (prev ? { ...prev, ...patch } : prev));
  }

  return (
    <AuthContext.Provider
      value={{ user, accessToken, status, login, signup, logout, updateUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
}

export { ApiRequestError };
