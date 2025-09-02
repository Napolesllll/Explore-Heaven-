// app/api/reservas/[id]/route.ts - VERSIÓN COMPLETA CON FILTRADO EXPLÍCITO POR USUARIO
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
    id: reserva.id,
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

// GET - Obtener reserva específica CON FILTRADO EXPLÍCITO POR USUARIO
export const GET = withPrismaCleanup(async (
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

    console.log(`📋 Usuario ${user.id} consultando reserva ${id}`);

    // 🎯 ✅ FILTRADO EXPLÍCITO POR USER ID
    const reserva = await prisma.reserva.findFirst({
      where: {
        id: parseInt(id),
        userId: user.id // ✅ FILTRO EXPLÍCITO POR USER ID
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

    if (!reserva) {
      return NextResponse.json(
        {
          success: false,
          error: 'Reserva no encontrada o no tienes permisos para verla'
        },
        { status: 404 }
      );
    }

    // Transformar respuesta
    const reservaTransformada = transformReservaForUser(reserva);

    return NextResponse.json({
      success: true,
      reserva: reservaTransformada,
      security: {
        user_filtering_enabled: true,
        user_id: user.id
      }
    });

  } catch (error) {
    console.error('💥 Error al obtener reserva:', error);

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
      error: 'Error al obtener reserva',
      message: error instanceof Error ? error.message : 'Error desconocido'
    }, { status: 500 });
  }
});

// PATCH - Actualizar reserva (cancelar/reprogramar) CON FILTRADO EXPLÍCITO POR USUARIO
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

    // 🎯 ✅ FILTRADO EXPLÍCITO POR USER ID - ESTO ES LO QUE FALTABA
    const reservaExistente = await prisma.reserva.findFirst({
      where: {
        id: parseInt(id),
        userId: user.id // ✅ FILTRO EXPLÍCITO POR USER ID
      },
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

      // 🎯 ✅ ACTUALIZACIÓN CON FILTRADO EXPLÍCITO POR USER ID
      reservaActualizada = await prisma.reserva.updateMany({
        where: {
          id: parseInt(id),
          userId: user.id // ✅ VERIFICACIÓN EXPLÍCITA DE PROPIEDAD
        },
        data: {
          estado: 'Cancelada',
          updatedAt: new Date()
        }
      });

      if (reservaActualizada.count === 0) {
        return NextResponse.json({
          success: false,
          error: 'Reserva no encontrada o no tienes permisos para cancelarla'
        }, { status: 404 });
      }

      // Obtener la reserva actualizada para la respuesta
      const reservaCancelada = await prisma.reserva.findFirst({
        where: {
          id: parseInt(id),
          userId: user.id
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

      console.log('✅ Reserva cancelada exitosamente. Cupo liberado para:', reservaExistente.fecha);
      reservaActualizada = reservaCancelada;

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

      // 1. ✅ VERIFICACIÓN EXPLÍCITA - SOLO RESERVAS DEL USUARIO
      const reservaEnNuevaFecha = await prisma.reserva.findFirst({
        where: {
          userId: user.id, // ✅ FILTRO EXPLÍCITO POR USER ID
          tourId: reservaExistente.tourId,
          fecha: fechaNueva,
          estado: { not: 'Cancelada' },
          id: { not: parseInt(id) } // Excluir la reserva actual
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

      // 2. Para límite global, necesitamos consulta raw (contar TODAS las reservas)
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

      // 🎯 ✅ ACTUALIZACIÓN CON FILTRADO EXPLÍCITO POR USER ID
      const updateResult = await prisma.reserva.updateMany({
        where: {
          id: parseInt(id),
          userId: user.id // ✅ VERIFICACIÓN EXPLÍCITA DE PROPIEDAD
        },
        data: {
          fecha: fechaNueva,
          estado: 'Reprogramada',
          updatedAt: new Date()
        }
      });

      if (updateResult.count === 0) {
        return NextResponse.json({
          success: false,
          error: 'Reserva no encontrada o no tienes permisos para reprogramarla'
        }, { status: 404 });
      }

      // Obtener la reserva actualizada para la respuesta
      reservaActualizada = await prisma.reserva.findFirst({
        where: {
          id: parseInt(id),
          userId: user.id
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

    if (!reservaActualizada) {
      return NextResponse.json({
        success: false,
        error: 'Error al procesar la actualización'
      }, { status: 500 });
    }

    // Transformar respuesta
    const reservaTransformada = transformReservaForUser(reservaActualizada);

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
        user_filtering_enabled: true,
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

// DELETE - Eliminar reserva CON FILTRADO EXPLÍCITO POR USUARIO  
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

    // 🎯 ✅ FILTRADO EXPLÍCITO POR USER ID
    const reservaExistente = await prisma.reserva.findFirst({
      where: {
        id: parseInt(id),
        userId: user.id // ✅ FILTRO EXPLÍCITO POR USER ID
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

    // 🎯 ✅ ELIMINACIÓN CON FILTRADO EXPLÍCITO POR USER ID
    const deleteResult = await prisma.reserva.deleteMany({
      where: {
        id: parseInt(id),
        userId: user.id // ✅ VERIFICACIÓN EXPLÍCITA DE PROPIEDAD
      }
    });

    if (deleteResult.count === 0) {
      return NextResponse.json({
        success: false,
        error: 'Reserva no encontrada o no tienes permisos para eliminarla'
      }, { status: 404 });
    }

    console.log('✅ Reserva eliminada exitosamente. Cupo liberado.');

    // Transformar respuesta usando los datos de la reserva antes de eliminar
    const reservaTransformada = transformReservaForUser(reservaExistente);

    return NextResponse.json({
      success: true,
      reserva: reservaTransformada,
      message: 'Reserva eliminada correctamente. El cupo ha sido liberado para otros usuarios.',
      security: {
        user_filtering_enabled: true,
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

      // Manejar errores específicos de Prisma
      if (error.message.includes('Record to delete does not exist')) {
        return NextResponse.json({
          success: false,
          error: 'Reserva no encontrada o ya eliminada'
        }, { status: 404 });
      }
    }

    return NextResponse.json({
      success: false,
      error: 'Error al eliminar reserva',
      message: error instanceof Error ? error.message : 'Error desconocido'
    }, { status: 500 });
  }
});

// OPTIONS - Configurar métodos permitidos
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Allow': 'GET, PATCH, DELETE, OPTIONS',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, PATCH, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}