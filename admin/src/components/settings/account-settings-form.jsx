"use client";

import { useActionState, useState } from "react";
import { CheckCircle2, Loader2, ShieldCheck } from "lucide-react";
import { changeCredentials } from "@/app/auth-actions";

function Field({ label, hint, error, children }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-foreground">{label}</span>
      {children}
      {hint && !error && <span className="mt-1 block text-xs text-muted-foreground">{hint}</span>}
      {error && <span className="mt-1 block text-xs text-destructive">{error}</span>}
    </label>
  );
}

export function AccountSettingsForm({ username }) {
  const [state, formAction, pending] = useActionState(changeCredentials, null);
  const [shown, setShown] = useState(false);
  const fields = state?.fields ?? {};
  // After a successful rename the form should show the new name.
  const currentName = state?.ok ? state.username : username;

  return (
    <form
      key={currentName}
      action={formAction}
      className="max-w-3xl rounded-lg border border-border bg-card p-5"
    >
      <h2 className="flex items-center gap-1.5 text-sm font-semibold text-foreground">
        <ShieldCheck size={15} />
        Login details
      </h2>
      <p className="mt-0.5 mb-4 text-xs text-muted-foreground">
        The username and password used to sign in to this admin panel. Enter your current password to
        change either one. Changing the password signs out every other device.
      </p>

      {state?.error && (
        <p role="alert" className="mb-4 rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {state.error}
        </p>
      )}
      {state?.ok && (
        <p className="mb-4 flex items-center gap-1.5 rounded-md border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-700">
          <CheckCircle2 size={15} />
          {state.message}
        </p>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Username" error={fields.username} hint="Letters, numbers and . _ -">
          <input name="username" defaultValue={state?.username ?? currentName} autoComplete="username" autoCapitalize="none" spellCheck={false} className="input" />
        </Field>
        <div className="hidden sm:block" />
        <Field label="New password" error={fields.newPassword} hint="At least 10 characters. Leave blank to keep the current one.">
          <input name="newPassword" type={shown ? "text" : "password"} autoComplete="new-password" className="input" />
        </Field>
        <Field label="Confirm new password" error={fields.confirmPassword}>
          <input name="confirmPassword" type={shown ? "text" : "password"} autoComplete="new-password" className="input" />
        </Field>
        <Field label="Current password" error={fields.currentPassword} hint="Required to save any change.">
          <input name="currentPassword" type={shown ? "text" : "password"} autoComplete="current-password" required className="input" />
        </Field>
        <label className="flex items-center gap-2 self-end pb-2 text-sm text-foreground">
          <input type="checkbox" checked={shown} onChange={(e) => setShown(e.target.checked)} className="size-4 rounded border-border" />
          Show passwords
        </label>
      </div>

      <button
        type="submit"
        disabled={pending}
        className="mt-5 flex items-center gap-1.5 rounded-md bg-brand px-4 py-2 text-sm font-medium text-brand-foreground hover:opacity-90 disabled:opacity-60"
      >
        {pending && <Loader2 size={15} className="animate-spin" />}
        {pending ? "Saving…" : "Update login details"}
      </button>
    </form>
  );
}
