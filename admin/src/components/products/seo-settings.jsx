"use client";

import { Wand2 } from "lucide-react";

// Storefront origin — used only for the "how it may look in Google"
// preview, so this is display-only and not a source of truth.
const STOREFRONT_URL = "https://sayandigital.in";
const SEO_TITLE_RECOMMENDED = 60;
const META_DESCRIPTION_RECOMMENDED = 160;

// Blank inputs are sent as null so the storefront falls back to the
// product's name/description/first photo.
export const SEO_TEXT_FIELDS = [
  "seoTitle",
  "metaDescription",
  "imageAltText",
  "canonicalUrl",
  "ogTitle",
  "ogDescription",
  "ogImage",
  "twitterTitle",
  "twitterDescription",
  "twitterImage",
];

export const EMPTY_SEO = {
  ...Object.fromEntries(SEO_TEXT_FIELDS.map((f) => [f, ""])),
  structuredDataEnabled: true,
};

function SeoField({ label, count, error, hint, children }) {
  return (
    <div>
      <label className="mb-1.5 flex items-center justify-between text-sm font-medium text-foreground">
        {label}
        {count}
      </label>
      {children}
      {hint && !error && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
      {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
    </div>
  );
}

function CharCount({ value, recommended }) {
  const length = (value ?? "").trim().length;
  return (
    <span className={`text-xs font-normal ${length > recommended ? "text-destructive" : "text-muted-foreground"}`}>
      {length} / {recommended}
    </span>
  );
}

export function SeoSettings({ values, errors, onChange, mode }) {
  const name = values.name.trim();
  const plainDescription = (values.description ?? "").replace(/\s+/g, " ").trim();
  // What the storefront uses when a field is left blank — shown as
  // placeholders and in the preview so the admin sees the real outcome.
  const fallbackTitle = name ? `${name} | Sayan Digital` : "";
  const fallbackDescription =
    plainDescription.length > META_DESCRIPTION_RECOMMENDED
      ? `${plainDescription.slice(0, META_DESCRIPTION_RECOMMENDED - 1).replace(/\s+\S*$/, "")}…`
      : plainDescription;
  const fallbackAlt = name ? `${name} - Sayan Digital` : "";
  const productUrl = `${STOREFRONT_URL}/products/${values.slug || "product-slug"}`;

  const titleLength = values.seoTitle.trim().length;
  const descriptionLength = values.metaDescription.trim().length;

  // Pre-fills editable suggestions from the product's own details — plain
  // and factual, never keyword-stuffed. Only touches fields still empty.
  function handleSuggest() {
    if (!values.seoTitle.trim()) onChange("seoTitle", fallbackTitle);
    if (!values.metaDescription.trim()) onChange("metaDescription", fallbackDescription);
    if (!values.imageAltText.trim()) onChange("imageAltText", name);
  }

  return (
    <fieldset className="space-y-4 rounded-md border border-border p-4">
      <legend className="px-1 text-sm font-semibold text-foreground">SEO Settings</legend>
      <p className="text-xs text-muted-foreground">
        Optional. Anything left blank is filled in automatically from the product name,
        description and first photo.
      </p>

      <div className="rounded-md border border-border bg-muted/30 p-3">
        <p className="mb-1.5 text-[10px] font-medium tracking-wide text-muted-foreground uppercase">
          Search engine preview (approximate)
        </p>
        <p className="truncate text-xs text-emerald-700">{values.canonicalUrl.trim() || productUrl}</p>
        <p className="line-clamp-2 text-base leading-snug text-blue-700">
          {values.seoTitle.trim() || fallbackTitle || "Product title"}
        </p>
        <p className="line-clamp-2 text-xs text-muted-foreground">
          {values.metaDescription.trim() || fallbackDescription || "Product description appears here."}
        </p>
        <p className="mt-1.5 text-[10px] text-muted-foreground">
          Illustrative only — search engines decide what they actually display.
        </p>
      </div>

      <button
        type="button"
        onClick={handleSuggest}
        disabled={!name}
        className="flex items-center gap-1.5 text-xs font-medium text-brand hover:underline disabled:cursor-not-allowed disabled:opacity-40"
      >
        <Wand2 size={12} />
        Fill empty fields from product details
      </button>

      <SeoField
        label="SEO Title"
        count={<CharCount value={values.seoTitle} recommended={SEO_TITLE_RECOMMENDED} />}
        error={errors.seoTitle?.[0]}
        hint={
          titleLength > SEO_TITLE_RECOMMENDED
            ? "Longer than ~60 characters — search engines may cut it off."
            : "Around 60 characters or less works best."
        }
      >
        <input
          value={values.seoTitle}
          onChange={(e) => onChange("seoTitle", e.target.value)}
          placeholder={fallbackTitle}
          className="input"
        />
      </SeoField>

      <SeoField
        label="Meta Description"
        count={<CharCount value={values.metaDescription} recommended={META_DESCRIPTION_RECOMMENDED} />}
        error={errors.metaDescription?.[0]}
        hint={
          descriptionLength > META_DESCRIPTION_RECOMMENDED
            ? "Longer than ~160 characters — search engines may shorten it."
            : "A clear 150–160 character summary of what the customer gets."
        }
      >
        <textarea
          rows={3}
          value={values.metaDescription}
          onChange={(e) => onChange("metaDescription", e.target.value)}
          placeholder={fallbackDescription}
          className="input"
        />
      </SeoField>

      <SeoField
        label="Image Alt Text"
        error={errors.imageAltText?.[0]}
        hint="Describe what the main photo actually shows, e.g. “Personalized photo printed ceramic mug”. Used by screen readers and image search."
      >
        <input
          value={values.imageAltText}
          onChange={(e) => onChange("imageAltText", e.target.value)}
          placeholder={fallbackAlt}
          className="input"
        />
      </SeoField>

      <SeoField
        label="Canonical URL"
        error={errors.canonicalUrl?.[0]}
        hint={
          mode === "edit"
            ? "Leave blank to use the product's own URL. Changing the slug changes that URL and can break links already indexed."
            : "Leave blank to use the product's own URL."
        }
      >
        <input
          type="url"
          value={values.canonicalUrl}
          onChange={(e) => onChange("canonicalUrl", e.target.value)}
          placeholder={productUrl}
          className="input"
        />
      </SeoField>

      <details className="rounded-md border border-border p-3">
        <summary className="cursor-pointer text-sm font-medium text-foreground">
          Open Graph (Facebook, WhatsApp, LinkedIn)
        </summary>
        <div className="mt-3 space-y-4">
          <SeoField label="OG Title" error={errors.ogTitle?.[0]} hint="Defaults to the SEO title.">
            <input
              value={values.ogTitle}
              onChange={(e) => onChange("ogTitle", e.target.value)}
              placeholder={values.seoTitle.trim() || name}
              className="input"
            />
          </SeoField>
          <SeoField label="OG Description" error={errors.ogDescription?.[0]} hint="Defaults to the meta description.">
            <textarea
              rows={2}
              value={values.ogDescription}
              onChange={(e) => onChange("ogDescription", e.target.value)}
              className="input"
            />
          </SeoField>
          <SeoField label="OG Image URL" error={errors.ogImage?.[0]} hint="Defaults to the first product photo.">
            <input
              type="url"
              value={values.ogImage}
              onChange={(e) => onChange("ogImage", e.target.value)}
              className="input"
            />
          </SeoField>
        </div>
      </details>

      <details className="rounded-md border border-border p-3">
        <summary className="cursor-pointer text-sm font-medium text-foreground">Twitter / X</summary>
        <div className="mt-3 space-y-4">
          <SeoField label="Twitter Title" error={errors.twitterTitle?.[0]} hint="Defaults to the Open Graph title.">
            <input
              value={values.twitterTitle}
              onChange={(e) => onChange("twitterTitle", e.target.value)}
              className="input"
            />
          </SeoField>
          <SeoField
            label="Twitter Description"
            error={errors.twitterDescription?.[0]}
            hint="Defaults to the Open Graph description."
          >
            <textarea
              rows={2}
              value={values.twitterDescription}
              onChange={(e) => onChange("twitterDescription", e.target.value)}
              className="input"
            />
          </SeoField>
          <SeoField label="Twitter Image URL" error={errors.twitterImage?.[0]} hint="Defaults to the Open Graph image.">
            <input
              type="url"
              value={values.twitterImage}
              onChange={(e) => onChange("twitterImage", e.target.value)}
              className="input"
            />
          </SeoField>
        </div>
      </details>

      <label className="flex items-start gap-2 text-sm text-foreground">
        <input
          type="checkbox"
          checked={values.structuredDataEnabled}
          onChange={(e) => onChange("structuredDataEnabled", e.target.checked)}
          className="mt-0.5 size-4 rounded border-border"
        />
        <span>
          Product rich-result data (price &amp; availability for search engines)
          <span className="block text-xs text-muted-foreground">
            Keep on unless this product shouldn&rsquo;t show price info in search.
          </span>
        </span>
      </label>
    </fieldset>
  );
}
