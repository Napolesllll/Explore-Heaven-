// lib/hooks/useAuth.ts
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

export function useRequireAuth(requiredRole?: string) {
    const { data: session, status } = useSession();
    const router = useRouter();
    const hasRedirected = useRef(false);

    useEffect(() => {
        // Evitar múltiples redirecciones
        if (hasRedirected.current) return;

        if (status === "loading") return; // Aún cargando

        if (!session) {
            hasRedirected.current = true;
            router.push("/auth/signin");
            return;
        }

        // Solo redirigir si se requiere un rol específico Y el usuario no lo tiene
        if (requiredRole && session.user?.role !== requiredRole) {
            // No hacer redirección automática, dejar que el middleware maneje esto
            console.warn(
                `Usuario con rol ${session.user?.role} intentando acceder a recurso que requiere ${requiredRole}`
            );
            return;
        }
    }, [session, status, requiredRole, router]); // ✅ router incluido en dependencias

    return {
        session,
        loading: status === "loading",
        isAuthenticated: !!session,
        user: session?.user,
        hasRequiredRole: requiredRole ? session?.user?.role === requiredRole : true,
    };
}

export function useRequireAdmin() {
    return useRequireAuth("ADMIN");
}

export function useRequireGuia() {
    return useRequireAuth("GUIA");
}

// Hook para verificar permisos sin redireccionar
export function usePermissions() {
    const { data: session } = useSession();

    return {
        isAdmin: session?.user?.role === "ADMIN",
        isGuia: session?.user?.role === "GUIA",
        isModerator: session?.user?.role === "MODERATOR",
        isUser: session?.user?.role === "USER",
        hasRole: (role: string) => session?.user?.role === role,
        hasAnyRole: (roles: string[]) => roles.includes(session?.user?.role || ""),
        currentRole: session?.user?.role,
    };
}
