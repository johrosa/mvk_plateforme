-- AlterTable
ALTER TABLE "Storage" ADD COLUMN "latitude" REAL;
ALTER TABLE "Storage" ADD COLUMN "longitude" REAL;

-- AlterTable
ALTER TABLE "Transport" ADD COLUMN "latitude" REAL;
ALTER TABLE "Transport" ADD COLUMN "longitude" REAL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN "latitude" REAL;
ALTER TABLE "User" ADD COLUMN "longitude" REAL;
