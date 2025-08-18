// app/api/admin/reservas/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../../auth/[...nextauth]/route';

const prisma = new PrismaClient();

// DELETE - Eliminar reserva
export async function DELETE(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        // Verificar sesión de admin
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json(
                { success: false, error: 'No autorizado' },
                { status: 401 }
            );
        }

        const { id } = await context.params;
        const reservaId = parseInt(id);

        // Validar que el ID sea numérico
        if (isNaN(reservaId)) {
            return NextResponse.json(
                { success: false, error: 'ID de reserva inválido' },
                { status: 400 }
            );
        }

        // Validar que la reserva existe
        const reservaExistente = await prisma.reserva.findUnique({
            where: { id: reservaId }
        });

        if (!reservaExistente) {
            return NextResponse.json(
                { success: false, error: 'Reserva no encontrada' },
                { status: 404 }
            );
        }

        // Verificar si se puede eliminar (opcional)
        if (reservaExistente.estado === 'Completada') {
            return NextResponse.json(
                { success: false, error: 'No se puede eliminar una reserva completada' },
                { status: 400 }
            );
        }

        // Eliminar reserva completamente
        await prisma.reserva.delete({
            where: { id: reservaId }
        });

        // Log para auditoría
        console.log(`Reserva ${reservaId} eliminada exitosamente`);

        return NextResponse.json({
            success: true,
            message: 'Reserva eliminada exitosamente'
        });

    } catch (error) {
        console.error('Error al eliminar reserva:', error);
        return NextResponse.json(
            { success: false, error: 'Error al eliminar la reserva' },
            { status: 500 }
        );
    } finally {
        await prisma.$disconnect();
    }
}

// PATCH - Actualizar campos específicos
export async function PATCH(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        // Verificar sesión de admin
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json(
                { success: false, error: 'No autorizado' },
                { status: 401 }
            );
        }

        const { id } = await context.params;
        const reservaId = parseInt(id);

        // Validar que el ID sea numérico
        if (isNaN(reservaId)) {
            return NextResponse.json(
                { success: false, error: 'ID de reserva inválido' },
                { status: 400 }
            );
        }

        const body = await request.json();

        // Validar que la reserva existe
        const reservaExistente = await prisma.reserva.findUnique({
            where: { id: reservaId }
        });

        if (!reservaExistente) {
            return NextResponse.json(
                { success: false, error: 'Reserva no encontrada' },
                { status: 404 }
            );
        }

        // Mapear status del frontend a estado de la BD
        const estadoMapping: { [key: string]: string } = {
            'pendiente': 'Pendiente',
            'confirmada': 'Confirmada',
            'cancelada': 'Cancelada',
            'completada': 'Completada',
            'en_proceso': 'En proceso'
        };

        // Preparar datos para actualizar
        const updateData: any = {};

        if (body.status) {
            updateData.estado = estadoMapping[body.status] || body.status;
        }

        // Otros campos que se pueden actualizar
        const allowedFields = ['nombre', 'correo', 'telefono', 'adultos', 'niños', 'participantes', 'contactoEmergencia'];

        allowedFields.forEach(field => {
            if (body[field] !== undefined) {
                updateData[field] = body[field];
            }
        });

        // Si no hay campos válidos, devolver error
        if (Object.keys(updateData).length === 0) {
            return NextResponse.json(
                { success: false, error: 'No se enviaron campos válidos para actualizar' },
                { status: 400 }
            );
        }

        // Actualizar la reserva
        const reservaActualizada = await prisma.reserva.update({
            where: { id: reservaId },
            data: updateData,
            include: {
                Tour: {
                    select: {
                        id: true,
                        nombre: true,
                        imagenUrl: true,
                        precio: true,
                        ubicacion: true,
                    }
                },
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    }
                },
                Guia: {
                    select: {
                        id: true,
                        nombre: true,
                        foto: true,
                    }
                }
            }
        });

        // Transformar la respuesta para que coincida con el formato del frontend
        const reservaTransformada = {
            id: reservaActualizada.id.toString(),
            tourId: reservaActualizada.tourId,
            tourNombre: reservaActualizada.Tour.nombre,
            tourImagen: reservaActualizada.Tour.imagenUrl,
            tourUbicacion: reservaActualizada.Tour.ubicacion || 'Ubicación no especificada',
            fechaSeleccionada: reservaActualizada.fecha.toISOString().split('T')[0],
            fechaCreacion: reservaActualizada.createdAt.toISOString().split('T')[0],
            status: mapEstadoToStatus(reservaActualizada.estado || 'Pendiente'),
            nombreReservante: reservaActualizada.nombre,
            correoReservante: reservaActualizada.correo,
            telefonoReservante: reservaActualizada.telefono,
            adultos: reservaActualizada.adultos,
            niños: reservaActualizada.niños,
            totalPersonas: reservaActualizada.adultos + reservaActualizada.niños,
            participantes: Array.isArray(reservaActualizada.participantes)
                ? reservaActualizada.participantes as any[]
                : [],
            contactoEmergencia: reservaActualizada.contactoEmergencia as any || {
                nombre: '',
                telefono: ''
            },
            precioTotal: reservaActualizada.Tour.precio * (reservaActualizada.adultos + reservaActualizada.niños),
            notas: '',
            guiaNombre: reservaActualizada.Guia?.nombre || null,
            userName: reservaActualizada.user.name || 'Usuario desconocido',
            userEmail: reservaActualizada.user.email || reservaActualizada.correo,
        };

        // Log para auditoría
        console.log(`Reserva ${reservaId} actualizada:`, updateData);

        return NextResponse.json({
            success: true,
            reserva: reservaTransformada,
            message: 'Reserva actualizada exitosamente'
        });

    } catch (error) {
        console.error('Error al actualizar reserva:', error);
        return NextResponse.json(
            { success: false, error: 'Error interno al actualizar la reserva' },
            { status: 500 }
        );
    } finally {
        await prisma.$disconnect();
    }
}

// PUT - Actualizar reserva completa (para el modal de edición)
export async function PUT(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await context.params; // ✅ Ahora sí espera los params
        // Verificar sesión de admin
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json(
                { success: false, error: 'No autorizado' },
                { status: 401 }
            );
        }

        const reservaId = parseInt(id);

        // Validar que el ID sea numérico
        if (isNaN(reservaId)) {
            return NextResponse.json(
                { success: false, error: 'ID de reserva inválido' },
                { status: 400 }
            );
        }

        const updatedReservation = await request.json();

        // Validar que la reserva exists
        const reservaExistente = await prisma.reserva.findUnique({
            where: { id: reservaId }
        });

        if (!reservaExistente) {
            return NextResponse.json(
                { success: false, error: 'Reserva no encontrada' },
                { status: 404 }
            );
        }

        // Mapear status del frontend a estado de la BD
        const estadoMapping: { [key: string]: string } = {
            'pendiente': 'Pendiente',
            'confirmada': 'Confirmada',
            'cancelada': 'Cancelada',
            'completada': 'Completada',
            'en_proceso': 'En proceso'
        };

        // Actualizar la reserva con todos los campos del modal
        const reservaActualizada = await prisma.reserva.update({
            where: { id: reservaId },
            data: {
                nombre: updatedReservation.nombreReservante,
                correo: updatedReservation.correoReservante,
                telefono: updatedReservation.telefonoReservante,
                estado: estadoMapping[updatedReservation.status] || updatedReservation.status,
                adultos: updatedReservation.adultos,
                niños: updatedReservation.niños,
                contactoEmergencia: updatedReservation.contactoEmergencia,
                participantes: updatedReservation.participantes,
            },
            include: {
                Tour: {
                    select: {
                        id: true,
                        nombre: true,
                        imagenUrl: true,
                        precio: true,
                        ubicacion: true,
                    }
                },
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    }
                },
                Guia: {
                    select: {
                        id: true,
                        nombre: true,
                        foto: true,
                    }
                }
            }
        });

        // Transformar la respuesta
        const reservaTransformada = {
            id: reservaActualizada.id.toString(),
            tourId: reservaActualizada.tourId,
            tourNombre: reservaActualizada.Tour.nombre,
            tourImagen: reservaActualizada.Tour.imagenUrl,
            tourUbicacion: reservaActualizada.Tour.ubicacion || 'Ubicación no especificada',
            fechaSeleccionada: reservaActualizada.fecha.toISOString().split('T')[0],
            fechaCreacion: reservaActualizada.createdAt.toISOString().split('T')[0],
            status: mapEstadoToStatus(reservaActualizada.estado || 'Pendiente'),
            nombreReservante: reservaActualizada.nombre,
            correoReservante: reservaActualizada.correo,
            telefonoReservante: reservaActualizada.telefono,
            adultos: reservaActualizada.adultos,
            niños: reservaActualizada.niños,
            totalPersonas: reservaActualizada.adultos + reservaActualizada.niños,
            participantes: Array.isArray(reservaActualizada.participantes)
                ? reservaActualizada.participantes as any[]
                : [],
            contactoEmergencia: reservaActualizada.contactoEmergencia as any || {
                nombre: '',
                telefono: ''
            },
            precioTotal: updatedReservation.precioTotal || (reservaActualizada.Tour.precio * (reservaActualizada.adultos + reservaActualizada.niños)),
            notas: updatedReservation.notas || '',
            guiaNombre: reservaActualizada.Guia?.nombre || null,
            userName: reservaActualizada.user.name || 'Usuario desconocido',
            userEmail: reservaActualizada.user.email || reservaActualizada.correo,
        };

        return NextResponse.json({
            success: true,
            reserva: reservaTransformada,
            message: 'Reserva actualizada exitosamente'
        });

    } catch (error) {
        console.error('Error al actualizar reserva completa:', error);
        return NextResponse.json(
            { success: false, error: 'Error interno al actualizar la reserva' },
            { status: 500 }
        );
    } finally {
        await prisma.$disconnect();
    }
}

// Función auxiliar para mapear estados de BD a status del frontend
function mapEstadoToStatus(estado: string): string {
    const estadoMap: { [key: string]: string } = {
        'Pendiente': 'pendiente',
        'Confirmada': 'confirmada',
        'Cancelada': 'cancelada',
        'Completada': 'completada',
        'En proceso': 'en_proceso',
        'Pagada': 'confirmada',
    };

    return estadoMap[estado] || 'pendiente';
}