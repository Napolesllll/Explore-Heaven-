import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../lib/auth/auth.config'; // Ajusta la ruta según tu configuración
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
    try {
        // Verificar autenticación
        const session = await getServerSession(authOptions);

        if (!session?.user?.email) {
            return NextResponse.json(
                { error: 'Usuario no autenticado' },
                { status: 401 }
            );
        }

        // Obtener datos del cuerpo de la petición
        const { imageUrl } = await request.json();

        if (!imageUrl) {
            return NextResponse.json(
                { error: 'URL de imagen requerida' },
                { status: 400 }
            );
        }

        // Validar que sea una URL de Cloudinary
        if (!imageUrl.includes('cloudinary.com')) {
            return NextResponse.json(
                { error: 'URL de imagen no válida' },
                { status: 400 }
            );
        }

        // Actualizar la foto de perfil del usuario en la base de datos
        const updatedUser = await prisma.user.update({
            where: {
                email: session.user.email,
            },
            data: {
                image: imageUrl,
            },
            select: {
                id: true,
                name: true,
                email: true,
                image: true,
            },
        });

        return NextResponse.json({
            success: true,
            message: 'Foto de perfil actualizada correctamente',
            user: updatedUser,
        });

    } catch (error) {
        console.error('Error al actualizar foto de perfil:', error);
        return NextResponse.json(
            { error: 'Error interno del servidor' },
            { status: 500 }
        );
    } finally {
        await prisma.$disconnect();
    }
}