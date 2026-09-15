"use client";

import { useState } from "react";
import { CreditCard, QrCode, Building2, Plus, CheckCircle2, Trash2, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

export function PaymentsTab({ paymentMethods: methods, onAdd, onRemove, onSetPrimary }) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [newVpa, setNewVpa] = useState("");
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleRemove(id) {
    if (confirm("Remove this payment method?")) {
      await onRemove(id);
    }
  }

  async function handleSetPrimary(id) {
    await onSetPrimary(id);
  }

  async function handleAddUpi(e) {
    e.preventDefault();
    if (!newVpa.includes("@")) {
      setFormError("Please enter a valid UPI ID (e.g. yourname@okhdfcbank).");
      return;
    }

    setSaving(true);
    setFormError("");
    try {
      await onAdd({
        type: "upi",
        title: "Saved UPI VPA",
        detail: newVpa.trim(),
        isPrimary: methods.length === 0,
        badge: "UPI",
      });
      setNewVpa("");
      setShowAddModal(false);
    } catch (error) {
      setFormError(error.message || "Failed to save UPI ID.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="font-serif text-xl font-medium text-foreground">
            Payment Methods & Billing
          </h3>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Saved UPI IDs, cards, and tax details for seamless one-click printing checkouts.
          </p>
        </div>

        <Button
          onClick={() => setShowAddModal(true)}
          size="sm"
          className="h-auto gap-1.5 rounded-full px-4 py-2 text-xs"
        >
          <Plus size={14} />
          Add UPI / Card
        </Button>
      </div>

      {/* Payment methods list */}
      <div className="space-y-4">
        {methods.map((method) => {
          return (
            <div
              key={method.id}
              className={`flex flex-col justify-between gap-4 rounded-2xl border bg-card p-5 shadow-sm transition-all sm:flex-row sm:items-center ${
                method.isPrimary
                  ? "border-(--brand)/40 ring-1 ring-(--brand)/20"
                  : "border-border"
              }`}
            >
              <div className="flex items-center gap-3.5">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-(--paper-muted) text-(--brand)">
                  {method.type === "upi" ? (
                    <QrCode size={18} />
                  ) : method.type === "card" ? (
                    <CreditCard size={18} />
                  ) : (
                    <Building2 size={18} />
                  )}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-semibold text-foreground">{method.title}</h4>
                    <span className="rounded-full bg-(--paper-muted) px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                      {method.badge}
                    </span>
                    {method.isPrimary && (
                      <span className="rounded-full bg-(--brand)/10 px-2 py-0.5 text-[10px] font-medium text-(--brand)">
                        Primary
                      </span>
                    )}
                  </div>
                  <p className="mt-0.5 font-mono text-xs text-muted-foreground">{method.detail}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-xs self-end sm:self-auto">
                {!method.isPrimary && (
                  <button
                    type="button"
                    onClick={() => handleSetPrimary(method.id)}
                    className="text-(--brand) hover:underline text-[11px] font-medium"
                  >
                    Make Primary
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => handleRemove(method.id)}
                  className="text-muted-foreground hover:text-destructive transition-colors"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Security Note */}
      <div className="flex items-start gap-3 rounded-2xl border border-border/80 bg-(--paper-muted) p-4 text-xs text-muted-foreground">
        <ShieldCheck size={18} className="shrink-0 text-emerald-700 mt-0.5" />
        <div>
          <strong className="text-foreground font-medium">A note on what&rsquo;s saved here:</strong>{" "}
          These are personal reference labels for your own convenience — not connected to a payment
          processor. Please never enter a full card number or CVV; use a masked reference (e.g.
          &ldquo;•••• 4892&rdquo;) instead.
        </div>
      </div>

      {/* Add UPI Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-2xl">
            <h3 className="font-serif text-xl font-medium text-foreground">Add New UPI VPA</h3>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Save your Google Pay, PhonePe, or BHIM UPI ID for fast checkout.
            </p>

            <form onSubmit={handleAddUpi} className="mt-4 space-y-4 text-xs">
              {formError && (
                <p className="rounded-lg bg-destructive/10 px-3 py-2 text-destructive">{formError}</p>
              )}
              <div>
                <label className="font-medium text-foreground">Virtual Payment Address (UPI ID)</label>
                <input
                  type="text"
                  required
                  value={newVpa}
                  onChange={(e) => setNewVpa(e.target.value)}
                  placeholder="e.g. mobileNumber@upi or name@okhdfcbank"
                  className="mt-1.5 w-full rounded-xl border border-border bg-background p-2.5 text-foreground placeholder:text-muted-foreground focus:border-(--brand) focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="rounded-full text-xs"
                  onClick={() => setShowAddModal(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" size="sm" disabled={saving} className="rounded-full text-xs">
                  {saving ? "Saving…" : "Save UPI ID"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
