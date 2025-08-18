// src/app/api/auth/confirm/route.ts
import { NextResponse } from "next/server";
import prisma from "../../../../lib/prismadb";

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const token = searchParams.get("token");
        if (!token) {
            return NextResponse.json(
                { success: false, message: "Token faltante" },
                { status: 400 }
            );
        }

        // 1. Busca el PendingUser
        const pending = await prisma.pendingUser.findUnique({
            where: { token },
        });
        if (!pending || pending.expires < new Date()) {
            return NextResponse.json(
                { success: false, message: "Enlace inválido o expirado" },
                { status: 400 }
            );
        }

        // 2. Crea el User definitivo
        await prisma.user.create({
            data: {
                name: pending.name,
                email: pending.email,
                hashedPassword: pending.hashedPassword,
                emailVerified: new Date(),
            },
        });

        // 3. Borra el PendingUser
        await prisma.pendingUser.delete({
            where: { token },
        });

        // 4. Devuelve éxito
        return NextResponse.json({ success: true }, { status: 200 });
    } catch (err) {
        console.error("[/api/auth/confirm] Error:", err);
        return NextResponse.json(
            { success: false, message: "Error interno del servidor" },
            { status: 500 }
        );
    }
}
