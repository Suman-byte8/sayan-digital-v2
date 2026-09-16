import Link from "next/link";

const NAV_LINKS = [
  { label: "Products", href: "/products" },
  { label: "Customers", href: "/customers" },
];

export function Shell({ children }) {
  return (
    <div className="flex min-h-full">
      <aside className="flex w-56 shrink-0 flex-col border-r border-border bg-card">
        <div className="border-b border-border px-5 py-5">
          <p className="text-sm font-semibold tracking-tight text-foreground">
            Sayan Digital
          </p>
          <p className="text-xs text-muted-foreground">Admin</p>
        </div>
        <nav className="flex flex-col gap-1 p-3">
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
      </aside>

      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
