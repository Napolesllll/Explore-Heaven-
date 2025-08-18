// src/app/api/auth/auto-signin/route.ts

import { NextRequest, NextResponse } from "next/server";
import { signIn } from "next-auth/react";

export async function POST(request: NextRequest) {
    try {
        const { email, callbackUrl } = await request.json();

        // Aquí podrías generar un token temporal para auto-login
        // Por seguridad, mejor redirigir a login normal

        return NextResponse.json({
            success: true,
            redirectUrl: `/auth?verified=true&email=${encodeURIComponent(email)}`
        });

    } catch (error) {
        console.error("[AUTO_SIGNIN_ERROR]:", error);
        return NextResponse.json(
            { error: "Error en auto-signin" },
            { status: 500 }
        );
    }
}