"use client";

import { Person } from "./types";

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

export default function Step3ParticipantsData({
  formData,
  updatePersonData,
  stepErrors,
}: Step3ParticipantsDataProps) {
  return (
    <div className="space-y-5">
      <div className="text-center mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-cyan-400">
          Datos de los participantes
        </h2>
        <p className="text-cyan-400 text-sm mt-2">
          Información de identificación para cada persona
        </p>
      </div>

      <div className="space-y-6 max-h-96 overflow-y-auto pr-2">
        {formData.adultos?.map((adulto: Person, index: number) => (
          <div
            key={`adulto-${index}`}
            className="bg-gray-800/50 p-4 rounded-xl space-y-3"
          >
            <h3 className="text-cyan-400 font-medium flex items-center gap-2">
              👤 Adulto {index + 1}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <input
                  type="text"
                  placeholder="Nombre completo"
                  value={adulto.nombre || ""}
                  onChange={(e) =>
                    updatePersonData("adultos", index, "nombre", e.target.value)
                  }
                  className="w-full bg-gray-700 border border-cyan-500/30 rounded-lg px-3 py-2 text-cyan-100 placeholder-cyan-400 focus:ring-2 focus:ring-cyan-500 text-sm"
                />
                {stepErrors[`adulto${index}nombre`] && (
                  <p className="text-red-400 text-xs mt-1">
                    {stepErrors[`adulto${index}nombre`]}
                  </p>
                )}
              </div>
              <div>
                <select
                  value={adulto.tipoDocumento || ""}
                  onChange={(e) =>
                    updatePersonData(
                      "adultos",
                      index,
                      "tipoDocumento",
                      e.target.value
                    )
                  }
                  className="w-full bg-gray-700 border border-cyan-500/30 rounded-lg px-3 py-2 text-cyan-100 focus:ring-2 focus:ring-cyan-500 text-sm"
                >
                  <option value="">Tipo documento</option>
                  <option value="CC">Cédula de Ciudadanía</option>
                  <option value="CE">Cédula de Extranjería</option>
                  <option value="PAS">Pasaporte</option>
                  <option value="PPT">Permiso por Protección Temporal</option>
                </select>
                {stepErrors[`adulto${index}tipoDoc`] && (
                  <p className="text-red-400 text-xs mt-1">
                    {stepErrors[`adulto${index}tipoDoc`]}
                  </p>
                )}
              </div>
              <div>
                <input
                  type="text"
                  placeholder="Número documento"
                  value={adulto.numeroDocumento || ""}
                  onChange={(e) =>
                    updatePersonData(
                      "adultos",
                      index,
                      "numeroDocumento",
                      e.target.value
                    )
                  }
                  className="w-full bg-gray-700 border border-cyan-500/30 rounded-lg px-3 py-2 text-cyan-100 placeholder-cyan-400 focus:ring-2 focus:ring-cyan-500 text-sm"
                />
                {stepErrors[`adulto${index}numDoc`] && (
                  <p className="text-red-400 text-xs mt-1">
                    {stepErrors[`adulto${index}numDoc`]}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}

        {formData.ninos?.map((nino: Person, index: number) => (
          <div
            key={`nino-${index}`}
            className="bg-gray-800/50 p-4 rounded-xl space-y-3"
          >
            <h3 className="text-cyan-400 font-medium flex items-center gap-2">
              👶 Niño {index + 1}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <input
                  type="text"
                  placeholder="Nombre completo"
                  value={nino.nombre || ""}
                  onChange={(e) =>
                    updatePersonData("ninos", index, "nombre", e.target.value)
                  }
                  className="w-full bg-gray-700 border border-cyan-500/30 rounded-lg px-3 py-2 text-cyan-100 placeholder-cyan-400 focus:ring-2 focus:ring-cyan-500 text-sm"
                />
                {stepErrors[`nino${index}nombre`] && (
                  <p className="text-red-400 text-xs mt-1">
                    {stepErrors[`nino${index}nombre`]}
                  </p>
                )}
              </div>
              <div>
                <select
                  value={nino.tipoDocumento || ""}
                  onChange={(e) =>
                    updatePersonData(
                      "ninos",
                      index,
                      "tipoDocumento",
                      e.target.value
                    )
                  }
                  className="w-full bg-gray-700 border border-cyan-500/30 rounded-lg px-3 py-2 text-cyan-100 focus:ring-2 focus:ring-cyan-500 text-sm"
                >
                  <option value="">Tipo documento</option>
                  <option value="RC">Registro Civil</option>
                  <option value="TI">Tarjeta de Identidad</option>
                  <option value="CC">Cédula de Ciudadanía</option>
                  <option value="CE">Cédula de Extranjería</option>
                  <option value="PAS">Pasaporte</option>
                  <option value="PPT">Permiso por Protección Temporal</option>
                </select>
                {stepErrors[`nino${index}tipoDoc`] && (
                  <p className="text-red-400 text-xs mt-1">
                    {stepErrors[`nino${index}tipoDoc`]}
                  </p>
                )}
              </div>
              <div>
                <input
                  type="text"
                  placeholder="Número documento"
                  value={nino.numeroDocumento || ""}
                  onChange={(e) =>
                    updatePersonData(
                      "ninos",
                      index,
                      "numeroDocumento",
                      e.target.value
                    )
                  }
                  className="w-full bg-gray-700 border border-cyan-500/30 rounded-lg px-3 py-2 text-cyan-100 placeholder-cyan-400 focus:ring-2 focus:ring-cyan-500 text-sm"
                />
                {stepErrors[`nino${index}numDoc`] && (
                  <p className="text-red-400 text-xs mt-1">
                    {stepErrors[`nino${index}numDoc`]}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
