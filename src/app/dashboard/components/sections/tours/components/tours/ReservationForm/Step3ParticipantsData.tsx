"use client";

import { Person } from "./types";
import { useMemo, memo, useCallback } from "react";

interface Step3ParticipantsDataProps {
  formData: {
    adultos: Person[];
    ninos: Person[];
    cantidadAdultos: number;
    cantidadNinos: number;
  };
  updatePersonData: (
    type: "adultos" | "ninos",
    index: number,
    field: keyof Person,
    value: string
  ) => void;
  stepErrors: Record<string, string>;
}

// Hook para detectar móvil
const useIsMobile = () => {
  return useMemo(() => {
    if (typeof window === "undefined") return false;
    return window.innerWidth < 768;
  }, []);
};

// Opciones de documentos constantes para evitar recreaciones
const ADULT_DOCUMENT_OPTIONS = [
  { value: "", label: "Tipo documento" },
  { value: "CC", label: "Cédula de Ciudadanía" },
  { value: "CE", label: "Cédula de Extranjería" },
  { value: "PAS", label: "Pasaporte" },
  { value: "PPT", label: "Permiso por Protección Temporal" },
];

const CHILD_DOCUMENT_OPTIONS = [
  { value: "", label: "Tipo documento" },
  { value: "RC", label: "Registro Civil" },
  { value: "TI", label: "Tarjeta de Identidad" },
  { value: "CC", label: "Cédula de Ciudadanía" },
  { value: "CE", label: "Cédula de Extranjería" },
  { value: "PAS", label: "Pasaporte" },
  { value: "PPT", label: "Permiso por Protección Temporal" },
];

// Componente de persona optimizado
const PersonForm = memo<{
  person: Person;
  index: number;
  type: "adultos" | "ninos";
  updatePersonData: (
    type: "adultos" | "ninos",
    index: number,
    field: keyof Person,
    value: string
  ) => void;
  stepErrors: Record<string, string>;
  isMobile: boolean;
}>(({ person, index, type, updatePersonData, stepErrors, isMobile }) => {
  const isAdult = type === "adultos";
  const documentOptions = isAdult
    ? ADULT_DOCUMENT_OPTIONS
    : CHILD_DOCUMENT_OPTIONS;

  // Handlers memoizados para cada campo
  const handleNameChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      updatePersonData(type, index, "nombre", e.target.value);
    },
    [type, index, updatePersonData]
  );

  const handleDocTypeChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      updatePersonData(type, index, "tipoDocumento", e.target.value);
    },
    [type, index, updatePersonData]
  );

  const handleDocNumberChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      updatePersonData(type, index, "numeroDocumento", e.target.value);
    },
    [type, index, updatePersonData]
  );

  return (
    <div className="bg-gray-800/50 p-3 sm:p-4 rounded-xl space-y-3">
      <h3 className="text-cyan-400 font-medium flex items-center gap-2 text-sm sm:text-base">
        {isAdult ? "👤" : "👶"} {isAdult ? "Adulto" : "Niño"} {index + 1}
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 sm:gap-3">
        <div>
          <input
            type="text"
            placeholder="Nombre completo"
            value={person.nombre || ""}
            onChange={handleNameChange}
            className="w-full bg-gray-700 border border-cyan-500/30 rounded-lg px-3 py-2 sm:py-2.5 text-cyan-100 placeholder-cyan-400 focus:ring-2 focus:ring-cyan-500 text-xs sm:text-sm touch-manipulation"
            style={{
              WebkitTapHighlightColor: "transparent",
              minHeight: isMobile ? "40px" : "auto",
            }}
          />
          {stepErrors[`${type.slice(0, -1)}${index}nombre`] && (
            <p className="text-red-400 text-xs mt-1">
              {stepErrors[`${type.slice(0, -1)}${index}nombre`]}
            </p>
          )}
        </div>
        <div>
          <select
            value={person.tipoDocumento || ""}
            onChange={handleDocTypeChange}
            className="w-full bg-gray-700 border border-cyan-500/30 rounded-lg px-3 py-2 sm:py-2.5 text-cyan-100 focus:ring-2 focus:ring-cyan-500 text-xs sm:text-sm touch-manipulation"
            style={{
              WebkitTapHighlightColor: "transparent",
              minHeight: isMobile ? "40px" : "auto",
              WebkitAppearance: "none",
              appearance: "none",
            }}
          >
            {documentOptions.map((option) => (
              <option
                key={option.value}
                value={option.value}
                className="bg-gray-700"
              >
                {option.label}
              </option>
            ))}
          </select>
          {stepErrors[`${type.slice(0, -1)}${index}tipoDoc`] && (
            <p className="text-red-400 text-xs mt-1">
              {stepErrors[`${type.slice(0, -1)}${index}tipoDoc`]}
            </p>
          )}
        </div>
        <div>
          <input
            type="text"
            placeholder="Número documento"
            value={person.numeroDocumento || ""}
            onChange={handleDocNumberChange}
            className="w-full bg-gray-700 border border-cyan-500/30 rounded-lg px-3 py-2 sm:py-2.5 text-cyan-100 placeholder-cyan-400 focus:ring-2 focus:ring-cyan-500 text-xs sm:text-sm touch-manipulation"
            style={{
              WebkitTapHighlightColor: "transparent",
              minHeight: isMobile ? "40px" : "auto",
            }}
          />
          {stepErrors[`${type.slice(0, -1)}${index}numDoc`] && (
            <p className="text-red-400 text-xs mt-1">
              {stepErrors[`${type.slice(0, -1)}${index}numDoc`]}
            </p>
          )}
        </div>
      </div>
    </div>
  );
});

PersonForm.displayName = "PersonForm";

export default function Step3ParticipantsData({
  formData,
  updatePersonData,
  stepErrors,
}: Step3ParticipantsDataProps) {
  const isMobile = useIsMobile();

  return (
    <div className="space-y-4 sm:space-y-5">
      <div className="text-center mb-4 sm:mb-6">
        <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-cyan-400">
          Datos de los participantes
        </h2>
        <p className="text-cyan-400 text-xs sm:text-sm mt-2">
          Información de identificación para cada persona
        </p>
      </div>

      <div className="space-y-3 sm:space-y-4 max-h-72 sm:max-h-96 overflow-y-auto pr-1 sm:pr-2">
        {formData.adultos?.map((adulto: Person, index: number) => (
          <PersonForm
            key={`adulto-${index}`}
            person={adulto}
            index={index}
            type="adultos"
            updatePersonData={updatePersonData}
            stepErrors={stepErrors}
            isMobile={isMobile}
          />
        ))}

        {formData.ninos?.map((nino: Person, index: number) => (
          <PersonForm
            key={`nino-${index}`}
            person={nino}
            index={index}
            type="ninos"
            updatePersonData={updatePersonData}
            stepErrors={stepErrors}
            isMobile={isMobile}
          />
        ))}
      </div>
    </div>
  );
}
