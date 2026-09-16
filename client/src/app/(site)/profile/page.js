import { Suspense } from "react";
import Link from "next/link";
import {
  ChevronRight,
  Home as HomeIcon,
  ShieldCheck,
  Truck,
  Palette,
  Sparkles,
} from "lucide-react";
import { ProfileView } from "@/components/profile/profile-view";
import { AuthGate } from "@/components/auth/auth-gate";
import { buildMetadata } from "@/lib/seo";

// Personal account/order area — no SEO value and contains customer-specific
// data, so it's kept out of search results (also excluded from sitemap.js
// and disallowed in robots.js).
export const metadata = buildMetadata({
  title: "My Account & Orders — Sayan Digital",
  description:
    "Manage your customized printing orders, review digital artwork proofs, track deliveries, and manage your delivery addresses at Sayan Digital.",
  path: "/profile",
  noIndex: true,
});

const TRUST_ITEMS = [
  {
    icon: Palette,
    title: "100% Free Proof Approval",
    desc: "Digital preview before printing",
  },
  {
    icon: Truck,
    title: "Pan-Bengal Express Courier",
    desc: "Safe doorstep delivery",
  },
  {
    icon: ShieldCheck,
    title: "Quality Checked Merchandise",
    desc: "Grade-A sublimation & ceramic",
  },
];

export default function ProfilePage() {
  return (
    <main className="bg-background pt-24 pb-20">
      <div className="container-premium pt-6 md:pt-10">
        {/* Breadcrumb Navigation */}
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
          <span className="font-medium text-(--brand)">My Account</span>
        </nav>

        {/* Master Profile Layout */}
        <AuthGate>
          <Suspense fallback={null}>
            <ProfileView />
          </Suspense>
        </AuthGate>

        {/* Bottom Trust Indicators */}
        <div className="mt-16 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {TRUST_ITEMS.map((t) => {
            const Icon = t.icon;
            return (
              <div
                key={t.title}
                className="flex items-center gap-4 rounded-2xl border border-border bg-(--paper-muted) p-4 shadow-xs"
              >
                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-card text-(--brand) shadow-xs border border-border/60">
                  <Icon size={18} />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-foreground">
                    {t.title}
                  </h4>
                  <p className="text-[11px] text-muted-foreground">{t.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
