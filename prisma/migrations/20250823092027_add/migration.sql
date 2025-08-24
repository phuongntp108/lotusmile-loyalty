/*
  Warnings:

  - A unique constraint covering the columns `[ssm_id]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN "ssm_id" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "User_ssm_id_key" ON "User"("ssm_id");
