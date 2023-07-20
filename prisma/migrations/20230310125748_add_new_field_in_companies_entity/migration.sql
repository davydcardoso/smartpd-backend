/*
  Warnings:

  - You are about to drop the column `is_enabled` on the `companies` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "companies" DROP COLUMN "is_enabled",
ADD COLUMN     "responsible_entity" VARCHAR,
ADD COLUMN     "sig_url" VARCHAR;
