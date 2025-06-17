/*
  Warnings:

  - You are about to drop the column `productId` on the `MovementProduct` table. All the data in the column will be lost.
  - You are about to drop the column `hasVariants` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `pictureUrl` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `price` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `sku` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `stock` on the `Product` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "MovementProduct" DROP CONSTRAINT "MovementProduct_productId_fkey";

-- DropIndex
DROP INDEX "Product_sku_key";

-- AlterTable
ALTER TABLE "Movement" ADD COLUMN     "providerId" INTEGER;

-- AlterTable
ALTER TABLE "MovementProduct" DROP COLUMN "productId";

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "hasVariants",
DROP COLUMN "pictureUrl",
DROP COLUMN "price",
DROP COLUMN "sku",
DROP COLUMN "stock";

-- AddForeignKey
ALTER TABLE "Movement" ADD CONSTRAINT "Movement_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "Provider"("id") ON DELETE SET NULL ON UPDATE CASCADE;
