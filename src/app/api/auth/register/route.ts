import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "../../../../lib/prismadb";
import { z } from "zod";
import { sendVerificationRequest } from "../../../../lib/email/sendVerificationRequest";
import crypto from "crypto";

const registerSchema = z.object({
  name: z.string().min(1, "El nombre es obligatorio"),
  email: z.string().email("Email no válido"),
  password: z.string().min(6, "La contraseña debe tener mínimo 6 caracteres"),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, password } = registerSchema.parse(body);

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return new NextResponse("El usuario ya existe", { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({
      data: {
        name,
        email,
        hashedPassword
        // El status será ACTIVE por defecto según tu modelo
        // El emailVerified será null hasta que se verifique
      },
    });

    const server = process.env.EMAIL_SERVER;
    const from = process.env.EMAIL_FROM;
    const baseUrl = process.env.NEXTAUTH_URL;

    if (!server || !from || !baseUrl) {
      console.error("Falta configurar EMAIL_SERVER, EMAIL_FROM o NEXTAUTH_URL");
      return new NextResponse("Error de configuración de correo electrónico", { status: 500 });
    }

    // 🧠 Generar y guardar token de verificación
    const token = crypto.randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24h

    await prisma.verificationToken.create({
      data: { identifier: email, token, expires },
    });

    // Usar nuestro endpoint personalizado para verificar email
    const verificationUrl = `${baseUrl}/api/auth/verify-email?token=${encodeURIComponent(token)}&email=${encodeURIComponent(email)}&callbackUrl=${encodeURIComponent(`${baseUrl}/dashboard`)}`;

    await sendVerificationRequest({
      identifier: email,
      url: verificationUrl,
      provider: { server, from },
    });

    return NextResponse.json(
      { id: user.id, name: user.name, email: user.email },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("[/api/auth/register] Error:", error);

    if (error instanceof z.ZodError) {
      return new NextResponse("Datos inválidos: " + error.message, {
        status: 400,
      });
    }

    return new NextResponse("Error en el servidor", { status: 500 });
  }
}