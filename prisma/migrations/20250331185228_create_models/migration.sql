/*
  Warnings:

  - The `questions` column on the `Assessment` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `salaryRanges` column on the `IndustryInsight` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Assessment" DROP COLUMN "questions",
ADD COLUMN     "questions" JSONB[];

-- AlterTable
ALTER TABLE "IndustryInsight" DROP COLUMN "salaryRanges",
ADD COLUMN     "salaryRanges" JSONB[];

-- CreateIndex
CREATE INDEX "IndustryInsight_industry_idx" ON "IndustryInsight"("industry");

-- RenameIndex
ALTER INDEX "unique_industry" RENAME TO "IndustryInsight_industry_key";
