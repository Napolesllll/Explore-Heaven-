// app/api/reservas/route.ts - VERSIÓN SEGURA CON RLS
import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedPrisma, withPrismaCleanup } from '../../../lib/prisma-rls';

// Definir tipos para los errores de Prisma
interface PrismaError {
  code: string;
  message: string;
}

// POST - Crear nueva reserva (CON RLS)
export const POST = withPrismaCleanup(async (request: NextRequest) => {
  console.log('🚀 POST /api/reservas llamado - Versión RLS');

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

    // Verificar que el tour existe (usando RLS - solo verá tours públicos)
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
    // RLS automáticamente filtrará solo las reservas de este usuario
    const reservaExistente = await prisma.reserva.findFirst({
      where: {
        tourId: tourId,
        fecha: fechaData.date,
        estado: {
          not: 'Cancelada'
        }
        // ❗ NO necesitamos agregar userId - RLS lo hace automáticamente
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
    // Usamos una consulta raw para saltarnos RLS temporalmente
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

    // 💾 CREAR LA RESERVA (RLS verificará automáticamente que userId coincide)
    console.log('💾 Creando reserva con RLS...');
    const reserva = await prisma.reserva.create({
      data: {
        nombre,
        correo,
        telefono,
        fecha: new Date(fechaData.date),
        hora: fechaData.hora || 'Por definir',
        adultos: Number(adultos),
        niños: Number(niños) || 0,
        participantes: participantes,
        contactoEmergencia: contactoEmergencia,
        tourId,
        userId: user.id, // RLS verificará que esto coincide con el usuario actual
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

    return NextResponse.json({
      ...reserva,
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

// GET - Obtener reservas del usuario (CON RLS)
export const GET = withPrismaCleanup(async () => {
  try {
    // 🔒 OBTENER PRISMA AUTENTICADO
    const { prisma, user } = await getAuthenticatedPrisma();

    console.log('🔍 Obteniendo reservas para usuario:', user.id);

    // 🎯 CON RLS: Ya solo veremos las reservas de este usuario automáticamente
    const reservas = await prisma.reserva.findMany({
      // ❗ NO necesitamos where: { userId: user.id } - RLS lo hace automáticamente
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

    console.log(`✅ RLS filtró automáticamente ${reservas.length} reservas para el usuario`);

    // Stats solo para este usuario (RLS aplicado automáticamente)
    const reservasCount = await prisma.reserva.count();
    const toursCount = await prisma.tour.count(); // Tours son públicos

    const userStats = {
      usuarios: 1, // Solo el usuario actual
      tours: toursCount,
      reservas: reservasCount // Solo las reservas de este usuario por RLS
    };

    return NextResponse.json({
      reservas,
      stats: userStats,
      security: {
        rls_enabled: true,
        user_id: user.id,
        filtered_by_rls: true
      }
    });

  } catch (error) {
    console.error('💥 Error al obtener reservas:', error);

    if (error instanceof Error && error.message === 'Usuario no autenticado') {
      return NextResponse.json(
        { error: 'Debes iniciar sesión para ver tus reservas' },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: 'Error al obtener reservas' },
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