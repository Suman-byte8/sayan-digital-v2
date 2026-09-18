-- AlterTable
-- orders is genuinely empty (no checkout flow existed until now), so these
-- can be added NOT NULL directly with no backfill needed.
ALTER TABLE "orders" ADD COLUMN "shippingName" TEXT NOT NULL;
ALTER TABLE "orders" ADD COLUMN "shippingPhone" TEXT NOT NULL;
ALTER TABLE "orders" ADD COLUMN "shippingAddressLine1" TEXT NOT NULL;
ALTER TABLE "orders" ADD COLUMN "shippingAddressLine2" TEXT;
ALTER TABLE "orders" ADD COLUMN "shippingCity" TEXT NOT NULL;
ALTER TABLE "orders" ADD COLUMN "shippingState" TEXT NOT NULL;
ALTER TABLE "orders" ADD COLUMN "shippingPincode" TEXT NOT NULL;
