// src/app/api/auth/auto-signin/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const body = (await request.json()) as { email?: unknown };

        const email = typeof body.email === 'string' ? body.email.trim() : null;

        if (!email) {
            return NextResponse.json({ error: 'Email inválido' }, { status: 400 });
        }

        // Por seguridad no hacemos signIn automático desde el servidor aquí.
        // Redirigimos al formulario de auth con query params para completar flujo en el cliente.
        return NextResponse.json({
            success: true,
            redirectUrl: `/auth?verified=true&email=${encodeURIComponent(email)}`
        });

    } catch (error: unknown) {
        console.error("[AUTO_SIGNIN_ERROR]:", error);
        return NextResponse.json(
            { error: "Error en auto-signin" },
            { status: 500 }
        );
    }
}
