import Link from "next/link";
import { Search } from "lucide-react";
import { api, ApiRequestError } from "@/lib/api";
import { OrderTable } from "@/components/orders/order-table";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Orders — Sayan Digital Admin",
};

const STATUS_TABS = [
  { value: undefined, label: "All" },
  { value: "PENDING", label: "Pending" },
  { value: "IN_PRODUCTION", label: "In Production" },
  { value: "SHIPPED", label: "Shipped" },
  { value: "DELIVERED", label: "Delivered" },
  { value: "CANCELLED", label: "Cancelled" },
];

export default async function OrdersPage({ searchParams }) {
  const { status, search, page } = await searchParams;
  const currentPage = Number(page) || 1;

  let orders = [];
  let pagination = null;
  let loadError = null;

  try {
    const result = await api.listOrders({ limit: 50, status, search, page: currentPage });
    orders = result.data;
    pagination = result.pagination;
  } catch (error) {
    loadError = error instanceof ApiRequestError ? error.message : "Failed to load orders.";
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-foreground">Orders</h1>
          <p className="text-sm text-muted-foreground">
            Every order placed through the Sayan Digital storefront.
          </p>
        </div>
        <form action="/orders" className="relative">
          {status && <input type="hidden" name="status" value={status} />}
          <Search
            size={15}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <input
            type="text"
            name="search"
            defaultValue={search ?? ""}
            placeholder="Search order #, name or email…"
            className="w-72 rounded-md border border-border bg-card py-2 pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-brand/40"
          />
        </form>
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        {STATUS_TABS.map((tab) => (
          <Link
            key={tab.label}
            href={{ pathname: "/orders", query: { ...(tab.value ? { status: tab.value } : {}), search } }}
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

      {loadError ? (
        <p className="rounded-md border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {loadError}
        </p>
      ) : (
        <>
          <OrderTable orders={orders} />

          {pagination && pagination.totalPages > 1 && (
            <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
              <p>
                Page {pagination.page} of {pagination.totalPages} · {pagination.total} orders
              </p>
              <div className="flex gap-2">
                {pagination.page > 1 && (
                  <Link
                    href={{ pathname: "/orders", query: { status, search, page: pagination.page - 1 } }}
                    className="rounded-md border border-border px-3 py-1.5 font-medium text-foreground hover:bg-muted"
                  >
                    Previous
                  </Link>
                )}
                {pagination.page < pagination.totalPages && (
                  <Link
                    href={{ pathname: "/orders", query: { status, search, page: pagination.page + 1 } }}
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
