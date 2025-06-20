/*
  Warnings:

  - You are about to drop the column `description` on the `Service` table. All the data in the column will be lost.
  - Added the required column `category` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `size` to the `Service` table without a default value. This is not possible if the table is not empty.
  - Made the column `price` on table `Service` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "ProductCategory" AS ENUM ('ARCHITECTURAL_DESIGN', 'RENOVATION', 'CONSTRUCTION');

-- AlterTable
ALTER TABLE "OrderItem" ADD COLUMN     "size" TEXT;

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "category" "ProductCategory" NOT NULL DEFAULT 'ARCHITECTURAL_DESIGN';

-- AlterTable
ALTER TABLE "Service" DROP COLUMN "description",
ADD COLUMN     "size" TEXT NOT NULL,
ALTER COLUMN "price" SET NOT NULL;
