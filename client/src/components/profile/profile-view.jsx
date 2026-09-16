"use client";

import { useEffect, useId, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import {
  User,
  Package,
  FileCheck,
  MapPin,
  Heart,
  CreditCard,
  Bell,
  LogOut,
  Camera,
  Coins,
  ShieldCheck,
  ChevronRight,
  Headphones,
  Sparkles,
} from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { useWishlist } from "@/context/wishlist-context";
import { profileApi } from "@/lib/auth-api";
import { toOrderView, toProofView, memberSinceLabel, loyaltyTier } from "@/lib/profile-view-model";
import { OrdersTab } from "@/components/profile/tabs/orders-tab";
import { ProofsTab } from "@/components/profile/tabs/proofs-tab";
import { AddressesTab } from "@/components/profile/tabs/addresses-tab";
import { PersonalInfoTab } from "@/components/profile/tabs/personal-info-tab";
import { WishlistTab } from "@/components/profile/tabs/wishlist-tab";
import { PaymentsTab } from "@/components/profile/tabs/payments-tab";
import { NotificationsTab } from "@/components/profile/tabs/notifications-tab";

const NAV_GROUPS = [
  {
    title: "Orders & Studio",
    items: [
      { id: "orders", label: "Orders & History", icon: Package, badgeKey: "activeOrders" },
      { id: "proofs", label: "Print Proof Approvals", icon: FileCheck, badgeKey: "pendingProofs" },
    ],
  },
  {
    title: "Saved Items",
    items: [
      { id: "wishlist", label: "Wishlist & Saved", icon: Heart, badgeKey: "wishlistCount" },
    ],
  },
  {
    title: "Account Settings",
    items: [
      { id: "personal-info", label: "Personal Details", icon: User },
      { id: "addresses", label: "Delivery Addresses", icon: MapPin },
      { id: "payments", label: "Payment & GSTIN", icon: CreditCard },
      { id: "notifications", label: "Notifications & Alerts", icon: Bell },
    ],
  },
];

export function ProfileView() {
  const { user, accessToken, logout, updateUser } = useAuth();
  const { items: wishlist, remove: removeWishlistItem } = useWishlist();
  // Deep-link support for the navbar's Wishlist icon (/profile?tab=wishlist)
  // — useSearchParams is SSR-aware (same value on the server render and the
  // client hydration pass), so this can seed state directly with no effect.
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState(() => searchParams.get("tab") || "orders");
  const [orders, setOrders] = useState([]);
  const [proofs, setProofs] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [avatarError, setAvatarError] = useState("");
  const avatarInputId = useId();

  useEffect(() => {
    if (!accessToken) return;

    Promise.all([
      profileApi.listOrders(accessToken),
      profileApi.listProofs(accessToken),
      profileApi.listAddresses(accessToken),
      profileApi.listPaymentMethods(accessToken),
    ])
      .then(([ordersRes, proofsRes, addressesRes, paymentsRes]) => {
        setOrders(ordersRes.data);
        setProofs(proofsRes.data);
        setAddresses(addressesRes.data);
        setPaymentMethods(paymentsRes.data);
      })
      .finally(() => setLoading(false));
  }, [accessToken]);

  const mappedOrders = orders.map(toOrderView);
  const mappedProofs = proofs.map(toProofView);

  const activeOrdersCount = mappedOrders.filter(
    (o) => o.status === "in-production" || o.status === "shipped"
  ).length;
  const pendingProofsCount = mappedProofs.filter((p) => p.status === "pending").length;
  const { tier } = loyaltyTier(user.loyaltyPoints);
  const avatarInitials = user.name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  const memberSince = memberSinceLabel(user.createdAt);
  const pointsValueRupees = Math.floor(user.loyaltyPoints / 10);

  async function handleSignOut() {
    if (confirm("Are you sure you want to sign out of your account?")) {
      await logout();
    }
  }

  // Address handlers
  async function handleCreateAddress(data) {
    const { data: created } = await profileApi.createAddress(accessToken, data);
    setAddresses((prev) => [created, ...prev].map((a) => (data.isDefaultShipping && a.id !== created.id ? { ...a, isDefaultShipping: false } : a)));
  }
  async function handleUpdateAddress(id, data) {
    const { data: updated } = await profileApi.updateAddress(accessToken, id, data);
    setAddresses((prev) =>
      prev.map((a) => (a.id === id ? updated : data.isDefaultShipping ? { ...a, isDefaultShipping: false } : a)),
    );
  }
  async function handleDeleteAddress(id) {
    await profileApi.deleteAddress(accessToken, id);
    setAddresses((prev) => prev.filter((a) => a.id !== id));
  }
  async function handleSetDefaultAddress(id) {
    await handleUpdateAddress(id, { isDefaultShipping: true });
  }

  // Payment method handlers
  async function handleAddPaymentMethod(data) {
    const { data: created } = await profileApi.createPaymentMethod(accessToken, data);
    setPaymentMethods((prev) =>
      [created, ...prev].map((m) => (data.isPrimary && m.id !== created.id ? { ...m, isPrimary: false } : m)),
    );
  }
  async function handleRemovePaymentMethod(id) {
    await profileApi.deletePaymentMethod(accessToken, id);
    setPaymentMethods((prev) => prev.filter((m) => m.id !== id));
  }
  async function handleSetPrimaryPaymentMethod(id) {
    await profileApi.setPrimaryPaymentMethod(accessToken, id);
    setPaymentMethods((prev) => prev.map((m) => ({ ...m, isPrimary: m.id === id })));
  }

  // Proof handlers
  async function handleApproveProof(id) {
    await profileApi.approveProof(accessToken, id);
    setProofs((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: "APPROVED", approvedAt: new Date().toISOString() } : p)),
    );
  }

  // Avatar handler — the file is compressed to WebP and stored in Drive
  // server-side (POST /profile/avatar); we just hand over the raw file.
  async function handleAvatarSelect(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadingAvatar(true);
    setAvatarError("");
    try {
      const { data } = await profileApi.uploadAvatar(accessToken, file);
      updateUser(data);
    } catch (error) {
      setAvatarError(error.message || "Failed to upload photo.");
    } finally {
      setUploadingAvatar(false);
      event.target.value = "";
    }
  }

  // Notification handlers
  async function handleToggleNotification(field, value) {
    const { data } = await profileApi.update(accessToken, { [field]: value });
    updateUser(data);
  }

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <div className="size-8 animate-spin rounded-full border-2 border-(--brand)/20 border-t-(--brand)" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Profile Identity Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-b from-(--paper-muted) to-card p-6 shadow-sm md:p-8">
        {/* Subtle decorative background watermark */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-6 -top-12 select-none font-serif text-[12rem] font-light text-foreground/[0.03] leading-none"
        >
          SD
        </div>

        <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          {/* User Info with Avatar */}
          <div className="flex items-center gap-5">
            <div className="relative size-20 shrink-0 overflow-hidden rounded-2xl border-2 border-(--brand)/20 bg-(--brand) text-white shadow-md flex items-center justify-center font-serif text-2xl font-light">
              {user.avatarUrl ? (
                <Image
                  src={user.avatarUrl}
                  alt={user.name}
                  fill
                  sizes="80px"
                  className="object-cover"
                />
              ) : (
                <span>{avatarInitials}</span>
              )}
              {uploadingAvatar && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                  <div className="size-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                </div>
              )}
              <label
                htmlFor={avatarInputId}
                aria-label="Upload profile picture"
                data-cursor="hover"
                className="absolute bottom-1 right-1 flex size-6 cursor-pointer items-center justify-center rounded-full bg-black/70 text-white backdrop-blur-sm transition-transform hover:scale-110"
              >
                <Camera size={12} />
              </label>
              <input
                id={avatarInputId}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                onChange={handleAvatarSelect}
                disabled={uploadingAvatar}
                className="hidden"
              />
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="font-serif text-2xl font-normal text-foreground sm:text-3xl">
                  {user.name}
                </h1>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-300 bg-amber-500/10 px-3 py-0.5 text-xs font-semibold text-amber-800 dark:text-amber-400">
                  <Sparkles size={12} />
                  {tier}
                </span>
              </div>

              <p className="mt-1 text-xs text-muted-foreground">
                {user.email} {user.phone ? `· ${user.phone}` : ""}
              </p>
              <p className="mt-0.5 text-[11px] text-muted-foreground/80">
                Customer at Sayan Digital since {memberSince} · Malda, WB
              </p>
              {avatarError && (
                <p className="mt-1 text-[11px] font-medium text-destructive">{avatarError}</p>
              )}
            </div>
          </div>

          {/* Quick Stats Ribbon */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Loyalty Coins Card */}
            <div className="flex items-center gap-3 rounded-2xl border border-amber-200/80 bg-amber-50/60 px-4 py-3 shadow-sm">
              <div className="flex size-10 items-center justify-center rounded-xl bg-amber-500 text-white shadow-xs">
                <Coins size={18} />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-serif text-lg font-semibold text-amber-950">
                    {user.loyaltyPoints.toLocaleString("en-IN")}
                  </span>
                  <span className="text-[11px] font-medium text-amber-800">Coins</span>
                </div>
                <p className="text-[11px] text-amber-900/80">
                  {pointsValueRupees > 0
                    ? `Save ₹${pointsValueRupees} on your next order`
                    : "Earn coins with every completed order"}
                </p>
              </div>
            </div>

            {/* In-Transit Orders Pill */}
            <button
              type="button"
              onClick={() => setActiveTab("orders")}
              className="flex items-center gap-3 rounded-2xl border border-border bg-card px-4 py-3 shadow-sm transition-all hover:border-(--brand)/40"
            >
              <div className="flex size-10 items-center justify-center rounded-xl bg-(--brand)/10 text-(--brand)">
                <Package size={18} />
              </div>
              <div className="text-left">
                <div className="flex items-center gap-1.5">
                  <span className="font-serif text-lg font-semibold text-foreground">
                    {activeOrdersCount}
                  </span>
                  <span className="text-[11px] font-medium text-muted-foreground">In-Transit</span>
                </div>
                <p className="text-[11px] text-muted-foreground">
                  {orders.length} Total orders
                </p>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Horizontal Tab Scrollbar */}
      <div className="lg:hidden flex overflow-x-auto pb-2 scrollbar-none gap-2">
        {NAV_GROUPS.flatMap((g) => g.items).map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          const badgeCount =
            item.id === "orders"
              ? activeOrdersCount
              : item.id === "proofs"
              ? pendingProofsCount
              : item.id === "wishlist"
              ? wishlist.length
              : null;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveTab(item.id)}
              className={`flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-xs font-medium transition-all ${
                isActive
                  ? "bg-(--brand) text-white shadow-sm"
                  : "border border-border bg-card text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon size={14} />
              <span>{item.label}</span>
              {badgeCount !== null && badgeCount > 0 && (
                <span
                  className={`rounded-full px-1.5 py-0.2 text-[10px] font-semibold ${
                    isActive ? "bg-white/20 text-white" : "bg-(--brand)/10 text-(--brand)"
                  }`}
                >
                  {badgeCount}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[280px_1fr]">
        {/* Left Sidebar (Desktop) */}
        <aside className="hidden lg:block space-y-6">
          <div className="rounded-3xl border border-border bg-card p-4 shadow-sm">
            <div className="space-y-6">
              {NAV_GROUPS.map((group) => (
                <div key={group.title}>
                  <p className="px-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                    {group.title}
                  </p>
                  <nav className="mt-2 space-y-1">
                    {group.items.map((item) => {
                      const Icon = item.icon;
                      const isActive = activeTab === item.id;
                      const badgeCount =
                        item.id === "orders"
                          ? activeOrdersCount
                          : item.id === "proofs"
                          ? pendingProofsCount
                          : item.id === "wishlist"
                          ? wishlist.length
                          : null;

                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setActiveTab(item.id)}
                          className={`group flex w-full items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-medium transition-all ${
                            isActive
                              ? "bg-(--brand) text-white shadow-sm"
                              : "text-muted-foreground hover:bg-(--paper-muted) hover:text-foreground"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <Icon
                              size={16}
                              className={
                                isActive
                                  ? "text-white"
                                  : "text-muted-foreground group-hover:text-foreground"
                              }
                            />
                            <span>{item.label}</span>
                          </div>

                          {badgeCount !== null && badgeCount > 0 ? (
                            <span
                              className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                                isActive
                                  ? "bg-white/20 text-white"
                                  : item.id === "proofs"
                                  ? "bg-amber-500 text-white animate-pulse"
                                  : "bg-(--brand)/10 text-(--brand)"
                              }`}
                            >
                              {badgeCount}
                            </span>
                          ) : (
                            <ChevronRight
                              size={14}
                              className={`opacity-0 transition-opacity group-hover:opacity-100 ${
                                isActive ? "opacity-100 text-white" : "text-muted-foreground"
                              }`}
                            />
                          )}
                        </button>
                      );
                    })}
                  </nav>
                </div>
              ))}
            </div>

            {/* Divider and Sign Out */}
            <div className="mt-6 border-t border-border pt-4">
              <button
                type="button"
                onClick={handleSignOut}
                className="flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-medium text-destructive transition-colors hover:bg-red-50 hover:text-red-700"
              >
                <LogOut size={16} />
                <span>Sign Out</span>
              </button>
            </div>
          </div>

          {/* Need help / studio contact widget */}
          <div className="rounded-3xl border border-border bg-(--paper-muted) p-5 text-xs text-muted-foreground">
            <div className="flex items-center gap-2 text-foreground font-medium">
              <Headphones size={16} className="text-(--brand)" />
              <span>Studio Assistance</span>
            </div>
            <p className="mt-2 text-[12px] leading-relaxed">
              Need to modify a bulk print order or send artwork via WhatsApp?
            </p>
            <div className="mt-3">
              <a
                href="tel:+919832045678"
                className="inline-flex items-center gap-1 font-semibold text-(--brand) hover:underline"
              >
                Call: +91 98320 45678
              </a>
            </div>
          </div>
        </aside>

        {/* Right Active Tab Content */}
        <main className="min-w-0">
          <div className="rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-8">
            {activeTab === "orders" && (
              <OrdersTab orders={mappedOrders} onSelectTab={(tab) => setActiveTab(tab)} />
            )}
            {activeTab === "proofs" && (
              <ProofsTab proofs={mappedProofs} onApprove={handleApproveProof} />
            )}
            {activeTab === "wishlist" && (
              <WishlistTab wishlist={wishlist} onRemove={removeWishlistItem} />
            )}
            {activeTab === "personal-info" && (
              <PersonalInfoTab profile={user} onUpdateProfile={(updated) => updateUser(updated)} />
            )}
            {activeTab === "addresses" && (
              <AddressesTab
                addresses={addresses}
                onCreate={handleCreateAddress}
                onUpdate={handleUpdateAddress}
                onDelete={handleDeleteAddress}
                onSetDefault={handleSetDefaultAddress}
              />
            )}
            {activeTab === "payments" && (
              <PaymentsTab
                paymentMethods={paymentMethods}
                onAdd={handleAddPaymentMethod}
                onRemove={handleRemovePaymentMethod}
                onSetPrimary={handleSetPrimaryPaymentMethod}
              />
            )}
            {activeTab === "notifications" && (
              <NotificationsTab notifications={user} onToggle={handleToggleNotification} />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
