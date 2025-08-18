// src/app/api/auth/verify-email/route.ts

import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../lib/prismadb";
import { signIn } from "next-auth/react";

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const token = searchParams.get("token");
        const email = searchParams.get("email");
        const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";

        if (!token || !email) {
            return NextResponse.redirect(
                new URL("/auth/error?error=MissingToken", request.url)
            );
        }

        // Verificar el token en la base de datos
        const verificationToken = await prisma.verificationToken.findFirst({
            where: {
                token: token,
                identifier: email,
                expires: {
                    gt: new Date() // Token no expirado
                }
            }
        });

        if (!verificationToken) {
            return NextResponse.redirect(
                new URL("/auth/error?error=TokenExpired", request.url)
            );
        }

        // Buscar el usuario
        const user = await prisma.user.findUnique({
            where: { email: email }
        });

        if (!user) {
            return NextResponse.redirect(
                new URL("/auth/error?error=UserNotFound", request.url)
            );
        }

        // Marcar el email como verificado
        await prisma.user.update({
            where: { email: email },
            data: {
                emailVerified: new Date()
            }
        });

        // Eliminar el token de verificación (ya fue usado)
        await prisma.verificationToken.delete({
            where: {
                identifier_token: {
                    identifier: email,
                    token: token
                }
            }
        });

        // Redirigir a una página que solicite login con mensaje de verificación exitosa
        return NextResponse.redirect(
            new URL(`/auth/success?verified=true`, request.url)
        );

    } catch (error) {
        console.error("[VERIFY_EMAIL_ERROR]:", error);
        return NextResponse.redirect(
            new URL("/auth/error?error=VerificationFailed", request.url)
        );
    }
}