// src/app/tours/[id]/components/ReservationModal/steps/Step1.tsx

import { motion } from "framer-motion";
import { FaUser, FaPhone, FaCalendarAlt, FaArrowRight } from "react-icons/fa";
import { useFormContext } from "react-hook-form";
import CustomCalendar from "../CustomCalendar";
import { ReservationFormData, Tour } from "../types";

interface Step1Props {
  tour: Tour;
  nextStep: () => void;
}

export default function Step1({ tour, nextStep }: Step1Props) {
  const {
    register,
    formState: { errors },
    trigger,
    setValue,
    watch,
  } = useFormContext<ReservationFormData>();

  const selectedDateId = watch("fechaId");

  const handleNext = async () => {
    const isValid = await trigger(["nombre", "correo", "telefono", "fechaId"]);
    if (isValid) nextStep();
  };

  const handleDateSelect = (dateId: string) => {
    setValue("fechaId", dateId, { shouldValidate: true });
  };

  return (
    <>
      <div className="space-y-4">
        {/* Campo Nombre Completo */}
        <div>
          <label
            htmlFor="nombre"
            className="block text-indigo-300 mb-1 flex items-center gap-2"
          >
            <FaUser className="text-indigo-400" />
            <span>Nombre completo</span>
          </label>
          <input
            id="nombre"
            type="text"
            {...register("nombre", { required: "Nombre es obligatorio" })}
            className={`w-full p-2 rounded bg-gray-800 text-white border ${
              errors.nombre ? "border-red-500" : "border-indigo-500/20"
            } focus:ring-2 focus:ring-indigo-400 outline-none`}
          />
          {errors.nombre && (
            <p className="text-red-400 text-sm mt-1">{errors.nombre.message}</p>
          )}
        </div>

        {/* Campo Correo Electrónico */}
        <div>
          <label
            htmlFor="correo"
            className="block text-indigo-300 mb-1 flex items-center gap-2"
          >
            <FaUser className="text-indigo-400" />
            <span>Correo electrónico</span>
          </label>
          <input
            id="correo"
            type="email"
            {...register("correo", {
              required: "Correo es obligatorio",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Correo inválido",
              },
            })}
            className={`w-full p-2 rounded bg-gray-800 text-white border ${
              errors.correo ? "border-red-500" : "border-indigo-500/20"
            } focus:ring-2 focus:ring-indigo-400 outline-none`}
          />
          {errors.correo && (
            <p className="text-red-400 text-sm mt-1">{errors.correo.message}</p>
          )}
        </div>

        {/* Campo Teléfono */}
        <div>
          <label
            htmlFor="telefono"
            className="block text-indigo-300 mb-1 flex items-center gap-2"
          >
            <FaPhone className="text-indigo-400" />
            <span>Teléfono</span>
          </label>
          <input
            id="telefono"
            type="tel"
            {...register("telefono", {
              required: "Teléfono es obligatorio",
              pattern: {
                value: /^[0-9+-\s()]{7,20}$/,
                message: "Teléfono inválido",
              },
            })}
            className={`w-full p-2 rounded bg-gray-800 text-white border ${
              errors.telefono ? "border-red-500" : "border-indigo-500/20"
            } focus:ring-2 focus:ring-indigo-400 outline-none`}
          />
          {errors.telefono && (
            <p className="text-red-400 text-sm mt-1">
              {errors.telefono.message}
            </p>
          )}
        </div>

        {/* Calendario personalizado */}
        <div>
          <label className="block text-indigo-300 mb-2 flex items-center gap-2">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ repeat: Infinity, duration: 3 }}
            >
              <FaCalendarAlt className="text-indigo-400" />
            </motion.div>
            <span className="bg-gradient-to-r from-indigo-300 to-purple-300 bg-clip-text text-transparent">
              Selecciona una fecha disponible
            </span>
          </label>

          <CustomCalendar
            tour={tour}
            selectedDateId={selectedDateId}
            onDateSelect={handleDateSelect}
            errors={errors.fechaId?.message}
          />

          {errors.fechaId && (
            <p className="text-red-400 text-sm mt-2">
              {errors.fechaId.message}
            </p>
          )}

          {/* Input oculto para el formulario */}
          <input
            type="hidden"
            {...register("fechaId", { required: "Seleccione una fecha" })}
          />
        </div>
      </div>

      <div className="mt-8 flex justify-end">
        <motion.button
          type="button"
          onClick={handleNext}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-6 rounded-xl transition-all duration-300"
        >
          Siguiente <FaArrowRight />
        </motion.button>
      </div>
    </>
  );
}
