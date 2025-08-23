// middleware.ts
// middleware.ts
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const token = req.nextauth.token;

    // Rutas que requieren autenticación específica
    if (pathname.startsWith("/dashboard/admin") || pathname.startsWith("/admin")) {
      if (!token || token.role !== "ADMIN") {
        return NextResponse.redirect(new URL("/admin/login", req.url));
      }
    }

    if (pathname.startsWith("/dashboard/guia") || pathname.startsWith("/guia")) {
      if (!token || token.role !== "GUIA") {
        return NextResponse.redirect(new URL("/auth/signin", req.url));
      }
    }

    if (pathname.startsWith("/dashboard/moderator") || pathname.startsWith("/moderator")) {
      if (!token || (token.role !== "MODERATOR" && token.role !== "ADMIN")) {
        return NextResponse.redirect(new URL("/auth/signin", req.url));
      }
    }

    // Redireccionar usuarios autenticados desde la página de login
    if ((pathname === "/auth/signin" || pathname === "/login") && token) {
      switch (token.role) {
        case "ADMIN":
          return NextResponse.redirect(new URL("/dashboard/admin", req.url));
        case "GUIA":
          return NextResponse.redirect(new URL("/dashboard/guia", req.url));
        default:
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
          pathname.endsWith(".ico")
        ) {
          return true;
        }

        // Para otras rutas, requerir token
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes) except /api/auth
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, etc)
     */
    '/((?!api(?!/auth)|_next/static|_next/image|favicon.ico|public/).*)',
  ],
};
/*import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const token = req.nextauth.token;

    // Rutas que requieren autenticación específica
    if (pathname.startsWith("/dashboard/admin") || pathname.startsWith("/admin")) {
      if (!token || token.role !== "ADMIN") {
        return NextResponse.redirect(new URL("/auth/signin", req.url));
      }
    }

    if (pathname.startsWith("/dashboard/guia") || pathname.startsWith("/guia")) {
      if (!token || token.role !== "GUIA") {
        return NextResponse.redirect(new URL("/auth/signin", req.url));
      }
    }

    if (pathname.startsWith("/dashboard/moderator") || pathname.startsWith("/moderator")) {
      if (!token || (token.role !== "MODERATOR" && token.role !== "ADMIN")) {
        return NextResponse.redirect(new URL("/auth/signin", req.url));
      }
    }

    // Redireccionar usuarios autenticados desde la página de login
    if (pathname === "/auth/signin" && token) {
      switch (token.role) {
        case "ADMIN":
          return NextResponse.redirect(new URL("/dashboard/admin", req.url));
        case "GUIA":
          return NextResponse.redirect(new URL("/dashboard/guia", req.url));
        default:
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
          pathname.endsWith(".ico")
        ) {
          return true;
        }

        // Para otras rutas, requerir token
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes) except /api/auth
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, etc)
     */
