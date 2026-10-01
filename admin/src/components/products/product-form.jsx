"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { refreshAdminData } from "@/app/actions";
import { Plus, Save, Tags, Trash2, Wand2, X } from "lucide-react";
import { api, ApiRequestError } from "@/lib/api";
import { ImageUploader } from "@/components/products/image-uploader";
import { VariantImagePicker } from "@/components/products/variant-image-picker";
import { EMPTY_SEO, SEO_TEXT_FIELDS, SeoSettings } from "@/components/products/seo-settings";

const MAX_VARIANT_OPTIONS = 4;

// Sorted "name:value|name:value" — must match server/src/lib/product-variants.js's
// computeSelectionKey exactly, used here only to dedupe "Generate variants"
// against combinations that already exist in the matrix.
function computeSelectionKey(selection) {
  return Object.entries(selection)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([name, value]) => `${name}:${value}`)
    .join("|");
}

function cartesianProduct(options) {
  return options.reduce(
    (acc, option) =>
      acc.flatMap((combo) => option.values.map((value) => ({ ...combo, [option.name]: value }))),
    [{}],
  );
}

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
  type: "PRINTING",
  unit: "",
  badge: "",
  images: [],
  minOrderQty: "",
  stock: "0",
  isActive: true,
  ...EMPTY_SEO,
};

export function ProductForm({ mode, productId, initialData }) {
  const router = useRouter();
  const [values, setValues] = useState({
    ...EMPTY_PRODUCT,
    ...initialData,
    // API returns null for unset SEO fields; inputs need strings.
    ...Object.fromEntries(SEO_TEXT_FIELDS.map((f) => [f, initialData?.[f] ?? ""])),
  });
  const [slugTouched, setSlugTouched] = useState(mode === "edit");
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [categories, setCategories] = useState([]);

  // Options/variants are managed as their own state (not part of `values`)
  // since they're a different shape (nested, per-row form inputs) — kept in
  // sync into the submit payload only at submit time.
  const [variantOptions, setVariantOptions] = useState(
    (initialData?.variantOptions ?? []).map((o) => ({ name: o.name, values: o.values })),
  );
  const [variants, setVariants] = useState(
    (initialData?.variants ?? []).map((v) => ({
      id: v.id,
      selection: v.selection,
      sku: v.sku ?? "",
      price: v.price != null ? String(v.price) : "",
      stock: String(v.stock ?? 0),
      images: v.images ?? [],
      isActive: v.isActive,
    })),
  );
  const [optionValueDrafts, setOptionValueDrafts] = useState({});

  useEffect(() => {
    api
      .listCategories()
      .then((result) => setCategories(result.data))
      .catch(() => setCategories([]));
  }, []);

  function handleChange(field, value) {
    setValues((prev) => ({ ...prev, [field]: value }));
  }

  function handleNameChange(value) {
    setValues((prev) => ({
      ...prev,
      name: value,
      slug: slugTouched ? prev.slug : slugify(value),
    }));
  }

  // Variant options
  function handleAddOption() {
    setVariantOptions((prev) => [...prev, { name: "", values: [] }]);
  }
  function handleRemoveOption(index) {
    const removedName = variantOptions[index]?.name;
    setVariantOptions((prev) => prev.filter((_, i) => i !== index));
    // Drop that option out of every variant's selection too, so the matrix
    // never carries a stale key that no longer corresponds to a real option.
    setVariants((prev) =>
      prev.map((v) => {
        const { [removedName]: _removed, ...rest } = v.selection;
        return { ...v, selection: rest };
      }),
    );
  }
  function handleOptionNameChange(index, name) {
    setVariantOptions((prev) => prev.map((o, i) => (i === index ? { ...o, name } : o)));
  }
  function handleAddOptionValue(index) {
    const draft = (optionValueDrafts[index] ?? "").trim();
    if (!draft) return;
    setVariantOptions((prev) =>
      prev.map((o, i) => (i === index && !o.values.includes(draft) ? { ...o, values: [...o.values, draft] } : o)),
    );
    setOptionValueDrafts((prev) => ({ ...prev, [index]: "" }));
  }
  // Options with any not-yet-added typed value merged in, so a value that
  // was typed but never confirmed with Enter/Add still counts instead of
  // leaving "Generate variants" disabled with no explanation.
  function optionsWithDrafts() {
    return variantOptions.map((o, i) => {
      const draft = (optionValueDrafts[i] ?? "").trim();
      return draft && !o.values.includes(draft) ? { ...o, values: [...o.values, draft] } : o;
    });
  }
  function handleRemoveOptionValue(index, value) {
    setVariantOptions((prev) =>
      prev.map((o, i) => (i === index ? { ...o, values: o.values.filter((v) => v !== value) } : o)),
    );
  }

  // Generates the cartesian product of every option's values and appends
  // only the combinations not already present in the matrix — safe to
  // click repeatedly. The admin then prunes whichever combos aren't
  // actually sellable (e.g. a frame size that doesn't come in every
  // thickness) and fills in price/stock for the rest.
  function handleGenerateVariants() {
    const merged = optionsWithDrafts();
    const validOptions = merged.filter((o) => o.name.trim() && o.values.length > 0);
    if (validOptions.length === 0) return;
    setVariantOptions(merged);
    setOptionValueDrafts({});

    const existingKeys = new Set(variants.map((v) => computeSelectionKey(v.selection)));
    const generated = cartesianProduct(validOptions).filter(
      (selection) => !existingKeys.has(computeSelectionKey(selection)),
    );

    setVariants((prev) => [
      ...prev,
      ...generated.map((selection) => ({
        selection,
        sku: "",
        price: "",
        stock: "0",
        images: [],
        isActive: true,
      })),
    ]);
  }

  function handleVariantFieldChange(index, field, value) {
    setVariants((prev) => prev.map((v, i) => (i === index ? { ...v, [field]: value } : v)));
  }
  function handleRemoveVariant(index) {
    setVariants((prev) => prev.filter((_, i) => i !== index));
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
      type: values.type,
      unit: values.unit || null,
      badge: values.badge || null,
      images: values.images,
      minOrderQty: values.minOrderQty ? Number(values.minOrderQty) : null,
      stock: Number(values.stock),
      isActive: values.isActive,
      ...Object.fromEntries(SEO_TEXT_FIELDS.map((f) => [f, (values[f] ?? "").trim() || null])),
      structuredDataEnabled: values.structuredDataEnabled,
      variantOptions: variantOptions
        .filter((o) => o.name.trim() && o.values.length > 0)
        .map((o) => ({ name: o.name.trim(), values: o.values })),
      variants: variants.map((v) => ({
        ...(v.id ? { id: v.id } : {}),
        selection: v.selection,
        sku: v.sku.trim() || null,
        price: v.price !== "" ? Number(v.price) : null,
        stock: Number(v.stock) || 0,
        images: v.images,
        isActive: v.isActive,
      })),
    };

    try {
      if (mode === "create") {
        await api.createProduct(payload);
      } else {
        await api.updateProduct(productId, payload);
      }
      // One round trip: clears the client cache (so the list and this
      // product's pages are fresh) and navigates to the list.
      await refreshAdminData("/products");
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
    <form onSubmit={handleSubmit} className="max-w-6xl space-y-5">
      {submitError && (
        <p className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {submitError}
        </p>
      )}

      <div className="grid gap-6 lg:grid-cols-2 lg:items-start">
      <div className="min-w-0 space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
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

      </div>

      <Field label="Description" error={errors.description?.[0]}>
        <textarea
          rows={3}
          value={values.description ?? ""}
          onChange={(e) => handleChange("description", e.target.value)}
          className="input"
        />
      </Field>

      <Field
        label="Catalog"
        error={errors.type?.[0]}
        hint="Which storefront section this appears in."
      >
        <select
          value={values.type}
          onChange={(e) => handleChange("type", e.target.value)}
          className="input"
        >
          <option value="PRINTING">Printing Products (/products)</option>
          <option value="STATIONERY">Sayan Stationery (/stationery)</option>
        </select>
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

      <div className="grid grid-cols-2 gap-4">
        <Field
          label="Category"
          error={errors.category?.[0]}
          hint={
            <>
              Don&rsquo;t see it?{" "}
              <Link href="/categories" className="inline-flex items-center gap-1 text-brand hover:underline">
                <Tags size={12} />
                Manage categories
              </Link>
            </>
          }
        >
          <select
            value={values.category ?? ""}
            onChange={(e) => handleChange("category", e.target.value)}
            className="input"
          >
            <option value="">No category</option>
            {/* Covers a legacy/imported category value not (yet) in the
                managed list, so the current selection is never silently lost. */}
            {values.category && !categories.some((c) => c.name === values.category) && (
              <option value={values.category}>{values.category}</option>
            )}
            {categories.map((category) => (
              <option key={category.id} value={category.name}>
                {category.name}
              </option>
            ))}
          </select>
        </Field>

        <Field
          label="Minimum Order Quantity"
          error={errors.minOrderQty?.[0]}
          hint="Optional — for wholesale-only items like lanyards. Leave blank if there's no minimum."
        >
          <input
            type="number"
            min="1"
            step="1"
            value={values.minOrderQty ?? ""}
            onChange={(e) => handleChange("minOrderQty", e.target.value)}
            placeholder="No minimum"
            className="input"
          />
        </Field>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Field
          label="Unit"
          error={errors.unit?.[0]}
          hint='Shown next to price, e.g. "pc", "set", "100 pcs".'
        >
          <input
            value={values.unit ?? ""}
            onChange={(e) => handleChange("unit", e.target.value)}
            placeholder="pc"
            className="input"
          />
        </Field>

        <Field
          label="Badge"
          error={errors.badge?.[0]}
          hint='Optional highlight, e.g. "Customizable", "220 GSM".'
        >
          <input
            value={values.badge ?? ""}
            onChange={(e) => handleChange("badge", e.target.value)}
            className="input"
          />
        </Field>
      </div>

      <Field label="Photos" error={errors.images?.[0]}>
        <ImageUploader
          images={values.images}
          onChange={(images) => handleChange("images", images)}
        />
      </Field>

      <div>
        <div className="mb-1.5 flex items-center justify-between">
          <label className="block text-sm font-medium text-foreground">
            Variants
          </label>
          {variantOptions.length < MAX_VARIANT_OPTIONS && (
            <button
              type="button"
              onClick={handleAddOption}
              className="flex items-center gap-1 text-xs font-medium text-brand hover:underline"
            >
              <Plus size={12} />
              Add option
            </button>
          )}
        </div>
        <p className="mb-3 text-xs text-muted-foreground">
          Optional — for products that come in different sizes/types/etc, each with its own
          price, stock and photos (e.g. mug type, frame size + thickness). Leave empty for a
          plain product. <strong className="font-medium text-foreground">Name the option, add
          its values below, then click &ldquo;Generate variants&rdquo;</strong> — that&rsquo;s
          where price, stock and images for each combination show up.
        </p>

        {variantOptions.length > 0 && (
          <div className="space-y-3 rounded-md border border-border p-3">
            {variantOptions.map((option, index) => (
              <div key={index} className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <input
                    value={option.name}
                    onChange={(e) => handleOptionNameChange(index, e.target.value)}
                    placeholder="Option name, e.g. Size"
                    className="input flex-1"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveOption(index)}
                    aria-label="Remove option"
                    className="shrink-0 rounded-md p-2 text-muted-foreground hover:bg-muted hover:text-destructive"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
                <div className="flex flex-wrap items-center gap-1.5">
                  {option.values.map((value) => (
                    <span
                      key={value}
                      className="flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-xs text-foreground"
                    >
                      {value}
                      <button
                        type="button"
                        onClick={() => handleRemoveOptionValue(index, value)}
                        aria-label={`Remove value ${value}`}
                      >
                        <X size={10} />
                      </button>
                    </span>
                  ))}
                  <input
                    value={optionValueDrafts[index] ?? ""}
                    onChange={(e) =>
                      setOptionValueDrafts((prev) => ({ ...prev, [index]: e.target.value }))
                    }
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === ",") {
                        e.preventDefault();
                        handleAddOptionValue(index);
                      }
                    }}
                    placeholder="Type a value, e.g. 4x6"
                    className="w-44 rounded-md border border-border bg-background px-2 py-1 text-xs text-foreground placeholder:text-muted-foreground focus:border-brand focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => handleAddOptionValue(index)}
                    disabled={!(optionValueDrafts[index] ?? "").trim()}
                    className="rounded-md border border-border px-2 py-1 text-xs font-medium text-foreground hover:bg-muted disabled:opacity-40"
                  >
                    Add value
                  </button>
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={handleGenerateVariants}
              disabled={!optionsWithDrafts().some((o) => o.name.trim() && o.values.length > 0)}
              title="Add an option name and at least one value first"
              className="flex items-center gap-1.5 rounded-md bg-brand px-3 py-1.5 text-xs font-medium text-brand-foreground hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Wand2 size={13} />
              Generate variants from options above
            </button>
            <p className="mt-1.5 text-[11px] text-muted-foreground">
              The option name is the category (e.g. &ldquo;Size&rdquo;); the values are its
              choices (e.g. 4x6, 8x12). Price is set per combination in the rows this creates
              — safe to click again after adding more values.
            </p>
          </div>
        )}

        {variants.length > 0 && (
          <div className="mt-3 overflow-x-auto rounded-md border border-border">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-border bg-muted/50 text-[10px] font-medium tracking-wide text-muted-foreground uppercase">
                <tr>
                  <th className="px-2 py-2">Combination</th>
                  <th className="px-2 py-2">SKU</th>
                  <th className="px-2 py-2">Price</th>
                  <th className="px-2 py-2">Stock</th>
                  <th className="px-2 py-2">Images</th>
                  <th className="px-2 py-2">Active</th>
                  <th className="px-2 py-2" />
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {variants.map((variant, index) => (
                  <tr key={variant.id ?? `new-${index}`}>
                    <td className="px-2 py-2 font-medium text-foreground whitespace-nowrap">
                      {Object.entries(variant.selection)
                        .map(([name, value]) => `${name}: ${value}`)
                        .join(", ")}
                    </td>
                    <td className="px-2 py-2">
                      <input
                        value={variant.sku}
                        onChange={(e) => handleVariantFieldChange(index, "sku", e.target.value)}
                        placeholder="Optional"
                        className="w-20 rounded-md border border-border bg-background px-1.5 py-1 text-xs text-foreground focus:border-brand focus:outline-none"
                      />
                    </td>
                    <td className="px-2 py-2">
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={variant.price}
                        onChange={(e) => handleVariantFieldChange(index, "price", e.target.value)}
                        placeholder={values.price || "Base price"}
                        className="w-20 rounded-md border border-border bg-background px-1.5 py-1 text-xs text-foreground focus:border-brand focus:outline-none"
                      />
                    </td>
                    <td className="px-2 py-2">
                      <input
                        type="number"
                        min="0"
                        step="1"
                        value={variant.stock}
                        onChange={(e) => handleVariantFieldChange(index, "stock", e.target.value)}
                        className="w-16 rounded-md border border-border bg-background px-1.5 py-1 text-xs text-foreground focus:border-brand focus:outline-none"
                      />
                    </td>
                    <td className="px-2 py-2">
                      <VariantImagePicker
                        images={variant.images}
                        onChange={(images) => handleVariantFieldChange(index, "images", images)}
                      />
                    </td>
                    <td className="px-2 py-2">
                      <input
                        type="checkbox"
                        checked={variant.isActive}
                        onChange={(e) => handleVariantFieldChange(index, "isActive", e.target.checked)}
                        className="size-4 rounded border-border"
                      />
                    </td>
                    <td className="px-2 py-2">
                      <button
                        type="button"
                        onClick={() => handleRemoveVariant(index)}
                        aria-label="Remove variant"
                        className="text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 size={13} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <label className="flex items-center gap-2 text-sm text-foreground">
        <input
          type="checkbox"
          checked={values.isActive}
          onChange={(e) => handleChange("isActive", e.target.checked)}
          className="size-4 rounded border-border"
        />
        Active (visible in the storefront)
      </label>
      </div>

      <div className="min-w-0 lg:sticky lg:top-4 lg:max-h-[calc(100vh-2rem)] lg:overflow-y-auto">
        <SeoSettings values={values} errors={errors} onChange={handleChange} mode={mode} />
      </div>
      </div>

      <div className="flex items-center gap-3 pt-2">
        <button
          type="submit"
          disabled={submitting}
          className="flex items-center gap-1.5 rounded-md bg-brand px-4 py-2 text-sm font-medium text-brand-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          <Save size={15} />
          {submitting ? "Saving…" : mode === "create" ? "Create product" : "Save changes"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/products")}
          className="flex items-center gap-1.5 rounded-md border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-muted"
        >
          <X size={15} />
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
