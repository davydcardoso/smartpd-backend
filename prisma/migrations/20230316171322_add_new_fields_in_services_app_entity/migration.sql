/*
  Warnings:

  - You are about to drop the `servcies` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "ServicesAmbient" AS ENUM ('PRODUCTION', 'DEVELOPMENT', 'SANDBOX');

-- CreateEnum
CREATE TYPE "ServicesStatus" AS ENUM ('ONLINE', 'OFFLINE');

-- DropForeignKey
ALTER TABLE "apps_services" DROP CONSTRAINT "apps_services_service_id_fkey";

-- DropTable
DROP TABLE "servcies";

-- CreateTable
CREATE TABLE "services" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(150) NOT NULL,
    "description" VARCHAR(255),
    "path_url" VARCHAR NOT NULL,
    "button_icon" TEXT,
    "ambient" "ServicesAmbient" NOT NULL DEFAULT 'SANDBOX',
    "status" "ServicesStatus" NOT NULL DEFAULT 'OFFLINE',
    "created_at" DATE,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "services_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "services_name_key" ON "services"("name");

-- AddForeignKey
ALTER TABLE "apps_services" ADD CONSTRAINT "apps_services_service_id_fkey" FOREIGN KEY ("service_id") REFERENCES "services"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
