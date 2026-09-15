-- Add the new columns first (nullable/defaulted, so existing rows are valid).
ALTER TABLE "products"
  ADD COLUMN "images" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  ADD COLUMN "minOrderQty" INTEGER;

-- Preserve existing single-image data into the new array column before
-- dropping the old one.
UPDATE "products"
SET "images" = ARRAY["imageUrl"]
WHERE "imageUrl" IS NOT NULL;

ALTER TABLE "products" DROP COLUMN "imageUrl";
