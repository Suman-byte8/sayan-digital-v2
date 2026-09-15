import { ProductForm } from "@/components/products/product-form";

export const metadata = {
  title: "Add Product — Sayan Digital Admin",
};

export default function NewProductPage() {
  return (
    <div>
      <h1 className="mb-6 text-xl font-semibold text-foreground">Add product</h1>
      <ProductForm mode="create" />
    </div>
  );
}
