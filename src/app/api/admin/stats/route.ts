// app/api/admin/stats/route.ts - ADMIN STATS CON RLS
import { NextRequest, NextResponse } from 'next/server';
import { getAdminPrisma, withPrismaCleanup } from '../../../../lib/prisma-rls';

// GET - Obtener estadísticas completas del sistema (solo admins)
export const GET = withPrismaCleanup(async (request: NextRequest) => {
    try {
        // 🔒 VERIFICAR PERMISOS DE ADMIN (automáticamente valida rol)
        const { prisma, user } = await getAdminPrisma();

        console.log('📊 Admin obteniendo estadísticas del sistema:', user.email);

        // Obtener fechas importantes
        const ahora = new Date();
        const inicioHoy = new Date(ahora.getFullYear(), ahora.getMonth(), ahora.getDate());
        const inicioSemana = new Date(ahora.setDate(ahora.getDate() - ahora.getDay()));
        const inicioMes = new Date(ahora.getFullYear(), ahora.getMonth(), 1);
        const inicioMesAnterior = new Date(ahora.getFullYear(), ahora.getMonth() - 1, 1);
        const finMesAnterior = new Date(ahora.getFullYear(), ahora.getMonth(), 0);

        // 🎯 CON RLS ADMIN: Los admins pueden ver TODAS las reservas
        const todasLasReservas = await prisma.reserva.findMany({
            include: {
                Tour: {
                    select: {
                        nombre: true,
                        precio: true,
                    }
                },
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                }
            }
        });

        console.log(`✅ Admin obtuvo ${todasLasReservas.length} reservas totales`);

        // Estadísticas básicas
        const totalReservas = todasLasReservas.length;
        const totalPersonas = todasLasReservas.reduce((sum, r) => sum + r.adultos + r.niños, 0);
        const ingresosTotales = todasLasReservas.reduce((sum, r) => sum + (r.Tour.precio * (r.adultos + r.niños)), 0);

        // Reservas por período
        const reservasHoy = todasLasReservas.filter(r => r.createdAt >= inicioHoy).length;
        const reservasSemana = todasLasReservas.filter(r => r.createdAt >= inicioSemana).length;
        const reservasMes = todasLasReservas.filter(r => r.createdAt >= inicioMes).length;
        const reservasMesAnterior = todasLasReservas.filter(r =>
            r.createdAt >= inicioMesAnterior && r.createdAt <= finMesAnterior
        ).length;

        // Calcular tasa de crecimiento
        const tasaCrecimiento = reservasMesAnterior > 0
            ? ((reservasMes - reservasMesAnterior) / reservasMesAnterior) * 100
            : 0;

        // Tour más popular
        const tourStats = todasLasReservas.reduce((acc, reserva) => {
            const tourNombre = reserva.Tour.nombre;
            if (!acc[tourNombre]) {
                acc[tourNombre] = {
                    tourNombre,
                    reservas: 0,
                    personas: 0,
                    ingresos: 0
                };
            }
            acc[tourNombre].reservas += 1;
            acc[tourNombre].personas += reserva.adultos + reserva.niños;
            acc[tourNombre].ingresos += reserva.Tour.precio * (reserva.adultos + reserva.niños);
            return acc;
        }, {} as any);

        const tourStatsArray = Object.values(tourStats).sort((a: any, b: any) => b.reservas - a.reservas);
        const tourMasPopular = tourStatsArray[0]?.tourNombre || 'N/A';

        // Reservas por estado
        const reservasPorEstado = todasLasReservas.reduce((acc, reserva) => {
            const estado = mapEstadoToStatus(reserva.estado || 'Pendiente');
            acc[estado] = (acc[estado] || 0) + 1;
            return acc;
        }, {} as any);

        // Completar estados que no existen
        const estadosCompletos = {
            pendiente: reservasPorEstado.pendiente || 0,
            confirmada: reservasPorEstado.confirmada || 0,
            cancelada: reservasPorEstado.cancelada || 0,
            completada: reservasPorEstado.completada || 0,
            en_proceso: reservasPorEstado.en_proceso || 0,
        };

        // Reservas por mes (últimos 8 meses)
        const reservasPorMes = [];
        for (let i = 7; i >= 0; i--) {
            const fecha = new Date();
            fecha.setMonth(fecha.getMonth() - i);
            const inicioMesIteracion = new Date(fecha.getFullYear(), fecha.getMonth(), 1);
            const finMesIteracion = new Date(fecha.getFullYear(), fecha.getMonth() + 1, 0);

            const reservasDelMes = todasLasReservas.filter(r =>
                r.createdAt >= inicioMesIteracion && r.createdAt <= finMesIteracion
            );

            const ingresosMes = reservasDelMes.reduce((sum, r) => sum + (r.Tour.precio * (r.adultos + r.niños)), 0);

            reservasPorMes.push({
                mes: fecha.toLocaleDateString('es-ES', { month: 'long' }),
                reservas: reservasDelMes.length,
                ingresos: ingresosMes
            });
        }

        // Estadísticas de usuarios (solo para admins)
        const totalUsuarios = await prisma.user.count();
        const usuariosActivos = await prisma.user.count({
            where: {
                status: 'ACTIVE'
            }
        });

        // Usuarios más activos (solo admins pueden ver esta información)
        const usuarioStats = await prisma.user.findMany({
            where: {
                reservas: {
                    some: {}
                }
            },
            select: {
                id: true,
                name: true,
                email: true,
                _count: {
                    select: {
                        reservas: true
                    }
                }
            },
            orderBy: {
                reservas: {
                    _count: 'desc'
                }
            },
            take: 10
        });

        const stats = {
            totalReservas,
            totalPersonas,
            ingresosTotales,
            reservasHoy,
            reservasSemana,
            reservasMes,
            tourMasPopular,
            promedioPersonasPorReserva: totalReservas > 0 ? parseFloat((totalPersonas / totalReservas).toFixed(1)) : 0,
            tasaCrecimiento: parseFloat(tasaCrecimiento.toFixed(1)),
            reservasPorEstado: estadosCompletos,
            reservasPorMes,
            tourStats: tourStatsArray.slice(0, 10), // Top 10 tours
            // Estadísticas adicionales solo para admins
            totalUsuarios,
            usuariosActivos,
            usuarioStats,
            security: {
                admin_access: true,
                user_id: user.id,
                user_role: user.role,
                rls_enabled: true
            }
        };

        return NextResponse.json(stats);

    } catch (error) {
        console.error('💥 Error al obtener estadísticas:', error);

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

        return NextResponse.json(
            { error: 'Error interno del servidor' },
            { status: 500 }
        );
    }
});

// Función auxiliar para mapear estados (sin cambios)
function mapEstadoToStatus(estado: string) {
    const estadoMap: { [key: string]: string } = {
        'Pendiente': 'pendiente',
        'Confirmada': 'confirmada',
        'Cancelada': 'cancelada',
        'Completada': 'completada',
        'En proceso': 'en_proceso',
        'Pagada': 'confirmada',
        'Reprogramada': 'pendiente', // Las reprogramadas se consideran pendientes
    };

    return estadoMap[estado] || 'pendiente';
}