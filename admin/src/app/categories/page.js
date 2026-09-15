import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { api, ApiRequestError } from "@/lib/api";
import { CategoryManager } from "@/components/categories/category-manager";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Manage Categories — Sayan Digital Admin",
};

export default async function CategoriesPage() {
  let categories = [];
  let loadError = null;

  try {
    const result = await api.listCategories();
    categories = result.data;
  } catch (error) {
    loadError = error instanceof ApiRequestError ? error.message : "Failed to load categories.";
  }

  return (
    <div>
      <Link
        href="/products"
        className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft size={15} />
        Back to products
      </Link>

      <h1 className="text-xl font-semibold text-foreground">Manage Categories</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        The category list products can be filed under, across both catalogs.
      </p>

      <div className="mt-6">
        {loadError ? (
          <p className="rounded-md border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {loadError}
          </p>
        ) : (
          <CategoryManager initialCategories={categories} />
        )}
      </div>
    </div>
  );
}
