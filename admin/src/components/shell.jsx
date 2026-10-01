"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut } from "lucide-react";
import { logout } from "@/app/auth-actions";

const NAV_LINKS = [
  { label: "Products", href: "/products" },
  { label: "Orders", href: "/orders" },
  { label: "Invoices", href: "/invoices" },
  { label: "Customers", href: "/customers" },
  { label: "Tasks", href: "/tasks" },
  { label: "Settings", href: "/settings" },
];

export function Shell({ children }) {
  const pathname = usePathname();

  // The sign-in page is full-screen: no sidebar, nothing to navigate to yet.
  if (pathname === "/login") return children;

  return (
    <div className="flex min-h-full">
      <aside className="flex w-56 shrink-0 flex-col border-r border-border bg-card">
        <div className="border-b border-border px-5 py-5">
          <p className="text-sm font-semibold tracking-tight text-foreground">
            Sayan Digital
          </p>
          <p className="text-xs text-muted-foreground">Admin</p>
        </div>
        <nav className="flex flex-1 flex-col gap-1 p-3">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-md px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <form action={logout} className="border-t border-border p-3">
          <button
            type="submit"
            className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <LogOut size={15} />
            Sign out
          </button>
        </form>
      </aside>

      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
