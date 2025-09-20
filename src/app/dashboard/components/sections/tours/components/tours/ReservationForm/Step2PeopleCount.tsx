"use client";

import { ReservationFormData } from "./types";
import { useMemo } from "react";

interface Step2PeopleCountProps {
  formData: ReservationFormData;
  handleAdultosChange: (value: number) => void;
  handleNinosChange: (value: number) => void;
  stepErrors: Record<string, string>;
}

// Hook para detectar móvil
const useIsMobile = () => {
  return useMemo(() => {
    if (typeof window === "undefined") return false;
    return window.innerWidth < 768;
  }, []);
};

export default function Step2PeopleCount({
  formData,
  handleAdultosChange,
  handleNinosChange,
  stepErrors,
}: Step2PeopleCountProps) {
  const isMobile = useIsMobile();

  // Memoizar opciones para evitar recrearlas en cada render
  const adultsOptions = useMemo(
    () => Array.from({ length: 10 }, (_, i) => i + 1),
    []
  );

  const childrenOptions = useMemo(
    () => Array.from({ length: 11 }, (_, i) => i),
    []
  );

  return (
    <div className="space-y-4 sm:space-y-5">
      <div className="text-center mb-4 sm:mb-6">
        <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-cyan-400">
          ¿Cuántas personas van?
        </h2>
        <p className="text-cyan-400 text-xs sm:text-sm mt-2">
          Especifica la cantidad de adultos y niños
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        <div className="bg-gray-800/50 p-3 sm:p-4 rounded-xl">
          <label className="block text-cyan-400 font-medium mb-3 text-sm sm:text-base">
            👥 Adultos (18+ años)
          </label>
          <select
            value={formData.cantidadAdultos || 1}
            onChange={(e) => handleAdultosChange(Number(e.target.value))}
            className="w-full bg-gray-700 border border-cyan-500/30 rounded-lg px-3 py-2.5 sm:py-3 text-cyan-100 focus:ring-2 focus:ring-cyan-500 text-sm sm:text-base touch-manipulation"
            style={{
              WebkitTapHighlightColor: "transparent",
              minHeight: isMobile ? "44px" : "auto",
              WebkitAppearance: "none",
              appearance: "none",
            }}
          >
            {adultsOptions.map((num) => (
              <option key={num} value={num} className="bg-gray-700">
                {num} {num === 1 ? "adulto" : "adultos"}
              </option>
            ))}
          </select>
          {stepErrors.cantidadAdultos && (
            <p className="text-red-400 text-xs sm:text-sm mt-1">
              {stepErrors.cantidadAdultos}
            </p>
          )}
        </div>

        <div className="bg-gray-800/50 p-3 sm:p-4 rounded-xl">
          <label className="block text-cyan-400 font-medium mb-3 text-sm sm:text-base">
            👶 Niños (0-17 años)
          </label>
          <select
            value={formData.cantidadNinos || 0}
            onChange={(e) => handleNinosChange(Number(e.target.value))}
            className="w-full bg-gray-700 border border-cyan-500/30 rounded-lg px-3 py-2.5 sm:py-3 text-cyan-100 focus:ring-2 focus:ring-cyan-500 text-sm sm:text-base touch-manipulation"
            style={{
              WebkitTapHighlightColor: "transparent",
              minHeight: isMobile ? "44px" : "auto",
              WebkitAppearance: "none",
              appearance: "none",
            }}
          >
            {childrenOptions.map((num) => (
              <option key={num} value={num} className="bg-gray-700">
                {num} {num === 1 ? "niño" : "niños"}
              </option>
            ))}
          </select>
          {stepErrors.cantidadNinos && (
            <p className="text-red-400 text-xs sm:text-sm mt-1">
              {stepErrors.cantidadNinos}
            </p>
          )}
        </div>
      </div>

      <div className="text-center bg-gray-800/30 rounded-lg p-3 sm:p-4">
        <p className="text-cyan-300 text-sm sm:text-base">
          <span className="text-cyan-400 font-semibold">
            Total de personas:
          </span>{" "}
          {(formData.cantidadAdultos || 1) + (formData.cantidadNinos || 0)}
        </p>
      </div>
    </div>
  );
}
