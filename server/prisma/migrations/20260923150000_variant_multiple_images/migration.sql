-- AlterTable: ProductVariant.image (single, nullable) -> images (array)
-- No real variant data exists outside local dev/testing yet (this whole
-- feature is unmerged), so no backfill is needed - a plain drop+add is safe.
ALTER TABLE "product_variants" DROP COLUMN "image";
ALTER TABLE "product_variants" ADD COLUMN "images" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[];

-- Fixes a real inconsistency from the previous migration: every other
-- String[] @default([]) column in this schema (products.images,
-- product_variants.images above) is NOT NULL - this one was missed.
ALTER TABLE "product_variant_options" ALTER COLUMN "values" SET NOT NULL;
