-- AlterTable: per-product SEO metadata. All nullable (blank = storefront
-- falls back to name/description/first image), except the boolean default.
ALTER TABLE "products"
  ADD COLUMN "seoTitle" VARCHAR(120),
  ADD COLUMN "metaDescription" VARCHAR(320),
  ADD COLUMN "imageAltText" VARCHAR(200),
  ADD COLUMN "canonicalUrl" VARCHAR(500),
  ADD COLUMN "ogTitle" VARCHAR(120),
  ADD COLUMN "ogDescription" VARCHAR(320),
  ADD COLUMN "ogImage" VARCHAR(500),
  ADD COLUMN "twitterTitle" VARCHAR(120),
  ADD COLUMN "twitterDescription" VARCHAR(320),
  ADD COLUMN "twitterImage" VARCHAR(500),
  ADD COLUMN "structuredDataEnabled" BOOLEAN NOT NULL DEFAULT true;
