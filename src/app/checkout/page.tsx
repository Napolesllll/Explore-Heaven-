//src/app/checkout/page.tsx
"use client";

// 1. Librerías externas
import Head from "next/head";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { tours } from "../../data/toursData";
import {
  CheckCircle,
  Calendar,
  Clock,
  User,
  Mail,
  Phone,
  Info,
  X as XIcon,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
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

// 2. Plugins y utilidades
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

// 3. Carrusel de imágenes
function TourImages({ fotos }: { fotos: string[] }) {
  const [sliderRef] = useKeenSlider<HTMLDivElement>(
    {
      loop: true,
      mode: "free-snap",
      slides: { perView: 1, spacing: 0 },
    },
    [AutoSlidePlugin]
  );

  return (
    <div
      ref={sliderRef}
      className="keen-slider rounded-3xl overflow-hidden h-[300px] sm:h-[450px] shadow-2xl border-4 border-yellow-500/20"
      aria-label="Galería de imágenes del tour"
    >
      {fotos.map((foto, index) => (
        <div key={index} className="keen-slider__slide relative h-full">
          <Image
            src={foto}
            alt={`Foto del tour ${index + 1}`}
            fill
            className="object-cover"
            priority={index === 0}
          />
          <div className="absolute bottom-4 right-4 bg-black/60 px-3 py-1 rounded-full text-xs text-white">
            {index + 1} / {fotos.length}
          </div>
        </div>
      ))}
    </div>
  );
}

// 4. Detalles básicos del tour
function TourDetails({ tour }: { tour: any }) {
  return (
    <section className="space-y-8" aria-labelledby="tour-title">
      <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 px-6 py-3 rounded-xl inline-block mb-4">
        <h2 id="tour-title" className="text-2xl font-bold text-gray-900">
          {tour.nombre}
        </h2>
      </div>
      <p className="text-gray-300 leading-relaxed italic text-center md:text-left">
        {tour.descripcion}
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
        <div className="flex items-center gap-3 bg-gray-800/50 p-4 rounded-xl">
          <span className="text-yellow-400 font-semibold" aria-hidden>
            💰
          </span>
          <div>
            <p className="text-gray-400 text-sm">Precio</p>
            <p className="text-white font-medium">{tour.precio}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 bg-gray-800/50 p-4 rounded-xl">
          <span className="text-yellow-400 font-semibold" aria-hidden>
            🕐
          </span>
          <div>
            <p className="text-gray-400 text-sm">Salida</p>
            <p className="text-white font-medium">{tour.salida}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 bg-gray-800/50 p-4 rounded-xl">
          <span className="text-yellow-400 font-semibold" aria-hidden>
            🔁
          </span>
          <div>
            <p className="text-gray-400 text-sm">Regreso</p>
            <p className="text-white font-medium">{tour.regreso}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 bg-gray-800/50 p-4 rounded-xl">
          <span className="text-yellow-400 font-semibold" aria-hidden>
            ⏳
          </span>
          <div>
            <p className="text-gray-400 text-sm">Duración</p>
            <p className="text-white font-medium">{tour.duracion}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

// 5. Inclusiones, exclusiones y recomendaciones
function InclusionDetails({ tour }: { tour: any }) {
  return (
    <section className="pt-6 grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
      <div className="bg-gray-800/50 p-5 rounded-2xl">
        <h3 className="font-bold text-yellow-400 mb-3 flex items-center gap-2">
          <CheckCircle className="w-5 h-5" /> Incluye
        </h3>
        <ul className="space-y-2">
          {tour.incluido.map((item: string, i: number) => (
            <li key={i} className="flex items-start">
              <div className="w-2 h-2 rounded-full bg-yellow-500 mt-2 mr-2 flex-shrink-0" />
              <span className="text-gray-300">{item}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="bg-gray-800/50 p-5 rounded-2xl">
        <h3 className="font-bold text-yellow-400 mb-3 flex items-center gap-2">
          <XIcon className="w-5 h-5" /> No incluye
        </h3>
        <ul className="space-y-2">
          {tour.noIncluido.map((item: string, i: number) => (
            <li key={i} className="flex items-start">
              <div className="w-2 h-2 rounded-full bg-red-500 mt-2 mr-2 flex-shrink-0" />
              <span className="text-gray-300">{item}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="bg-gray-800/50 p-5 rounded-2xl">
        <h3 className="font-bold text-yellow-400 mb-3 flex items-center gap-2">
          <Info className="w-5 h-5" /> Recomendaciones
        </h3>
        <ul className="space-y-2">
          {tour.outfit.map((item: string, i: number) => (
            <li key={i} className="flex items-start">
              <div className="w-2 h-2 rounded-full bg-emerald-500 mt-2 mr-2 flex-shrink-0" />
              <span className="text-gray-300">{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

// 6. Componente de calendario
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
    <div className="bg-gray-800 border border-gray-700 rounded-xl p-4">
      {/* Header del calendario */}
      <div className="flex items-center justify-between mb-4">
        <button
          type="button"
          onClick={goToPreviousMonth}
          className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
        >
          <ChevronLeft className="w-5 h-5 text-gray-400" />
        </button>
        <h3 className="text-lg font-semibold text-white">
          {format(currentMonth, "MMMM yyyy", { locale: es })}
        </h3>
        <button
          type="button"
          onClick={goToNextMonth}
          className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
        >
          <ChevronRight className="w-5 h-5 text-gray-400" />
        </button>
      </div>
      {/* Días de la semana */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"].map((day) => (
          <div
            key={day}
            className="text-center text-sm font-medium text-gray-400 py-2"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Días del mes */}
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
                    ? "text-white hover:bg-yellow-500/20 cursor-pointer"
                    : !isPastDate && isCurrentMonth
                      ? "text-gray-500 cursor-not-allowed"
                      : ""
                }
                ${isSelected ? "bg-yellow-500 text-gray-900 font-semibold" : ""}
                ${isToday && !isSelected ? "ring-2 ring-yellow-400" : ""}
              `}
            >
              {format(day, "d")}
              {isAvailable && isCurrentMonth && !isPastDate && (
                <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-yellow-400 rounded-full"></div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// 7. Formulario de reserva multi-paso con botón de WhatsApp
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

  // Validar paso actual
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
        // Validar datos de adultos
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

        // Validar datos de niños
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

  // Renderizar contenido según el paso actual
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-5">
            <div className="text-center mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-yellow-400">
                Información básica
              </h2>
              <p className="text-gray-400 text-sm mt-2">
                Comencemos con tus datos principales
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Nombre */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <User className="w-5 h-5 text-yellow-500" />
                </div>
                <input
                  type="text"
                  name="nombre"
                  value={formData.nombre || ""}
                  onChange={handleInputChange}
                  placeholder="Nombre completo"
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 pl-10 text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 text-sm sm:text-base"
                />
                {stepErrors.nombre && (
                  <p className="text-red-400 text-sm mt-1">
                    {stepErrors.nombre}
                  </p>
                )}
              </div>

              {/* Teléfono */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Phone className="w-5 h-5 text-yellow-500" />
                </div>
                <input
                  type="tel"
                  name="telefono"
                  value={formData.telefono || ""}
                  onChange={handleInputChange}
                  placeholder="Teléfono"
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 pl-10 text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 text-sm sm:text-base"
                />
                {stepErrors.telefono && (
                  <p className="text-red-400 text-sm mt-1">
                    {stepErrors.telefono}
                  </p>
                )}
              </div>
            </div>

            {/* Correo */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Mail className="w-5 h-5 text-yellow-500" />
              </div>
              <input
                type="email"
                name="correo"
                value={formData.correo || ""}
                onChange={handleInputChange}
                placeholder="Correo electrónico"
                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 pl-10 text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 text-sm sm:text-base"
              />
              {stepErrors.correo && (
                <p className="text-red-400 text-sm mt-1">{stepErrors.correo}</p>
              )}
            </div>

            {/* Calendario */}
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-yellow-400 font-medium text-sm sm:text-base">
                <Calendar className="w-5 h-5" />
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
                <div className="text-yellow-500 py-4 text-center">
                  <p className="text-sm sm:text-base">
                    No hay fechas disponibles
                  </p>
                </div>
              )}
              {stepErrors.fecha && (
                <p className="text-red-400 text-sm mt-1">{stepErrors.fecha}</p>
              )}
              {selectedDate && (
                <div className="text-center text-sm text-gray-300 bg-gray-800/50 rounded-lg p-2">
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
              <h2 className="text-xl sm:text-2xl font-bold text-yellow-400">
                ¿Cuántas personas van?
              </h2>
              <p className="text-gray-400 text-sm mt-2">
                Especifica la cantidad de adultos y niños
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Cantidad de adultos */}
              <div className="bg-gray-800/50 p-4 rounded-xl">
                <label className="block text-yellow-400 font-medium mb-3">
                  👥 Adultos (18+ años)
                </label>
                <select
                  value={formData.cantidadAdultos || 1}
                  onChange={(e) => handleAdultosChange(Number(e.target.value))}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-yellow-500"
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

              {/* Cantidad de niños */}
              <div className="bg-gray-800/50 p-4 rounded-xl">
                <label className="block text-yellow-400 font-medium mb-3">
                  👶 Niños (0-17 años)
                </label>
                <select
                  value={formData.cantidadNinos || 0}
                  onChange={(e) => handleNinosChange(Number(e.target.value))}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-yellow-500"
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
              <p className="text-gray-300">
                <span className="text-yellow-400 font-semibold">
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
              <h2 className="text-xl sm:text-2xl font-bold text-yellow-400">
                Datos de los participantes
              </h2>
              <p className="text-gray-400 text-sm mt-2">
                Información de identificación para cada persona
              </p>
            </div>

            <div className="space-y-6 max-h-96 overflow-y-auto pr-2">
              {/* Datos de adultos */}
              {formData.adultos?.map((adulto: any, index: number) => (
                <div
                  key={`adulto-${index}`}
                  className="bg-gray-800/50 p-4 rounded-xl space-y-3"
                >
                  <h3 className="text-yellow-400 font-medium flex items-center gap-2">
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
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:ring-2 focus:ring-yellow-500 text-sm"
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
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-yellow-500 text-sm"
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
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:ring-2 focus:ring-yellow-500 text-sm"
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

              {/* Datos de niños */}
              {formData.ninos?.map((nino: any, index: number) => (
                <div
                  key={`nino-${index}`}
                  className="bg-gray-800/50 p-4 rounded-xl space-y-3"
                >
                  <h3 className="text-yellow-400 font-medium flex items-center gap-2">
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
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:ring-2 focus:ring-yellow-500 text-sm"
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
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-yellow-500 text-sm"
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
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:ring-2 focus:ring-yellow-500 text-sm"
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
              <h2 className="text-xl sm:text-2xl font-bold text-yellow-400">
                Contacto de emergencia
              </h2>
              <p className="text-gray-400 text-sm mt-2">
                Persona a contactar en caso de emergencia
              </p>
            </div>

            <div className="bg-gray-800/50 p-4 rounded-xl space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-yellow-400 font-medium mb-2">
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
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:ring-2 focus:ring-yellow-500 text-sm"
                  />
                  {stepErrors.contactoNombre && (
                    <p className="text-red-400 text-sm mt-1">
                      {stepErrors.contactoNombre}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-yellow-400 font-medium mb-2">
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
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:ring-2 focus:ring-yellow-500 text-sm"
                  />
                  {stepErrors.contactoTelefono && (
                    <p className="text-red-400 text-sm mt-1">
                      {stepErrors.contactoTelefono}
                    </p>
                  )}
                </div>
              </div>

              <div className="text-center text-sm text-gray-400 bg-gray-700/50 rounded-lg p-3">
                <p className="flex items-center justify-center gap-2">
                  <Info className="w-4 h-4" />
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
    const whatsappNumber = "+573245340651"; // Reemplaza con tu número
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
      {/* Botón de cerrar */}
      <button
        type="button"
        onClick={() => setShowModal(false)}
        className="absolute top-4 right-4 z-20 w-8 h-8 flex items-center justify-center rounded-full bg-gray-800 hover:bg-gray-700 transition-colors"
        aria-label="Cerrar modal"
      >
        <XIcon className="w-5 h-5 text-gray-400" />
      </button>

      {/* Diseño decorativo */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-yellow-500 rounded-full filter blur-[80px] opacity-20" />
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-emerald-500 rounded-full filter blur-[100px] opacity-15" />
      </div>

      <div className="relative z-10 space-y-4">
        {!showWhatsApp ? (
          <>
            {/* Indicador de progreso */}
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

              {/* Botones de navegación */}
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

            {/* Resumen de la reserva */}
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

                {formData.adultos?.length > 0 && (
                  <div>
                    <p className="text-yellow-400 font-semibold">Adultos:</p>
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
                    <p className="text-yellow-400 font-semibold">Niños:</p>
                    {formData.ninos.map((nino: any, i: number) => (
                      <p key={i} className="ml-2">
                        • {nino.nombre} ({nino.tipoDocumento}:{" "}
                        {nino.numeroDocumento})
                      </p>
                    ))}
                  </div>
                )}

                <p>
                  <span className="text-yellow-400">Contacto emergencia:</span>{" "}
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
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.703" />
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

// 8. Página principal de checkout
export default function CheckoutPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [tour, setTour] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [showWhatsApp, setShowWhatsApp] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const [errors, setErrors] = useState<{
    nombre?: string;
    telefono?: string;
    correo?: string;
  }>({});
  const [availableDates, setAvailableDates] = useState<Date[]>([]);
  const [formData, setFormData] = useState({
    // Paso 1: Información básica
    nombre: "",
    correo: "",
    telefono: "",
    fecha: "",
    // Paso 2: Cantidades
    cantidadAdultos: 1,
    cantidadNinos: 0,

    // Paso 3: Datos de participantes
    adultos: [{ nombre: "", tipoDocumento: "", numeroDocumento: "" }],
    ninos: [],

    // Paso 4: Contacto de emergencia
    contactoEmergencia: { nombre: "", telefono: "" },
  });

  // Cargar tour seleccionado
  useEffect(() => {
    const tourId = searchParams.get("tourId");
    if (!tourId) return;
    const found = tours.find((t) => t.id === tourId) || null;
    setTour(found);
  }, [searchParams]);

  // Cargar fechas disponibles - CAMBIO: Ahora 60 días
  useEffect(() => {
    // Generar fechas de ejemplo (próximos 60 días)
    const dates = [];
    const today = new Date();
    for (let i = 1; i <= 60; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push(date);
    }
    setAvailableDates(dates);
  }, []);

  // Validación de formulario
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

  // Envío de formulario
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

  // Estado de carga
  if (!tour) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black">
        <div className="text-center animate-pulse">
          <div className="w-20 h-20 mx-auto bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-full flex items-center justify-center">
            <Calendar className="text-gray-900 w-10 h-10" />
          </div>
          <p className="mt-6 text-gray-400">Cargando detalles de tu tour...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Checkout | Reserva tu tour en Medellín</title>
        <meta
          name="description"
          content={`Reserva tu experiencia: ${tour.nombre}. Vive Medellín con seguridad y confianza.`}
        />
        <meta name="robots" content="noindex,follow" />
      </Head>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black py-12 px-4 relative overflow-hidden">
        {/* Elementos decorativos de fondo */}
        <div className="absolute inset-0" aria-hidden>
          <div className="absolute top-0 left-0 w-1/3 h-full bg-gradient-to-r from-gray-900 to-transparent z-0"></div>
          <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-gray-900 to-transparent z-0"></div>
          <div className="absolute bottom-20 left-1/4 w-80 h-80 bg-yellow-500 rounded-full filter blur-[100px] opacity-10"></div>
          <div className="absolute top-20 right-1/4 w-60 h-60 bg-emerald-500 rounded-full filter blur-[80px] opacity-10"></div>
          <div className="pattern-dots pattern-gray-800 pattern-bg-transparent pattern-opacity-10 pattern-size-2 absolute inset-0"></div>
        </div>

        {/* Contenido principal */}
        <div className="relative z-10 max-w-6xl mx-auto">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600 mb-4">
              ¡Listo para tu aventura!
            </h1>
            <p className="text-gray-400 max-w-xl mx-auto">
              Estás a un paso de vivir una experiencia inolvidable en Medellín
            </p>
          </motion.div>

          <motion.div
            className="bg-gradient-to-br from-gray-800/60 to-gray-900/80 backdrop-blur-lg rounded-3xl shadow-2xl p-6 md:p-10 space-y-8 relative border border-yellow-500/20"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 100, delay: 0.2 }}
          >
            {/* Sección superior: Carrusel y detalles básicos */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-stretch">
              {/* IMÁGENES - Carrusel automático */}
              {tour.fotos?.length > 0 && <TourImages fotos={tour.fotos} />}

              {/* INFORMACIÓN BÁSICA */}
              <TourDetails tour={tour} />
            </div>

            {/* Sección de detalles (ocupa todo el ancho) */}
            <div className="w-full">
              <InclusionDetails tour={tour} />
            </div>

            {/* Botones de acción */}
            <div className="flex flex-col sm:flex-row items-center gap-4 justify-center pt-10">
              <motion.button
                type="button"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowModal(true)}
                className="relative inline-flex items-center justify-center bg-gradient-to-r from-yellow-500 to-yellow-600 text-gray-900 px-8 py-4 rounded-xl font-bold overflow-hidden group"
              >
                <span className="relative z-10 flex items-center gap-2">
                  <CheckCircle className="w-6 h-6" />
                  Confirmar Reserva
                </span>
                <span className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-yellow-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
              </motion.button>

              <Link href="/" passHref>
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="border border-yellow-500/50 text-yellow-400 px-8 py-4 rounded-xl hover:bg-gray-800/50 transition-all font-medium flex items-center gap-2"
                >
                  Volver al inicio
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>

        {/* MODAL */}
        <AnimatePresence>
          {showModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-2 sm:p-4"
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
    </>
  );
}
