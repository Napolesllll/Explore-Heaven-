import { NextResponse } from 'next/server';

export async function GET() {
    console.log('🔍 [DEBUG-API] Environment variables check');

    const debugInfo = {
        nodeEnv: process.env.NODE_ENV,
        nextAuthUrl: process.env.NEXTAUTH_URL,
        hasSecret: !!process.env.NEXTAUTH_SECRET,
        hasAdminEmail: !!process.env.ADMIN_EMAIL,
        hasAdminPassword: !!process.env.ADMIN_MASTER_PASSWORD,
        hasDatabaseUrl: !!process.env.DATABASE_URL,
        // NO expongas las variables reales por seguridad
    };

    console.log('🔍 [DEBUG-API] Debug info:', debugInfo);

    return NextResponse.json(debugInfo);
}