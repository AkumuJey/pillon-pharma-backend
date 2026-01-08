/*
  Warnings:

  - Made the column `reason` on table `stockmovement` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `stockmovement` MODIFY `reason` VARCHAR(191) NOT NULL;
