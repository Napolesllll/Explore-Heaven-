import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../lib/auth/auth.config";
import prisma from "../../../../lib/prismadb";
import { compare, hash } from "bcryptjs";

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const body = await req.json();
    let { currentPassword, newPassword } = body;

    // Limpiar espacios en blanco
    currentPassword = currentPassword?.trim();
    newPassword = newPassword?.trim();

    // Debug: Log para ver qué datos llegan
    console.log("Datos recibidos:", {
      currentPasswordLength: currentPassword?.length,
      newPasswordLength: newPassword?.length,
      userEmail: session.user.email,
      areEqual: currentPassword === newPassword,
      currentPasswordPreview: currentPassword?.substring(0, 3) + "...",
      newPasswordPreview: newPassword?.substring(0, 3) + "..."
    });

    // Validaciones básicas
    if (!currentPassword || !newPassword) {
      console.log("Error: Contraseñas faltantes", { currentPassword: !!currentPassword, newPassword: !!newPassword });
      return NextResponse.json({
        error: "La contraseña actual y nueva son requeridas"
      }, { status: 400 });
    }

    if (newPassword.length < 6) {
      console.log("Error: Nueva contraseña muy corta", { length: newPassword.length });
      return NextResponse.json({
        error: "La nueva contraseña debe tener al menos 6 caracteres"
      }, { status: 400 });
    }

    if (currentPassword === newPassword) {
      console.log("Error: Contraseñas iguales - Debug:", {
        current: Array.from(currentPassword).map(c => c.charCodeAt(0)),
        new: Array.from(newPassword).map(c => c.charCodeAt(0))
      });
      return NextResponse.json({
        error: "La nueva contraseña debe ser diferente a la actual"
      }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      console.log("Error: Usuario no encontrado", { email: session.user.email });
      return NextResponse.json({
        error: "Usuario no encontrado"
      }, { status: 404 });
    }

    if (!user.hashedPassword) {
      console.log("Error: Usuario sin contraseña hasheada", { userId: user.id });
      return NextResponse.json({
        error: "Usuario sin contraseña configurada"
      }, { status: 400 });
    }

    console.log("Verificando contraseña actual...");
    const isValid = await compare(currentPassword, user.hashedPassword);

    if (!isValid) {
      console.log("Error: Contraseña actual incorrecta");
      return NextResponse.json({
        error: "Contraseña actual incorrecta"
      }, { status: 400 });
    }

    console.log("Hasheando nueva contraseña...");
    const newHashed = await hash(newPassword, 12);

    console.log("Actualizando contraseña en base de datos...");
    const updatedUser = await prisma.user.update({
      where: { email: session.user.email },
      data: {
        hashedPassword: newHashed,
        updatedAt: new Date() // Opcional: actualizar timestamp
      },
      select: {
        id: true,
        email: true,
        name: true,
        image: true,
        // No incluir hashedPassword por seguridad
      }
    });

    console.log("Contraseña actualizada exitosamente para:", session.user.email);

    return NextResponse.json({
      message: "Contraseña actualizada correctamente",
      user: updatedUser
    }, { status: 200 });

  } catch (error) {
    console.error("Error al cambiar contraseña:", error);
    return NextResponse.json({
      error: "Error interno del servidor",
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    }, { status: 500 });
  }
}