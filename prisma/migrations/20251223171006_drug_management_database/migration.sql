-- CreateTable
CREATE TABLE `Drug` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `brandName` VARCHAR(191) NOT NULL,
    `genericName` VARCHAR(191) NULL,
    `dosage` VARCHAR(191) NOT NULL,
    `barcode` VARCHAR(191) NULL,
    `isPrescriptionRequired` BOOLEAN NOT NULL DEFAULT false,
    `standardSellingPrice` DECIMAL(65, 30) NOT NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `categoryId` INTEGER NULL,

    UNIQUE INDEX `Drug_barcode_key`(`barcode`),
    INDEX `Drug_brandName_idx`(`brandName`),
    INDEX `Drug_genericName_idx`(`genericName`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `DrugCategory` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `DrugCategory_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Supplier` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `contactPerson` VARCHAR(191) NULL,
    `phone` VARCHAR(191) NULL,
    `email` VARCHAR(191) NULL,
    `address` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `InventoryBatch` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `batchNumber` VARCHAR(191) NOT NULL,
    `expiryDate` DATETIME(3) NOT NULL,
    `quantityReceived` INTEGER NOT NULL,
    `quantityRemaining` INTEGER NOT NULL,
    `buyingPrice` DECIMAL(65, 30) NOT NULL,
    `sellingPriceSnapshot` DECIMAL(65, 30) NOT NULL,
    `receivedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `drugId` INTEGER NOT NULL,
    `supplierId` INTEGER NULL,

    UNIQUE INDEX `InventoryBatch_drugId_batchNumber_key`(`drugId`, `batchNumber`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Sale` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `totalAmount` DECIMAL(65, 30) NOT NULL,
    `paymentMethod` ENUM('CASH', 'MPESA') NOT NULL,
    `createdBy` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `Sale_createdAt_idx`(`createdAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SaleItem` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `quantity` INTEGER NOT NULL,
    `unitPrice` DECIMAL(65, 30) NOT NULL,
    `totalPrice` DECIMAL(65, 30) NOT NULL,
    `saleId` INTEGER NOT NULL,
    `drugId` INTEGER NOT NULL,
    `inventoryBatchId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `StockMovement` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `movementType` ENUM('PURCHASE', 'SALE', 'ADJUSTMENT_IN', 'ADJUSTMENT_OUT', 'EXPIRED') NOT NULL,
    `quantity` INTEGER NOT NULL,
    `referenceId` INTEGER NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `inventoryBatchId` INTEGER NOT NULL,

    INDEX `StockMovement_movementType_idx`(`movementType`),
    INDEX `StockMovement_createdAt_idx`(`createdAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

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
