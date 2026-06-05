-- AlterTable
ALTER TABLE "ClientTicket" ADD COLUMN "addOns" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN "estimate" TEXT;
