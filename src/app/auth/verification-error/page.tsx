import Link from "next/link";
import { FaExclamationTriangle, FaArrowRight } from "react-icons/fa";

export default function VerificationErrorPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 to-orange-100 p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 space-y-6 border border-gray-100 text-center">
        <div className="mx-auto bg-amber-100 w-16 h-16 rounded-full flex items-center justify-center">
          <FaExclamationTriangle className="h-8 w-8 text-amber-600" />
        </div>

        <h1 className="text-2xl font-bold text-gray-900">
          Enlace inválido o expirado
        </h1>

        <div className="space-y-3">
          <p className="text-gray-600">
            El enlace de verificación que has usado no es válido o ha expirado.
          </p>
          <p className="text-gray-600">
            Por favor, solicita un nuevo enlace de verificación para completar
            tu registro.
          </p>
        </div>

        <div className="pt-4 flex flex-col gap-3">
          <Link
            href="/auth/resend"
            className="flex items-center justify-center gap-2 px-5 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
          >
            Solicitar nuevo enlace
            <FaArrowRight className="h-4 w-4" />
          </Link>

          <Link
            href="/auth"
            className="text-amber-600 hover:text-amber-700 transition-colors"
          >
            Volver al inicio de sesión
          </Link>
        </div>
      </div>
    </div>
  );
}
