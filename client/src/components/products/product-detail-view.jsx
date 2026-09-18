"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  ChevronRight,
  Heart,
  Home as HomeIcon,
  Loader2,
  Minus,
  MessageCircle,
  Palette,
  Plus,
  ShieldCheck,
  ShoppingCart,
  Truck,
} from "lucide-react";
import { Reveal } from "@/components/motion/reveal";
import { Magnetic } from "@/components/motion/magnetic";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { BRAND } from "@/constants/brand";
import { CONTACT_FAQS } from "@/constants/contact-detail";
import { useAuth } from "@/context/auth-context";
import { useWishlist } from "@/context/wishlist-context";
import { useCart } from "@/context/cart-context";

const TRUST_PILLS = [
  { icon: Truck, label: "Pan-Bengal Delivery" },
  { icon: Palette, label: "Free Digital Proof" },
  { icon: ShieldCheck, label: "Quality Checked" },
];

const TABS = [
  { key: "overview", label: "Overview" },
  { key: "ordering", label: "Ordering & Delivery" },
];

// Reuse the already-vetted FAQ copy from the contact page instead of
// writing new marketing claims for this tab.
const ORDERING_NOTES = CONTACT_FAQS.filter(
  (faq) => faq.question.includes("send my design") || faq.question.includes("turnaround")
);

function buildWhatsappHref(product) {
  const text = `Hi Sayan Digital, I'd like to order: ${product.name}`;
  return `https://wa.me/${BRAND.phone.replace(/\D/g, "")}?text=${encodeURIComponent(text)}`;
}

export function ProductDetailView({ product, catalogHref = "/products", catalogLabel = "Products" }) {
  const router = useRouter();
  const { status } = useAuth();
  const { productIds, toggleProduct } = useWishlist();
  const { addItem } = useCart();
  const isSaved = productIds.has(product.id);
  const [activeTab, setActiveTab] = useState("overview");
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const [buyingNow, setBuyingNow] = useState(false);

  function handleSave() {
    if (status !== "authenticated") {
      router.push("/profile");
      return;
    }
    toggleProduct(product.id);
  }

  async function handleAddToCart() {
    if (status !== "authenticated") {
      router.push("/profile");
      return;
    }
    setAddingToCart(true);
    try {
      await addItem(product.id, quantity);
      setAddedToCart(true);
      setTimeout(() => setAddedToCart(false), 2000);
    } finally {
      setAddingToCart(false);
    }
  }

  async function handleBuyNow() {
    if (status !== "authenticated") {
      router.push("/profile");
      return;
    }
    setBuyingNow(true);
    try {
      await addItem(product.id, quantity);
      router.push("/checkout");
    } finally {
      setBuyingNow(false);
    }
  }

  const specs = [
    { label: "Category", value: product.categoryLabel },
    { label: "Ordering Unit", value: `Per ${product.unit}` },
    { label: "Minimum Order", value: product.minQty },
    product.badge ? { label: "Highlight", value: product.badge } : null,
  ].filter(Boolean);

  return (
    <section className="container-premium pt-8 pb-6 md:pt-12">
      <nav
        aria-label="Breadcrumb"
        className="mb-8 flex flex-wrap items-center gap-1.5 text-[12px] text-muted-foreground"
      >
        <Link
          href="/"
          className="inline-flex items-center gap-1 transition-colors hover:text-(--brand)"
        >
          <HomeIcon size={13} />
          Home
        </Link>
        <ChevronRight size={13} />
        <Link href={catalogHref} className="transition-colors hover:text-(--brand)">
          {catalogLabel}
        </Link>
        <ChevronRight size={13} />
        <span className="max-w-[50vw] truncate font-medium text-(--brand)">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-14">
        <Reveal className="relative aspect-square overflow-hidden rounded-3xl border border-border bg-card shadow-premium">
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(min-width: 1024px) 45vw, 90vw"
            className="object-cover"
            priority
          />
          <span className="absolute top-4 left-4 rounded-full bg-card/90 px-3 py-1 text-[11px] font-bold tracking-widest text-(--brand) uppercase backdrop-blur-sm">
            {product.categoryLabel}
          </span>
          {product.badge && (
            <span
              className={cn(
                "absolute top-4 right-4 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[12px] font-medium backdrop-blur-sm",
                product.badgeTone === "neutral"
                  ? "bg-card/90 text-muted-foreground"
                  : "bg-(--gold)/20 text-[#8a6a1f]"
              )}
            >
              {product.badgeTone !== "neutral" && (
                <span className="size-1.5 rounded-full bg-(--gold)" aria-hidden />
              )}
              {product.badge}
            </span>
          )}
          <button
            type="button"
            onClick={handleSave}
            aria-pressed={isSaved}
            aria-label={
              isSaved ? `Remove ${product.name} from saved ideas` : `Save ${product.name} for later`
            }
            data-cursor="hover"
            className="absolute right-4 bottom-4 flex size-11 items-center justify-center rounded-full bg-card/90 text-foreground shadow-premium backdrop-blur-sm transition-transform active:scale-90"
          >
            <Heart size={18} className={isSaved ? "fill-red-500 text-red-500" : ""} />
          </button>
        </Reveal>

        <div>
          <Reveal delay={80}>
            <p className="eyebrow-label">{product.categoryLabel}</p>
          </Reveal>
          <Reveal delay={140}>
            <h1 className="mt-3 font-serif text-3xl font-light text-foreground md:text-4xl">
              {product.name}
            </h1>
          </Reveal>
          <Reveal delay={200}>
            <p className="body-copy mt-4">{product.description}</p>
          </Reveal>

          <Reveal delay={260} className="mt-6 flex items-baseline gap-3 border-y border-border py-5">
            <div>
              <span className="block text-[11px] text-muted-foreground">Starting at</span>
              <span className="text-3xl font-bold text-(--brand)">
                ₹{product.price}
                <span className="ml-1.5 text-sm font-normal text-muted-foreground">
                  / {product.unit}
                </span>
              </span>
            </div>
            <span
              className={cn(
                "ml-auto rounded-md px-3 py-1.5 text-[12px] font-medium",
                product.minQtyTone === "strong"
                  ? "bg-(--gold)/20 font-semibold text-[#8a6a1f]"
                  : "bg-muted text-muted-foreground"
              )}
            >
              {product.minQty}
            </span>
          </Reveal>

          <Reveal delay={290} className="mt-6 flex items-center gap-3">
            <div className="flex items-center rounded-full border border-border">
              <button
                type="button"
                aria-label="Decrease quantity"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="flex size-10 items-center justify-center text-foreground transition-colors hover:text-(--brand)"
              >
                <Minus size={14} />
              </button>
              <span className="w-8 text-center text-[14px] font-semibold text-foreground">
                {quantity}
              </span>
              <button
                type="button"
                aria-label="Increase quantity"
                onClick={() => setQuantity((q) => q + 1)}
                className="flex size-10 items-center justify-center text-foreground transition-colors hover:text-(--brand)"
              >
                <Plus size={14} />
              </button>
            </div>

            <Button
              type="button"
              variant="outline"
              data-cursor="hover"
              onClick={handleAddToCart}
              disabled={addingToCart}
              className="h-10 flex-1 gap-2 rounded-full text-[14px]"
            >
              {addingToCart ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <ShoppingCart size={16} />
              )}
              {addedToCart ? "Added to Cart" : "Add to Cart"}
            </Button>
          </Reveal>

          <Reveal delay={320} className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Magnetic strength={0.25} className="flex-1">
              <Button
                type="button"
                data-cursor="hover"
                onClick={handleBuyNow}
                disabled={buyingNow}
                className="h-12 w-full gap-2 rounded-full text-[14px]"
              >
                {buyingNow ? <Loader2 size={16} className="animate-spin" /> : <ArrowRight size={16} />}
                Buy Now
              </Button>
            </Magnetic>
            <Button asChild variant="outline" data-cursor="hover" className="h-12 gap-2 rounded-full text-[14px]">
              <a href={buildWhatsappHref(product)} target="_blank" rel="noopener noreferrer">
                <MessageCircle size={16} />
                WhatsApp
              </a>
            </Button>
          </Reveal>

          <Reveal delay={380} className="mt-6 flex flex-wrap gap-2.5">
            {TRUST_PILLS.map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2"
              >
                <Icon size={15} className="text-(--brand)" />
                <span className="text-[12px] font-medium text-foreground">{label}</span>
              </div>
            ))}
          </Reveal>

          <Reveal delay={440} className="mt-8">
            <div className="flex gap-6 border-b border-border">
              {TABS.map((tab) => (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setActiveTab(tab.key)}
                  className={cn(
                    "relative pb-3 text-[13px] font-medium transition-colors",
                    activeTab === tab.key
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {tab.label}
                  {activeTab === tab.key && (
                    <span className="absolute inset-x-0 -bottom-px h-[2px] bg-(--brand)" />
                  )}
                </button>
              ))}
            </div>

            <div className="pt-5">
              {activeTab === "overview" && (
                <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {specs.map((spec) => (
                    <div key={spec.label} className="rounded-xl bg-muted/60 p-3.5">
                      <dt className="text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">
                        {spec.label}
                      </dt>
                      <dd className="mt-1 text-[13px] font-medium text-foreground">{spec.value}</dd>
                    </div>
                  ))}
                </dl>
              )}

              {activeTab === "ordering" && (
                <div className="flex flex-col gap-4">
                  {ORDERING_NOTES.map((note) => (
                    <div key={note.question}>
                      <p className="text-[13px] font-semibold text-foreground">{note.question}</p>
                      <p className="body-copy mt-1 text-[13px]">{note.answer}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
