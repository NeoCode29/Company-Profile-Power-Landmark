/*
  Warnings:

  - Added the required column `basePrice` to the `Service` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cardText` to the `Service` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dialogText` to the `Service` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Service" ADD COLUMN     "basePrice" INTEGER NOT NULL,
ADD COLUMN     "cardText" TEXT NOT NULL,
ADD COLUMN     "dialogText" TEXT NOT NULL,
ADD COLUMN     "pricePerMeter" INTEGER;
