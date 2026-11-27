-- AlterTable
ALTER TABLE "Address" ADD COLUMN "isActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN "userId" TEXT,
ALTER COLUMN "companyId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Order" ADD COLUMN "carrier" TEXT,
ADD COLUMN "mpPaymentId" TEXT,
ADD COLUMN "paymentMethod" TEXT,
ADD COLUMN "requiresInvoice" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN "rfc" TEXT,
ADD COLUMN "shippedAt" TIMESTAMP(3),
ADD COLUMN "shippingCost" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN "subtotal" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN "taxAmount" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN "trackingNumber" TEXT;

-- Preserve existing order totals while providing safe values for new fields.
UPDATE "Order" SET "subtotal" = "totalAmount";

ALTER TABLE "Order"
ALTER COLUMN "shippingCost" DROP DEFAULT,
ALTER COLUMN "subtotal" DROP DEFAULT,
ALTER COLUMN "taxAmount" DROP DEFAULT;

-- Ensure every address belongs to exactly one user or company.
ALTER TABLE "Address"
ADD CONSTRAINT "Address_owner_xor_check"
CHECK (("companyId" IS NULL) <> ("userId" IS NULL));

-- CreateIndex
CREATE INDEX "Address_userId_isActive_idx" ON "Address"("userId", "isActive");

-- CreateIndex
CREATE UNIQUE INDEX "Order_mpPaymentId_key" ON "Order"("mpPaymentId");

-- AddForeignKey
ALTER TABLE "Address" ADD CONSTRAINT "Address_userId_fkey"
FOREIGN KEY ("userId") REFERENCES "User"("id")
ON DELETE CASCADE ON UPDATE CASCADE;
