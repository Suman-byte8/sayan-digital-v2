"use client";

import { useOptimistic, useState, useTransition } from "react";
import Link from "next/link";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { api, ApiRequestError } from "@/lib/api";
import { refreshAdminData } from "@/app/actions";

const currencyFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

export function ProductTable({ products }) {
  const [, startTransition] = useTransition();
  // The row disappears the instant Delete is confirmed; if the API call
  // fails the transition ends and the row reappears with the error shown.
  const [visibleProducts, removeProduct] = useOptimistic(products, (current, id) =>
    current.filter((p) => p.id !== id),
  );
  const [error, setError] = useState("");

  async function handleDelete(product) {
    if (!confirm(`Delete "${product.name}"? This cannot be undone.`)) return;

    setError("");
    startTransition(async () => {
      removeProduct(product.id);
      try {
        await api.deleteProduct(product.id);
        await refreshAdminData();
      } catch (err) {
        setError(err instanceof ApiRequestError ? err.message : "Failed to delete product.");
      }
    });
  }

  if (visibleProducts.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
        No products yet. Click &ldquo;Add product&rdquo; to create the first one.
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
              <th className="px-4 py-3">Photo</th>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Catalog</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Min. Qty</th>
              <th className="px-4 py-3">Stock</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {visibleProducts.map((product) => (
              <tr key={product.id}>
                <td className="px-4 py-3">
                  <Link href={`/products/${product.id}`}>
                    {product.images?.[0] ? (
                      // eslint-disable-next-line @next/next/no-img-element -- previewing an arbitrary uploaded/external URL, not a static local asset
                      <img referrerPolicy="no-referrer"
                        src={product.images[0]}
                        alt={product.name}
                        className="size-12 rounded-md border border-border object-cover"
                      />
                    ) : (
                      <div className="flex size-12 items-center justify-center rounded-md border border-dashed border-border text-[10px] text-muted-foreground">
                        No photo
                      </div>
                    )}
                  </Link>
                </td>
                <td className="px-4 py-3">
                  <Link href={`/products/${product.id}`} className="hover:underline">
                    <p className="font-medium text-foreground">{product.name}</p>
                  </Link>
                  <p className="text-xs text-muted-foreground">{product.slug}</p>
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {product.type === "STATIONERY" ? "Stationery" : "Printing"}
                </td>
                <td className="px-4 py-3 text-muted-foreground">{product.category || "—"}</td>
                <td className="px-4 py-3 text-foreground">
                  {currencyFormatter.format(product.price)}
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {product.minOrderQty ? `${product.minOrderQty} pcs` : "—"}
                </td>
                <td className="px-4 py-3 text-foreground">{product.stock}</td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                      product.isActive
                        ? "bg-green-100 text-green-700"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {product.isActive ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-3">
                    <Link
                      href={`/products/${product.id}`}
                      className="flex items-center gap-1 text-sm font-medium text-foreground hover:underline"
                    >
                      <Eye size={14} />
                      View
                    </Link>
                    <Link
                      href={`/products/${product.id}/edit`}
                      className="flex items-center gap-1 text-sm font-medium text-brand hover:underline"
                    >
                      <Pencil size={14} />
                      Edit
                    </Link>
                    <button
                      type="button"
                      onClick={() => handleDelete(product)}
                      className="flex items-center gap-1 text-sm font-medium text-destructive hover:underline"
                    >
                      <Trash2 size={14} />
                      Delete
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
