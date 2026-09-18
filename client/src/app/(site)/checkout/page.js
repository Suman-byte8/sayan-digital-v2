import Link from "next/link";
import { ChevronRight, Home as HomeIcon } from "lucide-react";
import { CheckoutView } from "@/components/checkout/checkout-view";
import { AuthGate } from "@/components/auth/auth-gate";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Checkout — Sayan Digital",
  description: "Complete your order with Sayan Digital.",
  path: "/checkout",
  noIndex: true,
});

export default function CheckoutPage() {
  return (
    <main className="bg-background pt-24 pb-20">
      <div className="container-premium pt-6 md:pt-10">
        <nav
          aria-label="Breadcrumb"
          className="mb-6 flex items-center gap-1.5 text-[12px] text-muted-foreground"
        >
          <Link
            href="/"
            className="inline-flex items-center gap-1 transition-colors hover:text-(--brand)"
          >
            <HomeIcon size={13} />
            Home
          </Link>
          <ChevronRight size={13} />
          <Link href="/cart" className="transition-colors hover:text-(--brand)">
            Cart
          </Link>
          <ChevronRight size={13} />
          <span className="font-medium text-(--brand)">Checkout</span>
        </nav>

        <h1 className="mb-8 font-serif text-2xl font-light tracking-tight text-foreground uppercase md:text-3xl">
          Checkout
        </h1>

        <AuthGate>
          <CheckoutView />
        </AuthGate>
      </div>
    </main>
  );
}
