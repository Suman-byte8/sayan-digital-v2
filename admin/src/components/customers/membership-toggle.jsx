"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Sparkles } from "lucide-react";
import { api, ApiRequestError } from "@/lib/api";

// The "Member" badge on a customer's own /profile is admin-set only - this
// is the only place it can be changed, deliberately no customer-facing
// toggle for it.
export function MembershipToggle({ id, isMember }) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleToggle() {
    setSaving(true);
    setError("");
    try {
      await api.updateUser(id, { isMember: !isMember });
      router.refresh();
    } catch (err) {
      setError(err instanceof ApiRequestError ? err.message : "Failed to update.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="rounded-md border border-border px-4 py-2 text-sm">
      <p className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-muted-foreground">
        <Sparkles size={12} />
        Membership
      </p>
      <button
        type="button"
        onClick={handleToggle}
        disabled={saving}
        className={`mt-0.5 flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium transition-colors disabled:opacity-50 ${
          isMember
            ? "bg-amber-100 text-amber-700 hover:bg-amber-200"
            : "bg-muted text-muted-foreground hover:bg-border"
        }`}
      >
        {isMember ? "Member" : "Not a Member"}
      </button>
      {error && <p className="mt-1 text-[11px] text-destructive">{error}</p>}
    </div>
  );
}
