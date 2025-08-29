"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { FaTimes } from "react-icons/fa";
import { useForm, FormProvider } from "react-hook-form";
import Step1 from "./steps/Step1";
import Step2 from "./steps/Step2";
import Step3 from "./steps/Step3";
import Step4 from "./steps/Step4";
import { ReservationFormData, Tour } from "./types";

interface ReservationModalProps {
  tour: Tour;
  isOpen: boolean;
  onClose: () => void;
  onSubmitReservation: (data: ReservationFormData) => Promise<void>;
}

export function ReservationModal({
  tour,
  isOpen,
  onClose,
  onSubmitReservation,
}: ReservationModalProps) {
  const methods = useForm<ReservationFormData>({
    defaultValues: {
      adultos: 1,
      niños: 0,
      participantes: [],
      contactoEmergencia: {
        nombre: "",
        telefono: "",
      },
    },
  });

  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);

  const handleSubmit = async (data: ReservationFormData) => {
    setIsSubmitting(true);
    try {
      await onSubmitReservation(data);
      onClose();
      methods.reset();
      setStep(1);
    } catch (error: unknown) {
      console.error("Error al procesar la reserva:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    onClose();
    methods.reset();
    setStep(1);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
      <div
        className="bg-[#0f172a] border border-indigo-500/30 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto relative"
        role="dialog"
        aria-modal="true"
        aria-labelledby="reservation-modal-title"
      >
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-indigo-300 hover:text-white transition-colors z-10"
          aria-label="Cerrar modal de reserva"
        >
          <FaTimes className="text-xl" />
        </button>

        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2
              className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400"
              id="reservation-modal-title"
            >
              Reservar Tour
            </h2>
            <div className="text-indigo-300 text-sm">Paso {step} de 4</div>
          </div>

          {/* Información del tour */}
          <div className="mb-6 p-3 bg-indigo-900/20 rounded-lg border border-indigo-500/20">
            <h3 className="text-indigo-300 font-semibold mb-1">
              {tour.nombre}
            </h3>
            <p className="text-indigo-200 text-sm">
              Precio:{" "}
              <span className="font-bold">
                ${tour.precio?.toLocaleString() || 0} por persona
              </span>
            </p>
            <p className="text-indigo-200 text-sm">
              Capacidad máxima:{" "}
              <span className="font-bold">
                {tour.maxReservas} personas por reserva
              </span>
            </p>
          </div>

          {/* Barra de progreso */}
          <div className="w-full bg-gray-700 rounded-full h-2 mb-6">
            <motion.div
              className="bg-indigo-500 h-2 rounded-full"
              initial={{ width: `${(step - 1) * 25}%` }}
              animate={{ width: `${(step - 1) * 25}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>

          <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(handleSubmit)}>
              {step === 1 && <Step1 tour={tour} nextStep={nextStep} />}
              {step === 2 && (
                <Step2 tour={tour} nextStep={nextStep} prevStep={prevStep} />
              )}
              {step === 3 && <Step3 nextStep={nextStep} prevStep={prevStep} />}
              {step === 4 && (
                <Step4
                  prevStep={prevStep}
                  onSubmit={methods.handleSubmit(handleSubmit)}
                  isSubmitting={isSubmitting}
                />
              )}
            </form>
          </FormProvider>
        </div>
      </div>
    </div>
  );
}

export default ReservationModal;
