// app/api/reservas/route.ts - VERSIÓN CORREGIDA CON FILTRADO EXPLÍCITO POR USUARIO
import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedPrisma, withPrismaCleanup } from '../../../lib/prisma-rls';

// Definir tipos para los errores de Prisma
interface PrismaError {
  code: string;
  message: string;
}

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

// POST - Crear nueva reserva
export const POST = withPrismaCleanup(async (request: NextRequest) => {
  console.log('🚀 POST /api/reservas llamado');

  try {
    // 🔒 OBTENER PRISMA AUTENTICADO (ya valida la sesión automáticamente)
    const { prisma, user } = await getAuthenticatedPrisma();

    console.log('✅ Usuario autenticado:', user.id, user.email);

    const body = await request.json();
    console.log('📋 Datos recibidos:', body);

    const {
      tourId,
      fechaId,
      nombre,
      correo,
      telefono,
      adultos,
      niños,
      participantes,
      contactoEmergencia
    } = body;

    // Validaciones básicas
    if (!tourId || !fechaId || !nombre || !correo || !telefono) {
      return NextResponse.json(
        { error: 'Faltan campos obligatorios' },
        { status: 400 }
      );
    }

    // Verificar que el tour existe
    console.log('🔍 Verificando que el tour existe...');
    const tour = await prisma.tour.findUnique({
      where: { id: tourId }
    });

    if (!tour) {
      console.log('❌ Tour no encontrado');
      return NextResponse.json(
        { error: 'Tour no encontrado' },
        { status: 400 }
      );
    }
    console.log('✅ Tour encontrado:', tour.nombre);

    // Buscar la fecha disponible
    console.log('🔍 Buscando fecha con ID:', fechaId);
    const fechaData = await prisma.availableDate.findUnique({
      where: { id: fechaId }
    });

    if (!fechaData) {
      return NextResponse.json(
        { error: 'Fecha no disponible' },
        { status: 400 }
      );
    }
    console.log('📅 Fecha encontrada:', fechaData);

    // 🛡️ VALIDACIÓN 1: VERIFICAR QUE EL USUARIO NO TENGA YA UNA RESERVA EN ESA FECHA
    // ✅ FILTRADO EXPLÍCITO POR USUARIO - ESTO ES LO QUE FALTABA
    const reservaExistente = await prisma.reserva.findFirst({
      where: {
        userId: user.id, // ✅ FILTRO EXPLÍCITO POR USER ID
        tourId: tourId,
        fecha: fechaData.date,
        estado: {
          not: 'Cancelada'
        }
      }
    });

    if (reservaExistente) {
      console.log('❌ Usuario ya tiene una reserva en esta fecha para este tour');
      return NextResponse.json(
        {
          error: 'Ya tienes una reserva para este tour en la fecha seleccionada',
          details: 'No puedes hacer múltiples reservas para el mismo tour en la misma fecha'
        },
        { status: 400 }
      );
    }

    // 🛡️ VALIDACIÓN 2: VERIFICAR LÍMITE DE 3 RESERVAS POR FECHA
    // Para esto necesitamos contar TODAS las reservas (no solo del usuario)
    const reservasEnFechaResult = await prisma.$queryRaw<[{ count: bigint }]>`
      SELECT COUNT(*) as count
      FROM "Reserva" 
      WHERE "tourId" = ${tourId}
      AND "fecha" = ${fechaData.date}
      AND "estado" != 'Cancelada'
    `;

    const reservasEnFecha = Number(reservasEnFechaResult[0].count);
    console.log(`📊 Reservas existentes en esta fecha: ${reservasEnFecha}/3`);

    if (reservasEnFecha >= 3) {
      console.log('❌ Límite de reservas alcanzado para esta fecha');
      return NextResponse.json(
        {
          error: 'Esta fecha ya está completamente reservada',
          details: 'Se ha alcanzado el límite máximo de 3 reservas para esta fecha'
        },
        { status: 400 }
      );
    }

    // 💾 CREAR LA RESERVA
    console.log('💾 Creando reserva...');
    const reserva = await prisma.reserva.create({
      data: {
        nombre,
        correo,
        telefono,
        fecha: new Date(fechaData.date),
        hora: 'Por definir',
        adultos: Number(adultos),
        niños: Number(niños) || 0,
        participantes: JSON.stringify(participantes || []),
        contactoEmergencia: JSON.stringify(contactoEmergencia || { nombre: '', telefono: '' }),
        tourId,
        userId: user.id, // ✅ ASIGNACIÓN EXPLÍCITA DEL USER ID
        estado: 'Pendiente',
      },
      include: {
        Tour: {
          select: {
            id: true,
            nombre: true,
            descripcion: true,
            precio: true,
            imagenUrl: true,
            ubicacion: true
          }
        }
      }
    });

    console.log('✅ Reserva creada exitosamente:', reserva.id);

    // 📊 VERIFICAR DISPONIBILIDAD RESTANTE
    const totalReservasAhoraResult = await prisma.$queryRaw<[{ count: bigint }]>`
      SELECT COUNT(*) as count
      FROM "Reserva" 
      WHERE "tourId" = ${tourId}
      AND "fecha" = ${fechaData.date}
      AND "estado" != 'Cancelada'
    `;

    const totalReservasAhora = Number(totalReservasAhoraResult[0].count);
    const reservasRestantes = 3 - totalReservasAhora;

    let mensaje = 'Reserva creada exitosamente';
    if (totalReservasAhora >= 3) {
      mensaje += '. Esta fecha ya está completamente reservada.';
    } else {
      mensaje += `. Quedan ${reservasRestantes} cupo${reservasRestantes !== 1 ? 's' : ''} disponibles para esta fecha.`;
    }

    // Transformar respuesta al formato esperado por ReservasFeed
    const reservaTransformada = transformReservaForUser(reserva);

    return NextResponse.json({
      ...reservaTransformada,
      mensaje,
      disponibilidadRestante: reservasRestantes
    }, { status: 201 });

  } catch (error) {
    console.error('💥 Error al crear reserva:', error);

    // Manejo específico de errores de autenticación
    if (error instanceof Error) {
      if (error.message === 'Usuario no autenticado') {
        return NextResponse.json(
          { error: 'Debes iniciar sesión para realizar una reserva' },
          { status: 401 }
        );
      }

      if (error.message.includes('Los administradores deben usar')) {
        return NextResponse.json(
          { error: 'Acceso no válido para este endpoint' },
          { status: 403 }
        );
      }
    }

    // Si es un error de Prisma
    if (error && typeof error === 'object' && 'code' in error) {
      const prismaError = error as PrismaError;
      console.log('🔍 Código de error Prisma:', prismaError.code);

      if (prismaError.code === 'P2003') {
        return NextResponse.json(
          {
            error: 'Error de clave foránea - Una de las relaciones no existe',
            details: 'Verifica que el tourId existe'
          },
          { status: 400 }
        );
      }
    }

    return NextResponse.json(
      {
        error: 'Error interno del servidor',
        message: error instanceof Error ? error.message : 'Error desconocido'
      },
      { status: 500 }
    );
  }
});

// GET - Obtener reservas del usuario - ✅ FILTRADO EXPLÍCITO POR USUARIO
export const GET = withPrismaCleanup(async () => {
  try {
    // 🔒 OBTENER PRISMA AUTENTICADO
    const { prisma, user } = await getAuthenticatedPrisma();

    console.log('🔍 Obteniendo reservas para usuario:', user.id);

    // 🎯 ✅ FILTRADO EXPLÍCITO POR USER ID - ESTO ES LO QUE FALTABA
    const reservas = await prisma.reserva.findMany({
      where: {
        userId: user.id // ✅ FILTRO EXPLÍCITO POR USER ID
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
        }
      },
      orderBy: { createdAt: 'desc' },
    });

    console.log(`✅ Se encontraron ${reservas.length} reservas para el usuario ${user.id}`);

    // Transformar reservas al formato esperado por ReservasFeed
    const reservasTransformadas = reservas.map(transformReservaForUser);

    // Stats solo para este usuario (con filtrado explícito)
    const reservasCount = await prisma.reserva.count({
      where: {
        userId: user.id // ✅ CONTAR SOLO RESERVAS DE ESTE USUARIO
      }
    });

    const toursCount = await prisma.tour.count(); // Tours son públicos

    const userStats = {
      usuarios: 1, // Solo el usuario actual
      tours: toursCount,
      reservas: reservasCount // Solo las reservas de este usuario
    };

    return NextResponse.json({
      success: true,
      reservas: reservasTransformadas,
      stats: userStats,
      security: {
        user_filtering_enabled: true,
        user_id: user.id,
        reservas_found: reservas.length
      }
    });

  } catch (error) {
    console.error('💥 Error al obtener reservas:', error);

    if (error instanceof Error && error.message === 'Usuario no autenticado') {
      return NextResponse.json(
        {
          success: false,
          error: 'Debes iniciar sesión para ver tus reservas'
        },
        { status: 401 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: 'Error al obtener reservas'
      },
      { status: 500 }
    );
  }
});

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Allow': 'GET, POST, OPTIONS',
    },
  });
}