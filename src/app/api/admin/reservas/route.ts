// app/api/admin/reservas/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]/route';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
    try {
        // Verificar si es admin (ajusta según tu lógica de autorización)
        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json(
                { error: 'No autorizado' },
                { status: 401 }
            );
        }

        // Obtener todas las reservas con información relacionada
        const reservas = await prisma.reserva.findMany({
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
            },
            orderBy: { createdAt: 'desc' },
        });

        // Transformar datos para que coincidan con el tipo Reservation
        const reservasTransformadas = reservas.map(reserva => ({
            id: reserva.id.toString(),
            tourId: reserva.tourId,
            tourNombre: reserva.Tour.nombre,
            tourImagen: reserva.Tour.imagenUrl,
            tourUbicacion: reserva.Tour.ubicacion || 'Ubicación no especificada',
            fechaSeleccionada: reserva.fecha.toISOString().split('T')[0],
            fechaCreacion: reserva.createdAt.toISOString().split('T')[0],
            status: mapEstadoToStatus(reserva.estado || 'Pendiente'),
            nombreReservante: reserva.nombre,
            correoReservante: reserva.correo,
            telefonoReservante: reserva.telefono,
            adultos: reserva.adultos,
            niños: reserva.niños,
            totalPersonas: reserva.adultos + reserva.niños,
            participantes: Array.isArray(reserva.participantes)
                ? reserva.participantes as any[]
                : [],
            contactoEmergencia: reserva.contactoEmergencia as any || {
                nombre: '',
                telefono: ''
            },
            precioTotal: reserva.Tour.precio * (reserva.adultos + reserva.niños),
            notas: '', // Agregar campo notas al modelo si es necesario
            guiaNombre: reserva.Guia?.nombre || null,
            userName: reserva.user.name || 'Usuario desconocido',
            userEmail: reserva.user.email || reserva.correo,
        }));

        return NextResponse.json({
            reservas: reservasTransformadas,
            total: reservasTransformadas.length
        });

    } catch (error) {
        console.error('Error al obtener reservas admin:', error);
        return NextResponse.json(
            { error: 'Error interno del servidor' },
            { status: 500 }
        );
    }
}

export async function PUT(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json(
                { error: 'No autorizado' },
                { status: 401 }
            );
        }

        const { reservaId, nuevoEstado } = await request.json();

        const reservaActualizada = await prisma.reserva.update({
            where: { id: parseInt(reservaId) },
            data: { estado: nuevoEstado },
            include: {
                Tour: true,
                user: true
            }
        });

        return NextResponse.json(reservaActualizada);

    } catch (error) {
        console.error('Error al actualizar reserva:', error);
        return NextResponse.json(
            { error: 'Error interno del servidor' },
            { status: 500 }
        );
    }
}

// Función auxiliar para mapear estados
function mapEstadoToStatus(estado: string) {
    const estadoMap: { [key: string]: string } = {
        'Pendiente': 'pendiente',
        'Confirmada': 'confirmada',
        'Cancelada': 'cancelada',
        'Completada': 'completada',
        'En proceso': 'en_proceso',
        'Pagada': 'confirmada', // Mapear "Pagada" a "confirmada"
    };

    return estadoMap[estado] || 'pendiente';
}

// PATCH - Actualizar campos específicos (como el status)
export async function PATCH(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = params;
        const body = await request.json();

        // Validar que la reserva existe
        const reservaExistente = await db.reservas.findUnique({
            where: { id }
        });

        if (!reservaExistente) {
            return NextResponse.json(
                { success: false, error: 'Reserva no encontrada' },
                { status: 404 }
            );
        }

        // Actualizar solo los campos proporcionados
        const reservaActualizada = await db.reservas.update({
            where: { id },
            data: {
                ...body,
                fechaActualizacion: new Date().toISOString()
            }
        });

        // const reservaActualizada = {
        //     id,
        //     ...body,
        //     fechaActualizacion: new Date().toISOString()
        // };

        // Log para auditoría
        console.log(`Reserva ${id} actualizada:`, body);

        return NextResponse.json({
            success: true,
            reserva: reservaActualizada,
            message: 'Reserva actualizada exitosamente'
        });

    } catch (error) {
        console.error('Error al actualizar reserva:', error);
        return NextResponse.json(
            { success: false, error: 'Error al actualizar la reserva' },
            { status: 500 }
        );
    }
}