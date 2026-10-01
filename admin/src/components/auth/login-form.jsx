"use client";

import { useActionState, useState } from "react";
import { Eye, EyeOff, Loader2, LogIn } from "lucide-react";
import { login } from "@/app/auth-actions";

export function LoginForm({ next, sessionEnded }) {
  const [state, formAction, pending] = useActionState(login, null);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <form action={formAction} className="rounded-lg border border-border bg-card p-6 shadow-sm">
      <h1 className="mb-1 text-base font-semibold text-foreground">Sign in</h1>
      <p className="mb-5 text-sm text-muted-foreground">Enter your admin username and password.</p>

      {sessionEnded && !state?.error && (
        <p className="mb-4 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">
          Your session has ended. Please sign in again.
        </p>
      )}
      {state?.error && (
        <p role="alert" className="mb-4 rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {state.error}
        </p>
      )}

      <input type="hidden" name="next" value={next} />

      <label className="mb-4 block">
        <span className="mb-1.5 block text-sm font-medium text-foreground">Username</span>
        <input
          name="username"
          defaultValue={state?.username ?? ""}
          type="text"
          autoComplete="username"
          autoCapitalize="none"
          spellCheck={false}
          autoFocus
          required
          className="input"
        />
      </label>

      <label className="mb-5 block">
        <span className="mb-1.5 block text-sm font-medium text-foreground">Password</span>
        <div className="relative">
          <input
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            required
            className="input pr-10"
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            aria-label={showPassword ? "Hide password" : "Show password"}
            className="absolute top-1/2 right-2 -translate-y-1/2 rounded p-1 text-muted-foreground hover:text-foreground"
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
      </label>

      <button
        type="submit"
        disabled={pending}
        className="flex w-full items-center justify-center gap-2 rounded-md bg-brand px-4 py-2.5 text-sm font-medium text-brand-foreground transition-opacity hover:opacity-90 disabled:opacity-60"
      >
        {pending ? <Loader2 size={15} className="animate-spin" /> : <LogIn size={15} />}
        {pending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
