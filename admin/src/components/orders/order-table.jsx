import Link from "next/link";
import { Eye } from "lucide-react";

const currencyFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

const dateFormatter = new Intl.DateTimeFormat("en-IN", { dateStyle: "medium" });

export const ORDER_STATUS_STYLES = {
  PENDING: "bg-muted text-muted-foreground",
  IN_PRODUCTION: "bg-amber-100 text-amber-700",
  SHIPPED: "bg-blue-100 text-blue-700",
  DELIVERED: "bg-green-100 text-green-700",
  CANCELLED: "bg-red-100 text-red-700",
};

export function OrderTable({ orders }) {
  if (orders.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
        No orders found.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-border bg-card">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-border bg-muted/50 text-xs font-medium tracking-wide text-muted-foreground uppercase">
          <tr>
            <th className="px-4 py-3">Order</th>
            <th className="px-4 py-3">Customer</th>
            <th className="px-4 py-3">Items</th>
            <th className="px-4 py-3">Total</th>
            <th className="px-4 py-3">Payment</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Placed</th>
            <th className="px-4 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {orders.map((order) => (
            <tr key={order.id}>
              <td className="px-4 py-3">
                <Link href={`/orders/${order.id}`} className="font-medium text-foreground hover:underline">
                  {order.orderNumber}
                </Link>
              </td>
              <td className="px-4 py-3 text-muted-foreground">
                <p className="text-foreground">{order.customer?.name ?? "—"}</p>
                <p className="text-xs">{order.customer?.email}</p>
              </td>
              <td className="px-4 py-3 text-foreground">
                {order.items.length} item{order.items.length === 1 ? "" : "s"}
              </td>
              <td className="px-4 py-3 text-foreground">{currencyFormatter.format(order.totalAmount)}</td>
              <td className="px-4 py-3 text-muted-foreground">
                {order.paymentMethod ?? "—"}
                {order.isPaid && (
                  <span className="ml-1.5 rounded-full bg-green-100 px-1.5 py-0.5 text-[10px] font-medium text-green-700">
                    Paid
                  </span>
                )}
              </td>
              <td className="px-4 py-3">
                <span
                  className={`rounded-full px-2 py-0.5 text-xs font-medium ${ORDER_STATUS_STYLES[order.status] ?? "bg-muted text-muted-foreground"}`}
                >
                  {order.status.replace("_", " ")}
                </span>
              </td>
              <td className="px-4 py-3 text-muted-foreground">
                {dateFormatter.format(new Date(order.createdAt))}
              </td>
              <td className="px-4 py-3">
                <div className="flex justify-end">
                  <Link
                    href={`/orders/${order.id}`}
                    className="flex items-center gap-1 text-sm font-medium text-foreground hover:underline"
                  >
                    <Eye size={14} />
                    View
                  </Link>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
