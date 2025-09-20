"use client";

import { useState, useCallback, useMemo } from "react";
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

// Hook para detectar móvil
const useIsMobile = () => {
  return useMemo(() => {
    if (typeof window === "undefined") return false;
    return window.innerWidth < 768;
  }, []);
};

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

  const isMobile = useIsMobile();

  // Handlers optimizados con useCallback
  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      setFormData(
        (prev) => ({ ...prev, [name]: value }) as ReservationFormData
      );
    },
    [setFormData]
  );

  const handleDateSelect = useCallback(
    (date: Date) => {
      setSelectedDate(date);
      const isoDate = date.toISOString();
      setFormData((prev) => ({ ...prev, fecha: isoDate }));
    },
    [setFormData]
  );

  // Validación por step
  const validateCurrentStep = useCallback(() => {
    const errors: Record<string, string> = {};

    switch (currentStep) {
      case 1: {
        if (!formData.nombre?.trim()) errors.nombre = "Nombre es requerido";
        if (
          !formData.correo?.trim() ||
          !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.correo)
        ) {
          errors.correo = "Correo válido es requerido";
        }

        const telefono = formData.telefono?.trim();
        if (telefono) {
          const phoneRegex = /^\+\d{1,4}\s\d{7,15}$/;
          if (!phoneRegex.test(telefono)) {
            errors.telefono = "Formato de teléfono inválido";
          } else {
            const phoneNumbers = telefono.split(" ")[1];
            if (
              !phoneNumbers ||
              phoneNumbers.length < 7 ||
              phoneNumbers.length > 15
            ) {
              errors.telefono =
                "Número de teléfono debe tener entre 7 y 15 dígitos";
            }
          }
        } else {
          errors.telefono = "Teléfono es requerido";
        }

        if (!formData.fecha) errors.fecha = "Fecha es requerida";
        break;
      }

      case 2: {
        if (!formData.cantidadAdultos || formData.cantidadAdultos < 1) {
          errors.cantidadAdultos = "Debe haber al menos 1 adulto";
        }
        if (formData.cantidadNinos < 0) {
          errors.cantidadNinos = "La cantidad de niños no puede ser negativa";
        }
        break;
      }

      case 3: {
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
      }

      case 4: {
        if (!formData.contactoEmergencia?.nombre?.trim()) {
          errors.contactoNombre =
            "Nombre del contacto de emergencia es requerido";
        }

        const telefonoEmergencia =
          formData.contactoEmergencia?.telefono?.trim();
        if (telefonoEmergencia) {
          const phoneRegexSimple = /^\d{7,15}$/;
          const phoneRegexWithCode = /^\+\d{1,4}\s\d{7,15}$/;

          if (
            !phoneRegexSimple.test(telefonoEmergencia) &&
            !phoneRegexWithCode.test(telefonoEmergencia)
          ) {
            errors.contactoTelefono =
              "Teléfono del contacto de emergencia inválido";
          }
        } else {
          errors.contactoTelefono =
            "Teléfono del contacto de emergencia es requerido";
        }
        break;
      }
    }

    setStepErrors(errors);
    return Object.keys(errors).length === 0;
  }, [currentStep, formData]);

  // Navegación
  const nextStep = useCallback(() => {
    if (validateCurrentStep()) {
      setCurrentStep((prev) => Math.min(prev + 1, 4));
    }
  }, [validateCurrentStep]);

  const prevStep = useCallback(() => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  }, []);

  const handleCloseModal = useCallback(() => {
    setShowModal(false);
  }, [setShowModal]);

  // Cambios en counts
  const handleAdultosChange = useCallback(
    (value: number) => {
      setFormData((prev) => {
        const adultos: Person[] = Array.from({ length: value }).map((_, i) => {
          return (
            prev.adultos?.[i] ?? {
              nombre: "",
              tipoDocumento: "",
              numeroDocumento: "",
            }
          );
        });
        return { ...prev, cantidadAdultos: value, adultos };
      });
    },
    [setFormData]
  );

  const handleNinosChange = useCallback(
    (value: number) => {
      setFormData((prev) => {
        const ninos: Person[] = Array.from({ length: value }).map((_, i) => {
          return (
            prev.ninos?.[i] ?? {
              nombre: "",
              tipoDocumento: "",
              numeroDocumento: "",
            }
          );
        });
        return { ...prev, cantidadNinos: value, ninos };
      });
    },
    [setFormData]
  );

  const updatePersonData = useCallback(
    (
      type: "adultos" | "ninos",
      index: number,
      field: keyof Person,
      value: string
    ) => {
      setFormData((prev) => {
        const list = [...(prev[type] || [])];
        list[index] = { ...list[index], [field]: value } as Person;
        return { ...prev, [type]: list } as ReservationFormData;
      });
    },
    [setFormData]
  );

  // Contenido de steps memoizado
  const stepContent = useMemo(() => {
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
  }, [
    currentStep,
    formData,
    handleInputChange,
    selectedDate,
    handleDateSelect,
    availableDates,
    stepErrors,
    handleAdultosChange,
    handleNinosChange,
    updatePersonData,
    setFormData,
  ]);

  // Formatear fecha para email
  const getFormattedDateForEmail = useCallback((): string => {
    if (!formData.fecha) return "";
    try {
      const date = new Date(formData.fecha);
      if (isNaN(date.getTime())) return "";
      return `${date.getDate().toString().padStart(2, "0")}/${(
        date.getMonth() + 1
      )
        .toString()
        .padStart(2, "0")}/${date.getFullYear()}`;
    } catch {
      return "";
    }
  }, [formData.fecha]);

  // Animación según dispositivo
  const animationConfig = useMemo(() => {
    if (isMobile) {
      return {
        initial: { scale: 0.98, opacity: 0 },
        animate: { scale: 1, opacity: 1 },
        exit: { scale: 0.98, opacity: 0 },
        transition: { duration: 0.2 },
      };
    }
    return {
      initial: { scale: 0.95, opacity: 0 },
      animate: { scale: 1, opacity: 1 },
      exit: { scale: 0.95, opacity: 0 },
      transition: { duration: 0.3 },
    };
  }, [isMobile]);

  const particleCount = isMobile ? 8 : 15;

  return (
    <div
      className="w-full h-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col touch-manipulation"
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-32 sm:w-48 md:w-96 h-32 sm:h-48 md:h-96 bg-cyan-500/10 rounded-full filter blur-3xl" />
        <div className="absolute bottom-0 left-0 w-32 sm:w-48 md:w-96 h-32 sm:h-48 md:h-96 bg-purple-500/10 rounded-full filter blur-3xl" />
        {[...Array(particleCount)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-gradient-to-r from-cyan-400/5 to-purple-500/5"
            initial={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              width: `${Math.random() * 4 + 2}px`,
              height: `${Math.random() * 4 + 2}px`,
              opacity: 0,
            }}
            animate={{ opacity: [0, 0.8, 0], scale: [0.5, 1.5, 0.5] }}
            transition={{
              duration: Math.random() * (isMobile ? 4 : 6) + (isMobile ? 3 : 4),
              repeat: Infinity,
              delay: Math.random() * 3,
            }}
            style={{
              contain: "layout style paint",
              willChange: "transform, opacity",
            }}
          />
        ))}
      </div>

      {/* Header */}
      <div className="relative z-20 flex items-center justify-between p-3 sm:p-4 lg:p-6 border-b border-slate-700/50 backdrop-blur-sm flex-shrink-0">
        <div className="flex-1">
          <h1 className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
            Reserva tu Tour
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-1 truncate max-w-xs sm:max-w-md">
            {tour.nombre}
          </p>
        </div>

        <button
          type="button"
          onClick={handleCloseModal}
          className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-full bg-slate-800/80 hover:bg-slate-700/80 active:bg-slate-600/80 border border-slate-600/50 transition-colors backdrop-blur-sm touch-manipulation flex-shrink-0"
          aria-label="Cerrar modal"
          style={{ WebkitTapHighlightColor: "transparent" }}
        >
          <XIcon className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400" />
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div
          className="flex-1 overflow-y-auto overflow-x-hidden"
          style={{
            WebkitOverflowScrolling: "touch",
            overscrollBehavior: "contain",
          }}
        >
          <div className="p-3 sm:p-4 lg:p-6">
            <motion.div
              {...animationConfig}
              className="w-full max-w-4xl mx-auto"
              role="dialog"
              aria-modal="true"
              aria-label="Formulario de reserva"
            >
              <div className="relative bg-slate-800/40 border border-cyan-400/20 rounded-2xl shadow-2xl backdrop-blur-xl overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-purple-500/5" />
                <div className="relative z-10 p-4 sm:p-6 lg:p-8">
                  {!showWhatsApp ? (
                    <>
                      {/* Progress Steps */}
                      <div className="mb-6 sm:mb-8 text-center">
                        <div className="flex items-center justify-center gap-1 sm:gap-2 mb-3 sm:mb-4 overflow-x-auto pb-2">
                          {[1, 2, 3, 4].map((step) => (
                            <div
                              key={step}
                              className="flex items-center flex-shrink-0"
                            >
                              <div
                                className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold transition-all duration-300 ${
                                  currentStep >= step
                                    ? "bg-gradient-to-r from-cyan-500 to-cyan-400 text-slate-900 shadow-lg shadow-cyan-500/30"
                                    : "bg-slate-700/50 text-cyan-400 border border-slate-600/50"
                                }`}
                                style={{ contain: "layout style paint" }}
                              >
                                {step}
                              </div>
                              {step < 4 && (
                                <div
                                  className={`w-4 sm:w-8 h-1 mx-1 sm:mx-2 rounded transition-all duration-300 flex-shrink-0 ${
                                    currentStep > step
                                      ? "bg-gradient-to-r from-cyan-500 to-cyan-400"
                                      : "bg-slate-700/50"
                                  }`}
                                />
                              )}
                            </div>
                          ))}
                        </div>
                        <p className="text-cyan-400 text-xs sm:text-sm font-medium">
                          Paso {currentStep} de 4
                        </p>
                      </div>

                      {/* Form */}
                      <form
                        ref={formRef}
                        onSubmit={(e) => {
                          e.preventDefault();
                          if (currentStep === 4 && validateCurrentStep()) {
                            sendEmail(e);
                          }
                        }}
                        className="space-y-4 sm:space-y-6"
                        noValidate
                      >
                        {/* Hidden Fields for EmailJS */}
                        <input
                          type="hidden"
                          name="tour"
                          value={tour.nombre || ""}
                        />
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
                        <input
                          type="hidden"
                          name="cantidadAdultos"
                          value={(formData.cantidadAdultos || 0).toString()}
                        />
                        <input
                          type="hidden"
                          name="cantidadNinos"
                          value={(formData.cantidadNinos || 0).toString()}
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

                        {/* Step Content */}
                        <div className="min-h-[250px] sm:min-h-[300px] lg:min-h-[400px]">
                          {stepContent}
                        </div>

                        {/* Navigation Buttons */}
                        <div className="flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-4 pt-4 sm:pt-6 border-t border-slate-700/50">
                          <div className="flex gap-2 sm:gap-3 order-2 sm:order-1">
                            <button
                              type="button"
                              onClick={handleCloseModal}
                              className="px-4 sm:px-6 py-2 sm:py-3 border border-slate-600/50 text-slate-300 hover:bg-slate-700/50 active:bg-slate-600/50 rounded-xl transition-colors backdrop-blur-sm text-sm sm:text-base touch-manipulation"
                              style={{ WebkitTapHighlightColor: "transparent" }}
                            >
                              Cancelar
                            </button>

                            {currentStep > 1 && (
                              <button
                                type="button"
                                onClick={prevStep}
                                className="px-4 sm:px-6 py-2 sm:py-3 bg-slate-700/50 hover:bg-slate-600/50 active:bg-slate-500/50 text-slate-200 rounded-xl transition-colors backdrop-blur-sm border border-slate-600/50 text-sm sm:text-base touch-manipulation"
                                style={{
                                  WebkitTapHighlightColor: "transparent",
                                }}
                              >
                                Anterior
                              </button>
                            )}
                          </div>

                          <div className="order-1 sm:order-2">
                            {currentStep < 4 ? (
                              <button
                                type="button"
                                onClick={nextStep}
                                className="px-6 sm:px-8 py-2 sm:py-3 bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400 active:from-cyan-700 active:to-cyan-600 text-slate-900 font-semibold rounded-xl transition-all duration-300 shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 text-sm sm:text-base touch-manipulation"
                                style={{
                                  WebkitTapHighlightColor: "transparent",
                                }}
                              >
                                Siguiente
                              </button>
                            ) : (
                              <button
                                type="submit"
                                disabled={isSubmitting || hasSubmitted}
                                className={`px-6 sm:px-8 py-2 sm:py-3 font-semibold rounded-xl transition-all duration-300 text-sm sm:text-base touch-manipulation ${
                                  isSubmitting || hasSubmitted
                                    ? "bg-slate-600 text-slate-400 cursor-not-allowed"
                                    : "bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400 active:from-cyan-700 active:to-cyan-600 text-slate-900 shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40"
                                }`}
                                style={{
                                  WebkitTapHighlightColor: "transparent",
                                }}
                              >
                                {isSubmitting ? (
                                  <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 sm:w-4 sm:h-4 border-t-2 border-slate-900 rounded-full animate-spin" />
                                    Procesando...
                                  </div>
                                ) : hasSubmitted ? (
                                  "Información enviada"
                                ) : (
                                  "Completar reserva"
                                )}
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
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="relative z-20 text-center p-2 sm:p-3 border-t border-slate-700/50 backdrop-blur-sm flex-shrink-0">
        <p className="text-xs text-slate-500">
          Tu información está segura con nosotros. Reservas 100% protegidas.
        </p>
      </div>
    </div>
  );
}
