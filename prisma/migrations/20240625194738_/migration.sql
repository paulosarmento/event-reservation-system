/*
  Warnings:

  - Made the column `productId` on table `ExternalImageURLs` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `ExternalImageURLs` DROP FOREIGN KEY `ExternalImageURLs_productId_fkey`;

-- AlterTable
ALTER TABLE `ExternalImageURLs` MODIFY `productId` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `ExternalImageURLs` ADD CONSTRAINT `ExternalImageURLs_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Product`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
