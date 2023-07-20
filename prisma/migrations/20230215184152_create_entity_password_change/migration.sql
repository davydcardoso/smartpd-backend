/*
  Warnings:

  - You are about to drop the column `birthDate` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `emailConfirmed` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `motherName` on the `users` table. All the data in the column will be lost.
  - Added the required column `birth_date` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `mother_name` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "birthDate",
DROP COLUMN "emailConfirmed",
DROP COLUMN "motherName",
ADD COLUMN     "birth_date" DATE NOT NULL,
ADD COLUMN     "email_confirmed" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "mother_name" VARCHAR(255) NOT NULL;

-- CreateTable
CREATE TABLE "password_changes" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "expires_in" TIMESTAMP(3) NOT NULL,
    "created_at" DATE,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "password_changes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "password_changes_code_key" ON "password_changes"("code");
