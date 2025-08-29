// src/app/tours/[id]/components/ReservationModal/steps/Step4.tsx

import {
  FaArrowLeft,
  FaUserAlt,
  FaPhone,
  FaExclamationTriangle,
} from "react-icons/fa";
import { useFormContext } from "react-hook-form";
import { ReservationFormData } from "../types";

interface Step4Props {
  prevStep: () => void;
  onSubmit: () => void;
  isSubmitting: boolean;
}

export default function Step4({
  prevStep,
  onSubmit,
  isSubmitting,
}: Step4Props) {
  const {
    register,
    formState: { errors },
  } = useFormContext<ReservationFormData>();

  return (
    <>
      <div className="space-y-4">
        <div className="bg-yellow-900/30 p-4 rounded-lg border border-yellow-500/30 flex items-start gap-3">
          <FaExclamationTriangle className="text-yellow-400 mt-1 flex-shrink-0" />
          <p className="text-yellow-200 text-sm">
            Por favor proporciona al menos un contacto de emergencia que podamos
            usar en caso necesario durante el tour.
          </p>
        </div>

        {/* Campo Nombre Contacto Emergencia */}
        <div>
          <label
            htmlFor="contactoEmergenciaNombre"
            className="block text-indigo-300 mb-1 flex items-center gap-2"
          >
            <FaUserAlt className="text-indigo-400" />
            <span>Nombre completo del contacto</span>
          </label>
          <input
            id="contactoEmergenciaNombre"
            type="text"
            {...register("contactoEmergencia.nombre", {
              required: "Por favor ingrese el nombre de contacto de emergencia",
            })}
            className={`w-full p-2 rounded bg-gray-800 text-white border ${
              errors.contactoEmergencia?.nombre
                ? "border-red-500"
                : "border-indigo-500/20"
            } focus:ring-2 focus:ring-indigo-400 outline-none`}
            placeholder="Nombre completo"
          />
          {errors.contactoEmergencia?.nombre && (
            <p className="text-red-400 text-sm mt-1">
              {errors.contactoEmergencia.nombre.message}
            </p>
          )}
        </div>

        {/* Campo Teléfono Contacto Emergencia */}
        <div>
          <label
            htmlFor="contactoEmergenciaTelefono"
            className="block text-indigo-300 mb-1 flex items-center gap-2"
          >
            <FaPhone className="text-indigo-400" />
            <span>Teléfono de contacto</span>
          </label>
          <input
            id="contactoEmergenciaTelefono"
            type="tel"
            {...register("contactoEmergencia.telefono", {
              required:
                "Por favor ingrese el teléfono de contacto de emergencia",
              pattern: {
                value: /^[0-9+-\s()]{7,20}$/,
                message: "Teléfono inválido",
              },
            })}
            className={`w-full p-2 rounded bg-gray-800 text-white border ${
              errors.contactoEmergencia?.telefono
                ? "border-red-500"
                : "border-indigo-500/20"
            } focus:ring-2 focus:ring-indigo-400 outline-none`}
            placeholder="Número de teléfono"
          />
          {errors.contactoEmergencia?.telefono && (
            <p className="text-red-400 text-sm mt-1">
              {errors.contactoEmergencia.telefono.message}
            </p>
          )}
        </div>
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
          onClick={onSubmit}
          disabled={isSubmitting}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-6 rounded-xl transition-all duration-300 disabled:opacity-50"
        >
          {isSubmitting ? "Reservando..." : "Confirmar Reserva"}
        </button>
      </div>
    </>
  );
}
