/*
  Warnings:

  - A unique constraint covering the columns `[order_index]` on the table `projects` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "projects_order_index_key" ON "projects"("order_index");
