/*
  Warnings:

  - A unique constraint covering the columns `[cName]` on the table `Plant` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[sName]` on the table `Plant` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Plant_cName_key" ON "Plant"("cName");

-- CreateIndex
CREATE UNIQUE INDEX "Plant_sName_key" ON "Plant"("sName");
