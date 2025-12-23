/*
  Warnings:

  - The primary key for the `drug` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `drugcategory` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `inventorybatch` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `sale` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `saleitem` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `stockmovement` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `supplier` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE `drug` DROP FOREIGN KEY `Drug_categoryId_fkey`;

-- DropForeignKey
ALTER TABLE `inventorybatch` DROP FOREIGN KEY `InventoryBatch_drugId_fkey`;

-- DropForeignKey
ALTER TABLE `inventorybatch` DROP FOREIGN KEY `InventoryBatch_supplierId_fkey`;

-- DropForeignKey
ALTER TABLE `saleitem` DROP FOREIGN KEY `SaleItem_drugId_fkey`;

-- DropForeignKey
ALTER TABLE `saleitem` DROP FOREIGN KEY `SaleItem_inventoryBatchId_fkey`;

-- DropForeignKey
ALTER TABLE `saleitem` DROP FOREIGN KEY `SaleItem_saleId_fkey`;

-- DropForeignKey
ALTER TABLE `stockmovement` DROP FOREIGN KEY `StockMovement_inventoryBatchId_fkey`;

-- DropIndex
DROP INDEX `Drug_categoryId_fkey` ON `drug`;

-- DropIndex
DROP INDEX `InventoryBatch_supplierId_fkey` ON `inventorybatch`;

-- DropIndex
DROP INDEX `SaleItem_drugId_fkey` ON `saleitem`;

-- DropIndex
DROP INDEX `SaleItem_inventoryBatchId_fkey` ON `saleitem`;

-- DropIndex
DROP INDEX `SaleItem_saleId_fkey` ON `saleitem`;

-- DropIndex
DROP INDEX `StockMovement_inventoryBatchId_fkey` ON `stockmovement`;

-- AlterTable
ALTER TABLE `drug` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(191) NOT NULL,
    MODIFY `categoryId` VARCHAR(191) NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `drugcategory` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `inventorybatch` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(191) NOT NULL,
    MODIFY `drugId` VARCHAR(191) NOT NULL,
    MODIFY `supplierId` VARCHAR(191) NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `sale` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `saleitem` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(191) NOT NULL,
    MODIFY `saleId` VARCHAR(191) NOT NULL,
    MODIFY `drugId` VARCHAR(191) NOT NULL,
    MODIFY `inventoryBatchId` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `stockmovement` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(191) NOT NULL,
    MODIFY `inventoryBatchId` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `supplier` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AddForeignKey
ALTER TABLE `Drug` ADD CONSTRAINT `Drug_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `DrugCategory`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `InventoryBatch` ADD CONSTRAINT `InventoryBatch_drugId_fkey` FOREIGN KEY (`drugId`) REFERENCES `Drug`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `InventoryBatch` ADD CONSTRAINT `InventoryBatch_supplierId_fkey` FOREIGN KEY (`supplierId`) REFERENCES `Supplier`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SaleItem` ADD CONSTRAINT `SaleItem_saleId_fkey` FOREIGN KEY (`saleId`) REFERENCES `Sale`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SaleItem` ADD CONSTRAINT `SaleItem_drugId_fkey` FOREIGN KEY (`drugId`) REFERENCES `Drug`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SaleItem` ADD CONSTRAINT `SaleItem_inventoryBatchId_fkey` FOREIGN KEY (`inventoryBatchId`) REFERENCES `InventoryBatch`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StockMovement` ADD CONSTRAINT `StockMovement_inventoryBatchId_fkey` FOREIGN KEY (`inventoryBatchId`) REFERENCES `InventoryBatch`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
