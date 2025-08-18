// middleware.ts
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    // Lógica adicional de autorización
    const token = req.nextauth.token;
    const isAdmin = token?.role === "ADMIN";
    const pathname = req.nextUrl.pathname;

    if (pathname.startsWith("/admin") && !isAdmin) {
      return NextResponse.redirect(new URL("/unauthorized", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Verificaciones básicas
        if (req.nextUrl.pathname.startsWith("/protected")) {
          return !!token;
        }
        return true;
      },
    },
  }
);

export const config = {
  matcher: ["/protected/:path*", "/admin/:path*", "/api/protected/:path*"]
};

/*import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const url = req.url;

  // Solo aplicar el middleware de NextAuth a rutas que NO sean admin
  if (url.includes('/dashboard/admin')) {
    // Las rutas admin se manejan con su propio sistema de auth
    return NextResponse.next();
  }

  // Para otras rutas protegidas, usar NextAuth
  return NextResponse.next();
}

export default withAuth({
  pages: {
    signIn: "/auth",
  },
});

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};*/