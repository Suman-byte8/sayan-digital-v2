"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FilePlus2, Files } from "lucide-react";

// Two separate views: browsing existing invoices, and generating a new one.
const TABS = [
  { href: "/invoices", label: "All Invoices", icon: Files, match: (p) => p === "/invoices" || (p.startsWith("/invoices/") && p !== "/invoices/new") },
  { href: "/invoices/new", label: "Generate Invoice", icon: FilePlus2, match: (p) => p === "/invoices/new" },
];

export function InvoiceTabs() {
  const pathname = usePathname();

  return (
    <div className="mb-6 flex gap-1 border-b border-border">
      {TABS.map((tab) => {
        const active = tab.match(pathname);
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={`-mb-px flex items-center gap-1.5 border-b-2 px-4 py-2.5 text-sm font-medium transition-colors ${
              active
                ? "border-brand text-brand"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <tab.icon size={15} />
            {tab.label}
          </Link>
        );
      })}
    </div>
  );
}
