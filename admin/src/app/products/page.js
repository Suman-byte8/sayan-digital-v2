import Link from "next/link";
import { Plus, Tags } from "lucide-react";
import { api, ApiRequestError } from "@/lib/api";
import { ProductTable } from "@/components/products/product-table";

// Always fetch fresh data — this is an admin tool, never statically cached.
export const dynamic = "force-dynamic";

export const metadata = {
  title: "Products — Sayan Digital Admin",
};

const TYPE_TABS = [
  { value: undefined, label: "All" },
  { value: "PRINTING", label: "Printing Products" },
  { value: "STATIONERY", label: "Sayan Stationery" },
];

export default async function ProductsPage({ searchParams }) {
  const { type } = await searchParams;

  let products = [];
  let loadError = null;

  try {
    const result = await api.listProducts({ limit: 100, type });
    products = result.data;
  } catch (error) {
    loadError = error instanceof ApiRequestError ? error.message : "Failed to load products.";
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-foreground">Products</h1>
          <p className="text-sm text-muted-foreground">
            Manage the Sayan Digital product catalog.
          </p>
        </div>
        <div className="flex gap-3">
          <Link
            href="/categories"
            className="flex items-center gap-1.5 rounded-md border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-muted"
          >
            <Tags size={15} />
            Manage Categories
          </Link>
          <Link
            href="/products/new"
            className="flex items-center gap-1.5 rounded-md bg-brand px-4 py-2 text-sm font-medium text-brand-foreground hover:opacity-90"
          >
            <Plus size={15} />
            Add product
          </Link>
        </div>
      </div>

      <div className="mb-4 flex gap-2">
        {TYPE_TABS.map((tab) => (
          <Link
            key={tab.label}
            href={tab.value ? `/products?type=${tab.value}` : "/products"}
            className={`rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
              type === tab.value
                ? "bg-brand text-brand-foreground"
                : "bg-muted text-muted-foreground hover:bg-border"
            }`}
          >
            {tab.label}
          </Link>
        ))}
      </div>

      {loadError ? (
        <p className="rounded-md border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {loadError}
        </p>
      ) : (
        <ProductTable products={products} />
      )}
    </div>
  );
}
