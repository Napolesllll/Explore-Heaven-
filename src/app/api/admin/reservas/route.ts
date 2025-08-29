// src/app/api/admin/reservas/route.ts - ADMIN CON RLS
import { NextRequest, NextResponse } from 'next/server';
import { getAdminPrisma, withPrismaCleanup } from '../../../../lib/prisma-rls';

// GET - Obtener TODAS las reservas (solo admins)
export const GET = withPrismaCleanup(async (request: NextRequest) => {
    try {
        // 🔒 VERIFICAR PERMISOS DE ADMIN (automáticamente valida rol)
        const { prisma, user } = await getAdminPrisma();

        console.log('🔍 Admin obteniendo todas las reservas:', user.email);

        // 🎯 Los admins pueden ver TODAS las reservas
        const reservas = await prisma.reserva.findMany({
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                },
                Tour: {
                    select: {
                        id: true,
                        nombre: true,
                        descripcion: true,
                        precio: true,
                        imagenUrl: true,
                        ubicacion: true
                    }
                },
                Guia: {
                    select: {
                        id: true,
                        nombre: true,
                        foto: true
                    }
                }
            },
            orderBy: { createdAt: 'desc' },
        });

        console.log(`✅ Admin obtuvo ${reservas.length} reservas totales`);

        // Stats completas del sistema para admin
        const stats = await Promise.all([
            prisma.user.count(),
            prisma.tour.count(),
            prisma.reserva.count(),
            prisma.reserva.count({
                where: { estado: 'Confirmada' }
            }),
            prisma.reserva.count({
                where: { estado: 'Pendiente' }
            }),
            prisma.reserva.count({
                where: { estado: 'Cancelada' }
            })
        ]);

        const adminStats = {
            usuarios: stats[0],
            tours: stats[1],
            reservas: stats[2],
            reservasConfirmadas: stats[3],
            reservasPendientes: stats[4],
            reservasCanceladas: stats[5]
        };

        return NextResponse.json({
            reservas,
            stats: adminStats,
            security: {
                admin_access: true,
                user_id: user.id,
                user_role: user.role
            }
        });

    } catch (error) {
        console.error('💥 Error en admin reservas:', error);

        if (error instanceof Error) {
            if (error.message === 'Usuario no autenticado') {
                return NextResponse.json({
                    error: 'Necesitas iniciar sesión'
                }, { status: 401 });
            }

            if (error.message.includes('permisos de administrador')) {
                return NextResponse.json({
                    error: 'Acceso denegado - Se requieren permisos de administrador'
                }, { status: 403 });
            }
        }

        return NextResponse.json({
            error: 'Error interno del servidor'
        }, { status: 500 });
    }
});

// PUT - Actualizar estado de reserva (solo admins)
export const PUT = withPrismaCleanup(async (request: NextRequest) => {
    try {
        const { prisma, user } = await getAdminPrisma();
        const body = await request.json();

        const { id, estado, guiaId } = body;

        if (!id || !estado) {
            return NextResponse.json(
                { error: 'ID y estado son requeridos' },
                { status: 400 }
            );
        }

        // Estados válidos
        const estadosValidos = ['Pendiente', 'Confirmada', 'Cancelada', 'Completada'];
        if (!estadosValidos.includes(estado)) {
            return NextResponse.json(
                { error: 'Estado no válido' },
                { status: 400 }
            );
        }

        console.log(`🔧 Admin actualizando reserva ${id} a estado: ${estado}`);

        const reservaActualizada = await prisma.reserva.update({
            where: { id },
            data: {
                estado,
                ...(guiaId && { guiaId }),
                updatedAt: new Date()
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                },
                Tour: {
                    select: {
                        id: true,
                        nombre: true,
                        precio: true
                    }
                },
                Guia: {
                    select: {
                        id: true,
                        nombre: true
                    }
                }
            }
        });

        console.log('✅ Reserva actualizada por admin:', reservaActualizada.id);

        return NextResponse.json({
            reserva: reservaActualizada,
            message: `Reserva actualizada a estado: ${estado}`
        });

    } catch (error) {
        console.error('💥 Error actualizando reserva:', error);

        if (error instanceof Error) {
            if (error.message === 'Usuario no autenticado') {
                return NextResponse.json({ error: 'Necesitas iniciar sesión' }, { status: 401 });
            }
            if (error.message.includes('permisos de administrador')) {
                return NextResponse.json({ error: 'Acceso denegado' }, { status: 403 });
            }
        }

        // Error de Prisma - registro no encontrado
        if (error && typeof error === 'object' && 'code' in error) {
            if ((error as any).code === 'P2025') {
                return NextResponse.json(
                    { error: 'Reserva no encontrada' },
                    { status: 404 }
                );
            }
        }

        return NextResponse.json({
            error: 'Error al actualizar reserva'
        }, { status: 500 });
    }
});

export async function OPTIONS() {
    return new NextResponse(null, {
        status: 200,
        headers: {
            'Allow': 'GET, PUT, OPTIONS',
        },
    });
}