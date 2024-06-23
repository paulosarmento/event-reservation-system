/*
  Warnings:

  - You are about to drop the `Addresses` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Carts` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CartsProducts` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Categories` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Image` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Orders` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `OrdersStatus` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Persons` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ProductVariation` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Products` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Users` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UsersLogs` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UsersPasswordRecovery` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `productsCategories` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `Addresses` DROP FOREIGN KEY `Addresses_personId_fkey`;

-- DropForeignKey
ALTER TABLE `Carts` DROP FOREIGN KEY `Carts_userId_fkey`;

-- DropForeignKey
ALTER TABLE `CartsProducts` DROP FOREIGN KEY `CartsProducts_cartId_fkey`;

-- DropForeignKey
ALTER TABLE `CartsProducts` DROP FOREIGN KEY `CartsProducts_productId_fkey`;

-- DropForeignKey
ALTER TABLE `Image` DROP FOREIGN KEY `Image_productId_fkey`;

-- DropForeignKey
ALTER TABLE `Orders` DROP FOREIGN KEY `Orders_addressId_fkey`;

-- DropForeignKey
ALTER TABLE `Orders` DROP FOREIGN KEY `Orders_cartId_fkey`;

-- DropForeignKey
ALTER TABLE `Orders` DROP FOREIGN KEY `Orders_statusId_fkey`;

-- DropForeignKey
ALTER TABLE `Orders` DROP FOREIGN KEY `Orders_userId_fkey`;

-- DropForeignKey
ALTER TABLE `ProductVariation` DROP FOREIGN KEY `ProductVariation_productId_fkey`;

-- DropForeignKey
ALTER TABLE `Users` DROP FOREIGN KEY `Users_personId_fkey`;

-- DropForeignKey
ALTER TABLE `UsersLogs` DROP FOREIGN KEY `UsersLogs_userId_fkey`;

-- DropForeignKey
ALTER TABLE `UsersPasswordRecovery` DROP FOREIGN KEY `UsersPasswordRecovery_userId_fkey`;

-- DropForeignKey
ALTER TABLE `productsCategories` DROP FOREIGN KEY `productsCategories_categoriesId_fkey`;

-- DropForeignKey
ALTER TABLE `productsCategories` DROP FOREIGN KEY `productsCategories_productsId_fkey`;

-- DropTable
DROP TABLE `Addresses`;

-- DropTable
DROP TABLE `Carts`;

-- DropTable
DROP TABLE `CartsProducts`;

-- DropTable
DROP TABLE `Categories`;

-- DropTable
DROP TABLE `Image`;

-- DropTable
DROP TABLE `Orders`;

-- DropTable
DROP TABLE `OrdersStatus`;

-- DropTable
DROP TABLE `Persons`;

-- DropTable
DROP TABLE `ProductVariation`;

-- DropTable
DROP TABLE `Products`;

-- DropTable
DROP TABLE `Users`;

-- DropTable
DROP TABLE `UsersLogs`;

-- DropTable
DROP TABLE `UsersPasswordRecovery`;

-- DropTable
DROP TABLE `productsCategories`;

-- CreateTable
CREATE TABLE `Product` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `code` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `unit` VARCHAR(191) NOT NULL,
    `NCM` VARCHAR(191) NULL,
    `origin` INTEGER NULL,
    `price` DOUBLE NOT NULL,
    `valueIPI` DOUBLE NULL,
    `observations` VARCHAR(191) NULL,
    `situation` VARCHAR(191) NOT NULL,
    `stock` DOUBLE NULL,
    `costPrice` DOUBLE NULL,
    `supplierCode` VARCHAR(191) NULL,
    `supplier` VARCHAR(191) NULL,
    `location` VARCHAR(191) NULL,
    `maxStock` DOUBLE NULL,
    `minStock` DOUBLE NULL,
    `netWeight` DOUBLE NULL,
    `grossWeight` DOUBLE NULL,
    `GTINEAN` VARCHAR(191) NULL,
    `GTINEANPackage` VARCHAR(191) NULL,
    `productWidth` DOUBLE NULL,
    `productHeight` DOUBLE NULL,
    `productDepth` DOUBLE NULL,
    `expirationDate` DATETIME(3) NULL,
    `supplierProductDescription` VARCHAR(191) NULL,
    `additionalDescription` VARCHAR(191) NULL,
    `itemsPerBox` DOUBLE NULL,
    `productVariation` VARCHAR(191) NULL,
    `productionType` VARCHAR(191) NULL,
    `IPIClassification` VARCHAR(191) NULL,
    `serviceListCode` VARCHAR(191) NULL,
    `itemType` VARCHAR(191) NULL,
    `tags` VARCHAR(191) NULL,
    `tributes` DOUBLE NULL,
    `parentCode` VARCHAR(191) NULL,
    `integrationCode` INTEGER NULL,
    `productGroup` VARCHAR(191) NULL,
    `brand` VARCHAR(191) NULL,
    `CEST` VARCHAR(191) NULL,
    `volumes` INTEGER NULL,
    `shortDescription` VARCHAR(191) NULL,
    `crossDocking` INTEGER NULL,
    `externalImageURLs` VARCHAR(191) NULL,
    `externalLink` VARCHAR(191) NULL,
    `supplierWarrantyMonths` VARCHAR(191) NULL,
    `cloneParentData` VARCHAR(191) NULL,
    `productCondition` VARCHAR(191) NULL,
    `freeShipping` VARCHAR(191) NULL,
    `FCI` VARCHAR(191) NULL,
    `video` VARCHAR(191) NULL,
    `department` VARCHAR(191) NULL,
    `unitOfMeasure` VARCHAR(191) NULL,
    `purchasePrice` DOUBLE NULL,
    `ICMSBaseRetentionValue` DOUBLE NULL,
    `ICMSRetentionValue` DOUBLE NULL,
    `ICMSOwnSubstituteValue` DOUBLE NULL,
    `productCategory` VARCHAR(191) NULL,
    `additionalInformation` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
