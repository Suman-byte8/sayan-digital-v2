import { BRAND } from "@/constants/brand";

// Central SEO constants + helpers so every page builds its metadata and
// structured data the same way instead of re-typing OG/Twitter/canonical
// boilerplate per page. Production domain — confirmed against the
// `site:sayandigital.in` reference already hardcoded in
// components/not-found/site-search-form.jsx.
export const SITE_URL = "https://sayandigital.in";
export const SITE_NAME = BRAND.name;

// Real local asset (the actual brand logo) used as the fallback social
// share image until a dedicated 1200x630 OG banner is designed — see
// implementation report for that follow-up.
const DEFAULT_OG_IMAGE = "/assets/sayan_digital_logo.png";

export function absoluteUrl(path = "/") {
  return new URL(path, SITE_URL).toString();
}

/**
 * Builds a full Next.js Metadata object (title, description, canonical,
 * Open Graph, Twitter card, robots) for one page. Pass `noIndex` for
 * private/utility routes that shouldn't be indexed.
 */
export function buildMetadata({
  title,
  description,
  path = "/",
  image = DEFAULT_OG_IMAGE,
  type = "website",
  noIndex = false,
}) {
  const url = absoluteUrl(path);
  const imageUrl = absoluteUrl(image);

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    robots: noIndex
      ? { index: false, follow: false }
      : {
          index: true,
          follow: true,
          googleBot: { index: true, follow: true },
        },
    openGraph: {
      title,
      description,
      url,
      siteName: SITE_NAME,
      images: [{ url: imageUrl, alt: title }],
      locale: "en_IN",
      type,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
  };
}

export function buildBreadcrumbJsonLd(items) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

// Reflects only real, already-published business info from constants/brand.js
// — no invented ratings, reviews, prices, or coordinates.
export function buildLocalBusinessJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Store",
    "@id": `${SITE_URL}/#business`,
    name: BRAND.name,
    description: BRAND.tagline,
    url: SITE_URL,
    image: absoluteUrl(DEFAULT_OG_IMAGE),
    telephone: BRAND.phone,
    email: BRAND.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: "Gour Road, Mokdumpur, English Bazar",
      addressLocality: "Malda",
      addressRegion: "West Bengal",
      postalCode: "732103",
      addressCountry: "IN",
    },
    areaServed: {
      "@type": "City",
      name: "Malda",
    },
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ],
      opens: "10:00",
      closes: "20:00",
    },
    sameAs: [BRAND.instagram, BRAND.facebook, BRAND.googleBusiness].filter(
      Boolean,
    ),
  };
}

export function buildWebsiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
  };
}

// ---------------------------------------------------------------------
// Product SEO — resolves per-product admin fields with sensible fallbacks
// (blank/whitespace-only counts as missing), then builds Next.js Metadata
// and schema.org JSON-LD from the ONE resolved object so the <head> tags
// and structured data can never disagree.
// ---------------------------------------------------------------------
const clean = (value) => (typeof value === "string" ? value.trim() : "");
const firstFilled = (...values) => values.map(clean).find(Boolean) ?? "";

// Plain-text excerpt for a meta description: strips any tags, collapses
// whitespace, cuts at a word boundary.
function excerpt(text, max = 160) {
  const plain = clean(text).replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
  if (plain.length <= max) return plain;
  return `${plain.slice(0, max - 1).replace(/\s+\S*$/, "")}…`;
}

export function resolveProductSeo(product, path) {
  const name = clean(product.name);
  const title = firstFilled(product.seoTitle, `${name} | ${SITE_NAME}`);
  const description = firstFilled(
    product.metaDescription,
    excerpt(product.description),
    `Buy ${name} online from ${SITE_NAME}, ${BRAND.location}.`,
  );
  const primaryImage = firstFilled(product.images?.[0], DEFAULT_OG_IMAGE);
  const ogTitle = firstFilled(product.ogTitle, product.seoTitle, name);
  const ogDescription = firstFilled(product.ogDescription, description);
  const ogImage = absoluteUrl(firstFilled(product.ogImage, primaryImage));

  return {
    title,
    description,
    canonical: firstFilled(product.canonicalUrl, absoluteUrl(path)),
    imageAlt: firstFilled(product.imageAltText, `${name} - ${SITE_NAME}`),
    ogTitle,
    ogDescription,
    ogImage,
    twitterTitle: firstFilled(product.twitterTitle, ogTitle),
    twitterDescription: firstFilled(product.twitterDescription, ogDescription),
    twitterImage: absoluteUrl(firstFilled(product.twitterImage, ogImage)),
  };
}

/**
 * Next.js Metadata for a product detail page. Inactive (draft/hidden)
 * products are served but marked noindex so they can't be indexed.
 */
export function buildProductMetadata(product, path) {
  const seo = resolveProductSeo(product, path);
  const indexable = product.isActive !== false;

  return {
    title: seo.title,
    description: seo.description,
    alternates: { canonical: seo.canonical },
    robots: indexable
      ? { index: true, follow: true, googleBot: { index: true, follow: true } }
      : { index: false, follow: true },
    openGraph: {
      title: seo.ogTitle,
      description: seo.ogDescription,
      url: seo.canonical,
      siteName: SITE_NAME,
      images: [{ url: seo.ogImage, alt: seo.imageAlt }],
      locale: "en_IN",
      // og:type "product" isn't accepted by Next's Metadata API — the page
      // component emits that one tag itself (see products/[slug]/page.js).
    },
    twitter: {
      card: "summary_large_image",
      title: seo.twitterTitle,
      description: seo.twitterDescription,
      images: [seo.twitterImage],
    },
  };
}

// schema.org Product from REAL data only: no brand (not stored), no
// ratings/reviews (none exist), sku only when exactly one sellable variant
// carries one. Offer price/availability come from price + stock; products
// with variants priced differently become an AggregateOffer range.
export function buildProductJsonLd(product, path) {
  const seo = resolveProductSeo(product, path);
  const url = absoluteUrl(path);
  const variants = (product.variants ?? []).filter((v) => v.isActive);

  const prices = variants.length
    ? variants.map((v) => v.price ?? product.price)
    : [product.price];
  const inStock = variants.length
    ? variants.some((v) => v.stock > 0)
    : product.stock > 0;
  const availability = `https://schema.org/${inStock ? "InStock" : "OutOfStock"}`;
  const low = Math.min(...prices);
  const high = Math.max(...prices);

  const offers =
    low === high
      ? { "@type": "Offer", url, priceCurrency: "INR", price: low, availability }
      : {
          "@type": "AggregateOffer",
          url,
          priceCurrency: "INR",
          lowPrice: low,
          highPrice: high,
          offerCount: prices.length,
          availability,
        };

  const skus = variants.map((v) => clean(v.sku)).filter(Boolean);
  const images = (product.images ?? []).map((src) => absoluteUrl(src));

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: seo.description,
    image: images.length ? images : [absoluteUrl(DEFAULT_OG_IMAGE)],
    ...(variants.length === 1 && skus.length === 1 ? { sku: skus[0] } : {}),
    ...(clean(product.category) ? { category: clean(product.category) } : {}),
    url,
    offers,
  };
}
