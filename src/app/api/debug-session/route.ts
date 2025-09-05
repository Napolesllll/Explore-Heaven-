import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../lib/auth/auth.config';

export async function GET() {
    try {
        console.log('🔍 [DEBUG-SESSION] Getting server session...');

        const session = await getServerSession(authOptions);

        const debugInfo = {
            timestamp: new Date().toISOString(),
            environment: process.env.NODE_ENV,
            session: {
                exists: !!session,
                user: session?.user || null,
            },
            environmentCheck: {
                hasAdminPassword: !!process.env.ADMIN_MASTER_PASSWORD,
                hasAdminEmail: !!process.env.ADMIN_EMAIL,
                hasNextAuthSecret: !!process.env.NEXTAUTH_SECRET,
                nextAuthUrl: process.env.NEXTAUTH_URL,
            }
        };

        console.log('🔍 [DEBUG-SESSION] Session info:', debugInfo);

        return NextResponse.json(debugInfo, {
            headers: {
                'Cache-Control': 'no-cache, no-store, must-revalidate',
                'Pragma': 'no-cache',
                'Expires': '0',
            }
        });
    } catch (error) {
        console.error('🔍 [DEBUG-SESSION] Error:', error);
        return NextResponse.json(
            {
                error: 'Debug session failed',
                details: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        );
    }
}