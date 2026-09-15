// Adapts real API shapes (server/'s Order/Proof/etc, uppercase enums, ISO
// dates) onto the display shape the existing profile tab components were
// already built around (lowercase-dash status strings, formatted date
// text) — same "one mapper, zero component rewrites" pattern as
// lib/product-view-model.js.
const dateFormatter = new Intl.DateTimeFormat("en-IN", { day: "2-digit", month: "short", year: "numeric" });
const dateTimeFormatter = new Intl.DateTimeFormat("en-IN", {
  day: "2-digit",
  month: "short",
  year: "numeric",
  hour: "numeric",
  minute: "2-digit",
});

function formatDate(iso) {
  return iso ? dateFormatter.format(new Date(iso)) : null;
}

const ORDER_STATUS_MAP = {
  PENDING: { status: "pending", statusLabel: "Order Received", badgeVariant: "info" },
  IN_PRODUCTION: { status: "in-production", statusLabel: "In Printing", badgeVariant: "warning" },
  SHIPPED: { status: "shipped", statusLabel: "Out for Delivery", badgeVariant: "info" },
  DELIVERED: { status: "delivered", statusLabel: "Delivered", badgeVariant: "success" },
  CANCELLED: { status: "cancelled", statusLabel: "Cancelled", badgeVariant: "neutral" },
};

export function toOrderView(order) {
  return {
    id: order.orderNumber,
    date: formatDate(order.createdAt),
    ...ORDER_STATUS_MAP[order.status],
    estimatedDelivery: formatDate(order.estimatedDelivery),
    deliveredOn: formatDate(order.deliveredAt),
    totalAmount: order.totalAmount,
    itemsCount: order.items.length,
    shippingCarrier: order.shippingCarrier,
    trackingNumber: order.trackingNumber,
    paymentMethod: order.paymentMethod,
    isPaid: order.isPaid,
    items: order.items.map((item) => ({
      id: item.id,
      name: item.name,
      customization: item.customization,
      qty: item.quantity,
      price: item.price,
      image: item.image,
    })),
  };
}

const PROOF_STATUS_MAP = {
  PENDING: "pending",
  APPROVED: "approved",
  REJECTED: "rejected",
};

export function toProofView(proof) {
  return {
    id: proof.id,
    title: proof.title,
    product: proof.product,
    orderRef: proof.orderRef,
    submittedDate: formatDate(proof.submittedAt),
    designer: proof.designer,
    status: PROOF_STATUS_MAP[proof.status],
    notes: proof.notes,
    dimensions: proof.dimensions,
    colorProfile: proof.colorProfile,
    previewUrl: proof.previewUrl,
    approvedDate: proof.approvedAt ? dateTimeFormatter.format(new Date(proof.approvedAt)) : null,
  };
}

export function memberSinceLabel(createdAt) {
  return new Intl.DateTimeFormat("en-IN", { month: "long", year: "numeric" }).format(
    new Date(createdAt),
  );
}

// Simple, honest tier derivation from real loyaltyPoints (default 0 for
// every new signup) — replaces the old mockup's hardcoded "Craft Club VIP"
// shown identically to every user regardless of any actual activity.
export function loyaltyTier(points) {
  if (points >= 2000) return { tier: "Gold Circle", tierColor: "gold" };
  if (points >= 500) return { tier: "Silver Circle", tierColor: "silver" };
  return { tier: "Member", tierColor: "default" };
}
