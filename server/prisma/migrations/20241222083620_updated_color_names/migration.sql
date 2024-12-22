/*
  Warnings:

  - You are about to drop the column `pcolor` on the `Plant` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Plant" DROP COLUMN "pcolor",
ADD COLUMN     "pColor" TEXT;
