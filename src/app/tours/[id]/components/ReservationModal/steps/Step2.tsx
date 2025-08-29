// src/app/tours/[id]/components/ReservationModal/steps/Step2.tsx

import { FaUserFriends, FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { useFormContext } from "react-hook-form";
import { ReservationFormData, Tour } from "../types";

interface Step2Props {
  tour: Tour;
  nextStep: () => void;
  prevStep: () => void;
}

export default function Step2({ tour, nextStep, prevStep }: Step2Props) {
  const {
    register,
    formState: { errors },
    trigger,
    watch,
  } = useFormContext<ReservationFormData>();
  const adultos = watch("adultos") || 1;
  const niños = watch("niños") || 0;
  const totalPersonas = adultos + niños;

  const handleNext = async () => {
    const isValid = await trigger(["adultos", "niños"]);
    if (isValid) nextStep();
  };

  return (
    <>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="adultos"
              className="block text-indigo-300 mb-1 flex items-center gap-2"
            >
              <FaUserFriends className="text-indigo-400" />
              <span>Adultos</span>
            </label>
            <input
              id="adultos"
              type="number"
              min="1"
              max={tour.maxReservas}
              {...register("adultos", {
                required: "Por favor ingrese el número de adultos",
                valueAsNumber: true,
                min: { value: 1, message: "Mínimo 1 adulto" },
                max: {
                  value: tour.maxReservas,
                  message: `Máximo ${tour.maxReservas} personas`,
                },
              })}
              className={`w-full p-2 rounded bg-gray-800 text-white border ${
                errors.adultos ? "border-red-500" : "border-indigo-500/20"
              } focus:ring-2 focus:ring-indigo-400 outline-none`}
            />
            {errors.adultos && (
              <p className="text-red-400 text-sm mt-1">
                {errors.adultos.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="niños"
              className="block text-indigo-300 mb-1 flex items-center gap-2"
            >
              <FaUserFriends className="text-indigo-400" />
              <span>Niños</span>
            </label>
            <input
              id="niños"
              type="number"
              min="0"
              max={tour.maxReservas - adultos}
              {...register("niños", {
                valueAsNumber: true,
                min: { value: 0, message: "No puede ser negativo" },
                max: {
                  value: tour.maxReservas - adultos,
                  message: `Máximo ${tour.maxReservas - adultos} niños`,
                },
              })}
              className={`w-full p-2 rounded bg-gray-800 text-white border ${
                errors.niños ? "border-red-500" : "border-indigo-500/20"
              } focus:ring-2 focus:ring-indigo-400 outline-none`}
            />
            {errors.niños && (
              <p className="text-red-400 text-sm mt-1">
                {errors.niños.message}
              </p>
            )}
          </div>
        </div>

        <div className="bg-indigo-900/30 p-4 rounded-lg border border-indigo-500/30">
          <p className="text-indigo-200 text-sm">
            Capacidad máxima:{" "}
            <span className="font-bold">{tour.maxReservas} personas</span>
          </p>
          <p className="text-indigo-200 text-sm mt-1">
            Total en tu grupo:{" "}
            <span className="font-bold">
              {totalPersonas} persona{totalPersonas !== 1 ? "s" : ""}
            </span>
          </p>
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
          onClick={handleNext}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-6 rounded-xl transition-all duration-300"
        >
          Siguiente <FaArrowRight />
        </button>
      </div>
    </>
  );
}
