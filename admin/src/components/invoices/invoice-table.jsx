"use client";

import { useOptimistic, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ExternalLink, MessageCircle, Pencil, Trash2 } from "lucide-react";
import { api, ApiRequestError } from "@/lib/api";
import { formatDate, formatMoney, todayYmd, whatsappLink } from "@/lib/invoice-format";

const STATUS_STYLES = {
  PAID: "bg-green-100 text-green-700",
  PARTIAL: "bg-amber-100 text-amber-700",
  UNPAID: "bg-red-100 text-red-700",
};
const STATUS_LABELS = { PAID: "Paid", PARTIAL: "Partly paid", UNPAID: "Unpaid" };

export function InvoiceTable({ invoices }) {
  const router = useRouter();
  const [, startTransition] = useTransition();
  // Row disappears the moment delete is confirmed; reappears with an error
  // if the request fails.
  const [visible, removeInvoice] = useOptimistic(invoices, (current, id) => current.filter((i) => i.id !== id));
  const [error, setError] = useState("");
  const today = todayYmd();

  function handleDelete(invoice) {
    if (!confirm(`Delete invoice ${invoice.invoiceNumber} for ${invoice.clientName}? This cannot be undone.`)) return;
    setError("");
    startTransition(async () => {
      removeInvoice(invoice.id);
      try {
        await api.deleteInvoice(invoice.id);
        router.refresh();
      } catch (err) {
        setError(err instanceof ApiRequestError ? err.message : "Failed to delete invoice.");
      }
    });
  }

  if (visible.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
        No invoices found.{" "}
        <Link href="/invoices/new" className="font-medium text-brand hover:underline">
          Generate your first invoice
        </Link>
        .
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
              <th className="px-4 py-3">Invoice</th>
              <th className="px-4 py-3">Client</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Due</th>
              <th className="px-4 py-3 text-right">Total</th>
              <th className="px-4 py-3 text-right">Balance</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {visible.map((invoice) => {
              const overdue = invoice.status !== "PAID" && invoice.dueDate && invoice.dueDate < today;
              return (
                <tr key={invoice.id}>
                  <td className="px-4 py-3">
                    <Link href={`/invoices/${invoice.id}`} className="font-medium text-foreground hover:underline">
                      {invoice.invoiceNumber}
                    </Link>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-foreground">{invoice.clientName}</p>
                    {invoice.clientPhone && <p className="text-xs text-muted-foreground">{invoice.clientPhone}</p>}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{formatDate(invoice.issueDate)}</td>
                  <td className={`px-4 py-3 ${overdue ? "font-medium text-red-600" : "text-muted-foreground"}`}>
                    {formatDate(invoice.dueDate) || "—"}
                    {overdue && <span className="ml-1 text-[10px] uppercase">overdue</span>}
                  </td>
                  <td className="px-4 py-3 text-right text-foreground">{formatMoney(invoice.total)}</td>
                  <td className="px-4 py-3 text-right font-medium text-foreground">{formatMoney(invoice.balanceDue)}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_STYLES[invoice.status]}`}>
                      {STATUS_LABELS[invoice.status]}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-3">
                      <Link
                        href={`/invoices/${invoice.id}`}
                        className="flex items-center gap-1 text-sm font-medium text-brand hover:underline"
                      >
                        <Pencil size={14} />
                        Open
                      </Link>
                      {invoice.driveUrl && (
                        <>
                          <a
                            href={invoice.driveUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center gap-1 text-sm font-medium text-foreground hover:underline"
                          >
                            <ExternalLink size={14} />
                            PDF
                          </a>
                          <a
                            href={whatsappLink({
                              phone: invoice.clientPhone,
                              clientName: invoice.clientName,
                              invoiceNumber: invoice.invoiceNumber,
                              businessName: "Sayan Digital",
                              total: invoice.total,
                              balanceDue: invoice.balanceDue,
                              dueDate: invoice.dueDate,
                              driveUrl: invoice.driveUrl,
                            })}
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center gap-1 text-sm font-medium text-[#128C7E] hover:underline"
                          >
                            <MessageCircle size={14} />
                            Share
                          </a>
                        </>
                      )}
                      <button
                        type="button"
                        onClick={() => handleDelete(invoice)}
                        className="flex items-center gap-1 text-sm font-medium text-destructive hover:underline"
                      >
                        <Trash2 size={14} />
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
