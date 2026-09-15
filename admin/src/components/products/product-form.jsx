"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api, ApiRequestError } from "@/lib/api";

function slugify(value) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const EMPTY_PRODUCT = {
  name: "",
  slug: "",
  description: "",
  price: "",
  category: "",
  imageUrl: "",
  stock: "0",
  isActive: true,
};

export function ProductForm({ mode, productId, initialData }) {
  const router = useRouter();
  const [values, setValues] = useState({ ...EMPTY_PRODUCT, ...initialData });
  const [slugTouched, setSlugTouched] = useState(mode === "edit");
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  function handleChange(field, value) {
    setValues((prev) => ({ ...prev, [field]: value }));
  }

  async function handleImageSelect(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setUploadError("");
    try {
      const result = await api.uploadImage(file);
      handleChange("imageUrl", result.data.url);
    } catch (error) {
      setUploadError(
        error instanceof ApiRequestError ? error.message : "Image upload failed.",
      );
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  }

  function handleNameChange(value) {
    setValues((prev) => ({
      ...prev,
      name: value,
      slug: slugTouched ? prev.slug : slugify(value),
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitting(true);
    setSubmitError("");
    setErrors({});

    const payload = {
      name: values.name,
      slug: values.slug,
      description: values.description || null,
      price: Number(values.price),
      category: values.category || null,
      imageUrl: values.imageUrl || null,
      stock: Number(values.stock),
      isActive: values.isActive,
    };

    try {
      if (mode === "create") {
        await api.createProduct(payload);
      } else {
        await api.updateProduct(productId, payload);
      }
      router.push("/products");
      router.refresh();
    } catch (error) {
      if (error instanceof ApiRequestError) {
        setSubmitError(error.message);
        if (error.details) setErrors(error.details);
      } else {
        setSubmitError("Something went wrong. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-xl space-y-5">
      {submitError && (
        <p className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {submitError}
        </p>
      )}

      <Field label="Name" error={errors.name?.[0]}>
        <input
          required
          value={values.name}
          onChange={(e) => handleNameChange(e.target.value)}
          className="input"
        />
      </Field>

      <Field label="Slug" error={errors.slug?.[0]} hint="Used in the product URL — lowercase, hyphenated.">
        <input
          required
          value={values.slug}
          onChange={(e) => {
            setSlugTouched(true);
            handleChange("slug", e.target.value);
          }}
          className="input"
        />
      </Field>

      <Field label="Description" error={errors.description?.[0]}>
        <textarea
          rows={4}
          value={values.description ?? ""}
          onChange={(e) => handleChange("description", e.target.value)}
          className="input"
        />
      </Field>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Price (INR)" error={errors.price?.[0]}>
          <input
            required
            type="number"
            min="0"
            step="0.01"
            value={values.price}
            onChange={(e) => handleChange("price", e.target.value)}
            className="input"
          />
        </Field>

        <Field label="Stock" error={errors.stock?.[0]}>
          <input
            type="number"
            min="0"
            step="1"
            value={values.stock}
            onChange={(e) => handleChange("stock", e.target.value)}
            className="input"
          />
        </Field>
      </div>

      <Field label="Category" error={errors.category?.[0]}>
        <input
          value={values.category ?? ""}
          onChange={(e) => handleChange("category", e.target.value)}
          className="input"
        />
      </Field>

      <Field label="Image" error={errors.imageUrl?.[0] || uploadError}>
        <div className="flex items-start gap-3">
          {values.imageUrl && (
            // eslint-disable-next-line @next/next/no-img-element -- previewing an arbitrary uploaded/external URL, not a static local asset
            <img
              src={values.imageUrl}
              alt="Product preview"
              className="size-16 shrink-0 rounded-md border border-border object-cover"
            />
          )}
          <div className="flex-1 space-y-2">
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              onChange={handleImageSelect}
              disabled={uploading}
              className="block w-full text-sm text-muted-foreground file:mr-3 file:rounded-md file:border-0 file:bg-muted file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-foreground hover:file:bg-border"
            />
            {uploading && <p className="text-xs text-muted-foreground">Uploading…</p>}
            <input
              value={values.imageUrl ?? ""}
              onChange={(e) => handleChange("imageUrl", e.target.value)}
              placeholder="or paste an image URL directly"
              className="input"
            />
          </div>
        </div>
      </Field>

      <label className="flex items-center gap-2 text-sm text-foreground">
        <input
          type="checkbox"
          checked={values.isActive}
          onChange={(e) => handleChange("isActive", e.target.checked)}
          className="size-4 rounded border-border"
        />
        Active (visible in the storefront)
      </label>

      <div className="flex items-center gap-3 pt-2">
        <button
          type="submit"
          disabled={submitting}
          className="rounded-md bg-brand px-4 py-2 text-sm font-medium text-brand-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {submitting ? "Saving…" : mode === "create" ? "Create product" : "Save changes"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/products")}
          className="rounded-md border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-muted"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

function Field({ label, error, hint, children }) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-foreground">{label}</label>
      {children}
      {hint && !error && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
      {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
    </div>
  );
}
