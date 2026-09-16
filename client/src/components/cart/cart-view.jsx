"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Minus, Plus, ShoppingCart, Trash2, MessageCircle, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/cart-context";
import { BRAND } from "@/constants/brand";

const currencyFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

// No payment gateway exists yet (see server/README.md) — the real ordering
// flow for this business is WhatsApp/email, same as the single-product
// enquiry buttons on the PDP. This just summarizes the whole cart into one.
function buildCartWhatsappHref(items) {
  const lines = [
    "Hi Sayan Digital, I'd like to order:",
    ...items.map((item) => `- ${item.product.name} x${item.quantity}`),
  ];
  return `https://wa.me/${BRAND.phone.replace(/\D/g, "")}?text=${encodeURIComponent(lines.join("\n"))}`;
}

function buildCartMailto(items, subtotal) {
  const subject = "Order Inquiry — Sayan Digital Cart";
  const lines = [
    "I'm interested in ordering:",
    "",
    ...items.map((item) => `${item.product.name} — Qty: ${item.quantity} — ₹${item.product.price} each`),
    "",
    `Estimated subtotal: ₹${subtotal}`,
    "",
    "Please confirm availability, pricing and (if applicable) a digital proof before production.",
  ];
  return `mailto:${BRAND.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines.join("\n"))}`;
}

export function CartView() {
  const { items, loading, subtotal, updateItem, removeItem, clearCart } = useCart();
  const [updatingId, setUpdatingId] = useState(null);
  const [removingId, setRemovingId] = useState(null);

  async function handleQuantityChange(item, quantity) {
    if (quantity < 1) return;
    setUpdatingId(item.id);
    try {
      await updateItem(item.id, quantity);
    } finally {
      setUpdatingId(null);
    }
  }

  async function handleRemove(item) {
    setRemovingId(item.id);
    try {
      await removeItem(item.id);
    } finally {
      setRemovingId(null);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <div className="size-8 animate-spin rounded-full border-2 border-(--brand)/20 border-t-(--brand)" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card/50 p-16 text-center">
        <div className="flex size-14 items-center justify-center rounded-full bg-(--paper-muted) text-muted-foreground">
          <ShoppingCart size={24} />
        </div>
        <h4 className="mt-4 font-serif text-lg text-foreground">Your cart is empty</h4>
        <p className="mt-1 max-w-sm text-xs text-muted-foreground">
          Browse our catalog and add products you&apos;d like to order.
        </p>
        <Button asChild size="sm" className="mt-5 rounded-full text-xs">
          <Link href="/products">Explore Catalog</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_320px]">
      <div className="space-y-4">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex gap-4 rounded-2xl border border-border bg-card p-4 shadow-sm"
          >
            <Link
              href={`/products/${item.product.slug}`}
              className="relative size-20 shrink-0 overflow-hidden rounded-xl bg-muted/30"
            >
              {item.product.images?.[0] && (
                <Image
                  src={item.product.images[0]}
                  alt={item.product.name}
                  fill
                  sizes="80px"
                  className="object-cover"
                />
              )}
            </Link>

            <div className="flex flex-1 flex-col">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <Link
                    href={`/products/${item.product.slug}`}
                    className="font-serif text-base text-foreground hover:text-(--brand)"
                  >
                    {item.product.name}
                  </Link>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {currencyFormatter.format(item.product.price)} / {item.product.unit || "pc"}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemove(item)}
                  disabled={removingId === item.id}
                  aria-label={`Remove ${item.product.name} from cart`}
                  className="flex size-8 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive disabled:opacity-50"
                >
                  <Trash2 size={15} />
                </button>
              </div>

              <div className="mt-auto flex items-center justify-between pt-3">
                <div className="flex items-center rounded-full border border-border">
                  <button
                    type="button"
                    aria-label="Decrease quantity"
                    onClick={() => handleQuantityChange(item, item.quantity - 1)}
                    disabled={updatingId === item.id}
                    className="flex size-8 items-center justify-center text-foreground transition-colors hover:text-(--brand) disabled:opacity-50"
                  >
                    <Minus size={13} />
                  </button>
                  <span className="w-7 text-center text-[13px] font-semibold text-foreground">
                    {item.quantity}
                  </span>
                  <button
                    type="button"
                    aria-label="Increase quantity"
                    onClick={() => handleQuantityChange(item, item.quantity + 1)}
                    disabled={updatingId === item.id}
                    className="flex size-8 items-center justify-center text-foreground transition-colors hover:text-(--brand) disabled:opacity-50"
                  >
                    <Plus size={13} />
                  </button>
                </div>
                <span className="font-serif text-sm font-semibold text-foreground">
                  {currencyFormatter.format(item.product.price * item.quantity)}
                </span>
              </div>
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={() => clearCart()}
          className="text-xs font-medium text-muted-foreground hover:text-destructive"
        >
          Clear cart
        </button>
      </div>

      <div className="h-fit space-y-4 rounded-2xl border border-border bg-card p-5 shadow-sm">
        <h3 className="font-serif text-lg text-foreground">Order Summary</h3>
        <div className="flex items-center justify-between border-b border-border pb-4 text-sm">
          <span className="text-muted-foreground">Subtotal</span>
          <span className="font-semibold text-foreground">{currencyFormatter.format(subtotal)}</span>
        </div>
        <p className="text-[11px] text-muted-foreground">
          Final pricing, delivery charges and GST (if applicable) are confirmed with you directly
          before production — no online payment is taken here.
        </p>

        <div className="flex flex-col gap-2 pt-2">
          <Button asChild data-cursor="hover" className="h-11 w-full gap-2 rounded-full text-[13px]">
            <a href={buildCartWhatsappHref(items)} target="_blank" rel="noopener noreferrer">
              <MessageCircle size={16} />
              Order via WhatsApp
            </a>
          </Button>
          <Button
            asChild
            variant="outline"
            data-cursor="hover"
            className="h-11 w-full gap-2 rounded-full text-[13px]"
          >
            <a href={buildCartMailto(items, subtotal)}>
              <Mail size={16} />
              Email Order Summary
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
}
