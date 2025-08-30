import { NextResponse } from "next/server";
import { z } from "zod";
import prisma from "../../../../lib/prismadb";
import { sendVerificationRequest } from "../../../../lib/email/sendVerificationRequest";
import { generateVerificationToken } from "../../../../lib/generateVerificationToken";

const schema = z.object({
    email: z.string().email("Email inválido"),
});

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { email } = schema.parse(body);

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return new NextResponse("Usuario no encontrado", { status: 404 });
        }

        if (user.emailVerified) {
            return new NextResponse("El correo ya está verificado", { status: 400 });
        }

        const baseUrl = process.env.NEXTAUTH_URL;
        const server = process.env.EMAIL_SERVER;
        const from = process.env.EMAIL_FROM;

        if (!baseUrl || !server || !from) {
            return new NextResponse("Falta configuración de correo", { status: 500 });
        }

        // Parsear las configuraciones del servidor de correo desde EMAIL_SERVER
        const { host, port, user: smtpUser, pass } = JSON.parse(server);

        // Generar el token de verificación
        const tokenRecord = (await generateVerificationToken(email)) as { token: string; expires?: string | Date };

        if (!tokenRecord || typeof tokenRecord.token !== "string") {
            console.error("[/api/auth/resend] token inválido:", tokenRecord);
            return new NextResponse("Error generando token de verificación", { status: 500 });
        }

        // Crear la URL de verificación
        const verificationUrl = `${baseUrl}/api/auth/verify-email?token=${encodeURIComponent(
            tokenRecord.token
        )}&email=${encodeURIComponent(email)}&callbackUrl=${encodeURIComponent(`${baseUrl}/dashboard`)}`;

        // Enviar el correo de verificación usando el endpoint personalizado
        await sendVerificationRequest({
            identifier: email,
            url: verificationUrl,
            provider: {
                server: {
                    host,  // La propiedad host debe estar dentro de server
                    port: port || 587,  // Asegúrate de que el puerto sea válido
                    auth: {
                        user: smtpUser, // Renombramos 'user' a 'smtpUser' para evitar conflictos
                        pass,
                    },
                },
                from, // Dirección de correo 'from'
            },
        });

        return new NextResponse("Correo de verificación enviado", { status: 200 });
    } catch (error: unknown) {
        console.error("[/api/auth/resend]", error);

        // Manejar errores de validación de Zod
        if (error instanceof z.ZodError) {
            return new NextResponse("Email inválido", { status: 400 });
        }

        // Manejar otros errores
        return new NextResponse("Error en el servidor", { status: 500 });
    }
}
