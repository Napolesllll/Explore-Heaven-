"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Tour } from "../../../../../../../../data/toursData";
import { X as XIcon } from "lucide-react";
import { Person, ReservationFormData } from "./types";
import Step1BasicInfo from "./Step1BasicInfo";
import Step2PeopleCount from "./Step2PeopleCount";
import Step3ParticipantsData from "./Step3ParticipantsData";
import Step4EmergencyContact from "./Step4EmergencyContact";
import SuccessStep from "./SuccessStep";

interface ReservationFormProps {
  tour: Tour;
  formRef: React.RefObject<HTMLFormElement>;
  sendEmail: (e: React.FormEvent<HTMLFormElement>) => void;
  isSubmitting: boolean;
  hasSubmitted: boolean;
  setShowModal: (show: boolean) => void;
  availableDates: Date[];
  formData: ReservationFormData;
  setFormData: React.Dispatch<React.SetStateAction<ReservationFormData>>;
  showWhatsApp: boolean;
  setShowWhatsApp: (show: boolean) => void;
}

export default function ReservationForm({
  tour,
  formRef,
  sendEmail,
  isSubmitting,
  hasSubmitted,
  setShowModal,
  availableDates,
  formData,
  setFormData,
  showWhatsApp,
  setShowWhatsApp,
}: ReservationFormProps) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(
    formData.fecha ? new Date(formData.fecha) : null
  );
  const [currentStep, setCurrentStep] = useState(1);
  const [stepErrors, setStepErrors] = useState<Record<string, string>>({});

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }) as ReservationFormData);
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    // Store date in ISO format to avoid parsing issues
    const isoDate = date.toISOString();
    setFormData((prev) => ({ ...prev, fecha: isoDate }));
  };

  const validateCurrentStep = () => {
    const errors: Record<string, string> = {};
    switch (currentStep) {
      case 1:
        if (!formData.nombre?.trim()) errors.nombre = "Nombre es requerido";
        if (
          !formData.correo?.trim() ||
          !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.correo)
        ) {
          errors.correo = "Correo válido es requerido";
        }
        if (
          !formData.telefono?.trim() ||
          !/^\d{7,15}$/.test(formData.telefono)
        ) {
          errors.telefono = "Teléfono válido es requerido";
        }
        if (!formData.fecha) errors.fecha = "Fecha es requerida";
        break;

      case 2:
        if (!formData.cantidadAdultos || formData.cantidadAdultos < 1) {
          errors.cantidadAdultos = "Debe haber al menos 1 adulto";
        }
        if (formData.cantidadNinos < 0) {
          errors.cantidadNinos = "La cantidad de niños no puede ser negativa";
        }
        break;

      case 3:
        for (let i = 0; i < (formData.cantidadAdultos || 0); i++) {
          if (!formData.adultos?.[i]?.nombre?.trim()) {
            errors[`adulto${i}nombre`] =
              `Nombre del adulto ${i + 1} es requerido`;
          }
          if (!formData.adultos?.[i]?.tipoDocumento) {
            errors[`adulto${i}tipoDoc`] =
              `Tipo de documento del adulto ${i + 1} es requerido`;
          }
          if (!formData.adultos?.[i]?.numeroDocumento?.trim()) {
            errors[`adulto${i}numDoc`] =
              `Número de documento del adulto ${i + 1} es requerido`;
          }
        }

        for (let i = 0; i < (formData.cantidadNinos || 0); i++) {
          if (!formData.ninos?.[i]?.nombre?.trim()) {
            errors[`nino${i}nombre`] = `Nombre del niño ${i + 1} es requerido`;
          }
          if (!formData.ninos?.[i]?.tipoDocumento) {
            errors[`nino${i}tipoDoc`] =
              `Tipo de documento del niño ${i + 1} es requerido`;
          }
          if (!formData.ninos?.[i]?.numeroDocumento?.trim()) {
            errors[`nino${i}numDoc`] =
              `Número de documento del niño ${i + 1} es requerido`;
          }
        }
        break;

      case 4:
        if (!formData.contactoEmergencia?.nombre?.trim()) {
          errors.contactoNombre =
            "Nombre del contacto de emergencia es requerido";
        }
        if (
          !formData.contactoEmergencia?.telefono?.trim() ||
          !/^\d{7,15}$/.test(formData.contactoEmergencia.telefono)
        ) {
          errors.contactoTelefono =
            "Teléfono del contacto de emergencia es requerido";
        }
        break;
    }

    setStepErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const nextStep = () => {
    if (validateCurrentStep()) {
      setCurrentStep((prev) => Math.min(prev + 1, 4));
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleAdultosChange = (value: number) => {
    setFormData((prev) => {
      const adultos: Person[] = Array.from({ length: value }).map(
        (_, i) =>
          prev.adultos?.[i] || {
            nombre: "",
            tipoDocumento: "",
            numeroDocumento: "",
          }
      );
      return { ...prev, cantidadAdultos: value, adultos };
    });
  };

  const handleNinosChange = (value: number) => {
    setFormData((prev) => {
      const ninos: Person[] = Array.from({ length: value }).map(
        (_, i) =>
          prev.ninos?.[i] || {
            nombre: "",
            tipoDocumento: "",
            numeroDocumento: "",
          }
      );
      return { ...prev, cantidadNinos: value, ninos };
    });
  };

  const updatePersonData = (
    type: "adultos" | "ninos",
    index: number,
    field: keyof Person,
    value: string
  ) => {
    setFormData((prev) => {
      const list = [...prev[type]];
      list[index] = { ...list[index], [field]: value };
      return { ...prev, [type]: list } as ReservationFormData;
    });
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <Step1BasicInfo
            formData={formData}
            handleInputChange={handleInputChange}
            selectedDate={selectedDate}
            handleDateSelect={handleDateSelect}
            availableDates={availableDates}
            stepErrors={stepErrors}
          />
        );

      case 2:
        return (
          <Step2PeopleCount
            formData={formData}
            handleAdultosChange={handleAdultosChange}
            handleNinosChange={handleNinosChange}
            stepErrors={stepErrors}
          />
        );

      case 3:
        return (
          <Step3ParticipantsData
            formData={formData}
            updatePersonData={updatePersonData}
            stepErrors={stepErrors}
          />
        );

      case 4:
        return (
          <Step4EmergencyContact
            formData={formData}
            setFormData={setFormData}
            stepErrors={stepErrors}
          />
        );

      default:
        return null;
    }
  };

  // Helper to format date for EmailJS (as readable string)
  const getFormattedDateForEmail = (): string => {
    if (!formData.fecha) return "";

    try {
      const date = new Date(formData.fecha);
      if (isNaN(date.getTime())) return "";

      // Format as DD/MM/YYYY for email
      return `${date.getDate().toString().padStart(2, "0")}/${(date.getMonth() + 1).toString().padStart(2, "0")}/${date.getFullYear()}`;
    } catch {
      return "";
    }
  };

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.8, opacity: 0 }}
      className="bg-gradient-to-br from-[#0f172a]/90 to-[#1e293b]/90 border-2 border-cyan-500/30 rounded-2xl shadow-2xl text-center space-y-6 relative overflow-hidden
        w-full max-w-4xl max-h-[95vh] overflow-y-auto
        p-4 sm:p-6 md:p-8
        mx-auto my-4"
      role="dialog"
      aria-modal="true"
      aria-label="Formulario de reserva"
    >
      <button
        type="button"
        onClick={() => setShowModal(false)}
        className="absolute top-4 right-4 z-20 w-8 h-8 flex items-center justify-center rounded-full bg-gray-800 hover:bg-gray-700 transition-colors"
        aria-label="Cerrar modal"
      >
        <XIcon className="w-5 h-5 text-cyan-400" />
      </button>

      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-cyan-500 rounded-full filter blur-[80px] opacity-20" />
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-purple-500 rounded-full filter blur-[100px] opacity-15" />
      </div>

      <div className="relative z-10 space-y-4">
        {!showWhatsApp ? (
          <>
            <div className="pt-6 pb-4">
              <div className="flex items-center justify-center gap-2 mb-4">
                {[1, 2, 3, 4].map((step) => (
                  <div key={step} className="flex items-center">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                        currentStep >= step
                          ? "bg-cyan-500 text-gray-900"
                          : "bg-gray-700 text-cyan-400"
                      }`}
                    >
                      {step}
                    </div>
                    {step < 4 && (
                      <div
                        className={`w-6 h-1 mx-1 ${
                          currentStep > step ? "bg-cyan-500" : "bg-gray-700"
                        }`}
                      />
                    )}
                  </div>
                ))}
              </div>
              <p className="text-cyan-400 text-sm">Paso {currentStep} de 4</p>
            </div>

            <form
              ref={formRef}
              onSubmit={(e) => {
                e.preventDefault();
                if (currentStep === 4 && validateCurrentStep()) {
                  sendEmail(e);
                }
              }}
              className="space-y-5 text-left"
              noValidate
            >
              {/* Campos ocultos para EmailJS */}
              <input type="hidden" name="tour" value={tour.nombre || ""} />
              <input
                type="hidden"
                name="nombre"
                value={formData.nombre || ""}
              />
              <input
                type="hidden"
                name="correo"
                value={formData.correo || ""}
              />
              <input
                type="hidden"
                name="telefono"
                value={formData.telefono || ""}
              />
              <input
                type="hidden"
                name="fecha"
                value={getFormattedDateForEmail()}
              />

              {/* Campos adicionales */}
              <input
                type="hidden"
                name="cantidadAdultos"
                value={formData.cantidadAdultos || 0}
              />
              <input
                type="hidden"
                name="cantidadNinos"
                value={formData.cantidadNinos || 0}
              />
              <input
                type="hidden"
                name="contactoEmergencia"
                value={formData.contactoEmergencia?.nombre || ""}
              />
              <input
                type="hidden"
                name="telefonoEmergencia"
                value={formData.contactoEmergencia?.telefono || ""}
              />

              {renderStepContent()}

              <div className="pt-6 flex flex-col sm:flex-row justify-between gap-3">
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-3 border border-cyan-500/30 rounded-xl text-cyan-300 hover:bg-gray-800 transition text-sm sm:text-base"
                  >
                    Cancelar
                  </button>

                  {currentStep > 1 && (
                    <button
                      type="button"
                      onClick={prevStep}
                      className="px-4 py-3 bg-gray-700 hover:bg-gray-600 text-cyan-100 rounded-xl transition text-sm sm:text-base"
                    >
                      Anterior
                    </button>
                  )}
                </div>

                <div>
                  {currentStep < 4 ? (
                    <button
                      type="button"
                      onClick={nextStep}
                      className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-cyan-600 text-gray-900 hover:from-cyan-400 hover:to-cyan-500 rounded-xl font-semibold transition text-sm sm:text-base"
                    >
                      Siguiente
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={isSubmitting || hasSubmitted}
                      className={`px-6 py-3 rounded-xl font-semibold transition relative overflow-hidden text-sm sm:text-base ${
                        isSubmitting || hasSubmitted
                          ? "bg-cyan-300 text-gray-900 cursor-not-allowed"
                          : "bg-gradient-to-r from-cyan-500 to-cyan-600 text-gray-900 hover:from-cyan-400 hover:to-cyan-500"
                      }`}
                    >
                      <span className="relative z-10 flex items-center justify-center gap-2">
                        {isSubmitting ? (
                          <div className="flex items-center">
                            <div className="w-4 h-4 border-t-2 border-gray-900 rounded-full animate-spin mr-2" />
                            Procesando...
                          </div>
                        ) : hasSubmitted ? (
                          "Información enviada"
                        ) : (
                          "Completar reserva"
                        )}
                      </span>
                    </button>
                  )}
                </div>
              </div>
            </form>
          </>
        ) : (
          <SuccessStep
            tour={tour}
            formData={formData}
            setShowWhatsApp={setShowWhatsApp}
            setCurrentStep={setCurrentStep}
          />
        )}
      </div>
    </motion.div>
  );
}
