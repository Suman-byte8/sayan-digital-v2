import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Mail, Phone, Building2, FileText, Coins } from "lucide-react";
import { api, ApiRequestError } from "@/lib/api";
import { DeleteCustomerButton } from "@/components/customers/delete-customer-button";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Customer — Sayan Digital Admin",
};

const currencyFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

const dateFormatter = new Intl.DateTimeFormat("en-IN", { dateStyle: "medium" });
const dateTimeFormatter = new Intl.DateTimeFormat("en-IN", { dateStyle: "medium", timeStyle: "short" });

const ORDER_STATUS_STYLES = {
  PENDING: "bg-muted text-muted-foreground",
  IN_PRODUCTION: "bg-amber-100 text-amber-700",
  SHIPPED: "bg-blue-100 text-blue-700",
  DELIVERED: "bg-green-100 text-green-700",
  CANCELLED: "bg-red-100 text-red-700",
};

const PROOF_STATUS_STYLES = {
  PENDING: "bg-amber-100 text-amber-700",
  APPROVED: "bg-green-100 text-green-700",
  REJECTED: "bg-red-100 text-red-700",
};

function initialsOf(name) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default async function CustomerDetailPage({ params }) {
  const { id } = await params;

  let customer;
  try {
    const result = await api.getUser(id);
    customer = result.data;
  } catch (error) {
    if (error instanceof ApiRequestError && error.status === 404) {
      notFound();
    }
    return (
      <p className="rounded-md border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
        {error instanceof ApiRequestError ? error.message : "Failed to load customer."}
      </p>
    );
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <Link
          href="/customers"
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft size={15} />
          Back to customers
        </Link>
        <DeleteCustomerButton id={customer.id} name={customer.name} />
      </div>

      {/* Identity card */}
      <div className="flex flex-col gap-6 rounded-lg border border-border bg-card p-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          {customer.avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element -- arbitrary uploaded/external URL
            <img
              src={customer.avatarUrl}
              alt={customer.name}
              className="size-16 rounded-full border border-border object-cover"
            />
          ) : (
            <div className="flex size-16 shrink-0 items-center justify-center rounded-full bg-brand/10 text-lg font-semibold text-brand">
              {initialsOf(customer.name)}
            </div>
          )}
          <div>
            <h1 className="text-xl font-semibold text-foreground">{customer.name}</h1>
            <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Mail size={13} />
                {customer.email}
              </span>
              {customer.phone && (
                <span className="flex items-center gap-1.5">
                  <Phone size={13} />
                  {customer.phone}
                </span>
              )}
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              Joined {dateFormatter.format(new Date(customer.createdAt))}
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          {customer.businessName && (
            <div className="rounded-md border border-border px-4 py-2 text-sm">
              <p className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                <Building2 size={12} />
                Business
              </p>
              <p className="mt-0.5 font-medium text-foreground">{customer.businessName}</p>
              {customer.gstin && <p className="text-xs text-muted-foreground">GSTIN: {customer.gstin}</p>}
            </div>
          )}
          <div className="rounded-md border border-border px-4 py-2 text-sm">
            <p className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-muted-foreground">
              <Coins size={12} />
              Loyalty
            </p>
            <p className="mt-0.5 font-medium text-foreground">
              {customer.loyaltyPoints.toLocaleString("en-IN")} pts
            </p>
          </div>
        </div>
      </div>

      {/* Orders */}
      <Section title="Orders" count={customer.orders.length}>
        {customer.orders.length === 0 ? (
          <EmptyState text="No orders yet." />
        ) : (
          <div className="divide-y divide-border">
            {customer.orders.map((order) => (
              <div key={order.id} className="py-3 first:pt-0 last:pb-0">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-foreground">{order.orderNumber}</p>
                    <p className="text-xs text-muted-foreground">
                      {dateTimeFormatter.format(new Date(order.createdAt))} · {order.items.length} item
                      {order.items.length === 1 ? "" : "s"}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-medium text-foreground">
                      {currencyFormatter.format(order.totalAmount)}
                    </span>
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-medium ${ORDER_STATUS_STYLES[order.status] ?? "bg-muted text-muted-foreground"}`}
                    >
                      {order.status.replace("_", " ")}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Section>

      {/* Addresses */}
      <Section title="Addresses" count={customer.addresses.length}>
        {customer.addresses.length === 0 ? (
          <EmptyState text="No saved addresses." />
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {customer.addresses.map((address) => (
              <div key={address.id} className="rounded-md border border-border p-3 text-sm">
                <div className="flex items-center justify-between">
                  <p className="font-medium text-foreground">{address.label}</p>
                  {address.isDefaultShipping && (
                    <span className="rounded-full bg-brand/10 px-2 py-0.5 text-[10px] font-medium text-brand">
                      Default
                    </span>
                  )}
                </div>
                <p className="mt-1 text-muted-foreground">
                  {address.addressLine1}
                  {address.addressLine2 ? `, ${address.addressLine2}` : ""}
                </p>
                <p className="text-muted-foreground">
                  {address.city}, {address.state} {address.pincode}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">{address.phone}</p>
              </div>
            ))}
          </div>
        )}
      </Section>

      {/* Wishlist */}
      <Section title="Wishlist" count={customer.wishlistItems.length}>
        {customer.wishlistItems.length === 0 ? (
          <EmptyState text="Nothing saved to the wishlist." />
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {customer.wishlistItems.map((item) => (
              <Link
                key={item.id}
                href={`/products/${item.product?.id ?? ""}`}
                className="flex items-center gap-3 rounded-md border border-border p-3 text-sm hover:bg-muted/50"
              >
                {item.product?.images?.[0] ? (
                  // eslint-disable-next-line @next/next/no-img-element -- arbitrary uploaded/external URL
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    className="size-10 shrink-0 rounded-md border border-border object-cover"
                  />
                ) : (
                  <div className="size-10 shrink-0 rounded-md border border-dashed border-border" />
                )}
                <p className="truncate font-medium text-foreground">
                  {item.product?.name ?? "(product no longer exists)"}
                </p>
              </Link>
            ))}
          </div>
        )}
      </Section>

      {/* Payment methods */}
      <Section title="Payment methods" count={customer.paymentMethods.length}>
        {customer.paymentMethods.length === 0 ? (
          <EmptyState text="No payment methods saved." />
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {customer.paymentMethods.map((method) => (
              <div key={method.id} className="rounded-md border border-border p-3 text-sm">
                <div className="flex items-center justify-between">
                  <p className="font-medium text-foreground">{method.title}</p>
                  {method.isPrimary && (
                    <span className="rounded-full bg-brand/10 px-2 py-0.5 text-[10px] font-medium text-brand">
                      Primary
                    </span>
                  )}
                </div>
                <p className="mt-1 text-muted-foreground">{method.detail}</p>
              </div>
            ))}
          </div>
        )}
      </Section>

      {/* Proofs */}
      <Section title="Print proofs" count={customer.proofs.length}>
        {customer.proofs.length === 0 ? (
          <EmptyState text="No design proofs submitted." />
        ) : (
          <div className="divide-y divide-border">
            {customer.proofs.map((proof) => (
              <div key={proof.id} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
                <div className="flex items-center gap-2">
                  <FileText size={14} className="text-muted-foreground" />
                  <div>
                    <p className="font-medium text-foreground">{proof.title}</p>
                    <p className="text-xs text-muted-foreground">{proof.product}</p>
                  </div>
                </div>
                <span
                  className={`rounded-full px-2 py-0.5 text-xs font-medium ${PROOF_STATUS_STYLES[proof.status] ?? "bg-muted text-muted-foreground"}`}
                >
                  {proof.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </Section>
    </div>
  );
}

function Section({ title, count, children }) {
  return (
    <div className="mt-6">
      <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-foreground">
        {title}
        <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
          {count}
        </span>
      </h2>
      <div className="rounded-lg border border-border bg-card p-4">{children}</div>
    </div>
  );
}

function EmptyState({ text }) {
  return <p className="py-2 text-sm text-muted-foreground">{text}</p>;
}
