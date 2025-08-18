/*
  Warnings:

  - Added the required column `adultos` to the `Reserva` table without a default value. This is not possible if the table is not empty.
  - Added the required column `niños` to the `Reserva` table without a default value. This is not possible if the table is not empty.
  - Added the required column `telefono` to the `Reserva` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `fecha` on the `Reserva` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropIndex
DROP INDEX "public"."VerificationToken_token_key";

-- AlterTable
ALTER TABLE "public"."Reserva" ADD COLUMN     "adultos" INTEGER NOT NULL,
ADD COLUMN     "contactoEmergencia" JSONB,
ADD COLUMN     "estado" TEXT DEFAULT 'Pagada',
ADD COLUMN     "niños" INTEGER NOT NULL,
ADD COLUMN     "participantes" JSONB,
ADD COLUMN     "telefono" TEXT NOT NULL,
DROP COLUMN "fecha",
ADD COLUMN     "fecha" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "hora" DROP NOT NULL;

-- AlterTable
ALTER TABLE "public"."VerificationToken" ADD CONSTRAINT "VerificationToken_pkey" PRIMARY KEY ("identifier", "token");

-- DropIndex
DROP INDEX "public"."VerificationToken_identifier_token_key";
