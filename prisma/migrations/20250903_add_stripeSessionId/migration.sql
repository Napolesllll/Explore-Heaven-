-- Migration: add stripeSessionId to Reserva
-- Generated manually because the database was not reachable from the environment where the command was run.

ALTER TABLE "Reserva"
ADD COLUMN IF NOT EXISTS "stripeSessionId" text;

-- Crear índice único para idempotencia. Postgres permite múltiples NULLs en unique indexes,
-- así que no bloqueará filas existentes con NULL.
CREATE UNIQUE INDEX IF NOT EXISTS "Reserva_stripeSessionId_unique" ON "Reserva" ("stripeSessionId");
