// app/api/perfil/route.ts - PERFIL CON RLS
import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedPrisma, withPrismaCleanup } from '../../../lib/prisma-rls';

// Definir tipos para los errores de Prisma
interface PrismaError {
  code: string;
  message: string;
}

// PUT - Actualizar perfil de usuario CON RLS
export const PUT = withPrismaCleanup(async (request: NextRequest) => {
  try {
    // 🔒 OBTENER PRISMA AUTENTICADO (valida sesión automáticamente)
    const { prisma, user } = await getAuthenticatedPrisma();

    console.log('👤 Actualizando perfil para usuario:', user.id, user.email);

    // Leer el body de forma defensiva: request.json() lanza si el body está vacío
    const rawBody = await request.text();
    console.log('🔎 Raw request body:', rawBody);

    let parsedBody: any = {};
    if (rawBody && rawBody.trim() !== '') {
      try {
        parsedBody = JSON.parse(rawBody);
      } catch (err) {
        console.error('❌ JSON inválido en el body:', err);
        return NextResponse.json({ error: 'JSON inválido en el body' }, { status: 400 });
      }
    }

    const { name, email } = parsedBody;

    // Validaciones básicas
    if (!name || !email) {
      return NextResponse.json(
        { error: "Nombre y email son requeridos" },
        { status: 400 }
      );
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Formato de email inválido" },
        { status: 400 }
      );
    }

    // Verificar si el nuevo email ya existe (solo si es diferente al actual)
    if (email !== user.email) {
      const emailExists = await prisma.user.findUnique({
        where: { email: email.toLowerCase() }
      });

      if (emailExists) {
        return NextResponse.json(
          { error: "Este email ya está registrado" },
          { status: 400 }
        );
      }
    }

    // 🎯 CON RLS: Solo podemos actualizar nuestro propio perfil
    // RLS verificará automáticamente que el usuario coincide
    const updatedUser = await prisma.user.update({
      where: { id: user.id }, // Usar ID del usuario autenticado
      data: {
        name: name.trim(),
        email: email.toLowerCase().trim(),
        updatedAt: new Date()
      },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        role: true,
        emailVerified: true,
        createdAt: true,
        updatedAt: true
      }
    });

    console.log('✅ Perfil actualizado exitosamente para:', updatedUser.email);

    return NextResponse.json({
      user: updatedUser,
      message: "Perfil actualizado exitosamente",
      security: {
        rls_enabled: true,
        user_id: user.id,
        action_performed: 'profile_update'
      }
    });

  } catch (error) {
    console.error('💥 Error al actualizar perfil:', error);

    if (error instanceof Error) {
      if (error.message === 'Usuario no autenticado') {
        return NextResponse.json({ error: "No autorizado" }, { status: 401 });
      }

      if (error.message.includes('Los administradores deben usar')) {
        return NextResponse.json({ error: 'Acceso no válido para este endpoint' }, { status: 403 });
      }
    }

    // Error de Prisma - registro no encontrado
    if (error && typeof error === 'object' && 'code' in error) {
      const prismaError = error as PrismaError;
      if (prismaError.code === 'P2025') {
        return NextResponse.json(
          { error: 'Usuario no encontrado' },
          { status: 404 }
        );
      }

      if (prismaError.code === 'P2002') {
        return NextResponse.json(
          { error: 'Este email ya está registrado' },
          { status: 400 }
        );
      }
    }

    return NextResponse.json({
      error: "Error al actualizar perfil"
    }, { status: 500 });
  }
});

// GET - Obtener perfil del usuario CON RLS
export const GET = withPrismaCleanup(async () => {
  try {
    // 🔒 OBTENER PRISMA AUTENTICADO
    const { prisma, user } = await getAuthenticatedPrisma();

    console.log('🔍 Obteniendo perfil para usuario:', user.id);

    // 🎯 CON RLS: Solo podemos ver nuestro propio perfil
    const userProfile = await prisma.user.findUnique({
      where: { id: user.id },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        role: true,
        emailVerified: true,
        createdAt: true,
        updatedAt: true,
        lastLogin: true,
        // Información adicional del perfil
        _count: {
          select: {
            reservas: true
          }
        }
      }
    });

    if (!userProfile) {
      return NextResponse.json(
        { error: 'Perfil no encontrado' },
        { status: 404 }
      );
    }

    console.log('✅ Perfil obtenido exitosamente');

    return NextResponse.json({
      user: userProfile,
      security: {
        rls_enabled: true,
        user_id: user.id,
        filtered_by_rls: true
      }
    });

  } catch (error) {
    console.error('💥 Error al obtener perfil:', error);

    if (error instanceof Error && error.message === 'Usuario no autenticado') {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    return NextResponse.json({
      error: "Error al obtener perfil"
    }, { status: 500 });
  }
});