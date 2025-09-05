import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const token = req.nextauth.token;

    // 🔍 DEBUG: Log detallado para producción
    /* console.log('🛡️ [MIDDLEWARE]', {
       pathname,
       hasToken: !!token,
       userId: token?.id,
       userEmail: token?.email,
       userRole: token?.role,
       isAdmin: token?.role === "ADMIN",
       isAdminSystem: token?.id === "admin-system"
     });*/

    // Rutas que requieren autenticación de ADMIN
    if (pathname.startsWith("/dashboard/admin") || pathname.startsWith("/admin")) {
      if (!token) {
        return NextResponse.redirect(new URL("/admin/login", req.url));
      }

      // ✅ CRÍTICO: Verificar tanto el role como el ID del sistema admin
      const isValidAdmin = token.role === "ADMIN" || token.id === "admin-system";

      if (!isValidAdmin) {
        console.log('🛡️ [MIDDLEWARE] Invalid admin access:', {
          role: token.role,
          id: token.id,
          expected: 'ADMIN role or admin-system id'
        });
        return NextResponse.redirect(new URL("/admin/login", req.url));
      }

    }

    // Rutas que requieren rol GUIA
    if (pathname.startsWith("/dashboard/guia") || pathname.startsWith("/guia")) {
      if (!token || token.role !== "GUIA") {
        return NextResponse.redirect(new URL("/auth/signin", req.url));
      }
    }

    // Rutas que requieren MODERATOR o ADMIN
    if (pathname.startsWith("/dashboard/moderator") || pathname.startsWith("/moderator")) {
      if (!token || (token.role !== "MODERATOR" && token.role !== "ADMIN" && token.id !== "admin-system")) {
        return NextResponse.redirect(new URL("/auth/signin", req.url));
      }
    }

    // Redireccionar usuarios autenticados desde páginas de login
    if ((pathname === "/auth/signin" || pathname === "/login") && token) {
      console.log('🛡️ [MIDDLEWARE] Authenticated user on login page, redirecting...');

      // ✅ Verificar admin-system también
      if (token.role === "ADMIN" || token.id === "admin-system") {
        return NextResponse.redirect(new URL("/dashboard/admin", req.url));
      } else if (token.role === "GUIA") {
        return NextResponse.redirect(new URL("/dashboard/guia", req.url));
      } else {
        return NextResponse.redirect(new URL("/dashboard", req.url));
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;

        // Permitir acceso a rutas públicas
        if (
          pathname.startsWith("/auth") ||
          pathname === "/" ||
          pathname.startsWith("/checkout") ||
          pathname.startsWith("/blog") ||
          pathname.startsWith("/api/auth") ||
          pathname.startsWith("/_next") ||
          pathname.startsWith("/favicon") ||
          pathname.includes("/images/") ||
          pathname.includes("/static/") ||
          pathname.endsWith(".jpg") ||
          pathname.endsWith(".jpeg") ||
          pathname.endsWith(".png") ||
          pathname.endsWith(".gif") ||
          pathname.endsWith(".svg") ||
          pathname.endsWith(".webp") ||
          pathname.endsWith(".ico") ||
          pathname.startsWith("/debug") // ✅ Permitir rutas de debug
        ) {
          return true;
        }

        // Para otras rutas, requerir token
        const hasToken = !!token;

        if (!hasToken) {
          console.log('🛡️ [AUTHORIZED] No token for protected route:', pathname);
        }

        return hasToken;
      },
    },
  }
);

export const config = {
  matcher: [
    '/((?!api/auth|_next/static|_next/image|favicon.ico|public/).*)',
  ],
};