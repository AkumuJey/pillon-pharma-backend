/*
  Warnings:

  - You are about to drop the column `createdBy` on the `sale` table. All the data in the column will be lost.
  - Added the required column `createdById` to the `InventoryBatch` table without a default value. This is not possible if the table is not empty.
  - Added the required column `createdById` to the `Sale` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `inventorybatch` ADD COLUMN `createdById` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `sale` DROP COLUMN `createdBy`,
    ADD COLUMN `createdById` VARCHAR(191) NOT NULL,
    ADD COLUMN `sessionId` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `stockmovement` MODIFY `referenceId` VARCHAR(191) NULL;

-- CreateIndex
CREATE INDEX `Sale_createdById_idx` ON `Sale`(`createdById`);

-- AddForeignKey
ALTER TABLE `InventoryBatch` ADD CONSTRAINT `InventoryBatch_createdById_fkey` FOREIGN KEY (`createdById`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Sale` ADD CONSTRAINT `Sale_createdById_fkey` FOREIGN KEY (`createdById`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Sale` ADD CONSTRAINT `Sale_sessionId_fkey` FOREIGN KEY (`sessionId`) REFERENCES `Session`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
