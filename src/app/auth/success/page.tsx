"use client";
import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { FaCheckCircle, FaSignInAlt } from "react-icons/fa";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import Image from "next/image";

export default function AuthSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const verified = searchParams.get("verified");

  const handleLogin = () => {
    router.push("/auth");
  };

  return (
    <div className="w-full min-h-screen bg-gray-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background with subtle logo */}
      <div className="absolute inset-0 z-0 opacity-10">
        <Image
          src="/images/logo-explore-heaven.png"
          alt="Logo Explore Heaven"
          fill
          className="object-contain object-center"
          quality={50}
        />
      </div>

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900/90 via-gray-900/80 to-gray-900/90 z-0" />

      {/* Back button */}
      <button
        onClick={() => router.push("/")}
        className="absolute top-6 left-6 z-50 flex items-center space-x-1 bg-gray-800/80 hover:bg-gray-700/90 backdrop-blur-sm border border-yellow-400/30 text-yellow-400 px-4 py-2.5 rounded-xl transition-all duration-300 shadow-lg hover:shadow-yellow-400/20"
      >
        <ArrowLeftIcon className="h-4 w-4" />
        <span className="font-medium">Regresar</span>
      </button>

      {/* Main card */}
      <div className="w-full max-w-md z-10">
        <div className="flex flex-col items-center mb-8">
          <div className="relative w-24 h-24 mb-4">
            <div className="absolute inset-0 bg-yellow-400 rounded-full blur-xl opacity-30"></div>
            <div className="relative w-full h-full bg-gray-800/80 backdrop-blur-sm border border-yellow-400/30 rounded-full flex items-center justify-center p-3 shadow-lg">
              <div className="w-full h-full bg-gray-900 rounded-full flex items-center justify-center overflow-hidden">
                <Image
                  src="/images/logoExploreee.png"
                  alt="Explore Heaven Logo"
                  width={80}
                  height={80}
                  className="object-contain"
                />
              </div>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-yellow-400 mb-1">
            Explore Heaven
          </h1>
          <p className="text-gray-400">Descubre experiencias únicas</p>
        </div>

        <div className="bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden border border-gray-700/50 p-8 text-center space-y-6">
          <div className="mx-auto bg-green-500/20 w-16 h-16 rounded-full flex items-center justify-center border border-green-400/30">
            <FaCheckCircle className="h-8 w-8 text-green-400" />
          </div>

          <h1 className="text-2xl font-bold text-white">¡Email Verificado!</h1>

          <p className="text-gray-300">
            Tu correo electrónico ha sido verificado exitosamente. Ahora puedes
            iniciar sesión con tu cuenta.
          </p>

          <div className="bg-gray-700/50 rounded-lg p-4 border border-gray-600/50 backdrop-blur-sm">
            <p className="text-sm text-yellow-400 font-medium">
              Tu cuenta está lista para usar
            </p>
            <p className="text-sm text-gray-300 mt-1">
              Usa tu email y contraseña para iniciar sesión
            </p>
          </div>

          <button
            onClick={handleLogin}
            className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 text-gray-900 font-bold py-4 px-4 rounded-xl hover:shadow-yellow-500/30 transition-all duration-300 flex items-center justify-center gap-2 shadow-lg"
          >
            <FaSignInAlt className="h-4 w-4" />
            Iniciar Sesión Ahora
          </button>
        </div>

        <div className="text-center text-gray-500 text-sm mt-6">
          © {new Date().getFullYear()} Explore Heaven. Todos los derechos
          reservados.
        </div>
      </div>
    </div>
  );
}
