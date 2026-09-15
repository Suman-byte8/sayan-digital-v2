"use client";

import { useState } from "react";
import { ArrowRight, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/auth-context";
import { ApiRequestError } from "@/lib/auth-api";

export function LoginForm({ onSwitchToSignup }) {
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function update(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      await login(form.email, form.password);
    } catch (err) {
      setError(err instanceof ApiRequestError ? err.message : "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-md rounded-3xl border border-border bg-card p-7 shadow-premium md:p-9">
      <div className="flex size-11 items-center justify-center rounded-2xl bg-(--brand)/10 text-(--brand)">
        <LogIn size={20} />
      </div>
      <h1 className="mt-4 font-serif text-2xl font-light text-foreground">Sign in to your account</h1>
      <p className="body-copy mt-2 text-[13px]">
        Access your orders, saved designs, and delivery addresses.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
        {error && (
          <p className="rounded-lg bg-destructive/10 px-3 py-2 text-[13px] text-destructive">
            {error}
          </p>
        )}

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="login-email">Email Address</Label>
          <Input
            id="login-email"
            type="email"
            required
            autoComplete="email"
            value={form.email}
            onChange={(e) => update("email", e.target.value)}
            placeholder="name@company.com"
            className="h-11"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="login-password">Password</Label>
          <Input
            id="login-password"
            type="password"
            required
            autoComplete="current-password"
            value={form.password}
            onChange={(e) => update("password", e.target.value)}
            placeholder="••••••••"
            className="h-11"
          />
        </div>

        <Button type="submit" disabled={submitting} data-cursor="hover" className="mt-2 h-12 gap-2 rounded-lg">
          {submitting ? "Signing in…" : "Sign In"}
          <ArrowRight size={16} />
        </Button>
      </form>

      <p className="mt-6 text-center text-[13px] text-muted-foreground">
        New to Sayan Digital?{" "}
        <button
          type="button"
          onClick={onSwitchToSignup}
          className="font-semibold text-(--brand) hover:underline"
        >
          Create an account
        </button>
      </p>
    </div>
  );
}
