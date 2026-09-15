"use client";

import { useState } from "react";
import { useAuth } from "@/context/auth-context";
import { LoginForm } from "@/components/auth/login-form";
import { SignupForm } from "@/components/auth/signup-form";

// Renders children only once a session is confirmed; otherwise shows the
// login/signup forms (per instruction: "if user is not signed in then
// display login or signup"). Used to gate /profile's real content.
export function AuthGate({ children }) {
  const { status } = useAuth();
  const [mode, setMode] = useState("login");

  if (status === "loading") {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="size-8 animate-spin rounded-full border-2 border-(--brand)/20 border-t-(--brand)" />
      </div>
    );
  }

  if (status === "unauthenticated") {
    return mode === "login" ? (
      <LoginForm onSwitchToSignup={() => setMode("signup")} />
    ) : (
      <SignupForm onSwitchToLogin={() => setMode("login")} />
    );
  }

  return children;
}
