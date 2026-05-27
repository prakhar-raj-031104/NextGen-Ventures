-- AlterTable
ALTER TABLE "Lead" ADD COLUMN     "budget" TEXT,
ADD COLUMN     "businessType" TEXT,
ADD COLUMN     "timeline" TEXT;

-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "liveUrl" TEXT;

-- AlterTable
ALTER TABLE "Service" ADD COLUMN     "whyUs" TEXT[];
