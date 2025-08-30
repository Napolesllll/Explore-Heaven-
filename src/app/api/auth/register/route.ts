import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "../../../../lib/prismadb";
import { z } from "zod";
import { sendVerificationRequest } from "../../../../lib/email/sendVerificationRequest";
import crypto from "crypto";

// Definir esquema de validación para el registro
const registerSchema = z.object({
  name: z.string().min(1, "El nombre es obligatorio"),
  email: z.string().email("Email no válido"),
  password: z.string().min(6, "La contraseña debe tener mínimo 6 caracteres"),
});

// Función para parsear URL SMTP
function parseSmtpUrl(smtpUrl: string) {
  try {
    const url = new URL(smtpUrl);
    return {
      host: url.hostname,
      port: parseInt(url.port) || 587,
      user: decodeURIComponent(url.username),
      pass: decodeURIComponent(url.password),
    };
  } catch {
    throw new Error("URL SMTP inválida");
  }
}

export async function POST(request: Request) {
  try {
    // Obtener el cuerpo de la solicitud con manejo de errores
    let body;
    try {
      body = await request.json();
    } catch (error) {
      console.error("Error leyendo el body:", error);
      return new NextResponse("Error al procesar la solicitud", { status: 400 });
    }

    const { name, email, password } = registerSchema.parse(body);

    // Normalizar el email a lowercase
    const normalizedEmail = email.toLowerCase().trim();

    // Verificar si el usuario ya existe
    const existingUser = await prisma.user.findUnique({ where: { email: normalizedEmail } });
    console.log("Email a verificar:", normalizedEmail);
    console.log("Usuario existente encontrado:", existingUser ? "SÍ" : "NO");

    if (existingUser) {
      console.log("Detalles del usuario existente:", {
        id: existingUser.id,
        email: existingUser.email,
        emailVerified: existingUser.emailVerified
      });

      // Si el usuario existe pero no ha verificado su email, permitir re-registro
      if (!existingUser.emailVerified) {
        console.log("Usuario no verificado, permitiendo re-registro...");

        // Eliminar tokens de verificación antiguos
        await prisma.verificationToken.deleteMany({
          where: { identifier: normalizedEmail }
        });

        // Actualizar la contraseña del usuario existente
        const hashedPassword = await bcrypt.hash(password, 12);
        await prisma.user.update({
          where: { email: normalizedEmail },
          data: {
            hashedPassword,
            name // También actualizar el nombre si es diferente
          }
        });
      } else {
        return new NextResponse("El usuario ya existe y está verificado", { status: 409 });
      }
    }

    // Hashear la contraseña
    const hashedPassword = await bcrypt.hash(password, 12);

    // Crear el nuevo usuario solo si no existe
    let newUser;
    if (!existingUser) {
      newUser = await prisma.user.create({
        data: {
          name,
          email: normalizedEmail,
          hashedPassword,
        },
      });
    } else {
      // Si el usuario existe pero no está verificado, usar el existente
      newUser = existingUser;
    }

    // Obtener las configuraciones necesarias de las variables de entorno
    const server = process.env.EMAIL_SERVER;
    const from = process.env.EMAIL_FROM;
    const baseUrl = process.env.NEXTAUTH_URL;

    // Verificar que todas las variables de entorno estén configuradas correctamente
    if (!server || !from || !baseUrl) {
      console.error("Falta configurar EMAIL_SERVER, EMAIL_FROM o NEXTAUTH_URL");
      return new NextResponse("Error de configuración de correo electrónico", { status: 500 });
    }

    // Parsear las credenciales del servidor de correo
    let smtpConfig;
    try {
      // Intentar primero como JSON
      smtpConfig = JSON.parse(server);
    } catch {
      // Si falla, intentar como URL SMTP
      smtpConfig = parseSmtpUrl(server);
    }

    const { host, port, user: smtpUser, pass } = smtpConfig;

    // Generar y guardar el token de verificación
    const token = crypto.randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // Expira en 24 horas

    await prisma.verificationToken.create({
      data: { identifier: normalizedEmail, token, expires },
    });

    // Crear la URL de verificación
    const verificationUrl = `${baseUrl}/api/auth/verify-email?token=${encodeURIComponent(token)}&email=${encodeURIComponent(normalizedEmail)}&callbackUrl=${encodeURIComponent(`${baseUrl}/dashboard`)}`;

    // Enviar el correo de verificación
    await sendVerificationRequest({
      identifier: normalizedEmail,
      url: verificationUrl,
      provider: {
        server: {
          host,
          port: port || 587,
          auth: {
            user: smtpUser,
            pass,
          },
        },
        from,
      },
    });

    // Devolver la respuesta de éxito
    return NextResponse.json(
      { id: newUser.id, name: newUser.name, email: newUser.email },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error("[/api/auth/register] Error:", error);

    // Manejar errores de validación de Zod
    if (error instanceof z.ZodError) {
      return new NextResponse("Datos inválidos: " + error.message, {
        status: 400,
      });
    }

    // Manejar otros errores
    const message = error instanceof Error ? error.message : String(error);
    return new NextResponse("Error en el servidor: " + message, { status: 500 });
  }
}