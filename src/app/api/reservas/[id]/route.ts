// app/api/reservas/[id]/route.ts - VERSIÓN SEGURA CON RLS CORREGIDA
import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedPrisma, withPrismaCleanup } from '../../../../lib/prisma-rls';
import { z } from 'zod';

// Esquema para actualizar reserva
const updateReservationSchema = z.object({
  action: z.enum(['cancelar', 'reprogramar']),
  nuevaFecha: z.string().optional(),
});

// Función para transformar reserva de Prisma a formato consistente para usuarios
const transformReservaForUser = (reserva: any) => {
  // Manejar participantes (puede ser string JSON o array)
  let participantes = [];
  if (reserva.participantes) {
    if (typeof reserva.participantes === 'string') {
      try {
        participantes = JSON.parse(reserva.participantes);
      } catch (e) {
        console.warn('Error parsing participantes:', e);
        participantes = [];
      }
    } else if (Array.isArray(reserva.participantes)) {
      participantes = reserva.participantes;
    }
  }

  // Manejar contacto de emergencia
  let contactoEmergencia = { nombre: '', telefono: '' };
  if (reserva.contactoEmergencia) {
    if (typeof reserva.contactoEmergencia === 'string') {
      try {
        contactoEmergencia = JSON.parse(reserva.contactoEmergencia);
      } catch (e) {
        console.warn('Error parsing contactoEmergencia:', e);
      }
    } else if (typeof reserva.contactoEmergencia === 'object') {
      contactoEmergencia = reserva.contactoEmergencia;
    }
  }

  // Formatear fecha como string
  const fechaFormateada = reserva.fecha instanceof Date
    ? reserva.fecha.toISOString().split('T')[0]
    : String(reserva.fecha || '');

  return {
    id: reserva.id, // Mantener como number para compatibilidad con ReservasFeed
    nombre: reserva.nombre || '',
    correo: reserva.correo || '',
    telefono: reserva.telefono || '',
    fecha: fechaFormateada,
    hora: reserva.hora || 'Por definir',
    tourId: String(reserva.tourId || ''),
    userId: String(reserva.userId || ''),
    adultos: Number(reserva.adultos || 0),
    niños: Number(reserva.niños || 0),
    participantes: Array.isArray(participantes) ? participantes : [],
    contactoEmergencia,
    estado: reserva.estado || 'Pendiente',
    Tour: reserva.Tour ? {
      id: String(reserva.Tour.id),
      nombre: reserva.Tour.nombre || 'Tour sin nombre',
      imagenUrl: reserva.Tour.imagenUrl || '',
      precio: Number(reserva.Tour.precio || 0),
      ubicacion: reserva.Tour.ubicacion || 'Ubicación no especificada'
    } : undefined,
    createdAt: reserva.createdAt instanceof Date
      ? reserva.createdAt.toISOString()
      : String(reserva.createdAt || new Date().toISOString()),
    updatedAt: reserva.updatedAt instanceof Date
      ? reserva.updatedAt.toISOString()
      : String(reserva.updatedAt || new Date().toISOString())
  };
};

// PATCH - Actualizar reserva (cancelar/reprogramar) CON RLS
export const PATCH = withPrismaCleanup(async (
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) => {
  try {
    // 🔒 OBTENER PRISMA AUTENTICADO (valida sesión automáticamente)
    const { prisma, user } = await getAuthenticatedPrisma();

    const { id } = await context.params;

    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json({
        success: false,
        error: 'ID de reserva inválido'
      }, { status: 400 });
    }

    let data;
    try {
      const body = await request.json();
      data = updateReservationSchema.parse(body);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return NextResponse.json({
          success: false,
          error: 'Datos inválidos',
          details: err.errors
        }, { status: 400 });
      }
      return NextResponse.json({
        success: false,
        error: 'Error interno'
      }, { status: 500 });
    }

    const { action, nuevaFecha } = data;

    console.log(`🔧 Usuario ${user.id} intentando ${action} reserva ${id}`);

    // 🎯 CON RLS: automáticamente solo veremos reservas de este usuario
    const reservaExistente = await prisma.reserva.findUnique({
      where: { id: parseInt(id) },
      // ❗ NO necesitamos filtrar por userId - RLS lo hace automáticamente
      include: {
        Tour: true
      }
    });

    if (!reservaExistente) {
      return NextResponse.json(
        {
          success: false,
          error: 'Reserva no encontrada o no tienes permisos para modificarla'
        },
        { status: 404 }
      );
    }

    // Verificar que la reserva no esté ya cancelada
    if (reservaExistente.estado === 'Cancelada') {
      return NextResponse.json({
        success: false,
        error: 'La reserva ya está cancelada'
      }, { status: 400 });
    }

    let reservaActualizada;

    if (action === 'cancelar') {
      console.log('🗑️ Cancelando reserva ID:', id);

      // 🎯 RLS verificará automáticamente que pertenece al usuario
      reservaActualizada = await prisma.reserva.update({
        where: { id: parseInt(id) },
        data: { estado: 'Cancelada', updatedAt: new Date() },
        include: {
          Tour: {
            select: {
              id: true,
              nombre: true,
              imagenUrl: true,
              precio: true,
              ubicacion: true
            }
          }
        }
      });

      console.log('✅ Reserva cancelada exitosamente. Cupo liberado para:', reservaExistente.fecha);

    } else if (action === 'reprogramar') {
      if (!nuevaFecha) {
        return NextResponse.json({
          success: false,
          error: 'Nueva fecha es requerida para reprogramar'
        }, { status: 400 });
      }

      // Validar que la nueva fecha sea futura
      const fechaNueva = new Date(nuevaFecha);
      const hoy = new Date();
      hoy.setHours(0, 0, 0, 0);

      if (fechaNueva < hoy) {
        return NextResponse.json({
          success: false,
          error: 'La nueva fecha debe ser futura'
        }, { status: 400 });
      }

      // 🛡️ VALIDACIONES DE DISPONIBILIDAD

      // 1. RLS verificará automáticamente que solo vemos reservas del usuario
      const reservaEnNuevaFecha = await prisma.reserva.findFirst({
        where: {
          tourId: reservaExistente.tourId,
          fecha: fechaNueva,
          estado: { not: 'Cancelada' },
          id: { not: parseInt(id) } // Excluir la reserva actual
          // ❗ NO necesitamos userId - RLS filtra automáticamente
        }
      });

      if (reservaEnNuevaFecha) {
        return NextResponse.json(
          {
            success: false,
            error: 'Ya tienes una reserva para este tour en la nueva fecha seleccionada',
            details: 'No puedes tener múltiples reservas para el mismo tour en la misma fecha'
          },
          { status: 400 }
        );
      }

      // 2. Para límite global, necesitamos consulta raw (saltarse RLS)
      const reservasEnNuevaFechaResult = await prisma.$queryRaw<[{ count: bigint }]>`
        SELECT COUNT(*) as count
        FROM "Reserva" 
        WHERE "tourId" = ${reservaExistente.tourId}
        AND "fecha" = ${fechaNueva}
        AND "estado" != 'Cancelada'
        AND "id" != ${parseInt(id)}
      `;

      const reservasEnNuevaFecha = Number(reservasEnNuevaFechaResult[0].count);

      if (reservasEnNuevaFecha >= 3) {
        return NextResponse.json(
          {
            success: false,
            error: 'La nueva fecha seleccionada ya está completamente reservada',
            details: 'Se ha alcanzado el límite máximo de 3 reservas para esa fecha'
          },
          { status: 400 }
        );
      }

      console.log(`📅 Reprogramando reserva de ${reservaExistente.fecha} a ${fechaNueva}`);
      console.log(`📊 Reservas en nueva fecha: ${reservasEnNuevaFecha}/3`);

      // 🎯 RLS verificará automáticamente que la reserva pertenece al usuario
      reservaActualizada = await prisma.reserva.update({
        where: { id: parseInt(id) },
        data: {
          fecha: fechaNueva,
          estado: 'Reprogramada',
          updatedAt: new Date()
        },
        include: {
          Tour: {
            select: {
              id: true,
              nombre: true,
              imagenUrl: true,
              precio: true,
              ubicacion: true
            }
          }
        }
      });

      console.log('✅ Reserva reprogramada exitosamente');
    }

    // Transformar respuesta
    const reservaTransformada = transformReservaForUser(reservaActualizada!);

    // Información adicional sobre disponibilidad
    let mensaje = '';
    if (action === 'cancelar') {
      mensaje = 'Reserva cancelada exitosamente. El cupo ha sido liberado para otros usuarios.';
    } else if (action === 'reprogramar') {
      // Calcular cupos restantes en nueva fecha
      const reservasRestantesResult = await prisma.$queryRaw<[{ count: bigint }]>`
        SELECT COUNT(*) as count
        FROM "Reserva" 
        WHERE "tourId" = ${reservaExistente.tourId}
        AND "fecha" = ${new Date(nuevaFecha!)}
        AND "estado" != 'Cancelada'
      `;

      const reservasRestantesEnNuevaFecha = 3 - Number(reservasRestantesResult[0].count);
      mensaje = `Reserva reprogramada exitosamente. Quedan ${reservasRestantesEnNuevaFecha} cupo${reservasRestantesEnNuevaFecha !== 1 ? 's' : ''} disponibles en la nueva fecha.`;
    }

    return NextResponse.json({
      success: true,
      ...reservaTransformada,
      mensaje,
      security: {
        rls_enabled: true,
        user_id: user.id,
        action_performed: action
      }
    });

  } catch (error) {
    console.error('💥 Error al actualizar reserva:', error);

    if (error instanceof Error) {
      if (error.message === 'Usuario no autenticado') {
        return NextResponse.json({
          success: false,
          error: 'No autenticado'
        }, { status: 401 });
      }

      if (error.message.includes('Los administradores deben usar')) {
        return NextResponse.json({
          success: false,
          error: 'Acceso no válido para este endpoint'
        }, { status: 403 });
      }
    }

    return NextResponse.json({
      success: false,
      error: 'Error al actualizar reserva',
      message: error instanceof Error ? error.message : 'Error desconocido'
    }, { status: 500 });
  }
});

// DELETE - Eliminar reserva CON RLS  
export const DELETE = withPrismaCleanup(async (
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) => {
  try {
    // 🔒 OBTENER PRISMA AUTENTICADO
    const { prisma, user } = await getAuthenticatedPrisma();

    const { id } = await context.params;

    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json({
        success: false,
        error: 'ID de reserva inválido'
      }, { status: 400 });
    }

    console.log(`🗑️ Usuario ${user.id} intentando eliminar reserva ${id}`);

    // 🎯 CON RLS: Solo veremos la reserva si pertenece al usuario
    const reservaExistente = await prisma.reserva.findUnique({
      where: { id: parseInt(id) }
      // ❗ NO necesitamos filtrar por userId - RLS lo hace automáticamente
    });

    if (!reservaExistente) {
      return NextResponse.json(
        {
          success: false,
          error: 'Reserva no encontrada o no tienes permisos para eliminarla'
        },
        { status: 404 }
      );
    }

    console.log('🗑️ Eliminando reserva ID:', id, 'Fecha:', reservaExistente.fecha);

    // 🎯 RLS verificará automáticamente que pertenece al usuario
    const reservaEliminada = await prisma.reserva.delete({
      where: { id: parseInt(id) },
      include: {
        Tour: {
          select: {
            id: true,
            nombre: true,
            imagenUrl: true,
            precio: true,
            ubicacion: true
          }
        }
      }
    });

    console.log('✅ Reserva eliminada exitosamente. Cupo liberado.');

    // Transformar respuesta
    const reservaTransformada = transformReservaForUser(reservaEliminada);

    return NextResponse.json({
      success: true,
      reserva: reservaTransformada,
      message: 'Reserva eliminada correctamente. El cupo ha sido liberado para otros usuarios.',
      security: {
        rls_enabled: true,
        user_id: user.id,
        action_performed: 'delete'
      }
    });

  } catch (error) {
    console.error('💥 Error al eliminar reserva:', error);

    if (error instanceof Error) {
      if (error.message === 'Usuario no autenticado') {
        return NextResponse.json({
          success: false,
          error: 'No autenticado'
        }, { status: 401 });
      }

      if (error.message.includes('Los administradores deben usar')) {
        return NextResponse.json({
          success: false,
          error: 'Acceso no válido para este endpoint'
        }, { status: 403 });
      }
    }

    return NextResponse.json({
      success: false,
      error: 'Error al eliminar reserva',
      message: error instanceof Error ? error.message : 'Error desconocido'
    }, { status: 500 });
  }
});

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Allow': 'PATCH, DELETE, OPTIONS',
    },
  });
}