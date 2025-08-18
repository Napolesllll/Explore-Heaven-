// src/app/auth/verify-request/page.tsx
"use client";

import { Suspense, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  FaEnvelope,
  FaCheckCircle,
  FaArrowLeft,
  FaPaperPlane,
} from "react-icons/fa";
import toast from "react-hot-toast";
import Image from "next/image";

function VerifyRequestContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [isResending, setIsResending] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  useEffect(() => {
    const emailParam = searchParams.get("email");
    if (emailParam) {
      setEmail(decodeURIComponent(emailParam));
    }
  }, [searchParams]);

  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => {
        setResendCooldown(resendCooldown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const handleResendEmail = async () => {
    if (!email || resendCooldown > 0) return;

    setIsResending(true);
    try {
      const response = await fetch("/api/auth/resend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const message = await response.text();

      if (response.ok) {
        toast.success("Correo reenviado exitosamente");
        setResendCooldown(60); // Cooldown de 60 segundos
      } else {
        if (response.status === 429) {
          toast.error("Demasiados intentos. Espera unos minutos.");
          setResendCooldown(300); // 5 minutos de cooldown
        } else {
          toast.error(message || "Error al reenviar el correo");
        }
      }
    } catch (error) {
      console.error("Error resending email:", error);
      toast.error("Error al reenviar el correo");
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background effects */}
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

      {/* Floating particles */}
      <div className="absolute top-20 left-20 w-4 h-4 bg-yellow-400 rounded-full opacity-60 animate-pulse" />
      <div className="absolute bottom-32 right-32 w-6 h-6 bg-blue-400 rounded-full opacity-40 animate-bounce" />
      <div className="absolute top-1/3 right-1/4 w-3 h-3 bg-purple-400 rounded-full opacity-50 animate-ping" />

      {/* Back button */}
      <button
        onClick={() => router.push("/auth")}
        className="absolute top-6 left-6 z-50 flex items-center space-x-2 bg-gray-800/80 hover:bg-gray-700/90 backdrop-blur-sm border border-yellow-400/30 text-yellow-400 px-4 py-2.5 rounded-xl transition-all duration-300 shadow-lg hover:shadow-yellow-400/20"
      >
        <FaArrowLeft className="h-4 w-4" />
        <span className="font-medium">Volver</span>
      </button>

      {/* Main content */}
      <div className="relative z-10 w-full max-w-md">
        <div className="bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden border border-gray-700/50 p-8">
          {/* Icon and header */}
          <div className="text-center mb-8">
            <div className="relative inline-block mb-6">
              <div className="absolute inset-0 bg-yellow-400 rounded-full blur-xl opacity-30 animate-pulse" />
              <div className="relative w-20 h-20 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center shadow-lg">
                <FaEnvelope className="h-10 w-10 text-gray-900" />
              </div>
            </div>

            <h1 className="text-2xl font-bold text-yellow-400 mb-2">
              Verifica tu correo
            </h1>
            <p className="text-gray-300 text-sm leading-relaxed">
              Te hemos enviado un enlace de verificación a:
            </p>
            {email && (
              <p className="text-white font-medium mt-2 bg-gray-700/50 px-3 py-2 rounded-lg">
                {email}
              </p>
            )}
          </div>

          {/* Instructions */}
          <div className="space-y-4 mb-8">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-yellow-400/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-yellow-400 text-sm font-bold">1</span>
              </div>
              <p className="text-gray-300 text-sm">
                Revisa tu bandeja de entrada (y la carpeta de spam)
              </p>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-yellow-400/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-yellow-400 text-sm font-bold">2</span>
              </div>
              <p className="text-gray-300 text-sm">
                Haz clic en el enlace de verificación
              </p>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-yellow-400/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <FaCheckCircle className="h-3 w-3 text-yellow-400" />
              </div>
              <p className="text-gray-300 text-sm">
                Serás redirigido automáticamente al dashboard
              </p>
            </div>
          </div>

          {/* Resend button */}
          <div className="space-y-4">
            <div className="text-center">
              <p className="text-gray-400 text-sm mb-4">
                ¿No recibiste el correo?
              </p>

              <button
                onClick={handleResendEmail}
                disabled={isResending || resendCooldown > 0 || !email}
                className={`flex items-center justify-center space-x-2 w-full py-3 px-4 rounded-xl font-medium transition-all duration-300 ${
                  isResending || resendCooldown > 0 || !email
                    ? "bg-gray-600 cursor-not-allowed text-gray-400"
                    : "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-400 hover:to-blue-500 text-white shadow-lg hover:shadow-blue-500/30"
                }`}
              >
                {isResending ? (
                  <>
                    <svg
                      className="animate-spin h-4 w-4"
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
                    <span>Enviando...</span>
                  </>
                ) : resendCooldown > 0 ? (
                  <span>Reenviar en {resendCooldown}s</span>
                ) : (
                  <>
                    <FaPaperPlane className="h-4 w-4" />
                    <span>Reenviar correo</span>
                  </>
                )}
              </button>
            </div>

            {/* Help text */}
            <div className="text-center pt-4 border-t border-gray-700">
              <p className="text-gray-500 text-xs">
                Si continúas teniendo problemas, contacta a nuestro equipo de
                soporte
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-gray-500 text-sm mt-6">
          © {new Date().getFullYear()} Explore Heaven. Todos los derechos
          reservados.
        </div>
      </div>
    </div>
  );
}

export default function VerifyRequestPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-900 flex items-center justify-center">
          <div className="text-yellow-400">Cargando...</div>
        </div>
      }
    >
      <VerifyRequestContent />
    </Suspense>
  );
}
