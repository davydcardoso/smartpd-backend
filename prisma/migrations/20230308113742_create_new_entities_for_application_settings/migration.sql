/*
  Warnings:

  - You are about to drop the `modules` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "modules" DROP CONSTRAINT "modules_company_id_fkey";

-- DropTable
DROP TABLE "modules";

-- CreateTable
CREATE TABLE "servcies" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(150) NOT NULL,
    "description" VARCHAR(255),
    "path_url" VARCHAR NOT NULL,
    "button_icon" TEXT,
    "created_at" DATE,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "servcies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "apps" (
    "id" TEXT NOT NULL,
    "status" VARCHAR NOT NULL,
    "version" VARCHAR NOT NULL,
    "current_plan" VARCHAR NOT NULL,
    "publication_date" DATE NOT NULL,
    "available_versions" TEXT NOT NULL,
    "company_id" TEXT NOT NULL,
    "created_at" DATE,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "apps_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "apps_services" (
    "id" TEXT NOT NULL,
    "service_id" VARCHAR NOT NULL,
    "apps_id" VARCHAR NOT NULL,
    "created_at" DATE,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "apps_services_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "servcies_name_key" ON "servcies"("name");

-- AddForeignKey
ALTER TABLE "apps" ADD CONSTRAINT "apps_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "apps_services" ADD CONSTRAINT "apps_services_service_id_fkey" FOREIGN KEY ("service_id") REFERENCES "servcies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "apps_services" ADD CONSTRAINT "apps_services_apps_id_fkey" FOREIGN KEY ("apps_id") REFERENCES "apps"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
