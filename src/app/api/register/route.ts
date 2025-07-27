import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "../../../lib/prismadb";
import { registerSchema } from "../../../lib/validationSchemas";
import { ZodError } from "zod";

// Función para crear un nuevo usuario
async function createUser({ email, name, password }: { email: string; name: string; password: string }) {
  // Hashear contraseña
  const hashedPassword = await bcrypt.hash(password, 10);

  // Crear usuario en la base de datos
  return prisma.user.create({
    data: {
      email,
      name,
      hashedPassword,
    },
  });
} 

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Validar datos con Zod
    const parsedData = registerSchema.parse(body);
    const { email, password, name } = parsedData;

    // Verificar si el usuario ya existe
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return new NextResponse("Este correo ya está registrado", { status: 400 });
    }

    // Crear nuevo usuario
    const newUser = await createUser({ email, name, password });

    // Retornar datos seguros
    return NextResponse.json({
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
    });
  } catch (error) {
    if (error instanceof ZodError) {
      // Manejar errores de validación de Zod
      return new NextResponse(
        JSON.stringify({ error: "Datos inválidos", details: error.errors }),
        { status: 400 }
      );
    }

    console.error("Error en registro:", error);
    return new NextResponse("Error interno del servidor", { status: 500 });
  }
}