// src/lib/prisma-rls.ts - VERSIÓN CORREGIDA
import { PrismaClient } from '@prisma/client';
import { getServerSession } from "next-auth/next";
import { authOptions } from '../app/api/auth/[...nextauth]/route';

// Cliente Prisma global con configuración de conexión
const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined;
};

// Cliente Prisma singleton
const prisma = globalForPrisma.prisma ?? new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

// Función para configurar el usuario en la sesión de base de datos
async function setDatabaseUser(userId: string): Promise<void> {
    try {
        console.log('🔧 Configurando usuario en BD:', userId);
        await prisma.$executeRawUnsafe(
            `SELECT set_current_user_id('${userId}');`
        );
    } catch (error) {
        console.error('💥 Error configurando usuario en BD:', error);
        throw new Error('Error de configuración de seguridad');
    }
}

// Función para limpiar la configuración de usuario
async function clearDatabaseUser(): Promise<void> {
    try {
        await prisma.$executeRawUnsafe(
            `SELECT set_config('app.current_user_id', '', false);`
        );
        console.log('🧹 Usuario de BD limpiado');
    } catch (error) {
        console.warn('⚠️ Error limpiando usuario de BD:', error);
    }
}

/**
 * Obtiene un cliente Prisma configurado con el usuario autenticado
 * Funciona tanto para usuarios regulares como admins
 */
export async function getAuthenticatedPrisma() {
    console.log('🔐 getAuthenticatedPrisma() llamado');

    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
        console.log('❌ No hay sesión válida');
        throw new Error('Usuario no autenticado');
    }

    console.log('✅ Sesión encontrada:', session.user.email, session.user.role);

    // Buscar el usuario en la base de datos para obtener ID y rol actualizados
    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        select: { id: true, email: true, role: true, name: true }
    });

    if (!user) {
        console.log('❌ Usuario no encontrado en BD');
        throw new Error('Usuario no encontrado');
    }

    // Configurar el usuario en la base de datos para RLS
    const userIdForRLS = user.role === 'ADMIN' ? 'ADMIN_USER' : user.id;
    await setDatabaseUser(userIdForRLS);

    console.log('✅ Usuario configurado para RLS:', user.email, user.role);

    return {
        prisma,
        user,
        cleanup: clearDatabaseUser
    };
}

/**
 * DEPRECATED: Usar getAuthenticatedPrisma() en su lugar
 * Mantenido por compatibilidad
 */
export async function getAdminPrisma() {
    console.log('⚠️ getAdminPrisma() está deprecado, usa getAuthenticatedPrisma()');

    const result = await getAuthenticatedPrisma();

    if (result.user.role !== 'ADMIN') {
        throw new Error('Se requieren permisos de administrador');
    }

    return result;
}

/**
 * Cliente Prisma público para operaciones que no requieren autenticación
 * (Ej: listar tours públicos, fechas disponibles)
 * ✅ CORREGIDO: Ahora devuelve el cliente directamente
 */
export async function getPublicPrisma() {
    console.log('🌍 getPublicPrisma() llamado');

    try {
        // Limpiar cualquier configuración de usuario previa
        await clearDatabaseUser();
        console.log('✅ Cliente público configurado');

        // Devolver el cliente directamente, no un wrapper
        return prisma;
    } catch (error) {
        console.error('💥 Error configurando cliente público:', error);
        // Si falla la limpieza, aún devolver el cliente
        return prisma;
    }
}

/**
 * HOC para manejar limpieza automática en routes
 */
export function withPrismaCleanup<T extends any[], R>(
    handler: (...args: T) => Promise<R>
) {
    return async (...args: T): Promise<R> => {
        try {
            console.log('🚀 Iniciando handler con limpieza automática');
            const result = await handler(...args);
            console.log('✅ Handler completado exitosamente');
            return result;
        } catch (error) {
            console.error('💥 Error en handler:', error);
            throw error;
        } finally {
            // Siempre limpiar al final
            console.log('🧹 Ejecutando limpieza automática...');
            await clearDatabaseUser();
        }
    };
}

// Re-exportar tipos necesarios
export type { PrismaClient } from '@prisma/client';

// Exportar el cliente por defecto para casos especiales
export default prisma;