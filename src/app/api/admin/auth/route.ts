import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH || '';
const JWT_SECRET = process.env.NEXTAUTH_SECRET || 'your-jwt-secret';

export async function POST(request: NextRequest) {
    try {
        const { password } = await request.json();

        // Debug completo del entorno

        if (!password) {
            return NextResponse.json(
                { error: 'Contraseña requerida' },
                { status: 400 }
            );
        }

        if (!ADMIN_PASSWORD_HASH) {
            console.error('❌ ADMIN_PASSWORD_HASH no está definido');
            return NextResponse.json(
                { error: 'Hash no configurado' },
                { status: 500 }
            );
        }

        // Verificar que el hash tiene el formato correcto
        if (!ADMIN_PASSWORD_HASH.startsWith('$2a$') && !ADMIN_PASSWORD_HASH.startsWith('$2b$')) {
            console.error('❌ Hash no tiene formato bcrypt válido');
            console.error('🔍 Hash actual:', ADMIN_PASSWORD_HASH);
            console.error('🔍 Se esperaba que comenzara con $2a$ o $2b$');

            // Intentar reconstruir el hash si parece que se perdió la parte inicial
            if (ADMIN_PASSWORD_HASH.length > 50 && !ADMIN_PASSWORD_HASH.startsWith('$')) {
                console.log('🔧 Intentando reconstruir hash...');
                // Este es un intento de recuperación, pero es mejor arreglar la causa raíz
            }

            return NextResponse.json(
                { error: 'Hash mal formateado' },
                { status: 500 }
            );
        }

        let isValid = false;

        try {
            // Intentar comparación directa
            isValid = await bcrypt.compare(password, ADMIN_PASSWORD_HASH);
            console.log('🔐 Comparación directa resultado:', isValid);

            if (!isValid) {
                console.log('❌ Contraseña no coincide');
                // Debug adicional: intentar generar un hash de la contraseña para comparar
                const testHash = await bcrypt.hash(password, 12);
                console.log('🔍 Hash de prueba generado:', testHash);
            } else {
                console.log('✅ Contraseña correcta');
            }

        } catch (compareError) {
            console.error('❌ Error en comparación bcrypt:', compareError);
            return NextResponse.json(
                { error: 'Error verificando contraseña' },
                { status: 500 }
            );
        }

        if (!isValid) {
            return NextResponse.json(
                { error: 'Contraseña incorrecta' },
                { status: 401 }
            );
        }

        console.log('✅ Login exitoso');

        // Generar token JWT
        const token = jwt.sign(
            {
                isAdmin: true,
                timestamp: Date.now()
            },
            JWT_SECRET,
            { expiresIn: '8h' }
        );

        return NextResponse.json({ token });

    } catch (error) {
        console.error('❌ Error en auth admin:', error);
        return NextResponse.json(
            { error: 'Error interno del servidor' },
            { status: 500 }
        );
    }
}