/*
  Warnings:

  - You are about to drop the column `stock` on the `ServiceDetail` table. All the data in the column will be lost.
  - Added the required column `unit` to the `ServiceDetail` table without a default value. This is not possible if the table is not empty.
  - Added the required column `unitType` to the `ServiceDetail` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ServiceDetail" DROP COLUMN "stock",
ADD COLUMN     "unit" INTEGER NOT NULL,
ADD COLUMN     "unitType" TEXT NOT NULL,
ADD COLUMN     "variant" TEXT;
