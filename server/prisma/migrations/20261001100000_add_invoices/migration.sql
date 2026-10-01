-- CreateTable
CREATE TABLE "invoices" (
    "id" TEXT NOT NULL,
    "invoiceNumber" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'UNPAID',
    "clientName" TEXT NOT NULL,
    "clientPhone" TEXT,
    "clientEmail" TEXT,
    "clientAddress" TEXT,
    "clientGstin" TEXT,
    "issueDate" DATE NOT NULL,
    "dueDate" DATE,
    "items" JSONB NOT NULL,
    "gstEnabled" BOOLEAN NOT NULL DEFAULT false,
    "gstMode" TEXT NOT NULL DEFAULT 'INTRA',
    "gstRate" DECIMAL(5,2) NOT NULL DEFAULT 18,
    "pricesIncludeGst" BOOLEAN NOT NULL DEFAULT false,
    "discountType" TEXT NOT NULL DEFAULT 'PERCENT',
    "discountValue" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "roundOff" BOOLEAN NOT NULL DEFAULT true,
    "subtotal" DECIMAL(12,2) NOT NULL,
    "discountAmount" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "taxAmount" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "total" DECIMAL(12,2) NOT NULL,
    "amountPaid" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "balanceDue" DECIMAL(12,2) NOT NULL,
    "business" JSONB NOT NULL,
    "paymentInfo" JSONB NOT NULL,
    "notes" TEXT,
    "terms" TEXT,
    "thankYou" TEXT,
    "accentColor" TEXT NOT NULL DEFAULT '#4a3f94',
    "driveFileId" TEXT,
    "driveUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "invoices_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "invoices_invoiceNumber_key" ON "invoices"("invoiceNumber");

-- CreateIndex
CREATE INDEX "invoices_createdAt_idx" ON "invoices"("createdAt");

-- CreateIndex
CREATE INDEX "invoices_status_idx" ON "invoices"("status");
