import { Sparkles } from "lucide-react";

// Placeholder for a nav item that's real in the backend but deliberately
// hidden from customers for now (see profile-view.jsx's NAV_GROUPS
// `comingSoon` flag) — same empty-state visual language as
// WishlistTab/OrdersTab's "nothing here yet" cards.
export function ComingSoonNotice({ icon: Icon, title, description }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card/50 p-16 text-center">
      <div className="flex size-14 items-center justify-center rounded-full bg-(--paper-muted) text-muted-foreground">
        <Icon size={24} />
      </div>
      <h3 className="mt-4 font-serif text-lg text-foreground">{title}</h3>
      <p className="mt-1 max-w-sm text-xs text-muted-foreground">{description}</p>
      <span className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 px-3 py-1 text-[11px] font-medium text-amber-700 dark:text-amber-400">
        <Sparkles size={12} />
        Coming Soon
      </span>
    </div>
  );
}
