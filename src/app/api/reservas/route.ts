// app/api/reservas/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/route'; // Ajusta la ruta según tu estructura

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  console.log('🚀 POST /api/reservas llamado');

  try {
    // 🔒 VALIDAR SESIÓN PRIMERO
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
      console.log('❌ Usuario no autenticado');
      return NextResponse.json(
        { error: 'Debes iniciar sesión para realizar una reserva' },
        { status: 401 }
      );
    }

    console.log('✅ Usuario autenticado:', session.user.id);

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

    // 🛡️ VALIDACIÓN 1: VERIFICAR QUE EL USUARIO NO TENGA YA UNA RESERVA EN ESA FECHA PARA ESE TOUR
    const reservaExistente = await prisma.reserva.findFirst({
      where: {
        userId: session.user.id,
        tourId: tourId,
        fecha: fechaData.date,
        estado: {
          not: 'Cancelada' // No contar reservas canceladas
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
    const reservasEnFecha = await prisma.reserva.count({
      where: {
        tourId: tourId,
        fecha: fechaData.date,
        estado: {
          not: 'Cancelada' // No contar reservas canceladas
        }
      }
    });

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

    // 🔥 USAR EL USER ID DE LA SESIÓN
    const userId = session.user.id;
    console.log('👤 Usando usuario de sesión:', userId);

    // Verificar que el usuario existe (opcional, por seguridad)
    const userExists = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, email: true }
    });

    if (!userExists) {
      console.log('❌ Usuario de sesión no encontrado en BD');
      return NextResponse.json(
        { error: 'Usuario no válido' },
        { status: 400 }
      );
    }

    console.log('✅ Usuario verificado:', userExists);

    // Crear la reserva
    console.log('💾 Creando reserva...');
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
        userId, // 🎯 ESTE ES EL CAMBIO CLAVE
        estado: 'Pendiente',
        // guiaId lo dejamos null ya que es opcional
      },
    });

    console.log('✅ Reserva creada exitosamente:', reserva);

    // 📊 VERIFICAR SI DESPUÉS DE ESTA RESERVA SE ALCANZÓ EL LÍMITE
    const totalReservasAhora = await prisma.reserva.count({
      where: {
        tourId: tourId,
        fecha: fechaData.date,
        estado: {
          not: 'Cancelada'
        }
      }
    });

    console.log(`📊 Total reservas después de crear: ${totalReservasAhora}/3`);

    // Mensaje informativo sobre disponibilidad restante
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

    // Si es un error de Prisma, dame más detalles
    if (error && typeof error === 'object' && 'code' in error) {
      console.log('🔍 Código de error Prisma:', (error as any).code);
      console.log('🔍 Meta información:', (error as any).meta);

      if ((error as any).code === 'P2003') {
        return NextResponse.json(
          {
            error: 'Error de clave foránea - Una de las relaciones no existe en la base de datos',
            details: 'Verifica que el tourId, userId y otros campos de relación existan',
            prismaError: (error as any).meta
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
}

export async function GET(request: NextRequest) {
  try {
    // 🔒 VALIDAR SESIÓN PARA GET TAMBIÉN
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
      return NextResponse.json(
        { error: 'Debes iniciar sesión para ver tus reservas' },
        { status: 401 }
      );
    }

    console.log('🔍 Obteniendo reservas para usuario:', session.user.id);

    // 🎯 FILTRAR RESERVAS SOLO PARA EL USUARIO AUTENTICADO
    const reservas = await prisma.reserva.findMany({
      where: {
        userId: session.user.id // 🔥 FILTRO CRÍTICO
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

    console.log(`✅ Encontradas ${reservas.length} reservas para el usuario`);

    // Stats solo para este usuario
    const userStats = {
      usuarios: 1, // Solo el usuario actual
      tours: await prisma.tour.count(),
      reservas: reservas.length // Solo las reservas de este usuario
    };

    return NextResponse.json({
      reservas,
      stats: userStats
    });

  } catch (error) {
    console.error('💥 Error al obtener reservas:', error);
    return NextResponse.json(
      { error: 'Error al obtener reservas' },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Allow': 'GET, POST, OPTIONS',
    },
  });
}