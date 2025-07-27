// /lib/prismadb.ts
import { PrismaClient } from '@prisma/client';

declare global {
  // Evitar múltiples instancias de PrismaClient en desarrollo
  var prisma: PrismaClient | undefined;
}

// Crear una instancia única de PrismaClient
const client =
  globalThis.prisma ||
  new PrismaClient({
    log: ['query'], // Opcional: registra las consultas en la consola para depuración
  });
  
// Asignar la instancia a globalThis en desarrollo
if (process.env.NODE_ENV !== 'production') globalThis.prisma = client;

export default client;