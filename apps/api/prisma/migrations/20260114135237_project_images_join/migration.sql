/*
  Warnings:

  - You are about to drop the column `alt_text` on the `images` table. All the data in the column will be lost.
  - You are about to drop the column `order_index` on the `images` table. All the data in the column will be lost.
  - You are about to drop the column `project_id` on the `images` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `images` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[url]` on the table `images` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "images" DROP CONSTRAINT "images_project_id_fkey";

-- DropIndex
DROP INDEX "images_project_id_idx";

-- AlterTable
ALTER TABLE "images" DROP COLUMN "alt_text",
DROP COLUMN "order_index",
DROP COLUMN "project_id",
DROP COLUMN "type";

-- CreateTable
CREATE TABLE "project_images" (
  "project_id" UUID NOT NULL,
  "image_id" UUID NOT NULL,
  "type" "ImageType" NOT NULL,
  "alt_text" TEXT,
  "order_index" INTEGER NOT NULL,

  CONSTRAINT "project_images_pkey" PRIMARY KEY ("project_id","image_id")
);

-- CreateIndex
CREATE INDEX "project_images_project_id_idx" ON "project_images"("project_id");

-- CreateIndex
CREATE INDEX "project_images_image_id_idx" ON "project_images"("image_id");

-- CreateIndex
CREATE UNIQUE INDEX "images_url_key" ON "images"("url");

-- AddForeignKey
ALTER TABLE "project_images" ADD CONSTRAINT "project_images_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_images" ADD CONSTRAINT "project_images_image_id_fkey" FOREIGN KEY ("image_id") REFERENCES "images"("id") ON DELETE CASCADE ON UPDATE CASCADE;
