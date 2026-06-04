-- CreateEnum
CREATE TYPE "InquiryStatus" AS ENUM ('NEW', 'REVIEWING', 'QUOTED', 'CLOSED');

-- CreateTable
CREATE TABLE "ServiceInquiry" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "company" TEXT,
    "serviceSlug" TEXT NOT NULL,
    "serviceName" TEXT NOT NULL,
    "selections" JSONB NOT NULL,
    "estimate" TEXT,
    "message" TEXT,
    "status" "InquiryStatus" NOT NULL DEFAULT 'NEW',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ServiceInquiry_pkey" PRIMARY KEY ("id")
);
