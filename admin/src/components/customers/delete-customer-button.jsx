"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { api, ApiRequestError } from "@/lib/api";

export function DeleteCustomerButton({ id, name }) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  async function handleDelete() {
    if (!confirm(`Delete "${name}"'s account? This removes their orders, addresses and everything else tied to it, and cannot be undone.`)) return;

    setDeleting(true);
    setError("");
    try {
      await api.deleteUser(id);
      router.push("/customers");
      router.refresh();
    } catch (err) {
      setError(err instanceof ApiRequestError ? err.message : "Failed to delete customer.");
      setDeleting(false);
    }
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        type="button"
        onClick={handleDelete}
        disabled={deleting}
        className="flex items-center gap-1.5 rounded-md border border-destructive/30 px-4 py-2 text-sm font-medium text-destructive hover:bg-destructive/10 disabled:opacity-50"
      >
        <Trash2 size={15} />
        {deleting ? "Deleting…" : "Delete customer"}
      </button>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
