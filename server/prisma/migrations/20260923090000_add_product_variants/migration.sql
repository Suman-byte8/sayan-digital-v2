-- CreateTable
CREATE TABLE "product_variant_options" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "position" INTEGER NOT NULL DEFAULT 0,
    "values" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "product_variant_options_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "product_variant_options_productId_name_key" ON "product_variant_options"("productId", "name");

-- AddForeignKey
ALTER TABLE "product_variant_options" ADD CONSTRAINT "product_variant_options_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- CreateTable
CREATE TABLE "product_variants" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "selection" JSONB NOT NULL,
    "selectionKey" TEXT NOT NULL,
    "sku" TEXT,
    "price" DECIMAL(10,2),
    "stock" INTEGER NOT NULL DEFAULT 0,
    "image" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "position" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "product_variants_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "product_variants_sku_key" ON "product_variants"("sku");

-- CreateIndex
CREATE UNIQUE INDEX "product_variants_productId_selectionKey_key" ON "product_variants"("productId", "selectionKey");

-- AddForeignKey
ALTER TABLE "product_variants" ADD CONSTRAINT "product_variants_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AlterTable cart_items: add variantId + variantKey (nullable first, backfilled below)
ALTER TABLE "cart_items" ADD COLUMN "variantId" TEXT;
ALTER TABLE "cart_items" ADD COLUMN "variantKey" TEXT;

-- Backfill: every existing row has no variant, so its key is just its product.
UPDATE "cart_items" SET "variantKey" = "productId" WHERE "variantKey" IS NULL;

ALTER TABLE "cart_items" ALTER COLUMN "variantKey" SET NOT NULL;

-- Replace the old (userId, productId) uniqueness with (userId, productId, variantKey)
DROP INDEX "cart_items_userId_productId_key";
CREATE UNIQUE INDEX "cart_items_userId_productId_variantKey_key" ON "cart_items"("userId", "productId", "variantKey");

-- AddForeignKey
ALTER TABLE "cart_items" ADD CONSTRAINT "cart_items_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "product_variants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AlterTable order_items: add variantId + frozen variantLabel snapshot
ALTER TABLE "order_items" ADD COLUMN "variantId" TEXT;
ALTER TABLE "order_items" ADD COLUMN "variantLabel" TEXT;

-- AddForeignKey
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "product_variants"("id") ON DELETE SET NULL ON UPDATE CASCADE;
