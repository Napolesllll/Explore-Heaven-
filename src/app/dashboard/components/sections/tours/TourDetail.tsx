"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Tour } from "../../../../../data/toursData";
import {
  FaCalendarAlt,
  FaUserAlt,
  FaEnvelope,
  FaRocket,
  FaCheckCircle,
  FaSpinner,
  FaWhatsapp,
} from "react-icons/fa";
import emailjs from "@emailjs/browser";
import toast from "react-hot-toast";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
  isAfter,
  startOfToday,
} from "date-fns";
import { es } from "date-fns/locale";
import {
  CheckCircle,
  X as XIcon,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

// Plugin para el carrusel (si es necesario)
function AutoSlidePlugin(slider: any) {
  let timeout: any;
  let mouseOver = false;
  const autoplaySpeed = 4000;

  const clearNextTimeout = () => clearTimeout(timeout);

  function nextTimeout() {
    clearNextTimeout();
    if (mouseOver) return;
    timeout = setTimeout(() => {
      slider.next();
    }, autoplaySpeed);
  }

  slider.on("created", () => {
    slider.container.addEventListener("mouseover", () => {
      mouseOver = true;
      clearNextTimeout();
    });
    slider.container.addEventListener("mouseout", () => {
      mouseOver = false;
      nextTimeout();
    });
    nextTimeout();
  });

  slider.on("dragStarted", clearNextTimeout);
  slider.on("animationEnded", nextTimeout);
  slider.on("updated", nextTimeout);
  slider.on("destroyed", clearNextTimeout);
}

// Componente de calendario
function DateCalendar({
  selectedDate,
  onDateSelect,
  availableDates,
}: {
  selectedDate: Date | null;
  onDateSelect: (date: Date) => void;
  availableDates: Date[];
}) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const today = startOfToday();

  const firstDayCurrentMonth = startOfMonth(currentMonth);
  const lastDayCurrentMonth = endOfMonth(currentMonth);
  const daysInMonth = eachDayOfInterval({
    start: firstDayCurrentMonth,
    end: lastDayCurrentMonth,
  });

  const startDate = new Date(firstDayCurrentMonth);
  startDate.setDate(startDate.getDate() - firstDayCurrentMonth.getDay());

  const endDate = new Date(lastDayCurrentMonth);
  endDate.setDate(endDate.getDate() + (6 - lastDayCurrentMonth.getDay()));

  const allDays = eachDayOfInterval({ start: startDate, end: endDate });

  const isDateAvailable = (date: Date) => {
    return availableDates.some((availableDate) =>
      isSameDay(date, availableDate)
    );
  };

  const goToPreviousMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const goToNextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  return (
    <div className="bg-gray-800 border border-cyan-500/30 rounded-xl p-4">
      <div className="flex items-center justify-between mb-4">
        <button
          type="button"
          onClick={goToPreviousMonth}
          className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
        >
          <ChevronLeft className="w-5 h-5 text-cyan-400" />
        </button>
        <h3 className="text-lg font-semibold text-cyan-100">
          {format(currentMonth, "MMMM yyyy", { locale: es })}
        </h3>
        <button
          type="button"
          onClick={goToNextMonth}
          className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
        >
          <ChevronRight className="w-5 h-5 text-cyan-400" />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2">
        {["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"].map((day) => (
          <div
            key={day}
            className="text-center text-sm font-medium text-cyan-400 py-2"
          >
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {allDays.map((day) => {
          const isCurrentMonth = isSameMonth(day, currentMonth);
          const isToday = isSameDay(day, today);
          const isSelected = selectedDate && isSameDay(day, selectedDate);
          const isAvailable = isDateAvailable(day);
          const isPastDate = !isAfter(day, today) && !isSameDay(day, today);

          return (
            <button
              key={day.toString()}
              type="button"
              onClick={() =>
                isAvailable &&
                isCurrentMonth &&
                !isPastDate &&
                onDateSelect(day)
              }
              disabled={!isAvailable || !isCurrentMonth || isPastDate}
              className={`
                relative p-2 text-sm rounded-lg transition-all duration-200
                ${!isCurrentMonth ? "text-gray-600" : ""}
                ${isPastDate ? "text-gray-600 cursor-not-allowed" : ""}
                ${
                  isAvailable && isCurrentMonth && !isPastDate
                    ? "text-cyan-100 hover:bg-cyan-500/20 cursor-pointer"
                    : !isPastDate && isCurrentMonth
                      ? "text-gray-500 cursor-not-allowed"
                      : ""
                }
                ${isSelected ? "bg-cyan-500 text-gray-900 font-semibold" : ""}
                ${isToday && !isSelected ? "ring-2 ring-cyan-400" : ""}
              `}
            >
              {format(day, "d")}
              {isAvailable && isCurrentMonth && !isPastDate && (
                <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-cyan-400 rounded-full"></div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// Componente del formulario de reserva
function ReservationForm({
  tour,
  formRef,
  errors,
  validateForm,
  sendEmail,
  isSubmitting,
  hasSubmitted,
  setShowModal,
  availableDates,
  formData,
  setFormData,
  showWhatsApp,
  setShowWhatsApp,
}: {
  tour: any;
  formRef: React.RefObject<HTMLFormElement>;
  errors: { [key: string]: string };
  validateForm: () => boolean;
  sendEmail: (e: React.FormEvent<HTMLFormElement>) => void;
  isSubmitting: boolean;
  hasSubmitted: boolean;
  setShowModal: (show: boolean) => void;
  availableDates: Date[];
  formData: any;
  setFormData: (data: any) => void;
  showWhatsApp: boolean;
  setShowWhatsApp: (show: boolean) => void;
}) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(
    formData.fecha ? new Date(formData.fecha) : null
  );
  const [currentStep, setCurrentStep] = useState(1);
  const [stepErrors, setStepErrors] = useState<{ [key: string]: string }>({});

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setFormData((prev: any) => ({ ...prev, fecha: date.toISOString() }));
  };

  const validateCurrentStep = () => {
    const errors: { [key: string]: string } = {};
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
    setFormData((prev: any) => {
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
    setFormData((prev: any) => {
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
    setFormData((prev: any) => ({
      ...prev,
      [type]: prev[type].map((person: any, i: number) =>
        i === index ? { ...person, [field]: value } : person
      ),
    }));
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-5">
            <div className="text-center mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-cyan-400">
                Información básica
              </h2>
              <p className="text-cyan-400 text-sm mt-2">
                Comencemos con tus datos principales
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <FaUserAlt className="w-5 h-5 text-cyan-500" />
                </div>
                <input
                  type="text"
                  name="nombre"
                  value={formData.nombre || ""}
                  onChange={handleInputChange}
                  placeholder="Nombre completo"
                  className="w-full bg-gray-800 border border-cyan-500/30 rounded-xl px-4 py-3 pl-10 text-cyan-100 placeholder-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 text-sm sm:text-base"
                />
                {stepErrors.nombre && (
                  <p className="text-red-400 text-sm mt-1">
                    {stepErrors.nombre}
                  </p>
                )}
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <FaEnvelope className="w-5 h-5 text-cyan-500" />
                </div>
                <input
                  type="tel"
                  name="telefono"
                  value={formData.telefono || ""}
                  onChange={handleInputChange}
                  placeholder="Teléfono"
                  className="w-full bg-gray-800 border border-cyan-500/30 rounded-xl px-4 py-3 pl-10 text-cyan-100 placeholder-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 text-sm sm:text-base"
                />
                {stepErrors.telefono && (
                  <p className="text-red-400 text-sm mt-1">
                    {stepErrors.telefono}
                  </p>
                )}
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <FaEnvelope className="w-5 h-5 text-cyan-500" />
              </div>
              <input
                type="email"
                name="correo"
                value={formData.correo || ""}
                onChange={handleInputChange}
                placeholder="Correo electrónico"
                className="w-full bg-gray-800 border border-cyan-500/30 rounded-xl px-4 py-3 pl-10 text-cyan-100 placeholder-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 text-sm sm:text-base"
              />
              {stepErrors.correo && (
                <p className="text-red-400 text-sm mt-1">{stepErrors.correo}</p>
              )}
            </div>

            <div className="space-y-3">
              <label className="flex items-center gap-2 text-cyan-400 font-medium text-sm sm:text-base">
                <FaCalendarAlt className="w-5 h-5" />
                Selecciona una fecha
              </label>
              {availableDates?.length > 0 ? (
                <div className="overflow-hidden">
                  <DateCalendar
                    selectedDate={selectedDate}
                    onDateSelect={handleDateSelect}
                    availableDates={availableDates}
                  />
                </div>
              ) : (
                <div className="text-cyan-500 py-4 text-center">
                  <p className="text-sm sm:text-base">
                    No hay fechas disponibles
                  </p>
                </div>
              )}
              {stepErrors.fecha && (
                <p className="text-red-400 text-sm mt-1">{stepErrors.fecha}</p>
              )}
              {selectedDate && (
                <div className="text-center text-sm text-cyan-300 bg-gray-800/50 rounded-lg p-2">
                  Fecha seleccionada:{" "}
                  {format(selectedDate, "PPP", { locale: es })}
                </div>
              )}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-5">
            <div className="text-center mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-cyan-400">
                ¿Cuántas personas van?
              </h2>
              <p className="text-cyan-400 text-sm mt-2">
                Especifica la cantidad de adultos y niños
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-800/50 p-4 rounded-xl">
                <label className="block text-cyan-400 font-medium mb-3">
                  👥 Adultos (18+ años)
                </label>
                <select
                  value={formData.cantidadAdultos || 1}
                  onChange={(e) => handleAdultosChange(Number(e.target.value))}
                  className="w-full bg-gray-700 border border-cyan-500/30 rounded-lg px-3 py-2 text-cyan-100 focus:ring-2 focus:ring-cyan-500"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                    <option key={num} value={num}>
                      {num} {num === 1 ? "adulto" : "adultos"}
                    </option>
                  ))}
                </select>
                {stepErrors.cantidadAdultos && (
                  <p className="text-red-400 text-sm mt-1">
                    {stepErrors.cantidadAdultos}
                  </p>
                )}
              </div>

              <div className="bg-gray-800/50 p-4 rounded-xl">
                <label className="block text-cyan-400 font-medium mb-3">
                  👶 Niños (0-17 años)
                </label>
                <select
                  value={formData.cantidadNinos || 0}
                  onChange={(e) => handleNinosChange(Number(e.target.value))}
                  className="w-full bg-gray-700 border border-cyan-500/30 rounded-lg px-3 py-2 text-cyan-100 focus:ring-2 focus:ring-cyan-500"
                >
                  {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                    <option key={num} value={num}>
                      {num} {num === 1 ? "niño" : "niños"}
                    </option>
                  ))}
                </select>
                {stepErrors.cantidadNinos && (
                  <p className="text-red-400 text-sm mt-1">
                    {stepErrors.cantidadNinos}
                  </p>
                )}
              </div>
            </div>

            <div className="text-center bg-gray-800/30 rounded-lg p-4">
              <p className="text-cyan-300">
                <span className="text-cyan-400 font-semibold">
                  Total de personas:{" "}
                </span>
                {(formData.cantidadAdultos || 1) +
                  (formData.cantidadNinos || 0)}
              </p>
            </div>
          </div>
        );

      case 3:
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
              {formData.adultos?.map((adulto: any, index: number) => (
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
                          updatePersonData(
                            "adultos",
                            index,
                            "nombre",
                            e.target.value
                          )
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
                        <option value="PPT">
                          Permiso por Protección Temporal
                        </option>
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

              {formData.ninos?.map((nino: any, index: number) => (
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
                          updatePersonData(
                            "ninos",
                            index,
                            "nombre",
                            e.target.value
                          )
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
                        <option value="PPT">
                          Permiso por Protección Temporal
                        </option>
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

      case 4:
        return (
          <div className="space-y-5">
            <div className="text-center mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-cyan-400">
                Contacto de emergencia
              </h2>
              <p className="text-cyan-400 text-sm mt-2">
                Persona a contactar en caso de emergencia
              </p>
            </div>

            <div className="bg-gray-800/50 p-4 rounded-xl space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-cyan-400 font-medium mb-2">
                    Nombre completo
                  </label>
                  <input
                    type="text"
                    placeholder="Nombre del contacto de emergencia"
                    value={formData.contactoEmergencia?.nombre || ""}
                    onChange={(e) =>
                      setFormData((prev: any) => ({
                        ...prev,
                        contactoEmergencia: {
                          ...prev.contactoEmergencia,
                          nombre: e.target.value,
                        },
                      }))
                    }
                    className="w-full bg-gray-700 border border-cyan-500/30 rounded-lg px-3 py-2 text-cyan-100 placeholder-cyan-400 focus:ring-2 focus:ring-cyan-500 text-sm"
                  />
                  {stepErrors.contactoNombre && (
                    <p className="text-red-400 text-sm mt-1">
                      {stepErrors.contactoNombre}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-cyan-400 font-medium mb-2">
                    Teléfono
                  </label>
                  <input
                    type="tel"
                    placeholder="Número de teléfono"
                    value={formData.contactoEmergencia?.telefono || ""}
                    onChange={(e) =>
                      setFormData((prev: any) => ({
                        ...prev,
                        contactoEmergencia: {
                          ...prev.contactoEmergencia,
                          telefono: e.target.value,
                        },
                      }))
                    }
                    className="w-full bg-gray-700 border border-cyan-500/30 rounded-lg px-3 py-2 text-cyan-100 placeholder-cyan-400 focus:ring-2 focus:ring-cyan-500 text-sm"
                  />
                  {stepErrors.contactoTelefono && (
                    <p className="text-red-400 text-sm mt-1">
                      {stepErrors.contactoTelefono}
                    </p>
                  )}
                </div>
              </div>

              <div className="text-center text-sm text-cyan-400 bg-gray-700/50 rounded-lg p-3">
                <p className="flex items-center justify-center gap-2">
                  <FaCheckCircle className="w-4 h-4" />
                  Esta información solo se usará en caso de emergencia durante
                  el tour
                </p>
              </div>
            </div>
          </div>
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

    if (formData.adultos?.length > 0) {
      message += `👤 *Datos adultos:*\n`;
      formData.adultos.forEach((adulto: any, i: number) => {
        message += `${i + 1}. ${adulto.nombre} (${adulto.tipoDocumento}: ${adulto.numeroDocumento})\n`;
      });
      message += `\n`;
    }

    if (formData.ninos?.length > 0) {
      message += `👶 *Datos niños:*\n`;
      formData.ninos.forEach((nino: any, i: number) => {
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
              <input type="hidden" name="tour" value={tour.nombre} />

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
              <p className="text-cyan-400 text-sm mb-6">
                Toda la información ha sido recopilada. Ahora contacta por
                WhatsApp para confirmar tu reserva
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
                  <span className="text-cyan-400">Contacto:</span>{" "}
                  {formData.nombre}
                </p>
                <p>
                  <span className="text-cyan-400">Teléfono:</span>{" "}
                  {formData.telefono}
                </p>
                <p>
                  <span className="text-cyan-400">Correo:</span>{" "}
                  {formData.correo}
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
                    {formData.adultos.map((adulto: any, i: number) => (
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
                    {formData.ninos.map((nino: any, i: number) => (
                      <p key={i} className="ml-2">
                        • {nino.nombre} ({nino.tipoDocumento}:{" "}
                        {nino.numeroDocumento})
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
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

export default function TourDetail({ tour }: { tour: Tour }) {
  const [formData, setFormData] = useState({
    nombre: "",
    correo: "",
    fecha: "",
    telefono: "",
    cantidadAdultos: 1,
    cantidadNinos: 0,
    adultos: [{ nombre: "", tipoDocumento: "", numeroDocumento: "" }],
    ninos: [],
    contactoEmergencia: { nombre: "", telefono: "" },
  });
  const [isLoading, setIsLoading] = useState(false);
  const [fechasDisponibles, setFechasDisponibles] = useState<string[]>([]);
  const [activeImage, setActiveImage] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [showWhatsApp, setShowWhatsApp] = useState(false);
  const [availableDates, setAvailableDates] = useState<Date[]>([]);
  const formRef = useRef<HTMLFormElement>(null);
  const [errors, setErrors] = useState<{
    nombre?: string;
    telefono?: string;
    correo?: string;
  }>({});

  // Consultar disponibilidad de fechas
  useEffect(() => {
    const fetchFechasDisponibles = async () => {
      try {
        const res = await fetch(`/api/guias/fechas?tourId=${tour.id}`);
        if (!res.ok) {
          throw new Error(`Error ${res.status}: ${res.statusText}`);
        }
        const data = await res.json();
        setFechasDisponibles(data.fechas || []);

        // Convertir a objetos Date para el calendario
        const dates = data.fechas.map((fecha: string) => new Date(fecha));
        setAvailableDates(dates);
      } catch (error) {
        console.error("Error al obtener fechas disponibles:", error);
        // Generar fechas de ejemplo si hay error
        const dates = [];
        const today = new Date();
        for (let i = 1; i <= 60; i++) {
          const date = new Date(today);
          date.setDate(today.getDate() + i);
          dates.push(date);
        }
        setAvailableDates(dates);
      }
    };
    fetchFechasDisponibles();
  }, [tour.id]);

  function validateForm() {
    const n = formData.nombre.trim();
    const c = formData.correo.trim();
    const p = formData.telefono.trim();
    const errs: typeof errors = {};
    let ok = true;
    if (!/^[a-zA-ZÀ-ÿ\s]{2,}$/.test(n)) {
      errs.nombre = "Nombre inválido";
      ok = false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(c)) {
      errs.correo = "Correo inválido";
      ok = false;
    }
    if (!/^\d{7,15}$/.test(p)) {
      errs.telefono = "Teléfono inválido";
      ok = false;
    }
    setErrors(errs);
    return ok;
  }

  async function sendEmail(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!validateForm() || isSubmitting || hasSubmitted) return;
    setIsSubmitting(true);
    setHasSubmitted(true);

    try {
      await emailjs.sendForm(
        "service_48b978l",
        "template_uk4drlm",
        formRef.current!,
        "Bl8NYZsWuRuNA-Jbi"
      );

      // Guardar datos de reserva en localStorage
      const reserva = {
        tourName: tour.nombre,
        date: formData.fecha || "",
        amount: tour.precio,
        reference: Date.now().toString(),
        email: formData.correo,
      };
      localStorage.setItem("last_reservation", JSON.stringify(reserva));

      toast.success("Información recopilada correctamente");
      setShowWhatsApp(true);
    } catch (error) {
      console.error(error);
      toast.error("Error procesando información");
      setIsSubmitting(false);
      setHasSubmitted(false);
    }
  }

  // Animaciones
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <div className="relative min-h-screen py-12 px-4 bg-gradient-to-br from-[#0c0f1d] via-[#151b35] to-[#0c0f1d]">
      {/* Efecto de partículas galácticas */}
      <div className="fixed inset-0 overflow-hidden -z-10">
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-gradient-to-r from-cyan-400/10 to-purple-500/10"
            initial={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              width: `${Math.random() * 6 + 2}px`,
              height: `${Math.random() * 6 + 2}px`,
              opacity: 0,
            }}
            animate={{
              opacity: [0, 0.5, 0],
              scale: [0, 1, 0],
            }}
            transition={{
              duration: Math.random() * 6 + 4,
              repeat: Infinity,
              delay: Math.random() * 3,
            }}
          />
        ))}
      </div>

      <div className="max-w-5xl mx-auto">
        {/* Cabecera con título y precio */}
        <motion.div
          className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500 mb-2">
              {tour.nombre}
            </h1>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 bg-gradient-to-r from-cyan-600 to-purple-600 text-white text-sm px-3 py-1 rounded-full">
                <FaRocket className="text-cyan-300" />
                <span>{tour.duracion}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-end">
            <span className="text-gray-400 text-sm">Desde</span>
            <span className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-500">
              {tour.precio}
            </span>
          </div>
        </motion.div>

        {/* Imagen principal */}
        <motion.div
          className="relative h-96 rounded-2xl overflow-hidden mb-10 border-2 border-cyan-500/30 shadow-xl shadow-cyan-500/10"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-[#0c0f1d] via-transparent to-transparent z-10"></div>
          <img
            src={tour.fotos?.[activeImage]}
            alt={`Imagen principal del tour ${tour.nombre}`}
            className="w-full h-full object-cover"
          />

          {/* Miniaturas */}
          <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-20">
            {tour.fotos?.map((foto, index) => (
              <button
                key={index}
                onClick={() => setActiveImage(index)}
                className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-all duration-300 ${
                  index === activeImage
                    ? "border-cyan-400 scale-110 shadow-lg shadow-cyan-500/50"
                    : "border-gray-700 opacity-70 hover:opacity-100"
                }`}
              >
                <img
                  src={foto}
                  alt={`Miniatura ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Información del tour */}
          <motion.div variants={container} initial="hidden" animate="show">
            <motion.div variants={item}>
              <h2 className="text-xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-400">
                Descripción de la experiencia
              </h2>
              <p className="text-gray-300 mb-8 leading-relaxed">
                {tour.descripcion}
              </p>
            </motion.div>

            <motion.div variants={item}>
              <h2 className="text-xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-400">
                Lo que incluye tu aventura
              </h2>
              <ul className="space-y-3">
                {tour.incluido.map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <FaCheckCircle className="text-cyan-400 mt-1 flex-shrink-0" />
                    <span className="text-gray-300">{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div variants={item} className="mt-8">
              <h2 className="text-xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-400">
                Características destacadas
              </h2>
              <div className="flex flex-wrap gap-2">
                {tour.caracteristicas?.map((caracteristica, i) => (
                  <span
                    key={i}
                    className="px-3 py-2 bg-cyan-900/30 text-cyan-300 rounded-lg border border-cyan-500/30"
                  >
                    {caracteristica}
                  </span>
                ))}
              </div>
            </motion.div>
          </motion.div>

          {/* Formulario de reserva */}
          <motion.div
            className="bg-gradient-to-br from-[#0f172a]/80 to-[#1e293b]/80 rounded-2xl p-6 border border-cyan-500/30 shadow-xl shadow-cyan-500/10 backdrop-blur-sm"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-2xl pointer-events-none" />
              <div className="relative z-10 space-y-4">
                <h2 className="text-2xl font-bold text-cyan-400 text-center">
                  Reserva tu lugar
                </h2>
                <p className="text-cyan-400 text-sm text-center">
                  Completa el formulario para iniciar tu reserva
                </p>
              </div>

              <motion.button
                onClick={() => setShowModal(true)}
                className="w-full py-4 rounded-xl font-bold relative overflow-hidden group bg-gradient-to-r from-cyan-600 to-purple-600"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute -inset-4 bg-gradient-to-r from-cyan-500/30 to-purple-500/30 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <span className="relative z-10 flex items-center justify-center gap-2">
                  Confirmar y continuar a la Reserva
                </span>
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
      <div className="text-center text-sm text-gray-400 mt-4">
        Tu información está segura con nosotros. Reservas 100% protegidas.
      </div>

      {/* MODAL */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black mt-20 bg-opacity-70 flex items-center justify-center z-50 p-2 sm:p-4"
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setShowModal(false);
              }
            }}
          >
            <ReservationForm
              tour={tour}
              formRef={formRef}
              errors={errors}
              validateForm={validateForm}
              sendEmail={sendEmail}
              isSubmitting={isSubmitting}
              hasSubmitted={hasSubmitted}
              setShowModal={setShowModal}
              availableDates={availableDates}
              formData={formData}
              setFormData={setFormData}
              showWhatsApp={showWhatsApp}
              setShowWhatsApp={setShowWhatsApp}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
