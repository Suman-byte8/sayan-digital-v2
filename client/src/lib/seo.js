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

// Only used on product detail pages, where a specific real product (name,
// description, image, price) is actually on the page — never on category/
// listing pages, so this never represents generic stationery items as if
// they were individually reviewed/priced products with invented data.
export function buildProductJsonLd(product, path) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: absoluteUrl(product.image),
    category: product.categoryLabel,
    url: absoluteUrl(path),
    offers: {
      "@type": "Offer",
      url: absoluteUrl(path),
      priceCurrency: "INR",
      price: product.price,
    },
  };
}
