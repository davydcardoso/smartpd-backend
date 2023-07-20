/*
  Warnings:

  - Added the required column `birthDate` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `motherName` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `telephone` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "users" ADD COLUMN     "birthDate" DATE NOT NULL,
ADD COLUMN     "emailConfirmed" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "motherName" VARCHAR(255) NOT NULL,
ADD COLUMN     "telephone" VARCHAR(21) NOT NULL;
