/*
  Warnings:

  - You are about to drop the `rental_items` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `gearItemId` to the `rental_orders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pricePerDay` to the `rental_orders` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "rental_items" DROP CONSTRAINT "rental_items_gearItemId_fkey";

-- DropForeignKey
ALTER TABLE "rental_items" DROP CONSTRAINT "rental_items_rentalOrderId_fkey";

-- AlterTable
ALTER TABLE "rental_orders" ADD COLUMN     "days" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "gearItemId" TEXT NOT NULL,
ADD COLUMN     "pricePerDay" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "quantity" INTEGER NOT NULL DEFAULT 1;

-- DropTable
DROP TABLE "rental_items";

-- CreateIndex
CREATE INDEX "rental_orders_gearItemId_idx" ON "rental_orders"("gearItemId");

-- AddForeignKey
ALTER TABLE "rental_orders" ADD CONSTRAINT "rental_orders_gearItemId_fkey" FOREIGN KEY ("gearItemId") REFERENCES "gear_items"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
