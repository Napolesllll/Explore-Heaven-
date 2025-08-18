"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { FaCheckCircle, FaSignInAlt } from "react-icons/fa";

export default function AuthSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const verified = searchParams.get("verified");

  const handleLogin = () => {
    router.push("/auth");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50 p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 text-center space-y-6">
        <div className="mx-auto bg-green-100 w-16 h-16 rounded-full flex items-center justify-center">
          <FaCheckCircle className="h-8 w-8 text-green-600" />
        </div>

        <h1 className="text-2xl font-bold text-gray-900">¡Email Verificado!</h1>

        <p className="text-gray-600">
          Tu correo electrónico ha sido verificado exitosamente. Ahora puedes
          iniciar sesión con tu cuenta.
        </p>

        <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
          <p className="text-sm text-blue-800 font-medium">
            Tu cuenta está lista para usar
          </p>
          <p className="text-sm text-blue-600 mt-1">
            Usa tu email y contraseña para iniciar sesión
          </p>
        </div>

        <button
          onClick={handleLogin}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
        >
          <FaSignInAlt className="h-4 w-4" />
          Iniciar Sesión Ahora
        </button>
      </div>
    </div>
  );
}
