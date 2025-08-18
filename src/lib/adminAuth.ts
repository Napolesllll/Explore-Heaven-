import jwt from 'jsonwebtoken';
import { NextRequest } from 'next/server';

const JWT_SECRET = process.env.NEXTAUTH_SECRET || 'your-jwt-secret';

export function verifyAdminToken(request: NextRequest): boolean {
    try {
        const authHeader = request.headers.get('authorization');
        const token = authHeader?.replace('Bearer ', '') ||
            request.cookies.get('admin_token')?.value;

        if (!token) {
            return false;
        }

        const decoded = jwt.verify(token, JWT_SECRET) as any;
        return decoded.isAdmin === true;
    } catch (error) {
        return false;
    }
}