"use client";

import { motion } from "framer-motion";
import { X as XIcon, CheckCircle } from "lucide-react";
import { useState } from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import Step1BasicInfo from "./Step1BasicInfo";
import Step2PeopleCount from "./Step2PeopleCount";
import Step3Participants from "./Step3Participants";
import Step4EmergencyContact from "./Step4EmergencyContact";
import {
  validateBasicInfo,
  validatePeopleCount,
  validateParticipants,
  validateEmergencyContact,
} from "../../../utils/validation";

interface Person {
  nombre: string;
  tipoDocumento: string;
  numeroDocumento: string;
}

interface EmergencyContact {
  nombre: string;
  telefono: string;
}

interface FormData {
  fecha?: string;
  nombre: string;
  telefono: string;
  correo: string;
  cantidadAdultos?: number;
  cantidadNinos?: number;
  adultos?: Person[];
  ninos?: Person[];
  contactoEmergencia?: EmergencyContact;
}

interface Tour {
  nombre: string;
}

interface ReservationFormProps {
  tour: Tour;
  formRef: React.RefObject<HTMLFormElement>;
  sendEmail: (e: React.FormEvent<HTMLFormElement>) => void;
  isSubmitting: boolean;
  hasSubmitted: boolean;
  setShowModal: (show: boolean) => void;
  availableDates: Date[];
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
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
  const [stepErrors, setStepErrors] = useState<{ [key: string]: string }>({});

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setFormData((prev) => ({ ...prev, fecha: date.toISOString() }));
  };

  const validateCurrentStep = () => {
    let errors: { [key: string]: string } = {};

    switch (currentStep) {
      case 1:
        errors = validateBasicInfo(formData);
        break;
      case 2:
        errors = validatePeopleCount(formData);
        break;
      case 3:
        errors = validateParticipants(formData);
        break;
      case 4:
        errors = validateEmergencyContact(formData);
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
      const adultos = Array(value)
        .fill(null)
        .map(
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
      const ninos = Array(value)
        .fill(null)
        .map(
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
    field: string,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      [type]: (prev[type] || []).map((person, i) =>
        i === index ? { ...person, [field]: value } : person
      ),
    }));
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
          <Step3Participants
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

  const generateWhatsAppMessage = () => {
    const fechaFormatted = formData.fecha
      ? format(new Date(formData.fecha), "PPP", { locale: es })
      : "Por definir";

    let message = `¡Hola! Me interesa hacer una reserva para el tour: *${tour.nombre}*\n\n`;
    message += `📋 *Información del contacto:*\n`;
    message += `• Nombre: ${formData.nombre}\n`;
    message += `• Teléfono: ${formData.telefono}\n`;
    message += `• Correo: ${formData.correo}\n`;
    message += `• Fecha deseada: ${fechaFormatted}\n\n`;

    message += `👥 *Participantes:*\n`;
    message += `• Adultos: ${formData.cantidadAdultos || 0}\n`;
    message += `• Niños: ${formData.cantidadNinos || 0}\n`;
    message += `• Total: ${(formData.cantidadAdultos || 0) + (formData.cantidadNinos || 0)}\n\n`;

    if (formData.adultos && formData.adultos.length > 0) {
      message += `👤 *Datos adultos:*\n`;
      formData.adultos.forEach((adulto, i) => {
        message += `${i + 1}. ${adulto.nombre} (${adulto.tipoDocumento}: ${adulto.numeroDocumento})\n`;
      });
      message += `\n`;
    }

    if (formData.ninos && formData.ninos.length > 0) {
      message += `👶 *Datos niños:*\n`;
      formData.ninos.forEach((nino, i) => {
        message += `${i + 1}. ${nino.nombre} (${nino.tipoDocumento}: ${nino.numeroDocumento})\n`;
      });
      message += `\n`;
    }

    message += `🚨 *Contacto de emergencia:*\n`;
    message += `• Nombre: ${formData.contactoEmergencia?.nombre || ""}\n`;
    message += `• Teléfono: ${formData.contactoEmergencia?.telefono || ""}\n\n`;

    message += `¿Podrías confirmarme la disponibilidad y el proceso de reserva? ¡Gracias!`;

    return encodeURIComponent(message);
  };

  const handleWhatsAppClick = () => {
    const whatsappNumber = "+573245340651";
    const message = generateWhatsAppMessage();
    const whatsappUrl = `https://wa.me/${whatsappNumber.replace("+", "")}?text=${message}`;
    window.open(whatsappUrl, "_blank");
  };

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.8, opacity: 0 }}
      className="bg-gradient-to-br from-gray-900 to-black border-2 border-yellow-500/30 rounded-3xl shadow-2xl text-center space-y-6 relative overflow-hidden
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
        <XIcon className="w-5 h-5 text-gray-400" />
      </button>

      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-yellow-500 rounded-full filter blur-[80px] opacity-20" />
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-emerald-500 rounded-full filter blur-[100px] opacity-15" />
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
                          ? "bg-yellow-500 text-gray-900"
                          : "bg-gray-700 text-gray-400"
                      }`}
                    >
                      {step}
                    </div>
                    {step < 4 && (
                      <div
                        className={`w-6 h-1 mx-1 ${
                          currentStep > step ? "bg-yellow-500" : "bg-gray-700"
                        }`}
                      />
                    )}
                  </div>
                ))}
              </div>
              <p className="text-gray-400 text-sm">Paso {currentStep} de 4</p>
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
              <input type="hidden" name="tour" value={tour.nombre} />

              {renderStepContent()}

              <div className="pt-6 flex flex-col sm:flex-row justify-between gap-3">
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-3 border border-gray-600 rounded-xl text-gray-300 hover:bg-gray-800 transition text-sm sm:text-base"
                  >
                    Cancelar
                  </button>

                  {currentStep > 1 && (
                    <button
                      type="button"
                      onClick={prevStep}
                      className="px-4 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-xl transition text-sm sm:text-base"
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
                      className="px-6 py-3 bg-gradient-to-r from-yellow-500 to-yellow-600 text-gray-900 hover:from-yellow-400 hover:to-yellow-500 rounded-xl font-semibold transition text-sm sm:text-base"
                    >
                      Siguiente
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={isSubmitting || hasSubmitted}
                      className={`px-6 py-3 rounded-xl font-semibold transition relative overflow-hidden text-sm sm:text-base ${
                        isSubmitting || hasSubmitted
                          ? "bg-yellow-300 text-gray-900 cursor-not-allowed"
                          : "bg-gradient-to-r from-yellow-500 to-yellow-600 text-gray-900 hover:from-yellow-400 hover:to-yellow-500"
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
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6 pt-6"
          >
            <div className="text-center">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-green-400 mb-2">
                ¡Información Completa!
              </h2>
              <p className="text-gray-400 text-sm mb-6">
                Toda la información ha sido recopilada. Ahora contacta por
                WhatsApp para confirmar tu reserva
              </p>
            </div>

            <div className="bg-gray-800/50 rounded-xl p-4 text-left space-y-3 max-w-2xl mx-auto max-h-64 overflow-y-auto">
              <h3 className="text-yellow-400 font-bold mb-3 text-center">
                Resumen de tu reserva
              </h3>

              <div className="space-y-2 text-sm text-gray-300">
                <p>
                  <span className="text-yellow-400">Tour:</span> {tour.nombre}
                </p>
                <p>
                  <span className="text-yellow-400">Contacto:</span>{" "}
                  {formData.nombre}
                </p>
                <p>
                  <span className="text-yellow-400">Teléfono:</span>{" "}
                  {formData.telefono}
                </p>
                <p>
                  <span className="text-yellow-400">Correo:</span>{" "}
                  {formData.correo}
                </p>
                <p>
                  <span className="text-yellow-400">Fecha:</span>{" "}
                  {formData.fecha
                    ? format(new Date(formData.fecha), "PPP", { locale: es })
                    : "Por definir"}
                </p>
                <p>
                  <span className="text-yellow-400">Participantes:</span>{" "}
                  {formData.cantidadAdultos || 0} adultos,{" "}
                  {formData.cantidadNinos || 0} niños
                </p>

                {formData.adultos && formData.adultos.length > 0 && (
                  <div>
                    <p className="text-yellow-400 font-semibold">Adultos:</p>
                    {formData.adultos.map((adulto, i) => (
                      <p key={i} className="ml-2">
                        • {adulto.nombre} ({adulto.tipoDocumento}:{" "}
                        {adulto.numeroDocumento})
                      </p>
                    ))}
                  </div>
                )}

                {formData.ninos && formData.ninos.length > 0 && (
                  <div>
                    <p className="text-yellow-400 font-semibold">Niños:</p>
                    {formData.ninos.map((nino, i) => (
                      <p key={i} className="ml-2">
                        • {nino.nombre} ({nino.tipoDocumento}:{" "}
                        {nino.numeroDocumento})
                      </p>
                    ))}
                  </div>
                )}

                <p>
                  <span className="text-yellow-400">Contacto emergencia:</span>{" "}
                  {formData.contactoEmergencia?.nombre || ""} -{" "}
                  {formData.contactoEmergencia?.telefono || ""}
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
              <button
                type="button"
                onClick={() => {
                  setShowWhatsApp(false);
                  setCurrentStep(1);
                }}
                className="flex-1 px-4 py-3 border border-gray-600 rounded-xl text-gray-300 hover:bg-gray-800 transition text-sm sm:text-base"
              >
                Editar información
              </button>
              <button
                type="button"
                onClick={handleWhatsAppClick}
                className="flex-1 px-6 py-3 bg-green-600 hover:bg-green-500 text-white rounded-xl font-semibold transition-colors flex items-center justify-center gap-2 text-sm sm:text-base"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.510-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.703" />
                </svg>
                Contactar por WhatsApp
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
