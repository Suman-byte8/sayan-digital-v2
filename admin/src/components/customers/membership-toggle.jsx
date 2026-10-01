"use client";

import { useOptimistic, useState, useTransition } from "react";
import { Sparkles } from "lucide-react";
import { api, ApiRequestError } from "@/lib/api";
import { refreshAdminData } from "@/app/actions";

// The "Member" badge on a customer's own /profile is admin-set only - this
// is the only place it can be changed, deliberately no customer-facing
// toggle for it.
export function MembershipToggle({ id, isMember }) {
  const [saving, startTransition] = useTransition();
  // Badge flips instantly; reverts by itself if the request fails.
  const [shownMember, setShownMember] = useOptimistic(isMember);
  const [error, setError] = useState("");

  function handleToggle() {
    setError("");
    startTransition(async () => {
      setShownMember(!shownMember);
      try {
        await api.updateUser(id, { isMember: !isMember });
        await refreshAdminData();
      } catch (err) {
        setError(err instanceof ApiRequestError ? err.message : "Failed to update.");
      }
    });
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
          shownMember
            ? "bg-amber-100 text-amber-700 hover:bg-amber-200"
            : "bg-muted text-muted-foreground hover:bg-border"
        }`}
      >
        {shownMember ? "Member" : "Not a Member"}
      </button>
      {error && <p className="mt-1 text-[11px] text-destructive">{error}</p>}
    </div>
  );
}
