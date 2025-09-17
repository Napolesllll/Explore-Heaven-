// 2. OPTIMIZACIONES PARA AdminLogin.tsx
"use client";

import { useState, useCallback, useMemo } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Lock, Eye, EyeOff, Shield, ArrowLeft } from "lucide-react";

export default function AdminLogin() {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  // Memoizar handlers para evitar re-renders
  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;
    
    setIsLoading(true);
    setError("");

    try {
      const result = await signIn("admin-credentials", {
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Contraseña de administrador incorrecta");
      } else if (result?.ok) {
        router.push("/dashboard/admin");
      }
    } catch (error) {
      console.error("Admin login error:", error);
      setError("Error del servidor. Intenta nuevamente.");
    }

    setIsLoading(false);
  }, [password, isLoading, router]);

  const togglePassword = useCallback(() => {
    setShowPassword(prev => !prev);
  }, []);

  const goBack = useCallback(() => {
    router.push("/auth");
  }, [router]);

  // Memoizar animaciones para evitar recálculos
  const containerAnimation = useMemo(() => ({
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4 } // Reducido de 0.6
  }), []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0c0f1d] via-[#151b35] to-[#0c0f1d] flex items-center justify-center p-4">
      {/* Efectos de fondo simplificados */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 sm:w-96 h-64 sm:h-96 bg-red-500/5 rounded-full filter blur-3xl" />
        <div className="absolute bottom-1/3 right-1/3 w-48 sm:w-80 h-48 sm:h-80 bg-orange-500/5 rounded-full filter blur-3xl" />
      </div>

      {/* Botón de regresar optimizado */}
      <button
        onClick={goBack}
        className="absolute top-4 sm:top-6 left-4 sm:left-6 z-50 flex items-center space-x-2 bg-gray-800/80 hover:bg-gray-700/90 backdrop-blur-sm border border-red-400/30 text-red-400 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl transition-all duration-300 text-sm sm:text-base"
        type="button"
      >
        <ArrowLeft className="h-4 w-4" />
        <span className="font-medium">Login Usuario</span>
      </button>

      <motion.div
        {...containerAnimation}
        className="relative w-full max-w-md"
      >
        <div className="bg-[#0f172a]/90 backdrop-blur-xl rounded-2xl border border-red-500/30 shadow-2xl shadow-red-500/10 p-6 sm:p-8">
          {/* Header optimizado */}
          <div className="text-center mb-6 sm:mb-8">
            <div className="flex justify-center mb-4">
              <div className="relative">
                <div className="absolute -inset-2 bg-gradient-to-r from-red-500 to-orange-500 rounded-full blur opacity-30" />
                <div className="relative bg-gray-900 border border-red-500/30 rounded-full p-3 sm:p-4">
                  <Shield className="text-red-400" size={24} />
                </div>
              </div>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-orange-400 mb-2">
              Panel de Administración
            </h1>
            <p className="text-gray-400 text-sm">
              Ingresa la contraseña maestra para acceder
            </p>
          </div>

          {/* Formulario optimizado */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-red-400" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Contraseña de administrador"
                className="w-full pl-10 pr-12 py-3 bg-gray-900/50 border border-red-500/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500/50 transition-all"
                required
                autoFocus
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={togglePassword}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-red-400 hover:text-red-300"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-red-500/10 border border-red-500/30 rounded-lg p-3"
              >
                <p className="text-red-400 text-sm text-center">{error}</p>
              </motion.div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 disabled:from-red-700 disabled:to-orange-700 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                  <span>Verificando acceso...</span>
                </>
              ) : (
                <>
                  <Shield size={18} />
                  <span>Acceder como Administrador</span>
                </>
              )}
            </button>
          </form>

          {/* Warning optimizado */}
          <div className="mt-6 p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg">
            <div className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-amber-400 flex-shrink-0" />
              <p className="text-amber-400 text-sm font-medium">
                Acceso restringido
              </p>
            </div>
            <p className="text-amber-300/80 text-xs mt-1">
              Esta área requiere privilegios de administrador. Solo personal
              autorizado.
            </p>
          </div>

          {/* Footer */}
          <div className="mt-6 sm:mt-8 text-center">
            <p className="text-xs text-gray-500">
              Sistema de administración - Explore Heaven
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
