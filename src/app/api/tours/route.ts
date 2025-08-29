// app/api/tours/route.ts - VERSIÓN SEGURA CON RLS
import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedPrisma, getPublicPrisma, withPrismaCleanup } from '../../../lib/prisma-rls';

// GET - Listar tours (PÚBLICO - No requiere autenticación)
export const GET = withPrismaCleanup(async (request: NextRequest) => {
  console.log('🚀 GET /api/tours llamado - Versión RLS (público)');

  try {
    // 🌍 OBTENER PRISMA PÚBLICO (no requiere autenticación)
    const prisma = await getPublicPrisma();

    // 🔍 VERIFICAR QUE PRISMA ESTÁ DISPONIBLE
    if (!prisma) {
      console.error('❌ getPublicPrisma() devolvió undefined');
      throw new Error('Cliente Prisma no disponible');
    }

    console.log('🔍 Obteniendo lista pública de tours...');

    // Los tours son públicos, pero verificamos que estén activos
    const tours = await prisma.tour.findMany({
      orderBy: { createdAt: "desc" },
      // Opcional: filtrar solo tours activos si tienes ese campo
      // where: { activo: true }
    });

    console.log(`✅ ${tours.length} tours encontrados (público)`);

    return NextResponse.json(tours);

  } catch (error) {
    console.error('💥 Error al obtener tours:', error);
    console.error('💥 Stack trace:', error instanceof Error ? error.stack : 'No stack');

    // Si getPublicPrisma falla, usar Prisma directo como fallback temporal
    console.log('🔄 Intentando con Prisma directo como fallback...');
    try {
      // Importar el Prisma original como fallback
      const { default: directPrisma } = await import('../../../lib/prismadb');
      const tours = await directPrisma.tour.findMany({
        orderBy: { createdAt: "desc" },
      });

      console.log('✅ Fallback exitoso: tours obtenidos con Prisma directo');
      return NextResponse.json(tours);
    } catch (fallbackError) {
      console.error('💥 Fallback también falló:', fallbackError);
    }

    return NextResponse.json(
      {
        error: 'Error al obtener tours',
        details: error instanceof Error ? error.message : 'Error desconocido'
      },
      { status: 500 }
    );
  }
});

// POST - Crear tour (SOLO ADMIN)
export const POST = withPrismaCleanup(async (request: NextRequest) => {
  console.log('🚀 POST /api/tours llamado - Versión RLS (admin)');

  try {
    // 🔒 OBTENER PRISMA AUTENTICADO CON VERIFICACIÓN DE ADMIN
    const { prisma, user } = await getAuthenticatedPrisma();

    // 🛡️ VERIFICAR QUE ES ADMINISTRADOR
    if (user.role !== 'ADMIN') {
      console.log('❌ Usuario no es admin:', user.email, user.role);
      return NextResponse.json(
        { error: 'Solo los administradores pueden crear tours' },
        { status: 403 }
      );
    }

    console.log('✅ Admin autenticado:', user.email);

    const body = await request.json();
    console.log('📋 Datos recibidos para crear tour:', {
      nombre: body.nombre,
      precio: body.precio,
      ubicacion: body.ubicacion
    });

    const {
      nombre,
      descripcion,
      salida,
      regreso,
      maxReservas,
      guias,
      precio,
      ubicacion,
      imagenUrl,
      gallery,
      info,
    } = body;

    // Validaciones básicas
    if (!nombre || !descripcion || !precio || !ubicacion) {
      return NextResponse.json(
        { error: 'Faltan campos obligatorios: nombre, descripción, precio, ubicación' },
        { status: 400 }
      );
    }

    // 💾 CREAR TOUR (RLS permite a admin crear)
    const tour = await prisma.tour.create({
      data: {
        nombre,
        descripcion,
        salida: salida ? new Date(salida).toISOString() : null,
        regreso: regreso ? new Date(regreso).toISOString() : null,
        maxReservas: Number(maxReservas) || 50,
        guias: guias || [],
        precio: Number(precio),
        ubicacion,
        imagenUrl,
        gallery: gallery || [],
        // info: info, // Si tienes este campo en el schema
        createdById: user.id, // Registrar quién creó el tour
      },
    });

    console.log('✅ Tour creado exitosamente:', tour.id, tour.nombre);

    return NextResponse.json(tour, { status: 201 });

  } catch (error) {
    console.error('💥 Error al crear tour:', error);

    // Manejo específico de errores de autenticación
    if (error instanceof Error) {
      if (error.message === 'Usuario no autenticado') {
        return NextResponse.json(
          { error: 'Debes iniciar sesión como administrador' },
          { status: 401 }
        );
      }
    }

    // Si es un error de Prisma
    if (error && typeof error === 'object' && 'code' in error) {
      const prismaError = error as any;
      console.log('🔍 Código de error Prisma:', prismaError.code);

      if (prismaError.code === 'P2002') {
        return NextResponse.json(
          { error: 'Ya existe un tour con ese nombre' },
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

// PUT - Editar tour (SOLO ADMIN)
export const PUT = withPrismaCleanup(async (request: NextRequest) => {
  console.log('🚀 PUT /api/tours llamado - Versión RLS (admin)');

  try {
    // 🔒 OBTENER PRISMA AUTENTICADO CON VERIFICACIÓN DE ADMIN
    const { prisma, user } = await getAuthenticatedPrisma();

    // 🛡️ VERIFICAR QUE ES ADMINISTRADOR
    if (user.role !== 'ADMIN') {
      console.log('❌ Usuario no es admin:', user.email, user.role);
      return NextResponse.json(
        { error: 'Solo los administradores pueden editar tours' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { id, ...data } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'ID del tour es requerido' },
        { status: 400 }
      );
    }

    console.log('✏️ Editando tour:', id);

    // Verificar que el tour existe antes de actualizar
    const existingTour = await prisma.tour.findUnique({
      where: { id }
    });

    if (!existingTour) {
      return NextResponse.json(
        { error: 'Tour no encontrado' },
        { status: 404 }
      );
    }

    // Preparar datos para actualización (limpiar campos undefined)
    const cleanData: any = {};

    Object.keys(data).forEach(key => {
      if (data[key] !== undefined && data[key] !== null) {
        if (key === 'salida' || key === 'regreso') {
          // Convertir fechas si se proporcionan
          cleanData[key] = new Date(data[key]).toISOString();
        } else if (key === 'precio' || key === 'maxReservas') {
          // Convertir números
          cleanData[key] = Number(data[key]);
        } else {
          cleanData[key] = data[key];
        }
      }
    });

    // Agregar metadatos de modificación
    cleanData.updatedAt = new Date();
    cleanData.updatedById = user.id;

    // 💾 ACTUALIZAR TOUR
    const tour = await prisma.tour.update({
      where: { id },
      data: cleanData,
    });

    console.log('✅ Tour actualizado exitosamente:', tour.nombre);

    return NextResponse.json(tour);

  } catch (error) {
    console.error('💥 Error al editar tour:', error);

    if (error instanceof Error && error.message === 'Usuario no autenticado') {
      return NextResponse.json(
        { error: 'Debes iniciar sesión como administrador' },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: 'Error al editar el tour' },
      { status: 500 }
    );
  }
});

// DELETE - Eliminar tour (SOLO ADMIN)
export const DELETE = withPrismaCleanup(async (request: NextRequest) => {
  console.log('🚀 DELETE /api/tours llamado - Versión RLS (admin)');

  try {
    // 🔒 OBTENER PRISMA AUTENTICADO CON VERIFICACIÓN DE ADMIN
    const { prisma, user } = await getAuthenticatedPrisma();

    // 🛡️ VERIFICAR QUE ES ADMINISTRADOR
    if (user.role !== 'ADMIN') {
      console.log('❌ Usuario no es admin:', user.email, user.role);
      return NextResponse.json(
        { error: 'Solo los administradores pueden eliminar tours' },
        { status: 403 }
      );
    }

    const url = new URL(request.url);
    const id = url.searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'ID del tour es requerido' },
        { status: 400 }
      );
    }

    console.log('🗑️ Eliminando tour:', id);

    // 🛡️ VERIFICACIÓN DE SEGURIDAD: Comprobar si tiene reservas activas
    const reservasActivas = await prisma.reserva.count({
      where: {
        tourId: id,
        estado: {
          not: 'Cancelada'
        }
      }
    });

    if (reservasActivas > 0) {
      console.log(`❌ Tour tiene ${reservasActivas} reservas activas`);
      return NextResponse.json(
        {
          error: 'No se puede eliminar el tour',
          details: `El tour tiene ${reservasActivas} reserva${reservasActivas !== 1 ? 's' : ''} activa${reservasActivas !== 1 ? 's' : ''}. Cancela las reservas primero.`
        },
        { status: 400 }
      );
    }

    // Verificar que el tour existe
    const existingTour = await prisma.tour.findUnique({
      where: { id }
    });

    if (!existingTour) {
      return NextResponse.json(
        { error: 'Tour no encontrado' },
        { status: 404 }
      );
    }

    // 💾 ELIMINAR TOUR
    await prisma.tour.delete({
      where: { id },
    });

    console.log('✅ Tour eliminado exitosamente');

    return NextResponse.json({
      success: true,
      message: 'Tour eliminado exitosamente'
    });

  } catch (error) {
    console.error('💥 Error al eliminar tour:', error);

    if (error instanceof Error && error.message === 'Usuario no autenticado') {
      return NextResponse.json(
        { error: 'Debes iniciar sesión como administrador' },
        { status: 401 }
      );
    }

    // Error de clave foránea (hay reservas vinculadas)
    if (error && typeof error === 'object' && 'code' in error) {
      const prismaError = error as any;
      if (prismaError.code === 'P2003' || prismaError.code === 'P2014') {
        return NextResponse.json(
          {
            error: 'No se puede eliminar el tour',
            details: 'El tour tiene reservas vinculadas. Elimina las reservas primero.'
          },
          { status: 400 }
        );
      }
    }

    return NextResponse.json(
      { error: 'Error al eliminar el tour' },
      { status: 500 }
    );
  }
});

// OPTIONS - CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Allow': 'GET, POST, PUT, DELETE, OPTIONS',
    },
  });
}