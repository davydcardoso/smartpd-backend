/*
  Warnings:

  - The `status` column on the `companies` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "CompanyStatus" AS ENUM ('ACTIVATED', 'DEACTIVATED', 'EXCLUDED');

-- AlterTable
ALTER TABLE "companies" DROP COLUMN "status",
ADD COLUMN     "status" "CompanyStatus" NOT NULL DEFAULT 'DEACTIVATED';
