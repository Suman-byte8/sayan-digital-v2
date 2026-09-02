import Link from "next/link";
import { AtSign, Mail, MapPin, Phone } from "lucide-react";
import { NAV_LINKS, STATIONARY_LINK } from "@/constants/navigation";
import { BRAND } from "@/constants/brand";

const BUSINESS_LINKS = [
  "Customized Printing",
  "Sublimation Printing",
  "Lanyard Printing",
  "ID Cards",
  "Personalized Gifts",
];

export function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="container-premium grid grid-cols-1 gap-12 py-16 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="text-sm font-semibold tracking-[0.18em] text-foreground">
            {BRAND.name.toUpperCase()}
          </p>
          <p className="mt-3 max-w-55 text-[13px] leading-relaxed text-muted-foreground">
            {BRAND.tagline} — based in {BRAND.location}.
          </p>
          <Link
            href={STATIONARY_LINK.href}
            className="mt-4 inline-block text-[13px] font-semibold text-(--brand)"
          >
            {STATIONARY_LINK.label} →
          </Link>
        </div>

        <div>
          <p className="text-xs font-semibold tracking-[0.2em] text-foreground uppercase">
            Quick Links
          </p>
          <ul className="mt-4 flex flex-col gap-2.5">
            {NAV_LINKS.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  className="text-[13px] text-muted-foreground transition-colors hover:text-foreground"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-xs font-semibold tracking-[0.2em] text-foreground uppercase">
            Business
          </p>
          <ul className="mt-4 flex flex-col gap-2.5">
            {BUSINESS_LINKS.map((label) => (
              <li key={label} className="text-[13px] text-muted-foreground">
                {label}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-xs font-semibold tracking-[0.2em] text-foreground uppercase">
            Contact
          </p>
          <ul className="mt-4 flex flex-col gap-3">
            <li className="flex items-start gap-2 text-[13px] text-muted-foreground">
              <MapPin size={15} className="mt-0.5 shrink-0" />
              {BRAND.addressLine}
            </li>
            <li className="flex items-start gap-2 text-[13px] text-muted-foreground">
              <Phone size={15} className="mt-0.5 shrink-0" />
              {BRAND.phone}
            </li>
            <li className="flex items-start gap-2 text-[13px] text-muted-foreground">
              <Mail size={15} className="mt-0.5 shrink-0" />
              {BRAND.email}
            </li>
            <li>
              <a
                href={BRAND.instagram}
                className="inline-flex items-center gap-2 text-[13px] text-muted-foreground transition-colors hover:text-foreground"
              >
                <AtSign size={15} />
                Instagram
              </a>
            </li>
            <li>
              <a
                href={BRAND.googleBusiness}
                className="text-[13px] text-muted-foreground transition-colors hover:text-foreground"
              >
                Google Business Profile
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="container-premium flex flex-col items-center justify-between gap-3 py-6 text-center sm:flex-row sm:text-left">
          <p className="text-[12px] text-muted-foreground">
            © 2026 {BRAND.name}. All rights reserved.
          </p>
          <p className="text-[12px] text-muted-foreground/70">Crafted with care.</p>
        </div>
      </div>
    </footer>
  );
}
