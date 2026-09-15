"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Plus, Search, Trash2, X } from "lucide-react";
import { api, ApiRequestError } from "@/lib/api";

export function CategoryManager({ initialCategories }) {
  const [categories, setCategories] = useState(initialCategories);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [addingName, setAddingName] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState("");
  const debounceRef = useRef(null);

  const savedNames = new Set(categories.map((c) => c.name.toLowerCase()));

  useEffect(() => {
    clearTimeout(debounceRef.current);
    const trimmed = query.trim();
    // Results are only ever rendered inside `{trimmedQuery && ...}` below,
    // so there's nothing to clear here — avoids a synchronous setState in
    // the effect body (react-hooks/set-state-in-effect) for a case that
    // doesn't need one.
    if (!trimmed) return;

    debounceRef.current = setTimeout(async () => {
      setSearching(true);
      try {
        const { data } = await api.searchTaxonomy(trimmed);
        setResults(data);
      } catch {
        setResults([]);
      } finally {
        setSearching(false);
      }
    }, 300);

    return () => clearTimeout(debounceRef.current);
  }, [query]);

  async function handleAdd(name, source) {
    setAddingName(name);
    setError("");
    try {
      const { data } = await api.createCategory({ name, source });
      setCategories((prev) =>
        prev.some((c) => c.id === data.id) ? prev : [...prev, data].sort((a, b) => a.name.localeCompare(b.name)),
      );
    } catch (err) {
      setError(err instanceof ApiRequestError ? err.message : "Failed to add category.");
    } finally {
      setAddingName(null);
    }
  }

  async function handleDelete(category) {
    if (!confirm(`Remove "${category.name}" from the category list?`)) return;

    setDeletingId(category.id);
    setError("");
    try {
      await api.deleteCategory(category.id);
      setCategories((prev) => prev.filter((c) => c.id !== category.id));
    } catch (err) {
      setError(err instanceof ApiRequestError ? err.message : "Failed to delete category.");
    } finally {
      setDeletingId(null);
    }
  }

  const trimmedQuery = query.trim();
  const exactMatchExists = results.some((r) => r.name.toLowerCase() === trimmedQuery.toLowerCase());

  return (
    <div className="max-w-2xl space-y-8">
      {error && (
        <p className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </p>
      )}

      <div>
        <h2 className="text-sm font-semibold text-foreground">Search categories</h2>
        <p className="mt-1 text-xs text-muted-foreground">
          Searches Google&rsquo;s product taxonomy — the same category system used by most
          e-commerce catalogs. Find a match, or add your own below if nothing fits.
        </p>

        <div className="relative mt-3">
          <Search
            size={16}
            className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-muted-foreground"
          />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g. mugs, lanyards, notebooks…"
            className="input pl-9"
          />
        </div>

        {trimmedQuery && (
          <div className="mt-3 overflow-hidden rounded-lg border border-border bg-card">
            {searching ? (
              <p className="px-4 py-3 text-sm text-muted-foreground">Searching…</p>
            ) : results.length > 0 ? (
              <ul className="divide-y divide-border">
                {results.map((result) => {
                  const isSaved = savedNames.has(result.name.toLowerCase());
                  return (
                    <li key={result.id} className="flex items-center justify-between gap-3 px-4 py-3">
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-foreground">{result.name}</p>
                        <p className="truncate text-xs text-muted-foreground">{result.path}</p>
                      </div>
                      {isSaved ? (
                        <span className="flex shrink-0 items-center gap-1 text-xs font-medium text-green-700">
                          <Check size={14} />
                          Added
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleAdd(result.name, "taxonomy")}
                          disabled={addingName === result.name}
                          className="flex shrink-0 items-center gap-1 rounded-md border border-border px-2.5 py-1 text-xs font-medium text-foreground hover:bg-muted disabled:opacity-50"
                        >
                          <Plus size={13} />
                          {addingName === result.name ? "Adding…" : "Add"}
                        </button>
                      )}
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p className="px-4 py-3 text-sm text-muted-foreground">No matches in the taxonomy.</p>
            )}

            {/* Always offered last, once there's no exact match already saved/listed
                — the "nothing fit, make my own" escape hatch. */}
            {!exactMatchExists && !savedNames.has(trimmedQuery.toLowerCase()) && (
              <div className="flex items-center justify-between gap-3 border-t border-border bg-muted/40 px-4 py-3">
                <p className="text-sm text-foreground">
                  Use &ldquo;<span className="font-medium">{trimmedQuery}</span>&rdquo; as a custom category
                </p>
                <button
                  type="button"
                  onClick={() => handleAdd(trimmedQuery, "custom")}
                  disabled={addingName === trimmedQuery}
                  className="flex shrink-0 items-center gap-1 rounded-md bg-brand px-2.5 py-1 text-xs font-medium text-brand-foreground hover:opacity-90 disabled:opacity-50"
                >
                  <Plus size={13} />
                  {addingName === trimmedQuery ? "Adding…" : "Add custom"}
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      <div>
        <h2 className="text-sm font-semibold text-foreground">
          Your categories <span className="text-muted-foreground">({categories.length})</span>
        </h2>
        {categories.length === 0 ? (
          <p className="mt-2 text-sm text-muted-foreground">
            No categories yet — search above to add your first one.
          </p>
        ) : (
          <ul className="mt-3 flex flex-wrap gap-2">
            {categories.map((category) => (
              <li
                key={category.id}
                className="flex items-center gap-2 rounded-full border border-border bg-card py-1.5 pr-1.5 pl-3 text-sm text-foreground"
              >
                {category.name}
                <button
                  type="button"
                  onClick={() => handleDelete(category)}
                  disabled={deletingId === category.id}
                  aria-label={`Remove ${category.name}`}
                  className="flex size-5 items-center justify-center rounded-full text-muted-foreground hover:bg-destructive/10 hover:text-destructive disabled:opacity-50"
                >
                  {deletingId === category.id ? (
                    <X size={12} />
                  ) : (
                    <Trash2 size={12} />
                  )}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
