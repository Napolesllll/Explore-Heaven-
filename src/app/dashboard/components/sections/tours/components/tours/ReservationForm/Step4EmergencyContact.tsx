"use client";

import { FaCheckCircle } from "react-icons/fa";
import { ReservationFormData } from "./types";

interface Step4EmergencyContactProps {
  formData: ReservationFormData;
  setFormData: React.Dispatch<React.SetStateAction<ReservationFormData>>;
  stepErrors: Record<string, string>;
}

export default function Step4EmergencyContact({
  formData,
  setFormData,
  stepErrors,
}: Step4EmergencyContactProps) {
  return (
    <div className="space-y-5">
      <div className="text-center mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-cyan-400">
          Contacto de emergencia
        </h2>
        <p className="text-cyan-400 text-sm mt-2">
          Persona a contactar en caso de emergencia
        </p>
      </div>

      <div className="bg-gray-800/50 p-4 rounded-xl space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-cyan-400 font-medium mb-2">
              Nombre completo
            </label>
            <input
              type="text"
              placeholder="Nombre del contacto de emergencia"
              value={formData.contactoEmergencia?.nombre || ""}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  contactoEmergencia: {
                    ...prev.contactoEmergencia,
                    nombre: e.target.value,
                  },
                }))
              }
              className="w-full bg-gray-700 border border-cyan-500/30 rounded-lg px-3 py-2 text-cyan-100 placeholder-cyan-400 focus:ring-2 focus:ring-cyan-500 text-sm"
            />
            {stepErrors.contactoNombre && (
              <p className="text-red-400 text-sm mt-1">
                {stepErrors.contactoNombre}
              </p>
            )}
          </div>

          <div>
            <label className="block text-cyan-400 font-medium mb-2">
              Teléfono
            </label>
            <input
              type="tel"
              placeholder="Número de teléfono"
              value={formData.contactoEmergencia?.telefono || ""}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  contactoEmergencia: {
                    ...prev.contactoEmergencia,
                    telefono: e.target.value,
                  },
                }))
              }
              className="w-full bg-gray-700 border border-cyan-500/30 rounded-lg px-3 py-2 text-cyan-100 placeholder-cyan-400 focus:ring-2 focus:ring-cyan-500 text-sm"
            />
            {stepErrors.contactoTelefono && (
              <p className="text-red-400 text-sm mt-1">
                {stepErrors.contactoTelefono}
              </p>
            )}
          </div>
        </div>

        <div className="text-center text-sm text-cyan-400 bg-gray-700/50 rounded-lg p-3">
          <p className="flex items-center justify-center gap-2">
            <FaCheckCircle className="w-4 h-4" />
            Esta información solo se usará en caso de emergencia durante el tour
          </p>
        </div>
      </div>
    </div>
  );
}
