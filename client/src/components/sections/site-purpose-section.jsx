import Link from "next/link";
import { ShieldCheck, ShoppingBag, UserRound } from "lucide-react";
import { BRAND } from "@/constants/brand";

// Plain, crawlable statement of what this website/app is for and what it
// does with user data — required for Google OAuth brand verification (the
// home page must explain the app's purpose) and useful to visitors. Kept as
// three short, scannable cards (not one long centered paragraph).
const POINTS = [
  {
    icon: ShoppingBag,
    title: "Browse and order",
    body: "See our printing products and stationery, save your favourites and place orders online.",
  },
  {
    icon: UserRound,
    title: "Track your orders",
    body: "Create an account to follow each order and keep your details and addresses in one place.",
  },
  {
    icon: ShieldCheck,
    title: "Your data stays yours",
    body: `${BRAND.name} uses Google Drive only to store product photos and profile pictures in its own folder. We never access your personal Google account or Drive.`,
  },
];

export function SitePurposeSection() {
  return (
    <section aria-labelledby="site-purpose-heading" className="border-t border-border bg-background py-14">
      <div className="container-premium">
        <div className="max-w-2xl">
          <h2 id="site-purpose-heading" className="text-xl font-semibold text-foreground">
            What this website is for
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            The online store for {BRAND.name}, a customised printing studio in {BRAND.location}.
          </p>
        </div>

        <ul className="mt-8 grid gap-4 md:grid-cols-3">
          {POINTS.map(({ icon: IconComponent, title, body }) => (
            <li key={title} className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-6">
              <span className="flex size-10 items-center justify-center rounded-full bg-(--brand)/8 text-(--brand)">
                <IconComponent size={18} strokeWidth={1.75} aria-hidden />
              </span>
              <h3 className="text-base font-semibold text-foreground">{title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{body}</p>
            </li>
          ))}
        </ul>

        <p className="mt-6 text-sm text-muted-foreground">
          Read our{" "}
          <Link href="/privacy-policy" className="text-(--brand) underline underline-offset-2">
            Privacy Policy
          </Link>{" "}
          and{" "}
          <Link href="/terms-of-service" className="text-(--brand) underline underline-offset-2">
            Terms of Service
          </Link>
          .
        </p>
      </div>
    </section>
  );
}
