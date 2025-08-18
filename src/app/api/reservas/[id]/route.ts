// app/api/reservas/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]/route'; // Ajusta según tu estructura
import { z } from 'zod';

const prisma = new PrismaClient();

// Esquema para actualizar reserva
const updateReservationSchema = z.object({
  action: z.enum(['cancelar', 'reprogramar']),
  nuevaFecha: z.string().optional(),
});

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> } // 👈 params ahora es Promise
) {
  try {
    // 🔒 Validar sesión
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }

    const { id } = await context.params; // 👈 await aquí

    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json({ error: 'ID de reserva inválido' }, { status: 400 });
    }

    let data;
    try {
      const body = await request.json();
      data = updateReservationSchema.parse(body);
    } catch (err: any) {
      if (err.name === 'ZodError') {
        return NextResponse.json({ error: 'Datos inválidos', details: err.errors }, { status: 400 });
      }
      return NextResponse.json({ error: 'Error interno' }, { status: 500 });
    }

    const { action, nuevaFecha } = data;

    // 🔥 VERIFICAR QUE LA RESERVA PERTENECE AL USUARIO AUTENTICADO
    const reservaExistente = await prisma.reserva.findFirst({
      where: {
        id: parseInt(id),
        userId: session.user.id, // 🎯 FILTRO CRÍTICO
      },
      include: {
        Tour: true // Incluir datos del tour para validaciones
      }
    });

    if (!reservaExistente) {
      return NextResponse.json(
        { error: 'Reserva no encontrada o no tienes permisos para modificarla' },
        { status: 404 }
      );
    }

    // Verificar que la reserva no esté ya cancelada
    if (reservaExistente.estado === 'Cancelada') {
      return NextResponse.json({ error: 'La reserva ya está cancelada' }, { status: 400 });
    }

    let reservaActualizada;

    if (action === 'cancelar') {
      console.log('🗑️ Cancelando reserva ID:', id);

      // Actualizar estado a cancelada
      reservaActualizada = await prisma.reserva.update({
        where: {
          id: parseInt(id),
          // 🔒 Doble verificación de seguridad
          userId: session.user.id
        },
        data: { estado: 'Cancelada' },
        include: {
          Tour: {
            select: {
              nombre: true,
              imagenUrl: true,
              precio: true,
            }
          }
        }
      });

      console.log('✅ Reserva cancelada exitosamente. Cupo liberado para:', reservaExistente.fecha);

    } else if (action === 'reprogramar') {
      if (!nuevaFecha) {
        return NextResponse.json({ error: 'Nueva fecha es requerida para reprogramar' }, { status: 400 });
      }

      // Validar que la nueva fecha sea futura
      const fechaNueva = new Date(nuevaFecha);
      const hoy = new Date();
      hoy.setHours(0, 0, 0, 0);

      if (fechaNueva < hoy) {
        return NextResponse.json({ error: 'La nueva fecha debe ser futura' }, { status: 400 });
      }

      // 🛡️ VALIDAR DISPONIBILIDAD DE LA NUEVA FECHA

      // 1. Verificar que el usuario no tenga ya una reserva en la nueva fecha para este tour
      const reservaEnNuevaFecha = await prisma.reserva.findFirst({
        where: {
          userId: session.user.id,
          tourId: reservaExistente.tourId,
          fecha: fechaNueva,
          estado: {
            not: 'Cancelada'
          },
          id: {
            not: parseInt(id) // Excluir la reserva actual
          }
        }
      });

      if (reservaEnNuevaFecha) {
        return NextResponse.json(
          {
            error: 'Ya tienes una reserva para este tour en la nueva fecha seleccionada',
            details: 'No puedes tener múltiples reservas para el mismo tour en la misma fecha'
          },
          { status: 400 }
        );
      }

      // 2. Verificar límite de 3 reservas en la nueva fecha
      const reservasEnNuevaFecha = await prisma.reserva.count({
        where: {
          tourId: reservaExistente.tourId,
          fecha: fechaNueva,
          estado: {
            not: 'Cancelada'
          },
          id: {
            not: parseInt(id) // Excluir la reserva actual ya que se está moviendo
          }
        }
      });

      if (reservasEnNuevaFecha >= 3) {
        return NextResponse.json(
          {
            error: 'La nueva fecha seleccionada ya está completamente reservada',
            details: 'Se ha alcanzado el límite máximo de 3 reservas para esa fecha'
          },
          { status: 400 }
        );
      }

      console.log(`📅 Reprogramando reserva de ${reservaExistente.fecha} a ${fechaNueva}`);
      console.log(`📊 Reservas en nueva fecha: ${reservasEnNuevaFecha}/3`);

      // Actualizar la reserva con la nueva fecha
      reservaActualizada = await prisma.reserva.update({
        where: {
          id: parseInt(id),
          // 🔒 Doble verificación de seguridad
          userId: session.user.id
        },
        data: {
          fecha: fechaNueva,
          estado: 'Reprogramada'
        },
        include: {
          Tour: {
            select: {
              nombre: true,
              imagenUrl: true,
              precio: true,
            }
          }
        }
      });

      console.log('✅ Reserva reprogramada exitosamente');
    }

    // Formatear respuesta
    const reservaFormateada = {
      ...reservaActualizada,
      fecha: reservaActualizada!.fecha.toISOString().split('T')[0],
      participantes: typeof reservaActualizada!.participantes === 'string'
        ? JSON.parse(reservaActualizada!.participantes)
        : reservaActualizada!.participantes,
      contactoEmergencia: typeof reservaActualizada!.contactoEmergencia === 'string'
        ? JSON.parse(reservaActualizada!.contactoEmergencia)
        : reservaActualizada!.contactoEmergencia,
    };

    // Información adicional sobre disponibilidad
    let mensaje = '';
    if (action === 'cancelar') {
      mensaje = 'Reserva cancelada exitosamente. El cupo ha sido liberado para otros usuarios.';
    } else if (action === 'reprogramar') {
      const reservasRestantesEnNuevaFecha = 3 - (await prisma.reserva.count({
        where: {
          tourId: reservaExistente.tourId,
          fecha: new Date(nuevaFecha!),
          estado: { not: 'Cancelada' }
        }
      }));

      mensaje = `Reserva reprogramada exitosamente. Quedan ${reservasRestantesEnNuevaFecha} cupos disponibles en la nueva fecha.`;
    }

    return NextResponse.json({
      ...reservaFormateada,
      mensaje
    });

  } catch (err: any) {
    console.error('Error al actualizar reserva:', err);
    return NextResponse.json({
      error: 'Error al actualizar reserva',
      message: err.message || 'Error desconocido'
    }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> } // 👈 params Promise
) {
  try {
    // 🔒 Validar sesión
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }

    const { id } = await context.params; // 👈 await aquí

    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json({ error: 'ID de reserva inválido' }, { status: 400 });
    }

    // 🔥 VERIFICAR QUE LA RESERVA PERTENECE AL USUARIO AUTENTICADO
    const reservaExistente = await prisma.reserva.findFirst({
      where: {
        id: parseInt(id),
        userId: session.user.id, // 🎯 FILTRO CRÍTICO
      },
    });

    if (!reservaExistente) {
      return NextResponse.json(
        { error: 'Reserva no encontrada o no tienes permisos para eliminarla' },
        { status: 404 }
      );
    }

    console.log('🗑️ Eliminando reserva ID:', id, 'Fecha:', reservaExistente.fecha);

    await prisma.reserva.delete({
      where: {
        id: parseInt(id),
        // 🔒 Doble verificación de seguridad
        userId: session.user.id
      },
    });

    console.log('✅ Reserva eliminada exitosamente. Cupo liberado.');

    return NextResponse.json({
      message: 'Reserva eliminada correctamente. El cupo ha sido liberado para otros usuarios.'
    });

  } catch (err: any) {
    console.error('Error al eliminar reserva:', err);
    return NextResponse.json({
      error: 'Error al eliminar reserva',
      message: err.message || 'Error desconocido'
    }, { status: 500 });
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Allow': 'PATCH, DELETE, OPTIONS',
    },
  });
}