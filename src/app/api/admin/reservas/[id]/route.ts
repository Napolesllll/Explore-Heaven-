// src/app/api/admin/reservas/[id]/route.ts - HANDLERS PARA UNA RESERVA (ADMIN RLS)
import { NextRequest, NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import { getAdminPrisma, withPrismaCleanup } from '../../../../../lib/prisma-rls';

// Definición correcta de tipos para Next.js App Router
type RouteContext = {
    params: Promise<{ id: string }>;
};

// Solo definimos los valores válidos como tipo, no como const en runtime
type Estado = 'Pendiente' | 'Confirmada' | 'Cancelada' | 'Completada';

interface UpdateBody {
    estado?: Estado;
    guiaId?: string | null;
    // otros campos que quieras permitir
}

/**
 * GET - obtener una reserva por id (solo admins)
 */
export const GET = withPrismaCleanup(async (request: NextRequest, { params }: RouteContext) => {
    try {
        const { prisma, user } = await getAdminPrisma();
        const { id } = await params;

        if (!id) {
            return NextResponse.json({ error: 'ID es requerido' }, { status: 400 });
        }

        // Convertir string a number para Prisma
        const reservaId = parseInt(id, 10);
        if (isNaN(reservaId)) {
            return NextResponse.json({ error: 'ID debe ser un número válido' }, { status: 400 });
        }

        const reserva = await prisma.reserva.findUnique({
            where: { id: reservaId },
            include: {
                user: { select: { id: true, name: true, email: true } },
                Tour: { select: { id: true, nombre: true, precio: true } },
                Guia: { select: { id: true, nombre: true } }
            }
        });

        if (!reserva) {
            return NextResponse.json({ error: 'Reserva no encontrada' }, { status: 404 });
        }

        return NextResponse.json({ reserva, admin: { id: user.id, role: user.role } }, { status: 200 });
    } catch (error: unknown) {
        console.error('💥 Error GET /admin/reservas/[id]:', error);
        return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
    }
});

/**
 * PUT - actualizar campos de la reserva (solo admins)
 */
export const PUT = withPrismaCleanup(async (request: NextRequest, { params }: RouteContext) => {
    try {
        const { prisma } = await getAdminPrisma();
        const { id } = await params;

        if (!id) {
            return NextResponse.json({ error: 'ID es requerido' }, { status: 400 });
        }

        // Convertir string a number para Prisma
        const reservaId = parseInt(id, 10);
        if (isNaN(reservaId)) {
            return NextResponse.json({ error: 'ID debe ser un número válido' }, { status: 400 });
        }

        const rawBody = await request.json();
        if (typeof rawBody !== 'object' || rawBody === null) {
            return NextResponse.json({ error: 'Body inválido' }, { status: 400 });
        }

        const body = rawBody as UpdateBody;

        const updateData: Prisma.ReservaUpdateInput = {
            ...(body.estado ? { estado: body.estado } : {}),
            ...(body.guiaId !== undefined ? {
                guiaId: body.guiaId ? parseInt(body.guiaId, 10) : null
            } : {}),
            updatedAt: new Date()
        };

        const reservaActualizada = await prisma.reserva.update({
            where: { id: reservaId },
            data: updateData,
            include: {
                user: { select: { id: true, name: true, email: true } },
                Tour: { select: { id: true, nombre: true, precio: true } },
                Guia: { select: { id: true, nombre: true } }
            }
        });

        return NextResponse.json({ reserva: reservaActualizada, message: 'Reserva actualizada' }, { status: 200 });
    } catch (error: unknown) {
        console.error('💥 Error PUT /admin/reservas/[id]:', error);
        const err = error as { code?: string; message?: string };
        if (err?.code === 'P2025') {
            return NextResponse.json({ error: 'Reserva no encontrada' }, { status: 404 });
        }
        return NextResponse.json({ error: 'Error al actualizar reserva' }, { status: 500 });
    }
});

/**
 * DELETE - eliminar una reserva (solo admins)
 */
export const DELETE = withPrismaCleanup(async (request: NextRequest, { params }: RouteContext) => {
    try {
        const { prisma } = await getAdminPrisma();
        const { id } = await params;

        if (!id) {
            return NextResponse.json({ error: 'ID es requerido' }, { status: 400 });
        }

        // Convertir string a number para Prisma
        const reservaId = parseInt(id, 10);
        if (isNaN(reservaId)) {
            return NextResponse.json({ error: 'ID debe ser un número válido' }, { status: 400 });
        }

        const deleted = await prisma.reserva.delete({
            where: { id: reservaId },
            include: {
                user: { select: { id: true, name: true, email: true } },
                Tour: { select: { id: true, nombre: true } }
            }
        });

        return NextResponse.json({ deleted, message: 'Reserva eliminada' }, { status: 200 });
    } catch (error: unknown) {
        console.error('💥 Error DELETE /admin/reservas/[id]:', error);
        const err = error as { code?: string; message?: string };
        if (err?.code === 'P2025') {
            return NextResponse.json({ error: 'Reserva no encontrada' }, { status: 404 });
        }
        return NextResponse.json({ error: 'Error al eliminar reserva' }, { status: 500 });
    }
});

/**
 * OPTIONS - permitir métodos HTTP
 */
export async function OPTIONS() {
    return new NextResponse(null, {
        status: 200,
        headers: {
            Allow: 'GET, PUT, DELETE, OPTIONS'
        }
    });
}