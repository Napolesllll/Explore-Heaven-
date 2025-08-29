"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  FaArrowLeft,
  FaArrowRight,
  FaUser,
  FaIdCard,
  FaBirthdayCake,
  FaShieldAlt,
} from "react-icons/fa";
import { useFormContext } from "react-hook-form";
import PrivacyPolicyModal from "../../PrivacyPolicy";
import { ReservationFormData, TIPOS_DOCUMENTO } from "../types";

interface Step3Props {
  prevStep: () => void;
  nextStep: () => void;
}

export default function Step3({ prevStep, nextStep }: Step3Props) {
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);

  const {
    register,
    formState: { errors },
    watch,
    trigger,
  } = useFormContext<ReservationFormData>();

  const adultos = watch("adultos") || 1;
  const niños = watch("niños") || 0;
  const totalPersonas = adultos + niños;

  const handleNext = async () => {
    const fieldsToValidate: string[] = [];
    for (let i = 0; i < totalPersonas; i++) {
      fieldsToValidate.push(
        `participantes.${i}.nombre`,
        `participantes.${i}.tipoDocumento`,
        `participantes.${i}.numeroDocumento`,
        `participantes.${i}.fechaNacimiento`
      );
    }

    const isValid = await trigger(fieldsToValidate);
    if (isValid) nextStep();
  };

  return (
    <>
      <div className="space-y-4">
        <div className="flex items-start gap-3 mb-4">
          <h3 className="text-lg font-semibold text-indigo-300">
            Información de los participantes
          </h3>
        </div>

        {/* Aviso importante sobre seguros médicos */}
        <div className="bg-blue-900/30 p-4 rounded-lg border border-blue-500/30 mb-6">
          <div className="flex items-start gap-3">
            <FaShieldAlt className="text-blue-400 mt-1 flex-shrink-0" />
            <div>
              <p className="text-blue-200 text-sm font-semibold mb-2">
                Información importante sobre seguros médicos
              </p>
              <p className="text-blue-200 text-xs mb-3">
                Todos los datos de identificación y fechas de nacimiento son
                obligatorios para procesar los seguros médicos durante el tour.
                Esta información es requerida por nuestras pólizas de seguro
                para garantizar la cobertura completa de todos los
                participantes.
              </p>
              <p className="text-blue-200 text-xs">
                <button
                  type="button"
                  onClick={() => setShowPrivacyModal(true)}
                  className="text-blue-300 hover:text-blue-100 underline decoration-blue-400 underline-offset-2 transition-colors"
                >
                  &quot;Consulta nuestras políticas de protección de datos&quot;
                </button>{" "}
                - En caso de continuar se entiende la aceptación de dichas
                políticas. Contrato disponible en el perfil de la empresa.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-indigo-900/30 p-4 rounded-lg border border-indigo-500/30 mb-4">
          <p className="text-indigo-200 text-sm">
            Por favor completa toda la información de los participantes (
            {totalPersonas} persona{totalPersonas !== 1 ? "s" : ""})
          </p>
        </div>

        {/* Campos para adultos */}
        {[...Array(adultos)].map((_, index) => (
          <motion.div
            key={`adulto-${index}`}
            className="bg-gray-900/50 p-4 rounded-lg border border-indigo-500/20 mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <h4 className="text-indigo-300 font-semibold mb-3 flex items-center gap-2">
              <FaUser className="text-indigo-400" />
              Adulto {index + 1}
            </h4>

            {/* Nombre */}
            <div className="mb-3">
              <label
                htmlFor={`adulto-nombre-${index}`}
                className="block text-indigo-300 mb-1 text-sm"
              >
                Nombre completo *
              </label>
              <input
                id={`adulto-nombre-${index}`}
                type="text"
                {...register(`participantes.${index}.nombre`, {
                  required: `Nombre del adulto ${index + 1} es obligatorio`,
                })}
                className={`w-full p-2 rounded bg-gray-800 text-white border ${
                  errors.participantes?.[index]?.nombre
                    ? "border-red-500"
                    : "border-indigo-500/20"
                } focus:ring-2 focus:ring-indigo-400 outline-none`}
                placeholder={`Nombre completo del adulto ${index + 1}`}
              />
              {errors.participantes?.[index]?.nombre && (
                <p className="text-red-400 text-sm mt-1">
                  {errors.participantes[index]?.nombre?.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
              {/* Tipo de documento */}
              <div>
                <label
                  htmlFor={`adulto-tipo-doc-${index}`}
                  className="block text-indigo-300 mb-1 text-sm flex items-center gap-1"
                >
                  <FaIdCard className="text-indigo-400" />
                  Tipo de documento *
                </label>
                <select
                  id={`adulto-tipo-doc-${index}`}
                  {...register(`participantes.${index}.tipoDocumento`, {
                    required: `Tipo de documento del adulto ${index + 1} es obligatorio`,
                  })}
                  className={`w-full p-2 rounded bg-gray-800 text-white border ${
                    errors.participantes?.[index]?.tipoDocumento
                      ? "border-red-500"
                      : "border-indigo-500/20"
                  } focus:ring-2 focus:ring-indigo-400 outline-none`}
                >
                  <option value="">Seleccione tipo</option>
                  {TIPOS_DOCUMENTO.map((tipo) => (
                    <option key={tipo.value} value={tipo.value}>
                      {tipo.label}
                    </option>
                  ))}
                </select>
                {errors.participantes?.[index]?.tipoDocumento && (
                  <p className="text-red-400 text-sm mt-1">
                    {errors.participantes[index]?.tipoDocumento?.message}
                  </p>
                )}
              </div>

              {/* Número de documento */}
              <div>
                <label
                  htmlFor={`adulto-num-doc-${index}`}
                  className="block text-indigo-300 mb-1 text-sm"
                >
                  Número de documento *
                </label>
                <input
                  id={`adulto-num-doc-${index}`}
                  type="text"
                  {...register(`participantes.${index}.numeroDocumento`, {
                    required: `Número de documento del adulto ${index + 1} es obligatorio`,
                    pattern: {
                      value: /^[A-Za-z0-9-]+$/,
                      message: "Formato de documento inválido",
                    },
                  })}
                  className={`w-full p-2 rounded bg-gray-800 text-white border ${
                    errors.participantes?.[index]?.numeroDocumento
                      ? "border-red-500"
                      : "border-indigo-500/20"
                  } focus:ring-2 focus:ring-indigo-400 outline-none`}
                  placeholder="Número de identificación"
                />
                {errors.participantes?.[index]?.numeroDocumento && (
                  <p className="text-red-400 text-sm mt-1">
                    {errors.participantes[index]?.numeroDocumento?.message}
                  </p>
                )}
              </div>
            </div>

            {/* Fecha de nacimiento */}
            <div>
              <label
                htmlFor={`adulto-fecha-${index}`}
                className="block text-indigo-300 mb-1 text-sm flex items-center gap-1"
              >
                <FaBirthdayCake className="text-indigo-400" />
                Fecha de nacimiento *
              </label>
              <input
                id={`adulto-fecha-${index}`}
                type="date"
                {...register(`participantes.${index}.fechaNacimiento`, {
                  required: `Fecha de nacimiento del adulto ${index + 1} es obligatoria`,
                  validate: {
                    isAdult: (value) => {
                      const birthDate = new Date(value);
                      const today = new Date();
                      let age = today.getFullYear() - birthDate.getFullYear();
                      const monthDiff = today.getMonth() - birthDate.getMonth();
                      if (
                        monthDiff < 0 ||
                        (monthDiff === 0 &&
                          today.getDate() < birthDate.getDate())
                      ) {
                        age--;
                      }
                      return (
                        age >= 18 || "Los adultos deben ser mayores de 18 años"
                      );
                    },
                  },
                })}
                max={new Date().toISOString().split("T")[0]}
                className={`w-full p-2 rounded bg-gray-800 text-white border ${
                  errors.participantes?.[index]?.fechaNacimiento
                    ? "border-red-500"
                    : "border-indigo-500/20"
                } focus:ring-2 focus:ring-indigo-400 outline-none`}
              />
              {errors.participantes?.[index]?.fechaNacimiento && (
                <p className="text-red-400 text-sm mt-1">
                  {errors.participantes[index]?.fechaNacimiento?.message}
                </p>
              )}
            </div>
          </motion.div>
        ))}

        {/* Campos para niños */}
        {[...Array(niños)].map((_, index) => (
          <motion.div
            key={`niño-${index}`}
            className="bg-purple-900/20 p-4 rounded-lg border border-purple-500/20 mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: (adultos + index) * 0.1 }}
          >
            <h4 className="text-purple-300 font-semibold mb-3 flex items-center gap-2">
              <FaUser className="text-purple-400" />
              Niño {index + 1}
            </h4>

            {/* Nombre */}
            <div className="mb-3">
              <label
                htmlFor={`niño-nombre-${index}`}
                className="block text-purple-300 mb-1 text-sm"
              >
                Nombre completo *
              </label>
              <input
                id={`niño-nombre-${index}`}
                type="text"
                {...register(`participantes.${adultos + index}.nombre`, {
                  required: `Nombre del niño ${index + 1} es obligatorio`,
                })}
                className={`w-full p-2 rounded bg-gray-800 text-white border ${
                  errors.participantes?.[adultos + index]?.nombre
                    ? "border-red-500"
                    : "border-purple-500/20"
                } focus:ring-2 focus:ring-purple-400 outline-none`}
                placeholder={`Nombre completo del niño ${index + 1}`}
              />
              {errors.participantes?.[adultos + index]?.nombre && (
                <p className="text-red-400 text-sm mt-1">
                  {errors.participantes[adultos + index]?.nombre?.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
              {/* Tipo de documento */}
              <div>
                <label
                  htmlFor={`niño-tipo-doc-${index}`}
                  className="block text-purple-300 mb-1 text-sm flex items-center gap-1"
                >
                  <FaIdCard className="text-purple-400" />
                  Tipo de documento *
                </label>
                <select
                  id={`niño-tipo-doc-${index}`}
                  {...register(
                    `participantes.${adultos + index}.tipoDocumento`,
                    {
                      required: `Tipo de documento del niño ${index + 1} es obligatorio`,
                    }
                  )}
                  className={`w-full p-2 rounded bg-gray-800 text-white border ${
                    errors.participantes?.[adultos + index]?.tipoDocumento
                      ? "border-red-500"
                      : "border-purple-500/20"
                  } focus:ring-2 focus:ring-purple-400 outline-none`}
                >
                  <option value="">Seleccione tipo</option>
                  {TIPOS_DOCUMENTO.map((tipo) => (
                    <option key={tipo.value} value={tipo.value}>
                      {tipo.label}
                    </option>
                  ))}
                </select>
                {errors.participantes?.[adultos + index]?.tipoDocumento && (
                  <p className="text-red-400 text-sm mt-1">
                    {
                      errors.participantes[adultos + index]?.tipoDocumento
                        ?.message
                    }
                  </p>
                )}
              </div>

              {/* Número de documento */}
              <div>
                <label
                  htmlFor={`niño-num-doc-${index}`}
                  className="block text-purple-300 mb-1 text-sm"
                >
                  Número de documento *
                </label>
                <input
                  id={`niño-num-doc-${index}`}
                  type="text"
                  {...register(
                    `participantes.${adultos + index}.numeroDocumento`,
                    {
                      required: `Número de documento del niño ${index + 1} es obligatorio`,
                      pattern: {
                        value: /^[A-Za-z0-9-]+$/,
                        message: "Formato de documento inválido",
                      },
                    }
                  )}
                  className={`w-full p-2 rounded bg-gray-800 text-white border ${
                    errors.participantes?.[adultos + index]?.numeroDocumento
                      ? "border-red-500"
                      : "border-purple-500/20"
                  } focus:ring-2 focus:ring-purple-400 outline-none`}
                  placeholder="Número de identificación"
                />
                {errors.participantes?.[adultos + index]?.numeroDocumento && (
                  <p className="text-red-400 text-sm mt-1">
                    {
                      errors.participantes[adultos + index]?.numeroDocumento
                        ?.message
                    }
                  </p>
                )}
              </div>
            </div>

            {/* Fecha de nacimiento */}
            <div>
              <label
                htmlFor={`niño-fecha-${index}`}
                className="block text-purple-300 mb-1 text-sm flex items-center gap-1"
              >
                <FaBirthdayCake className="text-purple-400" />
                Fecha de nacimiento *
              </label>
              <input
                id={`niño-fecha-${index}`}
                type="date"
                {...register(
                  `participantes.${adultos + index}.fechaNacimiento`,
                  {
                    required: `Fecha de nacimiento del niño ${index + 1} es obligatoria`,
                    validate: {
                      isMinor: (value) => {
                        const birthDate = new Date(value);
                        const today = new Date();
                        let age = today.getFullYear() - birthDate.getFullYear();
                        const monthDiff =
                          today.getMonth() - birthDate.getMonth();
                        if (
                          monthDiff < 0 ||
                          (monthDiff === 0 &&
                            today.getDate() < birthDate.getDate())
                        ) {
                          age--;
                        }
                        return (
                          age < 18 || "Los niños deben ser menores de 18 años"
                        );
                      },
                    },
                  }
                )}
                max={new Date().toISOString().split("T")[0]}
                className={`w-full p-2 rounded bg-gray-800 text-white border ${
                  errors.participantes?.[adultos + index]?.fechaNacimiento
                    ? "border-red-500"
                    : "border-purple-500/20"
                } focus:ring-2 focus:ring-purple-400 outline-none`}
              />
              {errors.participantes?.[adultos + index]?.fechaNacimiento && (
                <p className="text-red-400 text-sm mt-1">
                  {
                    errors.participantes[adultos + index]?.fechaNacimiento
                      ?.message
                  }
                </p>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-8 flex justify-between">
        <button
          type="button"
          onClick={prevStep}
          className="flex items-center gap-2 text-indigo-300 hover:text-white"
        >
          <FaArrowLeft /> Anterior
        </button>
        <button
          type="button"
          onClick={handleNext}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-6 rounded-xl transition-all duration-300"
        >
          Siguiente <FaArrowRight />
        </button>
      </div>

      {/* Modal de Políticas de Protección de Datos */}
      <PrivacyPolicyModal
        isOpen={showPrivacyModal}
        onClose={() => setShowPrivacyModal(false)}
      />
    </>
  );
}
