"use client";

import { useState } from "react";
import { MessageCircle, Bell, Mail, Sparkles, CheckCircle2 } from "lucide-react";

export function NotificationsTab({ notifications: initialNotifications }) {
  const [settings, setSettings] = useState(initialNotifications);
  const [savedBadge, setSavedBadge] = useState(false);

  function toggle(key) {
    setSettings((prev) => {
      const updated = { ...prev, [key]: !prev[key] };
      setSavedBadge(true);
      setTimeout(() => setSavedBadge(false), 2000);
      return updated;
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-serif text-xl font-medium text-foreground">
            Notification & Communication Preferences
          </h3>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Control how Sayan Digital sends you order tracking, artwork proof alerts, and offers.
          </p>
        </div>

        {savedBadge && (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 border border-emerald-200">
            <CheckCircle2 size={13} />
            Preferences Saved
          </span>
        )}
      </div>

      <div className="divide-y divide-border/70 rounded-2xl border border-border bg-card shadow-sm">
        {/* WhatsApp updates */}
        <div className="flex items-center justify-between p-5">
          <div className="flex items-start gap-3.5">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200">
              <MessageCircle size={18} />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-foreground">WhatsApp Order Tracking</h4>
              <p className="mt-0.5 max-w-md text-xs text-muted-foreground">
                Receive instant WhatsApp dispatch updates, out-for-delivery alerts, and courier tracking
                links directly on your registered phone number.
              </p>
            </div>
          </div>

          <label className="relative inline-flex cursor-pointer items-center">
            <input
              type="checkbox"
              checked={settings.orderUpdatesWhatsapp}
              onChange={() => toggle("orderUpdatesWhatsapp")}
              className="peer sr-only"
            />
            <div className="peer h-6 w-11 rounded-full bg-muted after:absolute after:left-[2px] after:top-[2px] after:size-5 after:rounded-full after:border after:border-border after:bg-white after:transition-all after:content-[''] peer-checked:bg-emerald-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none" />
          </label>
        </div>

        {/* Digital Proof email/SMS alerts */}
        <div className="flex items-center justify-between p-5">
          <div className="flex items-start gap-3.5">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-(--brand)/10 text-(--brand)">
              <Bell size={18} />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-foreground">
                Digital Print Proof Approvals
              </h4>
              <p className="mt-0.5 max-w-md text-xs text-muted-foreground">
                Receive immediate high-priority alerts when our studio designer uploads your custom mug,
                ID card, or trophy layout mockup for approval.
              </p>
            </div>
          </div>

          <label className="relative inline-flex cursor-pointer items-center">
            <input
              type="checkbox"
              checked={settings.designProofAlerts}
              onChange={() => toggle("designProofAlerts")}
              className="peer sr-only"
            />
            <div className="peer h-6 w-11 rounded-full bg-muted after:absolute after:left-[2px] after:top-[2px] after:size-5 after:rounded-full after:border after:border-border after:bg-white after:transition-all after:content-[''] peer-checked:bg-(--brand) peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none" />
          </label>
        </div>

        {/* SMS delivery alerts */}
        <div className="flex items-center justify-between p-5">
          <div className="flex items-start gap-3.5">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-(--paper-muted) text-foreground">
              <Mail size={18} />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-foreground">SMS Delivery PIN & Alerts</h4>
              <p className="mt-0.5 max-w-md text-xs text-muted-foreground">
                Standard SMS containing courier delivery verification codes, OTPs, and tax invoice download
                links.
              </p>
            </div>
          </div>

          <label className="relative inline-flex cursor-pointer items-center">
            <input
              type="checkbox"
              checked={settings.deliverySms}
              onChange={() => toggle("deliverySms")}
              className="peer sr-only"
            />
            <div className="peer h-6 w-11 rounded-full bg-muted after:absolute after:left-[2px] after:top-[2px] after:size-5 after:rounded-full after:border after:border-border after:bg-white after:transition-all after:content-[''] peer-checked:bg-(--brand) peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none" />
          </label>
        </div>

        {/* Festive offers & bulk quotes */}
        <div className="flex items-center justify-between p-5">
          <div className="flex items-start gap-3.5">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-700 border border-amber-200">
              <Sparkles size={18} />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-foreground">
                Festive Gifting & Corporate Discounts
              </h4>
              <p className="mt-0.5 max-w-md text-xs text-muted-foreground">
                Occasional announcements for Durga Puja, Diwali, New Year corporate gifting combos, and bulk
                printing rate drops.
              </p>
            </div>
          </div>

          <label className="relative inline-flex cursor-pointer items-center">
            <input
              type="checkbox"
              checked={settings.festiveDiscountAlerts}
              onChange={() => toggle("festiveDiscountAlerts")}
              className="peer sr-only"
            />
            <div className="peer h-6 w-11 rounded-full bg-muted after:absolute after:left-[2px] after:top-[2px] after:size-5 after:rounded-full after:border after:border-border after:bg-white after:transition-all after:content-[''] peer-checked:bg-(--brand) peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none" />
          </label>
        </div>
      </div>
    </div>
  );
}
