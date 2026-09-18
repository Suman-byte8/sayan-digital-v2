"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  CheckCircle2,
  Circle,
  MapPin,
  MessageCircle,
  Package,
  Plus,
  ShoppingBag,
  Sparkles,
  Truck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/auth-context";
import { useCart } from "@/context/cart-context";
import { profileApi, ApiRequestError } from "@/lib/auth-api";
import { BRAND } from "@/constants/brand";

const currencyFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

const EMPTY_ADDRESS_FORM = {
  label: "Home",
  recipientName: "",
  phone: "",
  addressLine1: "",
  addressLine2: "",
  city: "Malda",
  state: "West Bengal",
  pincode: "",
};

function buildOrderWhatsappHref(order) {
  const lines = [
    `Hi Sayan Digital, I've just placed order ${order.orderNumber} on the site (Cash on Delivery).`,
    "Please confirm delivery charges and expected timeline.",
  ];
  return `https://wa.me/${BRAND.phone.replace(/\D/g, "")}?text=${encodeURIComponent(lines.join("\n"))}`;
}

export function CheckoutView() {
  const { user, accessToken } = useAuth();
  const { items, subtotal, clearCart } = useCart();

  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [loadingAddresses, setLoadingAddresses] = useState(true);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [addressForm, setAddressForm] = useState(EMPTY_ADDRESS_FORM);
  const [savingAddress, setSavingAddress] = useState(false);

  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState("");
  const [placedOrder, setPlacedOrder] = useState(null);

  useEffect(() => {
    profileApi
      .listAddresses(accessToken)
      .then(({ data }) => {
        setAddresses(data);
        const preferred = data.find((a) => a.isDefaultShipping) ?? data[0];
        if (preferred) setSelectedAddressId(preferred.id);
        else setShowAddressForm(true);
      })
      .finally(() => setLoadingAddresses(false));
  }, [accessToken]);

  async function handleSaveAddress(event) {
    event.preventDefault();
    if (!addressForm.recipientName || !addressForm.phone || !addressForm.addressLine1 || !addressForm.pincode) {
      setError("Please fill in recipient name, phone, street address and pincode.");
      return;
    }
    setSavingAddress(true);
    setError("");
    try {
      const { data } = await profileApi.createAddress(accessToken, {
        ...addressForm,
        isDefaultShipping: addresses.length === 0,
      });
      setAddresses((prev) => [data, ...prev]);
      setSelectedAddressId(data.id);
      setShowAddressForm(false);
      setAddressForm(EMPTY_ADDRESS_FORM);
    } catch (err) {
      setError(err instanceof ApiRequestError ? err.message : "Failed to save address.");
    } finally {
      setSavingAddress(false);
    }
  }

  async function handlePlaceOrder() {
    const address = addresses.find((a) => a.id === selectedAddressId);
    if (!address) {
      setError("Please select or add a delivery address.");
      return;
    }

    setPlacing(true);
    setError("");
    try {
      const { data } = await profileApi.createOrder(accessToken, {
        shippingName: address.recipientName,
        shippingPhone: address.phone,
        shippingAddressLine1: address.addressLine1,
        shippingAddressLine2: address.addressLine2,
        shippingCity: address.city,
        shippingState: address.state,
        shippingPincode: address.pincode,
        paymentMethod: "COD",
      });
      await clearCart();
      setPlacedOrder(data);
    } catch (err) {
      setError(err instanceof ApiRequestError ? err.message : "Failed to place order.");
    } finally {
      setPlacing(false);
    }
  }

  if (placedOrder) {
    return (
      <div className="mx-auto flex max-w-lg flex-col items-center rounded-2xl border border-border bg-card p-10 text-center shadow-sm">
        <div className="flex size-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
          <CheckCircle2 size={28} />
        </div>
        <h2 className="mt-4 font-serif text-2xl text-foreground">Order Placed!</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Order <span className="font-semibold text-foreground">{placedOrder.orderNumber}</span> has
          been received. We&apos;ll confirm the final delivery charge and timeline with you over
          WhatsApp or phone shortly. You&apos;ll pay cash on delivery.
        </p>
        <div className="mt-6 flex w-full flex-col gap-2.5">
          <Button asChild className="h-11 gap-2 rounded-full text-[13px]">
            <a href={buildOrderWhatsappHref(placedOrder)} target="_blank" rel="noopener noreferrer">
              <MessageCircle size={16} />
              Confirm via WhatsApp
            </a>
          </Button>
          <Button asChild variant="outline" className="h-11 gap-2 rounded-full text-[13px]">
            <Link href="/profile?tab=orders">
              <Package size={16} />
              View My Orders
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card/50 p-16 text-center">
        <div className="flex size-14 items-center justify-center rounded-full bg-(--paper-muted) text-muted-foreground">
          <ShoppingBag size={24} />
        </div>
        <h4 className="mt-4 font-serif text-lg text-foreground">Your cart is empty</h4>
        <p className="mt-1 max-w-sm text-xs text-muted-foreground">
          Add products to your cart before checking out.
        </p>
        <Button asChild size="sm" className="mt-5 rounded-full text-xs">
          <Link href="/products">Explore Catalog</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_380px]">
      <div className="space-y-8">
        {/* Information */}
        <section>
          <h2 className="font-serif text-lg text-foreground">Information</h2>

          <div className="mt-4 rounded-2xl border border-border bg-card p-4 text-sm">
            <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
              Personal Information
            </p>
            <p className="mt-2 font-medium text-foreground">{user.name}</p>
            <p className="text-xs text-muted-foreground">
              {user.email} {user.phone ? `· ${user.phone}` : ""}
            </p>
            <Link href="/profile" className="mt-1 inline-block text-[11px] text-(--brand) hover:underline">
              Edit in profile
            </Link>
          </div>

          <div className="mt-4 rounded-2xl border border-border bg-card p-4">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                Shipping Information
              </p>
              {addresses.length > 0 && (
                <button
                  type="button"
                  onClick={() => setShowAddressForm((v) => !v)}
                  className="flex items-center gap-1 text-[11px] font-medium text-(--brand) hover:underline"
                >
                  <Plus size={12} />
                  Add new address
                </button>
              )}
            </div>

            {loadingAddresses ? (
              <p className="mt-3 text-xs text-muted-foreground">Loading addresses…</p>
            ) : (
              <div className="mt-3 space-y-2">
                {addresses.map((address) => (
                  <button
                    key={address.id}
                    type="button"
                    onClick={() => setSelectedAddressId(address.id)}
                    className={`flex w-full items-start gap-3 rounded-xl border p-3 text-left text-xs transition-colors ${
                      selectedAddressId === address.id
                        ? "border-(--brand) bg-(--brand)/5"
                        : "border-border hover:bg-muted/50"
                    }`}
                  >
                    {selectedAddressId === address.id ? (
                      <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-(--brand)" />
                    ) : (
                      <Circle size={16} className="mt-0.5 shrink-0 text-muted-foreground" />
                    )}
                    <div>
                      <p className="font-semibold text-foreground">
                        {address.recipientName} · {address.label}
                      </p>
                      <p className="mt-0.5 text-muted-foreground">
                        {address.addressLine1}
                        {address.addressLine2 ? `, ${address.addressLine2}` : ""}, {address.city},{" "}
                        {address.state} — {address.pincode}
                      </p>
                      <p className="text-muted-foreground">{address.phone}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {showAddressForm && (
              <form onSubmit={handleSaveAddress} className="mt-4 space-y-3 border-t border-border pt-4 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <input
                    required
                    placeholder="Recipient name"
                    value={addressForm.recipientName}
                    onChange={(e) => setAddressForm({ ...addressForm, recipientName: e.target.value })}
                    className="rounded-lg border border-border bg-background p-2.5 text-foreground placeholder:text-muted-foreground focus:border-(--brand) focus:outline-none"
                  />
                  <input
                    required
                    placeholder="Phone"
                    value={addressForm.phone}
                    onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })}
                    className="rounded-lg border border-border bg-background p-2.5 text-foreground placeholder:text-muted-foreground focus:border-(--brand) focus:outline-none"
                  />
                </div>
                <input
                  required
                  placeholder="Street address / house / flat"
                  value={addressForm.addressLine1}
                  onChange={(e) => setAddressForm({ ...addressForm, addressLine1: e.target.value })}
                  className="w-full rounded-lg border border-border bg-background p-2.5 text-foreground placeholder:text-muted-foreground focus:border-(--brand) focus:outline-none"
                />
                <input
                  placeholder="Landmark / area (optional)"
                  value={addressForm.addressLine2}
                  onChange={(e) => setAddressForm({ ...addressForm, addressLine2: e.target.value })}
                  className="w-full rounded-lg border border-border bg-background p-2.5 text-foreground placeholder:text-muted-foreground focus:border-(--brand) focus:outline-none"
                />
                <div className="grid grid-cols-3 gap-3">
                  <input
                    required
                    placeholder="City"
                    value={addressForm.city}
                    onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                    className="rounded-lg border border-border bg-background p-2.5 text-foreground focus:border-(--brand) focus:outline-none"
                  />
                  <input
                    required
                    placeholder="State"
                    value={addressForm.state}
                    onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
                    className="rounded-lg border border-border bg-background p-2.5 text-foreground focus:border-(--brand) focus:outline-none"
                  />
                  <input
                    required
                    placeholder="Pincode"
                    value={addressForm.pincode}
                    onChange={(e) => setAddressForm({ ...addressForm, pincode: e.target.value })}
                    className="rounded-lg border border-border bg-background p-2.5 text-foreground focus:border-(--brand) focus:outline-none"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-1">
                  {addresses.length > 0 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="rounded-full text-xs"
                      onClick={() => setShowAddressForm(false)}
                    >
                      Cancel
                    </Button>
                  )}
                  <Button type="submit" size="sm" disabled={savingAddress} className="rounded-full text-xs">
                    {savingAddress ? "Saving…" : "Save Address"}
                  </Button>
                </div>
              </form>
            )}
          </div>
        </section>

        {/* Delivery */}
        <section>
          <h2 className="font-serif text-lg text-foreground">Delivery</h2>
          <div className="mt-4 flex items-start gap-3 rounded-2xl border border-(--brand) bg-(--brand)/5 p-4 text-xs">
            <Truck size={18} className="mt-0.5 shrink-0 text-(--brand)" />
            <div>
              <p className="font-semibold text-foreground">Pan-Bengal Delivery</p>
              <p className="mt-1 text-muted-foreground">
                Delivered via India Post or courier partners. Delivery charges (if any) are
                confirmed with you after your order is placed.
              </p>
            </div>
          </div>
        </section>

        {/* Payment */}
        <section>
          <h2 className="font-serif text-lg text-foreground">Payment</h2>
          <div className="mt-4 space-y-2.5">
            <div className="flex items-center gap-3 rounded-2xl border border-(--brand) bg-(--brand)/5 p-4 text-xs">
              <CheckCircle2 size={18} className="shrink-0 text-(--brand)" />
              <div>
                <p className="font-semibold text-foreground">Cash on Delivery</p>
                <p className="text-muted-foreground">Pay in cash when your order is delivered.</p>
              </div>
            </div>
            <div className="flex cursor-not-allowed items-center gap-3 rounded-2xl border border-border bg-muted/30 p-4 text-xs opacity-60">
              <Circle size={18} className="shrink-0 text-muted-foreground" />
              <div className="flex-1">
                <p className="font-semibold text-foreground">Pay Online (Razorpay)</p>
                <p className="text-muted-foreground">Cards, UPI &amp; netbanking.</p>
              </div>
              <span className="flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                <Sparkles size={10} />
                Coming Soon
              </span>
            </div>
          </div>
        </section>
      </div>

      {/* Shopping Bag summary */}
      <div className="h-fit space-y-4 rounded-2xl border border-border bg-card p-5 shadow-sm">
        <h3 className="font-serif text-lg text-foreground">Shopping Bag ({items.length})</h3>

        <div className="space-y-3">
          {items.map((item) => (
            <div key={item.id} className="flex items-center gap-3">
              <div className="relative size-14 shrink-0 overflow-hidden rounded-lg bg-muted/30">
                {item.product.images?.[0] && (
                  <Image src={item.product.images[0]} alt={item.product.name} fill sizes="56px" className="object-cover" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-medium text-foreground">{item.product.name}</p>
                <p className="text-[11px] text-muted-foreground">Qty: {item.quantity}</p>
              </div>
              <span className="text-xs font-semibold text-foreground">
                {currencyFormatter.format(item.product.price * item.quantity)}
              </span>
            </div>
          ))}
        </div>

        <div className="space-y-1.5 border-t border-border pt-4 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Subtotal</span>
            <span className="font-medium text-foreground">{currencyFormatter.format(subtotal)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Delivery</span>
            <span className="text-xs text-muted-foreground">Confirmed after order</span>
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-border pt-3">
          <span className="font-serif text-base text-foreground">Total</span>
          <span className="font-serif text-xl font-semibold text-foreground">
            {currencyFormatter.format(subtotal)}
          </span>
        </div>

        {error && (
          <p className="rounded-lg bg-destructive/10 px-3 py-2 text-xs text-destructive">{error}</p>
        )}

        <Button
          onClick={handlePlaceOrder}
          disabled={placing || loadingAddresses}
          className="h-12 w-full gap-2 rounded-full text-[13px]"
        >
          <MapPin size={16} />
          {placing ? "Placing Order…" : "Review and Place Order"}
        </Button>
      </div>
    </div>
  );
}
