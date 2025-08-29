"use client";

import { FaCheckCircle, FaWhatsapp } from "react-icons/fa";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Tour } from "../../../../../../../../data/toursData";
import { ReservationFormData } from "./types";

interface SuccessStepProps {
  tour: Tour;
  formData: ReservationFormData;
  setShowWhatsApp: (show: boolean) => void;
  setCurrentStep: (step: number) => void;
}

export default function SuccessStep({
  tour,
  formData,
  setShowWhatsApp,
  setCurrentStep,
}: SuccessStepProps) {
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

    if (formData.adultos?.length > 0) {
      message += `👤 *Datos adultos:*\n`;
      formData.adultos.forEach((adulto, i) => {
        message += `${i + 1}. ${adulto.nombre} (${adulto.tipoDocumento}: ${adulto.numeroDocumento})\n`;
      });
      message += `\n`;
    }

    if (formData.ninos?.length > 0) {
      message += `👶 *Datos niños:*\n`;
      formData.ninos.forEach((nino, i) => {
        message += `${i + 1}. ${nino.nombre} (${nino.tipoDocumento}: ${nino.numeroDocumento})\n`;
      });
      message += `\n`;
    }

    message += `🚨 *Contacto de emergencia:*\n`;
    message += `• Nombre: ${formData.contactoEmergencia?.nombre}\n`;
    message += `• Teléfono: ${formData.contactoEmergencia?.telefono}\n\n`;

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
    <div className="space-y-6 pt-6">
      <div className="text-center">
        <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <FaCheckCircle className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-green-400 mb-2">
          ¡Información Completa!
        </h2>
        <p className="text-cyan-400 text-sm mb-6">
          Toda la información ha sido recopilada. Ahora contacta por WhatsApp
          para confirmar tu reserva
        </p>
      </div>

      <div className="bg-gray-800/50 rounded-xl p-4 text-left space-y-3 max-w-2xl mx-auto max-h-64 overflow-y-auto">
        <h3 className="text-cyan-400 font-bold mb-3 text-center">
          Resumen de tu reserva
        </h3>

        <div className="space-y-2 text-sm text-cyan-300">
          <p>
            <span className="text-cyan-400">Tour:</span> {tour.nombre}
          </p>
          <p>
            <span className="text-cyan-400">Contacto:</span> {formData.nombre}
          </p>
          <p>
            <span className="text-cyan-400">Teléfono:</span> {formData.telefono}
          </p>
          <p>
            <span className="text-cyan-400">Correo:</span> {formData.correo}
          </p>
          <p>
            <span className="text-cyan-400">Fecha:</span>{" "}
            {formData.fecha
              ? format(new Date(formData.fecha), "PPP", { locale: es })
              : "Por definir"}
          </p>
          <p>
            <span className="text-cyan-400">Participantes:</span>{" "}
            {formData.cantidadAdultos || 0} adultos,{" "}
            {formData.cantidadNinos || 0} niños
          </p>

          {formData.adultos?.length > 0 && (
            <div>
              <p className="text-cyan-400 font-semibold">Adultos:</p>
              {formData.adultos.map((adulto, i) => (
                <p key={i} className="ml-2">
                  • {adulto.nombre} ({adulto.tipoDocumento}:{" "}
                  {adulto.numeroDocumento})
                </p>
              ))}
            </div>
          )}

          {formData.ninos?.length > 0 && (
            <div>
              <p className="text-cyan-400 font-semibold">Niños:</p>
              {formData.ninos.map((nino, i) => (
                <p key={i} className="ml-2">
                  • {nino.nombre} ({nino.tipoDocumento}: {nino.numeroDocumento})
                </p>
              ))}
            </div>
          )}

          <p>
            <span className="text-cyan-400">Contacto emergencia:</span>{" "}
            {formData.contactoEmergencia?.nombre} -{" "}
            {formData.contactoEmergencia?.telefono}
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
          className="flex-1 px-4 py-3 border border-cyan-500/30 rounded-xl text-cyan-300 hover:bg-gray-800 transition text-sm sm:text-base"
        >
          Editar información
        </button>
        <button
          type="button"
          onClick={handleWhatsAppClick}
          className="flex-1 px-6 py-3 bg-green-600 hover:bg-green-500 text-white rounded-xl font-semibold transition-colors flex items-center justify-center gap-2 text-sm sm:text-base"
        >
          <FaWhatsapp className="w-5 h-5" />
          Contactar por WhatsApp
        </button>
      </div>
    </div>
  );
}
