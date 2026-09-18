"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Save } from "lucide-react";
import { api, ApiRequestError } from "@/lib/api";

const STATUS_OPTIONS = ["PENDING", "IN_PRODUCTION", "SHIPPED", "DELIVERED", "CANCELLED"];

function toDateInputValue(iso) {
  return iso ? new Date(iso).toISOString().slice(0, 10) : "";
}

export function OrderStatusForm({ order }) {
  const router = useRouter();
  const [status, setStatus] = useState(order.status);
  const [shippingCarrier, setShippingCarrier] = useState(order.shippingCarrier ?? "");
  const [trackingNumber, setTrackingNumber] = useState(order.trackingNumber ?? "");
  const [estimatedDelivery, setEstimatedDelivery] = useState(toDateInputValue(order.estimatedDelivery));
  const [isPaid, setIsPaid] = useState(order.isPaid);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setSaving(true);
    setError("");
    setSaved(false);
    try {
      await api.updateOrder(order.id, {
        status,
        shippingCarrier: shippingCarrier.trim() || null,
        trackingNumber: trackingNumber.trim() || null,
        estimatedDelivery: estimatedDelivery || null,
        isPaid,
      });
      setSaved(true);
      router.refresh();
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      setError(err instanceof ApiRequestError ? err.message : "Failed to update order.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-lg border border-border bg-card p-5">
      <h2 className="mb-4 text-sm font-semibold text-foreground">Manage Order</h2>

      {error && (
        <p className="mb-3 rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </p>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="text-xs font-medium text-muted-foreground">Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="mt-1 w-full rounded-md border border-border bg-background p-2.5 text-sm text-foreground focus:border-brand focus:outline-none"
          >
            {STATUS_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option.replace("_", " ")}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-end">
          <label className="flex items-center gap-2 text-sm text-foreground">
            <input
              type="checkbox"
              checked={isPaid}
              onChange={(e) => setIsPaid(e.target.checked)}
              className="rounded border-border"
            />
            Payment received
          </label>
        </div>

        <div>
          <label className="text-xs font-medium text-muted-foreground">Shipping Carrier</label>
          <input
            type="text"
            value={shippingCarrier}
            onChange={(e) => setShippingCarrier(e.target.value)}
            placeholder="India Post, Blue Dart…"
            className="mt-1 w-full rounded-md border border-border bg-background p-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-brand focus:outline-none"
          />
        </div>

        <div>
          <label className="text-xs font-medium text-muted-foreground">Tracking Number</label>
          <input
            type="text"
            value={trackingNumber}
            onChange={(e) => setTrackingNumber(e.target.value)}
            placeholder="AWB / consignment number"
            className="mt-1 w-full rounded-md border border-border bg-background p-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-brand focus:outline-none"
          />
        </div>

        <div>
          <label className="text-xs font-medium text-muted-foreground">Estimated Delivery</label>
          <input
            type="date"
            value={estimatedDelivery}
            onChange={(e) => setEstimatedDelivery(e.target.value)}
            className="mt-1 w-full rounded-md border border-border bg-background p-2.5 text-sm text-foreground focus:border-brand focus:outline-none"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={saving}
        className="mt-5 flex items-center gap-1.5 rounded-md bg-brand px-4 py-2 text-sm font-medium text-brand-foreground hover:opacity-90 disabled:opacity-50"
      >
        <Save size={15} />
        {saving ? "Saving…" : saved ? "Saved!" : "Save Changes"}
      </button>
    </form>
  );
}
