import Link from "next/link";
import { ChevronRight, Home as HomeIcon } from "lucide-react";
import { CartView } from "@/components/cart/cart-view";
import { AuthGate } from "@/components/auth/auth-gate";
import { buildMetadata } from "@/lib/seo";

// Personal cart contents — no SEO value, kept out of search results same
// as /profile.
export const metadata = buildMetadata({
  title: "Your Cart — Sayan Digital",
  description: "Review the products you've added before placing an order with Sayan Digital.",
  path: "/cart",
  noIndex: true,
});

export default function CartPage() {
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
          <span className="font-medium text-(--brand)">Cart</span>
        </nav>

        <h1 className="mb-8 font-serif text-2xl font-light text-foreground md:text-3xl">
          Your Cart
        </h1>

        <AuthGate>
          <CartView />
        </AuthGate>
      </div>
    </main>
  );
}
