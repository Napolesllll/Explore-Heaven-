// src/lib/prisma-rls.ts
import { PrismaClient } from '@prisma/client';
import { getServerSession } from "next-auth/next";
import { authOptions } from '../lib/auth/auth.config';

// Cliente Prisma global con configuración de conexión
const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined;
};

// Cliente Prisma singleton
export const prisma = globalForPrisma.prisma ?? new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

// Función para configurar el usuario en la sesión de base de datos
export async function setDatabaseUser(userId: string): Promise<void> {
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
export async function clearDatabaseUser(): Promise<void> {
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
 */
export async function getAuthenticatedPrisma() {
    console.log('🔐 getAuthenticatedPrisma() llamado');

    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
        console.log('❌ No hay sesión válida');
        throw new Error('Usuario no autenticado');
    }

    console.log('✅ Sesión encontrada:', session.user.email, session.user.role);

    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        select: { id: true, email: true, role: true, name: true }
    });

    if (!user) {
        console.log('❌ Usuario no encontrado en BD');
        throw new Error('Usuario no encontrado');
    }

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
 */
export async function getPublicPrisma() {
    console.log('🌍 getPublicPrisma() llamado');

    try {
        await clearDatabaseUser();
        console.log('✅ Cliente público configurado');
        return prisma;
    } catch (error) {
        console.error('💥 Error configurando cliente público:', error);
        return prisma;
    }
}

/**
 * HOC para manejar limpieza automática en routes
 */
export function withPrismaCleanup<Args extends unknown[], Return>(
    handler: (...args: Args) => Promise<Return>
) {
    return async (...args: Args): Promise<Return> => {
        try {
            console.log('🚀 Iniciando handler con limpieza automática');
            const result = await handler(...args);
            console.log('✅ Handler completado exitosamente');
            return result;
        } catch (error) {
            console.error('💥 Error en handler:', error);
            throw error;
        } finally {
            console.log('🧹 Ejecutando limpieza automática...');
            await clearDatabaseUser();
        }
    };
}

// Re-exportar tipos necesarios
export type { PrismaClient } from '@prisma/client';

// Exportar el cliente por defecto para casos especiales
export default prisma;