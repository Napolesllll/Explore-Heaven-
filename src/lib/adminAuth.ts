// src/lib/adminAuth.ts
import jwt, { JwtPayload } from 'jsonwebtoken';
import { NextRequest } from 'next/server';

const JWT_SECRET = process.env.NEXTAUTH_SECRET || 'your-jwt-secret';

// Definimos el tipo esperado del payload
interface AdminTokenPayload extends JwtPayload {
    isAdmin?: boolean;
    [key: string]: unknown; // reemplazamos 'any' por 'unknown'
}

export function verifyAdminToken(request: NextRequest): boolean {
    try {
        const authHeader = request.headers.get('authorization');
        const token =
            authHeader?.replace('Bearer ', '') ||
            request.cookies.get('admin_token')?.value;

        if (!token) {
            return false;
        }

        const decoded = jwt.verify(token, JWT_SECRET) as AdminTokenPayload;

        return decoded.isAdmin === true;
    } catch {
        // Si ocurre cualquier error, devolvemos false
        return false;
    }
}
