"use client";

import { useState } from "react";
import { Search } from "lucide-react";

// No internal site search exists yet, so this falls back to a Google
// site-scoped search in a new tab rather than faking a real search feature.
export function SiteSearchForm() {
  const [query, setQuery] = useState("");

  function handleSubmit(event) {
    event.preventDefault();
    const trimmed = query.trim();
    const searchQuery = trimmed ? `site:sayandigital.in ${trimmed}` : "site:sayandigital.in";
    window.open(
      `https://www.google.com/search?q=${encodeURIComponent(searchQuery)}`,
      "_blank",
      "noopener,noreferrer"
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4 flex w-full max-w-xs items-center gap-2">
      <div className="relative flex-1">
        <Search
          size={15}
          className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-muted-foreground"
        />
        <input
          type="text"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search"
          className="w-full rounded-lg border border-border bg-card py-2 pr-3 pl-9 text-[13px] text-foreground outline-none focus:ring-2 focus:ring-(--brand)/20"
        />
      </div>
      <button
        type="submit"
        data-cursor="hover"
        className="shrink-0 rounded-lg bg-muted px-4 py-2 text-[13px] font-medium text-foreground transition-colors hover:bg-muted/70"
      >
        Search
      </button>
    </form>
  );
}
