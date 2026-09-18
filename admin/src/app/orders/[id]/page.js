import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Mail, Phone, MapPin } from "lucide-react";
import { api, ApiRequestError } from "@/lib/api";
import { OrderStatusForm } from "@/components/orders/order-status-form";
import { ORDER_STATUS_STYLES } from "@/components/orders/order-table";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Order — Sayan Digital Admin",
};

const currencyFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

const dateTimeFormatter = new Intl.DateTimeFormat("en-IN", { dateStyle: "medium", timeStyle: "short" });

export default async function OrderDetailPage({ params }) {
  const { id } = await params;

  let order;
  try {
    const result = await api.getOrder(id);
    order = result.data;
  } catch (error) {
    if (error instanceof ApiRequestError && error.status === 404) {
      notFound();
    }
    return (
      <p className="rounded-md border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
        {error instanceof ApiRequestError ? error.message : "Failed to load order."}
      </p>
    );
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <Link
          href="/orders"
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft size={15} />
          Back to orders
        </Link>
        <span
          className={`rounded-full px-2.5 py-1 text-xs font-medium ${ORDER_STATUS_STYLES[order.status] ?? "bg-muted text-muted-foreground"}`}
        >
          {order.status.replace("_", " ")}
        </span>
      </div>

      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-foreground">{order.orderNumber}</h1>
          <p className="text-sm text-muted-foreground">
            Placed {dateTimeFormatter.format(new Date(order.createdAt))}
          </p>
        </div>
        <p className="text-2xl font-semibold text-foreground">
          {currencyFormatter.format(order.totalAmount)}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_360px]">
        <div className="space-y-6">
          {/* Items */}
          <div className="rounded-lg border border-border bg-card p-5">
            <h2 className="mb-3 text-sm font-semibold text-foreground">
              Items ({order.items.length})
            </h2>
            <div className="divide-y divide-border">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                  {item.image ? (
                    // eslint-disable-next-line @next/next/no-img-element -- arbitrary product image URL
                    <img
                      src={item.image}
                      alt={item.name}
                      className="size-12 rounded-md border border-border object-cover"
                    />
                  ) : (
                    <div className="size-12 shrink-0 rounded-md border border-dashed border-border" />
                  )}
                  <div className="flex-1">
                    <p className="font-medium text-foreground">{item.name}</p>
                    <p className="text-xs text-muted-foreground">
                      Qty: {item.quantity} × {currencyFormatter.format(item.price)}
                    </p>
                  </div>
                  <span className="font-medium text-foreground">
                    {currencyFormatter.format(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Management form */}
          <OrderStatusForm order={order} />
        </div>

        <div className="space-y-6">
          {/* Customer */}
          <div className="rounded-lg border border-border bg-card p-5">
            <h2 className="mb-3 text-sm font-semibold text-foreground">Customer</h2>
            <p className="font-medium text-foreground">{order.customer?.name}</p>
            <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
              <Mail size={13} />
              {order.customer?.email}
            </p>
            {order.customer?.phone && (
              <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
                <Phone size={13} />
                {order.customer.phone}
              </p>
            )}
          </div>

          {/* Shipping address */}
          <div className="rounded-lg border border-border bg-card p-5">
            <h2 className="mb-3 flex items-center gap-1.5 text-sm font-semibold text-foreground">
              <MapPin size={14} />
              Shipping Address
            </h2>
            <p className="text-sm font-medium text-foreground">{order.shippingName}</p>
            <p className="text-sm text-muted-foreground">
              {order.shippingAddressLine1}
              {order.shippingAddressLine2 ? `, ${order.shippingAddressLine2}` : ""}
            </p>
            <p className="text-sm text-muted-foreground">
              {order.shippingCity}, {order.shippingState} — {order.shippingPincode}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">{order.shippingPhone}</p>
          </div>

          {/* Payment */}
          <div className="rounded-lg border border-border bg-card p-5">
            <h2 className="mb-3 text-sm font-semibold text-foreground">Payment</h2>
            <p className="text-sm text-foreground">{order.paymentMethod ?? "—"}</p>
            <span
              className={`mt-2 inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
                order.isPaid ? "bg-green-100 text-green-700" : "bg-muted text-muted-foreground"
              }`}
            >
              {order.isPaid ? "Paid" : "Not paid yet"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
