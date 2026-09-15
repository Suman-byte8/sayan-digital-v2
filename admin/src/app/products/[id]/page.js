import Link from "next/link";
import { notFound } from "next/navigation";
import { api, ApiRequestError } from "@/lib/api";
import { ProductImageGallery } from "@/components/products/product-image-gallery";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Product — Sayan Digital Admin",
};

const currencyFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

const dateFormatter = new Intl.DateTimeFormat("en-IN", {
  dateStyle: "medium",
  timeStyle: "short",
});

export default async function ProductDetailPage({ params }) {
  const { id } = await params;

  let product;
  try {
    const result = await api.getProduct(id);
    product = result.data;
  } catch (error) {
    if (error instanceof ApiRequestError && error.status === 404) {
      notFound();
    }
    return (
      <p className="rounded-md border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
        {error instanceof ApiRequestError ? error.message : "Failed to load product."}
      </p>
    );
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <Link href="/products" className="text-sm text-muted-foreground hover:text-foreground">
          ← Back to products
        </Link>
        <div className="flex gap-3">
          <Link
            href={`/products/${id}/edit`}
            className="rounded-md bg-brand px-4 py-2 text-sm font-medium text-brand-foreground hover:opacity-90"
          >
            Edit product
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[380px_1fr]">
        <ProductImageGallery images={product.images} name={product.name} />

        <div>
          <div className="flex items-start justify-between gap-3">
            <div>
              <h1 className="text-2xl font-semibold text-foreground">{product.name}</h1>
              <p className="mt-1 text-sm text-muted-foreground">/{product.slug}</p>
            </div>
            <span
              className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${
                product.isActive
                  ? "bg-green-100 text-green-700"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {product.isActive ? "Active" : "Inactive"}
            </span>
          </div>

          <p className="mt-4 text-3xl font-semibold text-foreground">
            {currencyFormatter.format(product.price)}
          </p>

          <dl className="mt-6 grid grid-cols-2 gap-4 rounded-lg border border-border bg-card p-4">
            <DetailItem
              label="Catalog"
              value={product.type === "STATIONERY" ? "Sayan Stationery" : "Printing Products"}
            />
            <DetailItem label="Category" value={product.category || "—"} />
            <DetailItem label="Unit" value={product.unit || "—"} />
            <DetailItem label="Badge" value={product.badge || "—"} />
            <DetailItem
              label="Minimum Order Quantity"
              value={product.minOrderQty ? `${product.minOrderQty} pcs` : "No minimum"}
            />
            <DetailItem label="Stock" value={product.stock} />
            <DetailItem label="Photos" value={product.images?.length ?? 0} />
          </dl>

          {product.description && (
            <div className="mt-6">
              <h2 className="text-sm font-semibold text-foreground">Description</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {product.description}
              </p>
            </div>
          )}

          <div className="mt-6 flex flex-col gap-1 text-xs text-muted-foreground">
            <p>Created: {dateFormatter.format(new Date(product.createdAt))}</p>
            <p>Last updated: {dateFormatter.format(new Date(product.updatedAt))}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function DetailItem({ label, value }) {
  return (
    <div>
      <dt className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
        {label}
      </dt>
      <dd className="mt-1 text-sm font-medium text-foreground">{value}</dd>
    </div>
  );
}
