"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Package,
  Search,
  Truck,
  CheckCircle2,
  Clock,
  Download,
  ExternalLink,
  ChevronRight,
  RotateCcw,
  Copy,
  Check,
  FileCheck,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export function OrdersTab({ orders, onSelectTab }) {
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedId, setCopiedId] = useState(null);

  const filteredOrders = orders.filter((order) => {
    // Filter status
    if (filter === "active" && order.status !== "in-production" && order.status !== "shipped") {
      return false;
    }
    if (filter === "in-production" && order.status !== "in-production") {
      return false;
    }
    if (filter === "shipped" && order.status !== "shipped") {
      return false;
    }
    if (filter === "delivered" && order.status !== "delivered") {
      return false;
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchId = order.id.toLowerCase().includes(q);
      const matchCarrier = order.shippingCarrier?.toLowerCase().includes(q);
      const matchItem = order.items.some((item) =>
        item.name.toLowerCase().includes(q) || item.customization?.toLowerCase().includes(q)
      );
      return matchId || matchCarrier || matchItem;
    }
    return true;
  });

  function handleCopyTracking(id, trackNum) {
    navigator.clipboard.writeText(trackNum);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  }

  return (
    <div className="space-y-6">
      {/* Top Filter & Search Controls */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-1.5 rounded-xl border border-border bg-(--paper-muted) p-1 text-xs">
          {[
            { id: "all", label: "All Orders", count: orders.length },
            {
              id: "active",
              label: "Active & In-Transit",
              count: orders.filter((o) => o.status === "in-production" || o.status === "shipped").length,
            },
            {
              id: "delivered",
              label: "Delivered",
              count: orders.filter((o) => o.status === "delivered").length,
            },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setFilter(tab.id)}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 font-medium transition-all ${
                filter === tab.id
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`rounded-full px-1.5 py-0.2 text-[10px] ${
                  filter === tab.id
                    ? "bg-(--brand)/10 text-(--brand)"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Order ID or item..."
            className="w-full rounded-xl border border-border bg-card py-2 pl-9 pr-3 text-xs text-foreground placeholder:text-muted-foreground focus:border-(--brand) focus:outline-none focus:ring-1 focus:ring-(--brand)"
          />
        </div>
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card/50 p-12 text-center">
          <div className="flex size-14 items-center justify-center rounded-full bg-(--paper-muted) text-muted-foreground">
            <Package size={24} />
          </div>
          <h3 className="mt-4 font-serif text-lg text-foreground">No orders found</h3>
          <p className="mt-1 text-xs text-muted-foreground">
            {searchQuery
              ? "No orders match your search term. Try a different keyword."
              : "You don't have any orders under this filter category."}
          </p>
          <Button
            variant="outline"
            className="mt-5 rounded-full text-xs"
            onClick={() => {
              setFilter("all");
              setSearchQuery("");
            }}
          >
            Clear Filters
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => {
            const isDelivered = order.status === "delivered";
            const isShipped = order.status === "shipped";
            const isInProduction = order.status === "in-production";
            const isPending = order.status === "pending";
            const isCancelled = order.status === "cancelled";

            return (
              <div
                key={order.id}
                className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all duration-200 hover:border-(--brand)/30 hover:shadow-md"
              >
                {/* Card Header Bar */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/80 bg-(--paper-muted)/60 px-5 py-3.5 sm:px-6">
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs">
                    <div>
                      <span className="text-muted-foreground">Order </span>
                      <span className="font-semibold text-foreground">#{order.id}</span>
                    </div>
                    <span className="text-border">·</span>
                    <span className="text-muted-foreground">Placed on {order.date}</span>
                    <span className="text-border">·</span>
                    <span className="text-muted-foreground">{order.paymentMethod}</span>
                  </div>

                  {/* Status Badge */}
                  <div className="flex items-center gap-2">
                    {isPending && (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-500/10 px-3 py-1 text-[11px] font-medium text-slate-700 dark:text-slate-400">
                        <Clock size={12} />
                        Order Received
                      </span>
                    )}
                    {isCancelled && (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-red-500/10 px-3 py-1 text-[11px] font-medium text-red-700 dark:text-red-400">
                        <XCircle size={12} />
                        Cancelled
                      </span>
                    )}
                    {isInProduction && (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 px-3 py-1 text-[11px] font-medium text-amber-700 dark:text-amber-400">
                        <Clock size={12} className="animate-spin" />
                        In Printing
                      </span>
                    )}
                    {isShipped && (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-500/10 px-3 py-1 text-[11px] font-medium text-blue-700 dark:text-blue-400">
                        <Truck size={12} />
                        Out for Delivery
                      </span>
                    )}
                    {isDelivered && (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-[11px] font-medium text-emerald-700 dark:text-emerald-400">
                        <CheckCircle2 size={12} />
                        Delivered
                      </span>
                    )}
                  </div>
                </div>

                {/* Tracking Progress Notice for active orders */}
                {(isInProduction || isShipped) && (
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/60 bg-blue-50/40 px-5 py-2.5 text-xs text-blue-950 sm:px-6">
                    <div className="flex items-center gap-2">
                      <Truck size={15} className="text-(--brand)" />
                      <span>
                        <strong className="font-medium text-foreground">
                          {isShipped ? "Shipped via " : "Printing Studio dispatch via "}
                          {order.shippingCarrier}
                        </strong>{" "}
                        — Est. Arrival:{" "}
                        <span className="font-semibold text-(--brand)">{order.estimatedDelivery}</span>
                      </span>
                    </div>

                    {order.trackingNumber && (
                      <button
                        type="button"
                        onClick={() => handleCopyTracking(order.id, order.trackingNumber)}
                        className="inline-flex items-center gap-1 rounded-md border border-border bg-card px-2.5 py-1 text-[11px] text-muted-foreground transition-colors hover:text-foreground"
                      >
                        {copiedId === order.id ? (
                          <>
                            <Check size={12} className="text-emerald-600" />
                            <span className="text-emerald-600 font-medium">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy size={12} />
                            <span>AWB: {order.trackingNumber}</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                )}

                {/* Items in this order */}
                <div className="divide-y divide-border/60 px-5 py-2 sm:px-6">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex items-center gap-4 py-3.5">
                      <div className="relative size-16 shrink-0 overflow-hidden rounded-xl border border-border bg-muted/40">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="size-full object-cover object-center"
                        />
                      </div>

                      <div className="min-w-0 flex-1">
                        <h4 className="truncate text-sm font-medium text-foreground">{item.name}</h4>
                        <p className="mt-0.5 text-xs text-muted-foreground">{item.customization}</p>
                        <div className="mt-1 flex items-center gap-3 text-xs">
                          <span className="text-muted-foreground">Qty: {item.qty}</span>
                          <span className="text-border">·</span>
                          <span className="font-semibold text-foreground">₹{item.price} each</span>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-sm font-semibold text-foreground">
                          ₹{item.price * item.qty}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Card Footer Actions */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border/80 bg-(--paper-muted)/30 px-5 py-3.5 sm:px-6">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">Order Total:</span>
                    <span className="font-serif text-lg font-semibold text-foreground">
                      ₹{order.totalAmount.toLocaleString("en-IN")}
                    </span>
                    <span
                      className={`text-[11px] px-2 py-0.5 rounded-full border ${
                        order.isPaid
                          ? "text-emerald-700 bg-emerald-50 border-emerald-200"
                          : "text-muted-foreground bg-muted border-border"
                      }`}
                    >
                      {order.isPaid ? "Paid" : order.paymentMethod === "COD" ? "Pay on Delivery" : "Unpaid"}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => alert(`Downloading GST Tax Invoice for Order #${order.id}...`)}
                      className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3.5 py-1.5 text-xs font-medium text-foreground shadow-sm transition-colors hover:bg-muted"
                    >
                      <Download size={13} />
                      Invoice
                    </button>

                    {isInProduction && onSelectTab && (
                      <button
                        type="button"
                        onClick={() => onSelectTab("proofs")}
                        className="inline-flex items-center gap-1.5 rounded-full border border-(--brand)/30 bg-(--brand)/5 px-3.5 py-1.5 text-xs font-medium text-(--brand) transition-colors hover:bg-(--brand)/10"
                      >
                        <FileCheck size={13} />
                        View Proof
                      </button>
                    )}

                    <Button
                      size="sm"
                      className="h-auto gap-1.5 rounded-full px-4 py-1.5 text-xs"
                      asChild
                    >
                      <Link href="/products">
                        <RotateCcw size={12} />
                        Reorder
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
