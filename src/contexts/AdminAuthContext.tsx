"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

interface AdminAuthContextType {
  isAuthenticated: boolean;
  login: (password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(
  undefined
);

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Verificar si ya está autenticado al cargar
    const adminToken = sessionStorage.getItem("admin_token");
    const tokenExpiry = sessionStorage.getItem("admin_token_expiry");

    if (adminToken && tokenExpiry) {
      const now = new Date().getTime();
      const expiry = parseInt(tokenExpiry);

      if (now < expiry) {
        setIsAuthenticated(true);
      } else {
        // Token expirado, limpiar
        sessionStorage.removeItem("admin_token");
        sessionStorage.removeItem("admin_token_expiry");
      }
    }

    setIsLoading(false);
  }, []);

  const login = async (password: string): Promise<boolean> => {
    try {
      const response = await fetch("/api/admin/auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password }),
      });

      if (response.ok) {
        const { token } = await response.json();

        // Guardar token con expiración de 8 horas
        const expiryTime = new Date().getTime() + 8 * 60 * 60 * 1000;
        sessionStorage.setItem("admin_token", token);
        sessionStorage.setItem("admin_token_expiry", expiryTime.toString());

        setIsAuthenticated(true);
        return true;
      }

      return false;
    } catch (error) {
      console.error("Error en login admin:", error);
      return false;
    }
  };

  const logout = () => {
    sessionStorage.removeItem("admin_token");
    sessionStorage.removeItem("admin_token_expiry");
    setIsAuthenticated(false);
  };

  return (
    <AdminAuthContext.Provider
      value={{ isAuthenticated, login, logout, isLoading }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (context === undefined) {
    throw new Error("useAdminAuth must be used within an AdminAuthProvider");
  }
  return context;
}
