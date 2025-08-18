/*
  Warnings:

  - The primary key for the `VerificationToken` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `createdAt` on the `VerificationToken` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `VerificationToken` table. All the data in the column will be lost.
  - You are about to drop the column `id` on the `VerificationToken` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `VerificationToken` table. All the data in the column will be lost.
  - Added the required column `identifier` to the `VerificationToken` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "public"."VerificationToken_email_key";

-- AlterTable
ALTER TABLE "public"."VerificationToken" DROP CONSTRAINT "VerificationToken_pkey",
DROP COLUMN "createdAt",
DROP COLUMN "email",
DROP COLUMN "id",
DROP COLUMN "updatedAt",
ADD COLUMN     "identifier" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "VerificationToken_identifier_idx" ON "public"."VerificationToken"("identifier");
