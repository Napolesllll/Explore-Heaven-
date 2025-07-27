import { withAuth } from "next-auth/middleware";

import { NextResponse } from "next/server";

export function middleware(req: Request) {
  const url = req.nextUrl.clone();
  const isAdminRoute = url.pathname.startsWith("/dashboard/admin");

  // Simulación: Verificar si el usuario tiene permisos de administrador
  const user = { isAdmin: true }; // Cambia esto por la lógica real de autenticación

  if (isAdminRoute && !user.isAdmin) {
    return NextResponse.redirect(new URL("/unauthorized", req.url));
  }
 
  return NextResponse.next();
}

export default withAuth({
  pages: {
    signIn: "/auth", // A dónde redirigir si no está autenticado
  },
});


export const config = {
  matcher: ["/dashboard/admin/:path*"], // Aplica el middleware solo a rutas de administrador
};
