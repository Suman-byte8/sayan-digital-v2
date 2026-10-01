import { unstable_rethrow } from "next/navigation";
import Link from "next/link";
import { Search } from "lucide-react";
import { ApiRequestError } from "@/lib/api";
import { api } from "@/lib/api-server";
import { InvoiceTable } from "@/components/invoices/invoice-table";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Invoices — Sayan Digital Admin",
};

const STATUS_TABS = [
  { value: undefined, label: "All" },
  { value: "UNPAID", label: "Unpaid" },
  { value: "PARTIAL", label: "Partly paid" },
  { value: "PAID", label: "Paid" },
];

export default async function InvoicesPage({ searchParams }) {
  const { status, search, page } = await searchParams;
  const currentPage = Number(page) || 1;

  let invoices = [];
  let pagination = null;
  let loadError = null;

  try {
    const result = await api.listInvoices({ limit: 50, status, search, page: currentPage });
    invoices = result.data;
    pagination = result.pagination;
  } catch (error) {
    unstable_rethrow(error);
    loadError = error instanceof ApiRequestError ? error.message : "Failed to load invoices.";
  }

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          {STATUS_TABS.map((tab) => (
            <Link
              key={tab.label}
              href={{ pathname: "/invoices", query: { ...(tab.value ? { status: tab.value } : {}), search } }}
              className={`rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
                status === tab.value
                  ? "bg-brand text-brand-foreground"
                  : "bg-muted text-muted-foreground hover:bg-border"
              }`}
            >
              {tab.label}
            </Link>
          ))}
        </div>
        <form action="/invoices" className="relative">
          {status && <input type="hidden" name="status" value={status} />}
          <Search
            size={15}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <input
            type="text"
            name="search"
            defaultValue={search ?? ""}
            placeholder="Search invoice # or client…"
            className="w-72 rounded-md border border-border bg-card py-2 pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-brand/40"
          />
        </form>
      </div>

      {loadError ? (
        <p className="rounded-md border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {loadError}
        </p>
      ) : (
        <>
          <InvoiceTable invoices={invoices} />

          {pagination && pagination.totalPages > 1 && (
            <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
              <p>
                Page {pagination.page} of {pagination.totalPages} · {pagination.total} invoices
              </p>
              <div className="flex gap-2">
                {pagination.page > 1 && (
                  <Link
                    href={{ pathname: "/invoices", query: { status, search, page: pagination.page - 1 } }}
                    className="rounded-md border border-border px-3 py-1.5 font-medium text-foreground hover:bg-muted"
                  >
                    Previous
                  </Link>
                )}
                {pagination.page < pagination.totalPages && (
                  <Link
                    href={{ pathname: "/invoices", query: { status, search, page: pagination.page + 1 } }}
                    className="rounded-md border border-border px-3 py-1.5 font-medium text-foreground hover:bg-muted"
                  >
                    Next
                  </Link>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
