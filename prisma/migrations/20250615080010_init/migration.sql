/*
  Warnings:

  - Added the required column `changeInMoney` to the `MovementProduct` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "MovementProduct" ADD COLUMN     "changeInMoney" DOUBLE PRECISION NOT NULL;
