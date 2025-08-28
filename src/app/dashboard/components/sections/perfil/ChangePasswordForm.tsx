"use client";

import { useState, useRef, useEffect } from "react";
import { useSession } from "next-auth/react";

export default function ChangePasswordForm() {
  const { data: session, update } = useSession();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    setError("");

    // Debug: Verificar que las contraseñas sean diferentes
    console.log("Formulario - Debug:", {
      currentPasswordLength: currentPassword.length,
      newPasswordLength: newPassword.length,
      confirmPasswordLength: confirmPassword.length,
      areEqual: currentPassword === newPassword,
      passwordsMatch: newPassword === confirmPassword,
      currentPreview: currentPassword.substring(0, 3) + "...",
      newPreview: newPassword.substring(0, 3) + "...",
      confirmPreview: confirmPassword.substring(0, 3) + "...",
    });

    if (currentPassword === newPassword) {
      setError("La nueva contraseña debe ser diferente a la actual");
      setLoading(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Las contraseñas nuevas no coinciden");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/perfil/password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      if (res.ok) {
        const updatedData = await res.json();

        // Actualizar la sesión con los nuevos datos si es necesario
        if (updatedData.user) {
          await update({
            user: {
              ...session?.user,
              ...updatedData.user,
            },
          });
        }

        setSuccess(true);
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");

        // Limpiar mensaje de éxito después de 5 segundos
        setTimeout(() => {
          setSuccess(false);
        }, 5000);
      } else {
        const errorData = await res.json();
        setError(
          errorData.error || errorData.message || "Error al cambiar contraseña"
        );

        // Limpiar mensaje de error después de 5 segundos
        setTimeout(() => {
          setError("");
        }, 5000);
      }
    } catch (err) {
      console.error("Error changing password:", err);
      setError("Error de conexión con el servidor");

      // Limpiar mensaje de error después de 5 segundos
      setTimeout(() => {
        setError("");
      }, 5000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      ref={containerRef}
      className={`w-full mx-auto p-4 transition-all duration-1000 ease-out ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      }`}
    >
      <div className="bg-gradient-to-br from-indigo-900/70 to-purple-900/70 backdrop-blur-xl rounded-xl p-6 border border-white/10 shadow-2xl shadow-purple-900/30">
        <div className="flex flex-col items-center justify-center mb-6 sm:flex-row sm:mb-8">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-1 rounded-full mb-4 sm:mb-0">
            <div className="bg-gray-900 rounded-full p-2 sm:p-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-7 w-7 text-blue-400 sm:h-8 sm:w-8"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>
          <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400 sm:text-2xl sm:ml-4">
            Cambio de Contraseña
          </h1>
        </div>

        <p className="text-gray-300 text-center text-sm mb-6 sm:text-base sm:mb-8">
          Protege tu cuenta con una nueva contraseña segura
        </p>

        {error && (
          <div className="mb-6 p-4 bg-gradient-to-r from-red-500/10 to-pink-500/10 border border-red-400/30 rounded-xl text-red-300 text-center backdrop-blur-sm">
            <div className="flex items-center justify-center gap-2">
              <span className="text-lg">⚠️</span>
              <span>{error}</span>
            </div>
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-400/30 rounded-xl text-green-300 text-center backdrop-blur-sm">
            <div className="flex items-center justify-center gap-3">
              <div className="w-5 h-5 rounded-full bg-green-400 animate-pulse" />
              <span className="font-medium">
                ¡Contraseña actualizada exitosamente!
              </span>
              <span className="text-lg">✨</span>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
          <div className="relative">
            <label
              htmlFor="currentPassword"
              className="block text-sm text-gray-400 mb-1"
            >
              Contraseña actual
            </label>
            <input
              id="currentPassword"
              type="password"
              placeholder="Ingresa tu contraseña actual"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full px-4 py-3 text-sm sm:text-base sm:px-5 sm:py-4 bg-gray-800/60 border border-gray-700 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-white transition-all duration-300 placeholder-gray-500"
              required
              disabled={loading}
            />
            <div className="absolute inset-0 rounded-lg sm:rounded-xl border border-blue-500/30 pointer-events-none opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
          </div>

          <div className="relative">
            <label
              htmlFor="newPassword"
              className="block text-sm text-gray-400 mb-1"
            >
              Nueva contraseña
            </label>
            <input
              id="newPassword"
              type="password"
              placeholder="Crea una nueva contraseña"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              autoComplete="new-password"
              className="w-full px-4 py-3 text-sm sm:text-base sm:px-5 sm:py-4 bg-gray-800/60 border border-gray-700 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 text-white transition-all duration-300 placeholder-gray-500"
              required
              disabled={loading}
            />
            <div className="absolute inset-0 rounded-lg sm:rounded-xl border border-purple-500/30 pointer-events-none opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
          </div>

          <div className="relative">
            <label
              htmlFor="confirmPassword"
              className="block text-sm text-gray-400 mb-1"
            >
              Confirmar nueva contraseña
            </label>
            <input
              id="confirmPassword"
              type="password"
              placeholder="Confirma tu nueva contraseña"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              autoComplete="new-password"
              className="w-full px-4 py-3 text-sm sm:text-base sm:px-5 sm:py-4 bg-gray-800/60 border border-gray-700 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/50 text-white transition-all duration-300 placeholder-gray-500"
              required
              disabled={loading}
            />
            <div className="absolute inset-0 rounded-lg sm:rounded-xl border border-green-500/30 pointer-events-none opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
          </div>

          <button
            type="submit"
            disabled={
              loading ||
              currentPassword.trim() === "" ||
              newPassword.trim() === "" ||
              confirmPassword.trim() === ""
            }
            className={`
              w-full py-3 px-5 sm:py-4 sm:px-6 rounded-lg sm:rounded-xl font-bold text-white transition-all duration-300 transform hover:scale-[1.02] shadow-lg flex items-center justify-center text-sm sm:text-base
              ${
                loading
                  ? "bg-gradient-to-r from-blue-600/60 to-purple-600/60 cursor-not-allowed"
                  : currentPassword.trim() === "" ||
                      newPassword.trim() === "" ||
                      confirmPassword.trim() === ""
                    ? "bg-gradient-to-r from-gray-600 to-gray-700 cursor-not-allowed opacity-50"
                    : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 shadow-blue-500/20 hover:shadow-blue-500/30"
              }
            `}
          >
            {loading ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 sm:h-5 sm:w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Procesando...
              </>
            ) : (
              <>
                Cambiar contraseña
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="ml-2 h-4 w-4 sm:h-5 sm:w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </>
            )}
          </button>
        </form>

        <div className="mt-6 pt-5 border-t border-gray-800 sm:mt-8 sm:pt-6">
          <div className="flex items-start">
            <div className="flex-shrink-0 pt-0.5">
              <svg
                className="h-4 w-4 sm:h-5 sm:w-5 text-blue-400"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-2 sm:ml-3">
              <p className="text-xs text-gray-400 sm:text-sm">
                Usa una combinación de letras, números y símbolos para mayor
                seguridad. Recomendamos al menos 8 caracteres.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
