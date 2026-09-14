"use client";

import { useState } from "react";
import { User, ShieldCheck, Building2, Key, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export function PersonalInfoTab({ profile, onUpdateProfile }) {
  const [formData, setFormData] = useState({
    firstName: profile.firstName || "Sayan",
    lastName: profile.lastName || "Mukherjee",
    email: profile.email || "sayan.mukherjee@gmail.com",
    phone: profile.phone || "+91 98320 45678",
    businessName: profile.businessName || "Sayan Media & Creative Studio",
    gstin: profile.gstin || "19AAECS1234M1Z5",
  });

  const [savedSuccess, setSavedSuccess] = useState(false);
  const [securityModal, setSecurityModal] = useState(false);
  const [passwordState, setPasswordState] = useState({ current: "", new: "", confirm: "" });

  function handleSubmit(e) {
    e.preventDefault();
    if (onUpdateProfile) {
      onUpdateProfile({
        ...profile,
        ...formData,
        name: `${formData.firstName} ${formData.lastName}`.trim(),
      });
    }
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  }

  function handlePasswordSubmit(e) {
    e.preventDefault();
    if (!passwordState.current || !passwordState.new) {
      alert("Please fill in both current and new password.");
      return;
    }
    if (passwordState.new !== passwordState.confirm) {
      alert("New password and confirm password do not match.");
      return;
    }
    alert("Password updated successfully!");
    setSecurityModal(false);
    setPasswordState({ current: "", new: "", confirm: "" });
  }

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div>
        <h3 className="font-serif text-xl font-medium text-foreground">
          Personal & Account Information
        </h3>
        <p className="mt-0.5 text-xs text-muted-foreground">
          Manage your personal details, contact number for delivery SMS, and business GSTIN.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Personal Details Section */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <div className="flex items-center gap-2 border-b border-border/80 pb-4">
            <User size={16} className="text-(--brand)" />
            <h4 className="text-sm font-semibold text-foreground">Personal Details</h4>
          </div>

          <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="text-xs font-medium text-foreground">First Name</label>
              <input
                type="text"
                required
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                className="mt-1.5 w-full rounded-xl border border-border bg-background p-2.5 text-xs text-foreground focus:border-(--brand) focus:outline-none focus:ring-1 focus:ring-(--brand)"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-foreground">Last Name</label>
              <input
                type="text"
                required
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                className="mt-1.5 w-full rounded-xl border border-border bg-background p-2.5 text-xs text-foreground focus:border-(--brand) focus:outline-none focus:ring-1 focus:ring-(--brand)"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-foreground">Email Address</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="mt-1.5 w-full rounded-xl border border-border bg-background p-2.5 text-xs text-foreground focus:border-(--brand) focus:outline-none focus:ring-1 focus:ring-(--brand)"
              />
              <p className="mt-1 text-[11px] text-muted-foreground">Used for digital print proofs and invoices.</p>
            </div>

            <div>
              <label className="text-xs font-medium text-foreground">Phone Number</label>
              <input
                type="text"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="mt-1.5 w-full rounded-xl border border-border bg-background p-2.5 text-xs text-foreground focus:border-(--brand) focus:outline-none focus:ring-1 focus:ring-(--brand)"
              />
              <p className="mt-1 text-[11px] text-muted-foreground">Used for delivery courier coordination.</p>
            </div>
          </div>
        </div>

        {/* Corporate & GST Details Section */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <div className="flex items-center justify-between border-b border-border/80 pb-4">
            <div className="flex items-center gap-2">
              <Building2 size={16} className="text-(--brand)" />
              <h4 className="text-sm font-semibold text-foreground">Business & GSTIN (Optional)</h4>
            </div>
            <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-medium text-emerald-700 border border-emerald-200">
              B2B Tax Credit
            </span>
          </div>

          <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="text-xs font-medium text-foreground">Company / Studio / Firm Name</label>
              <input
                type="text"
                value={formData.businessName}
                onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                placeholder="e.g. Acme Tech Solutions Pvt Ltd"
                className="mt-1.5 w-full rounded-xl border border-border bg-background p-2.5 text-xs text-foreground placeholder:text-muted-foreground focus:border-(--brand) focus:outline-none focus:ring-1 focus:ring-(--brand)"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-foreground">GSTIN (15 Digits)</label>
              <input
                type="text"
                value={formData.gstin}
                onChange={(e) => setFormData({ ...formData, gstin: e.target.value.toUpperCase() })}
                placeholder="e.g. 19AAECS1234M1Z5"
                className="mt-1.5 w-full rounded-xl border border-border bg-background p-2.5 text-xs font-mono uppercase text-foreground placeholder:text-muted-foreground focus:border-(--brand) focus:outline-none focus:ring-1 focus:ring-(--brand)"
              />
            </div>
          </div>
          <p className="mt-3 text-[11px] text-muted-foreground">
            Providing your registered GSTIN ensures all commercial printing, ID cards, and corporate
            gift purchases generate a valid B2B tax invoice with eligible input credit.
          </p>
        </div>

        {/* Save Bar */}
        <div className="flex items-center justify-between">
          <div>
            {savedSuccess && (
              <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-700">
                <CheckCircle2 size={14} />
                Profile updated successfully!
              </span>
            )}
          </div>
          <Button type="submit" size="sm" className="rounded-full px-6 py-2 text-xs">
            Save Profile Changes
          </Button>
        </div>
      </form>

      {/* Security & Password Section */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <div className="flex items-center justify-between border-b border-border/80 pb-4">
          <div className="flex items-center gap-2">
            <Key size={16} className="text-(--brand)" />
            <div>
              <h4 className="text-sm font-semibold text-foreground">Password & Security</h4>
              <p className="text-[11px] text-muted-foreground">
                Manage your credentials and login safety.
              </p>
            </div>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="rounded-full text-xs"
            onClick={() => setSecurityModal(true)}
          >
            Change Password
          </Button>
        </div>

        <div className="mt-4 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <ShieldCheck size={16} className="text-emerald-600" />
            <span className="text-foreground">Two-Factor Authentication (OTP via WhatsApp/SMS)</span>
          </div>
          <span className="font-semibold text-emerald-700">Active</span>
        </div>
      </div>

      {/* Password Change Modal */}
      {securityModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-2xl">
            <h3 className="font-serif text-xl font-medium text-foreground">Change Password</h3>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Choose a strong password with at least 8 characters.
            </p>

            <form onSubmit={handlePasswordSubmit} className="mt-4 space-y-3 text-xs">
              <div>
                <label className="font-medium text-foreground">Current Password</label>
                <input
                  type="password"
                  required
                  value={passwordState.current}
                  onChange={(e) => setPasswordState({ ...passwordState, current: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-border bg-background p-2.5 text-foreground focus:border-(--brand) focus:outline-none"
                />
              </div>

              <div>
                <label className="font-medium text-foreground">New Password</label>
                <input
                  type="password"
                  required
                  value={passwordState.new}
                  onChange={(e) => setPasswordState({ ...passwordState, new: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-border bg-background p-2.5 text-foreground focus:border-(--brand) focus:outline-none"
                />
              </div>

              <div>
                <label className="font-medium text-foreground">Confirm New Password</label>
                <input
                  type="password"
                  required
                  value={passwordState.confirm}
                  onChange={(e) => setPasswordState({ ...passwordState, confirm: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-border bg-background p-2.5 text-foreground focus:border-(--brand) focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="rounded-full text-xs"
                  onClick={() => setSecurityModal(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" size="sm" className="rounded-full text-xs">
                  Update Password
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
