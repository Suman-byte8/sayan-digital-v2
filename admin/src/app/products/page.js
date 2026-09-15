import Link from "next/link";
import { api, ApiRequestError } from "@/lib/api";
import { ProductTable } from "@/components/products/product-table";

// Always fetch fresh data — this is an admin tool, never statically cached.
export const dynamic = "force-dynamic";

export const metadata = {
  title: "Products — Sayan Digital Admin",
};

export default async function ProductsPage() {
  let products = [];
  let loadError = null;

  try {
    const result = await api.listProducts({ limit: 100 });
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
        <Link
          href="/products/new"
          className="rounded-md bg-brand px-4 py-2 text-sm font-medium text-brand-foreground hover:opacity-90"
        >
          Add product
        </Link>
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
