-- CreateTable
CREATE TABLE "ClientAccount" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "company" TEXT NOT NULL,
    "domain" TEXT NOT NULL,
    "mobile" TEXT NOT NULL,
    "dob" DATE NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "lastLoginAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ClientAccount_pkey" PRIMARY KEY ("id")
);

-- AlterTable
ALTER TABLE "ClientTicket" ADD COLUMN "accountId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "ClientAccount_email_key" ON "ClientAccount"("email");

-- CreateIndex
CREATE UNIQUE INDEX "ClientAccount_domain_key" ON "ClientAccount"("domain");

-- CreateIndex
CREATE INDEX "ClientTicket_accountId_idx" ON "ClientTicket"("accountId");

-- AddForeignKey
ALTER TABLE "ClientTicket" ADD CONSTRAINT "ClientTicket_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "ClientAccount"("id") ON DELETE SET NULL ON UPDATE CASCADE;
