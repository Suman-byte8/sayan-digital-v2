-- CreateEnum
CREATE TYPE "ProductType" AS ENUM ('PRINTING', 'STATIONERY');

-- AlterTable
ALTER TABLE "products" ADD COLUMN     "badge" TEXT,
ADD COLUMN     "type" "ProductType" NOT NULL DEFAULT 'PRINTING',
ADD COLUMN     "unit" TEXT;
