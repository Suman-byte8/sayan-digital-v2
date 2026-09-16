import Link from "next/link";
import { Search } from "lucide-react";
import { api, ApiRequestError } from "@/lib/api";
import { CustomerTable } from "@/components/customers/customer-table";

// Always fetch fresh data — this is an admin tool, never statically cached.
export const dynamic = "force-dynamic";

export const metadata = {
  title: "Customers — Sayan Digital Admin",
};

export default async function CustomersPage({ searchParams }) {
  const { search, page } = await searchParams;
  const currentPage = Number(page) || 1;

  let customers = [];
  let pagination = null;
  let loadError = null;

  try {
    const result = await api.listUsers({ limit: 50, search, page: currentPage });
    customers = result.data;
    pagination = result.pagination;
  } catch (error) {
    loadError = error instanceof ApiRequestError ? error.message : "Failed to load customers.";
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-foreground">Customers</h1>
          <p className="text-sm text-muted-foreground">
            Everyone with an account on the Sayan Digital storefront.
          </p>
        </div>
        <form action="/customers" className="relative">
          <Search
            size={15}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <input
            type="text"
            name="search"
            defaultValue={search ?? ""}
            placeholder="Search name, email or phone…"
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
          <CustomerTable customers={customers} />

          {pagination && pagination.totalPages > 1 && (
            <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
              <p>
                Page {pagination.page} of {pagination.totalPages} · {pagination.total} customers
              </p>
              <div className="flex gap-2">
                {pagination.page > 1 && (
                  <Link
                    href={{ pathname: "/customers", query: { search, page: pagination.page - 1 } }}
                    className="rounded-md border border-border px-3 py-1.5 font-medium text-foreground hover:bg-muted"
                  >
                    Previous
                  </Link>
                )}
                {pagination.page < pagination.totalPages && (
                  <Link
                    href={{ pathname: "/customers", query: { search, page: pagination.page + 1 } }}
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
