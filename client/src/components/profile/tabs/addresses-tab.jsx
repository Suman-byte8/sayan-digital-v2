"use client";

import { useState } from "react";
import { MapPin, Plus, Edit2, Trash2, CheckCircle2, ShieldCheck, Home, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";

export function AddressesTab({ addresses, onCreate, onUpdate, onDelete, onSetDefault }) {
  const [showModal, setShowModal] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  // Form State
  const [formData, setFormData] = useState({
    label: "Home",
    recipientName: "",
    phone: "",
    addressLine1: "",
    addressLine2: "",
    city: "Malda",
    state: "West Bengal",
    pincode: "",
    isDefaultShipping: false,
  });

  function handleOpenAdd() {
    setEditingAddress(null);
    setFormData({
      label: "Home",
      recipientName: "",
      phone: "+91 ",
      addressLine1: "",
      addressLine2: "",
      city: "Malda",
      state: "West Bengal",
      pincode: "732101",
      isDefaultShipping: addresses.length === 0,
    });
    setShowModal(true);
  }

  function handleOpenEdit(addr) {
    setEditingAddress(addr);
    setFormData({
      label: addr.label,
      recipientName: addr.recipientName,
      phone: addr.phone,
      addressLine1: addr.addressLine1,
      addressLine2: addr.addressLine2 ?? "",
      city: addr.city,
      state: addr.state,
      pincode: addr.pincode,
      isDefaultShipping: addr.isDefaultShipping,
    });
    setShowModal(true);
  }

  async function handleSetDefault(id) {
    await onSetDefault(id);
  }

  async function handleDelete(id) {
    if (confirm("Are you sure you want to remove this delivery address?")) {
      await onDelete(id);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!formData.recipientName || !formData.addressLine1 || !formData.pincode) {
      setFormError("Please fill in recipient name, street address, and pincode.");
      return;
    }

    setSaving(true);
    setFormError("");
    try {
      if (editingAddress) {
        await onUpdate(editingAddress.id, formData);
      } else {
        await onCreate(formData);
      }
      setShowModal(false);
    } catch (error) {
      setFormError(error.message || "Failed to save address.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="font-serif text-xl font-medium text-foreground">
            Saved Delivery Addresses
          </h3>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Manage your personal delivery locations and corporate dispatch destinations.
          </p>
        </div>

        <Button
          onClick={handleOpenAdd}
          size="sm"
          className="h-auto gap-1.5 rounded-full px-4 py-2 text-xs"
        >
          <Plus size={14} />
          Add New Address
        </Button>
      </div>

      {/* Address cards grid */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {addresses.map((addr) => (
          <div
            key={addr.id}
            className={`relative flex flex-col justify-between rounded-2xl border bg-card p-5 shadow-sm transition-all duration-200 hover:shadow-md ${
              addr.isDefaultShipping
                ? "border-(--brand)/50 ring-1 ring-(--brand)/20"
                : "border-border"
            }`}
          >
            <div>
              {/* Badge & Label */}
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="flex size-7 items-center justify-center rounded-lg bg-(--paper-muted) text-(--brand)">
                    {addr.label.toLowerCase().includes("office") ||
                    addr.label.toLowerCase().includes("studio") ? (
                      <Briefcase size={14} />
                    ) : (
                      <Home size={14} />
                    )}
                  </div>
                  <span className="font-semibold text-xs text-foreground">{addr.label}</span>
                </div>

                {addr.isDefaultShipping && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-(--brand)/10 px-2.5 py-0.5 text-[10px] font-medium text-(--brand)">
                    <CheckCircle2 size={11} />
                    Default
                  </span>
                )}
              </div>

              {/* Recipient & Full Address */}
              <div className="mt-4 space-y-1 text-xs">
                <p className="font-semibold text-foreground text-sm">{addr.recipientName}</p>
                <p className="text-muted-foreground">{addr.addressLine1}</p>
                {addr.addressLine2 && <p className="text-muted-foreground">{addr.addressLine2}</p>}
                <p className="text-foreground">
                  {addr.city}, {addr.state} —{" "}
                  <span className="font-mono font-medium">{addr.pincode}</span>
                </p>
                <p className="pt-1.5 text-muted-foreground">
                  Phone: <span className="font-medium text-foreground">{addr.phone}</span>
                </p>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="mt-5 flex items-center justify-between border-t border-border/70 pt-3 text-xs">
              <div>
                {!addr.isDefaultShipping && (
                  <button
                    type="button"
                    onClick={() => handleSetDefault(addr.id)}
                    className="text-(--brand) hover:underline text-[11px] font-medium"
                  >
                    Set as Default
                  </button>
                )}
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => handleOpenEdit(addr)}
                  className="inline-flex items-center gap-1 text-muted-foreground transition-colors hover:text-foreground"
                >
                  <Edit2 size={12} />
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(addr.id)}
                  className="inline-flex items-center gap-1 text-muted-foreground transition-colors hover:text-destructive"
                >
                  <Trash2 size={12} />
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Address Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl border border-border bg-card p-6 shadow-2xl">
            <h3 className="font-serif text-xl font-medium text-foreground">
              {editingAddress ? "Edit Delivery Address" : "Add New Delivery Address"}
            </h3>
            <p className="mt-0.5 text-xs text-muted-foreground">
              For pan-Bengal express shipping & customized product dispatch.
            </p>

            <form onSubmit={handleSubmit} className="mt-5 space-y-4 text-xs">
              {formError && (
                <p className="rounded-lg bg-destructive/10 px-3 py-2 text-destructive">{formError}</p>
              )}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-medium text-foreground">Address Type</label>
                  <select
                    value={formData.label}
                    onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-border bg-background p-2.5 text-foreground focus:border-(--brand) focus:outline-none"
                  >
                    <option value="Home">Home</option>
                    <option value="Office / Studio">Office / Studio</option>
                    <option value="Storefront">Storefront</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="font-medium text-foreground">Contact Phone</label>
                  <input
                    type="text"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 98320 XXXXX"
                    className="mt-1 w-full rounded-xl border border-border bg-background p-2.5 text-foreground placeholder:text-muted-foreground focus:border-(--brand) focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="font-medium text-foreground">Recipient / Company Name</label>
                <input
                  type="text"
                  required
                  value={formData.recipientName}
                  onChange={(e) => setFormData({ ...formData, recipientName: e.target.value })}
                  placeholder="e.g. Sayan Mukherjee"
                  className="mt-1 w-full rounded-xl border border-border bg-background p-2.5 text-foreground placeholder:text-muted-foreground focus:border-(--brand) focus:outline-none"
                />
              </div>

              <div>
                <label className="font-medium text-foreground">Street Address / House / Flat</label>
                <input
                  type="text"
                  required
                  value={formData.addressLine1}
                  onChange={(e) => setFormData({ ...formData, addressLine1: e.target.value })}
                  placeholder="Flat No, Building Name, Road"
                  className="mt-1 w-full rounded-xl border border-border bg-background p-2.5 text-foreground placeholder:text-muted-foreground focus:border-(--brand) focus:outline-none"
                />
              </div>

              <div>
                <label className="font-medium text-foreground">Landmark / Area (Optional)</label>
                <input
                  type="text"
                  value={formData.addressLine2}
                  onChange={(e) => setFormData({ ...formData, addressLine2: e.target.value })}
                  placeholder="Near Netaji Statue, Rathbari More"
                  className="mt-1 w-full rounded-xl border border-border bg-background p-2.5 text-foreground placeholder:text-muted-foreground focus:border-(--brand) focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-medium text-foreground">City</label>
                  <input
                    type="text"
                    required
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-border bg-background p-2.5 text-foreground focus:border-(--brand) focus:outline-none"
                  />
                </div>
                <div>
                  <label className="font-medium text-foreground">State</label>
                  <input
                    type="text"
                    required
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-border bg-background p-2.5 text-foreground focus:border-(--brand) focus:outline-none"
                  />
                </div>
                <div>
                  <label className="font-medium text-foreground">Pincode</label>
                  <input
                    type="text"
                    required
                    value={formData.pincode}
                    onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                    placeholder="732101"
                    className="mt-1 w-full rounded-xl border border-border bg-background p-2.5 text-foreground focus:border-(--brand) focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="isDefaultShipping"
                  checked={formData.isDefaultShipping}
                  onChange={(e) =>
                    setFormData({ ...formData, isDefaultShipping: e.target.checked })
                  }
                  className="rounded border-border text-(--brand) focus:ring-(--brand)"
                />
                <label htmlFor="isDefaultShipping" className="text-xs text-foreground">
                  Set as default shipping address
                </label>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="rounded-full text-xs"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" size="sm" disabled={saving} className="rounded-full text-xs">
                  {saving ? "Saving…" : "Save Address"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
