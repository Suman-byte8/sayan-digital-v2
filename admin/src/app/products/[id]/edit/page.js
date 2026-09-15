import { notFound } from "next/navigation";
import { api, ApiRequestError } from "@/lib/api";
import { ProductForm } from "@/components/products/product-form";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Edit Product — Sayan Digital Admin",
};

export default async function EditProductPage({ params }) {
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
      <h1 className="mb-6 text-xl font-semibold text-foreground">Edit product</h1>
      <ProductForm
        mode="edit"
        productId={id}
        initialData={{
          ...product,
          price: String(product.price),
          stock: String(product.stock),
          minOrderQty: product.minOrderQty != null ? String(product.minOrderQty) : "",
        }}
      />
    </div>
  );
}
