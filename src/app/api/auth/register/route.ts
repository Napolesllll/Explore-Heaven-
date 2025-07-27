import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "../../../../lib/prismadb";
import { z } from "zod";

// Esquema de validación para los datos de registro
const registerSchema = z.object({
  email: z.string().email("Correo inválido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
  name: z.string().min(1, "El nombre es obligatorio"),
}); 

export async function POST(req: Request) {
  try {
    // Parsear y validar los datos de entrada
    const body = await req.json();
    const { email, password, name } = registerSchema.parse(body);

    // Verificar si el usuario ya existe
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return new NextResponse("Este correo ya está registrado", { status: 400 });
    }

    // Hashear la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear el nuevo usuario
    const user = await prisma.user.create({
      data: {
        email,
        name,
        hashedPassword,
      },
    });

    // Responder con los datos del usuario creado
    return NextResponse.json({
      id: user.id,
      email: user.email,
      name: user.name,
    });
  } catch (error) {
    // Manejo de errores de validación
    if (error instanceof z.ZodError) {
      return new NextResponse(
        JSON.stringify({ error: "Datos inválidos", detalles: error.errors }),
        { status: 400 }
      );
    }

    // Manejo de errores generales
    console.error("Error en el registro:", error);
    return new NextResponse("Error interno del servidor", { status: 500 });
  }
}