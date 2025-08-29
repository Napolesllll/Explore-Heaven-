"use client";

import { ReservationFormData } from "./types";

interface Step2PeopleCountProps {
  formData: ReservationFormData;
  handleAdultosChange: (value: number) => void;
  handleNinosChange: (value: number) => void;
  stepErrors: Record<string, string>;
}

export default function Step2PeopleCount({
  formData,
  handleAdultosChange,
  handleNinosChange,
  stepErrors,
}: Step2PeopleCountProps) {
  return (
    <div className="space-y-5">
      <div className="text-center mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-cyan-400">
          ¿Cuántas personas van?
        </h2>
        <p className="text-cyan-400 text-sm mt-2">
          Especifica la cantidad de adultos y niños
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-800/50 p-4 rounded-xl">
          <label className="block text-cyan-400 font-medium mb-3">
            👥 Adultos (18+ años)
          </label>
          <select
            value={formData.cantidadAdultos || 1}
            onChange={(e) => handleAdultosChange(Number(e.target.value))}
            className="w-full bg-gray-700 border border-cyan-500/30 rounded-lg px-3 py-2 text-cyan-100 focus:ring-2 focus:ring-cyan-500"
          >
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
              <option key={num} value={num}>
                {num} {num === 1 ? "adulto" : "adultos"}
              </option>
            ))}
          </select>
          {stepErrors.cantidadAdultos && (
            <p className="text-red-400 text-sm mt-1">
              {stepErrors.cantidadAdultos}
            </p>
          )}
        </div>

        <div className="bg-gray-800/50 p-4 rounded-xl">
          <label className="block text-cyan-400 font-medium mb-3">
            👶 Niños (0-17 años)
          </label>
          <select
            value={formData.cantidadNinos || 0}
            onChange={(e) => handleNinosChange(Number(e.target.value))}
            className="w-full bg-gray-700 border border-cyan-500/30 rounded-lg px-3 py-2 text-cyan-100 focus:ring-2 focus:ring-cyan-500"
          >
            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
              <option key={num} value={num}>
                {num} {num === 1 ? "niño" : "niños"}
              </option>
            ))}
          </select>
          {stepErrors.cantidadNinos && (
            <p className="text-red-400 text-sm mt-1">
              {stepErrors.cantidadNinos}
            </p>
          )}
        </div>
      </div>

      <div className="text-center bg-gray-800/30 rounded-lg p-4">
        <p className="text-cyan-300">
          <span className="text-cyan-400 font-semibold">
            Total de personas:
          </span>
          {(formData.cantidadAdultos || 1) + (formData.cantidadNinos || 0)}
        </p>
      </div>
    </div>
  );
}
