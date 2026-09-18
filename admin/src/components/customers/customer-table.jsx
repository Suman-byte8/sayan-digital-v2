"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, Trash2 } from "lucide-react";
import { api, ApiRequestError } from "@/lib/api";

const dateFormatter = new Intl.DateTimeFormat("en-IN", { dateStyle: "medium" });

function initialsOf(name) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function CustomerTable({ customers }) {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState("");

  async function handleDelete(customer) {
    if (!confirm(`Delete "${customer.name}"'s account? This removes their orders, addresses and everything else tied to it, and cannot be undone.`)) return;

    setDeletingId(customer.id);
    setError("");
    try {
      await api.deleteUser(customer.id);
      router.refresh();
    } catch (err) {
      setError(err instanceof ApiRequestError ? err.message : "Failed to delete customer.");
    } finally {
      setDeletingId(null);
    }
  }

  if (customers.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
        No customers found.
      </div>
    );
  }

  return (
    <div>
      {error && (
        <p className="mb-3 rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </p>
      )}
      <div className="overflow-x-auto rounded-lg border border-border bg-card">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border bg-muted/50 text-xs font-medium tracking-wide text-muted-foreground uppercase">
            <tr>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Contact</th>
              <th className="px-4 py-3">Business</th>
              <th className="px-4 py-3">Orders</th>
              <th className="px-4 py-3">Addresses</th>
              <th className="px-4 py-3">Wishlist</th>
              <th className="px-4 py-3">Joined</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {customers.map((customer) => (
              <tr key={customer.id}>
                <td className="px-4 py-3">
                  <Link href={`/customers/${customer.id}`} className="flex items-center gap-3">
                    {customer.avatarUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element -- arbitrary uploaded/external URL
                      <img
                        src={customer.avatarUrl}
                        alt={customer.name}
                        className="size-9 rounded-full border border-border object-cover"
                      />
                    ) : (
                      <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-brand/10 text-xs font-semibold text-brand">
                        {initialsOf(customer.name)}
                      </div>
                    )}
                    <span className="font-medium text-foreground hover:underline">{customer.name}</span>
                    {customer.isMember && (
                      <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-medium text-amber-700">
                        Member
                      </span>
                    )}
                  </Link>
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  <p>{customer.email}</p>
                  {customer.phone && <p className="text-xs">{customer.phone}</p>}
                </td>
                <td className="px-4 py-3 text-muted-foreground">{customer.businessName || "—"}</td>
                <td className="px-4 py-3 text-foreground">{customer._count?.orders ?? 0}</td>
                <td className="px-4 py-3 text-foreground">{customer._count?.addresses ?? 0}</td>
                <td className="px-4 py-3 text-foreground">{customer._count?.wishlistItems ?? 0}</td>
                <td className="px-4 py-3 text-muted-foreground">
                  {dateFormatter.format(new Date(customer.createdAt))}
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-3">
                    <Link
                      href={`/customers/${customer.id}`}
                      className="flex items-center gap-1 text-sm font-medium text-foreground hover:underline"
                    >
                      <Eye size={14} />
                      View
                    </Link>
                    <button
                      type="button"
                      onClick={() => handleDelete(customer)}
                      disabled={deletingId === customer.id}
                      className="flex items-center gap-1 text-sm font-medium text-destructive hover:underline disabled:opacity-50"
                    >
                      <Trash2 size={14} />
                      {deletingId === customer.id ? "Deleting…" : "Delete"}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
