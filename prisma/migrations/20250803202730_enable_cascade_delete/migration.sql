-- DropForeignKey
ALTER TABLE "public"."AvailableDate" DROP CONSTRAINT "AvailableDate_tourId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Reserva" DROP CONSTRAINT "Reserva_guiaId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Reserva" DROP CONSTRAINT "Reserva_tourId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Reserva" DROP CONSTRAINT "Reserva_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Review" DROP CONSTRAINT "Review_tourId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Review" DROP CONSTRAINT "Review_userId_fkey";

-- AddForeignKey
ALTER TABLE "public"."Review" ADD CONSTRAINT "Review_tourId_fkey" FOREIGN KEY ("tourId") REFERENCES "public"."Tour"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Review" ADD CONSTRAINT "Review_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Reserva" ADD CONSTRAINT "Reserva_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Reserva" ADD CONSTRAINT "Reserva_tourId_fkey" FOREIGN KEY ("tourId") REFERENCES "public"."Tour"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Reserva" ADD CONSTRAINT "Reserva_guiaId_fkey" FOREIGN KEY ("guiaId") REFERENCES "public"."Guia"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AvailableDate" ADD CONSTRAINT "AvailableDate_tourId_fkey" FOREIGN KEY ("tourId") REFERENCES "public"."Tour"("id") ON DELETE CASCADE ON UPDATE CASCADE;
