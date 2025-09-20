"use client";

import { FaUserAlt, FaEnvelope, FaCalendarAlt, FaPhone } from "react-icons/fa";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import DateCalendar from "../DateCalendar";
import { ReservationFormData } from "./types";
import { useState, useEffect, useMemo, memo, useCallback } from "react";

interface Step1BasicInfoProps {
  formData: ReservationFormData;
  handleInputChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
  selectedDate: Date | null;
  handleDateSelect: (date: Date) => void;
  availableDates: Date[];
  stepErrors: Record<string, string>;
}

// Configuración de países optimizada y constante
const COUNTRIES = [
  {
    code: "+1",
    name: "Estados Unidos",
    flag: "🇺🇸",
    minLength: 10,
    maxLength: 10,
  },
  { code: "+1", name: "Canadá", flag: "🇨🇦", minLength: 10, maxLength: 10 },
  { code: "+52", name: "México", flag: "🇲🇽", minLength: 10, maxLength: 10 },
  { code: "+57", name: "Colombia", flag: "🇨🇴", minLength: 10, maxLength: 10 },
  { code: "+58", name: "Venezuela", flag: "🇻🇪", minLength: 10, maxLength: 10 },
  { code: "+51", name: "Perú", flag: "🇵🇪", minLength: 9, maxLength: 9 },
  { code: "+593", name: "Ecuador", flag: "🇪🇨", minLength: 9, maxLength: 9 },
  { code: "+507", name: "Panamá", flag: "🇵🇦", minLength: 8, maxLength: 8 },
  { code: "+506", name: "Costa Rica", flag: "🇨🇷", minLength: 8, maxLength: 8 },
  { code: "+503", name: "El Salvador", flag: "🇸🇻", minLength: 8, maxLength: 8 },
  { code: "+502", name: "Guatemala", flag: "🇬🇹", minLength: 8, maxLength: 8 },
  { code: "+504", name: "Honduras", flag: "🇭🇳", minLength: 8, maxLength: 8 },
  { code: "+505", name: "Nicaragua", flag: "🇳🇮", minLength: 8, maxLength: 8 },
  { code: "+34", name: "España", flag: "🇪🇸", minLength: 9, maxLength: 9 },
  { code: "+54", name: "Argentina", flag: "🇦🇷", minLength: 10, maxLength: 10 },
  { code: "+56", name: "Chile", flag: "🇨🇱", minLength: 9, maxLength: 9 },
  { code: "+598", name: "Uruguay", flag: "🇺🇾", minLength: 8, maxLength: 8 },
  { code: "+595", name: "Paraguay", flag: "🇵🇾", minLength: 9, maxLength: 9 },
  { code: "+591", name: "Bolivia", flag: "🇧🇴", minLength: 8, maxLength: 8 },
  { code: "+55", name: "Brasil", flag: "🇧🇷", minLength: 10, maxLength: 11 },
];

const DEFAULT_COUNTRY_INDEX = 3; // Colombia

// Hook para detectar móvil
const useIsMobile = () => {
  return useMemo(() => {
    if (typeof window === "undefined") return false;
    return window.innerWidth < 768;
  }, []);
};

const Step1BasicInfo = memo<Step1BasicInfoProps>(function Step1BasicInfo({
  formData,
  handleInputChange,
  selectedDate,
  handleDateSelect,
  availableDates,
  stepErrors,
}) {
  const [selectedCountry, setSelectedCountry] = useState("+57");
  const isMobile = useIsMobile();

  // Memoizar el país actual con optimización
  const getCurrentCountry = useMemo(() => {
    return (
      COUNTRIES.find((country) => country.code === selectedCountry) ||
      COUNTRIES[DEFAULT_COUNTRY_INDEX]
    );
  }, [selectedCountry]);

  // Función de validación memoizada
  const validatePhoneNumber = useMemo(() => {
    return (phoneNumber: string) => {
      const cleanNumber = phoneNumber.replace(/\D/g, "");
      const currentCountry = getCurrentCountry;

      if (cleanNumber.length < currentCountry.minLength) {
        return `El número debe tener al menos ${currentCountry.minLength} dígitos`;
      }
      if (cleanNumber.length > currentCountry.maxLength) {
        return `El número debe tener máximo ${currentCountry.maxLength} dígitos`;
      }
      return null;
    };
  }, [getCurrentCountry]);

  // Sincronizar el código de país optimizado
  useEffect(() => {
    if (formData.telefono) {
      const phoneRegex = /^\+(\d{1,4})\s/;
      const match = formData.telefono.match(phoneRegex);
      if (match) {
        const codeFromPhone = `+${match[1]}`;
        if (codeFromPhone !== selectedCountry) {
          setSelectedCountry(codeFromPhone);
        }
      }
    }
  }, [formData.telefono, selectedCountry]);

  // Handler optimizado para cambio de teléfono
  const handlePhoneChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const phoneNumber = e.target.value.replace(/\D/g, "");
      const currentCountry = getCurrentCountry;

      const limitedPhone = phoneNumber.slice(0, currentCountry.maxLength);
      const fullPhone = limitedPhone
        ? `${selectedCountry} ${limitedPhone}`
        : "";

      const syntheticEvent = {
        ...e,
        target: {
          ...e.target,
          name: "telefono",
          value: fullPhone,
        },
      };

      handleInputChange(syntheticEvent as React.ChangeEvent<HTMLInputElement>);
    },
    [getCurrentCountry, selectedCountry, handleInputChange]
  );

  // Handler optimizado para cambio de país
  const handleCountryChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const newCountryCode = e.target.value;
      setSelectedCountry(newCountryCode);

      const currentPhone = getPhoneWithoutCode(formData.telefono || "");
      const newFullPhone = currentPhone
        ? `${newCountryCode} ${currentPhone}`
        : "";

      const syntheticEvent = {
        target: {
          name: "telefono",
          value: newFullPhone,
        },
      } as React.ChangeEvent<HTMLInputElement>;

      handleInputChange(syntheticEvent);
    },
    [formData.telefono, handleInputChange]
  );

  // Función helper optimizada
  const getPhoneWithoutCode = useCallback((fullPhone: string) => {
    if (!fullPhone) return "";
    const phoneRegex = /^\+\d{1,4}\s(.+)$/;
    const match = fullPhone.match(phoneRegex);
    return match ? match[1] : "";
  }, []);

  // Memoizar el valor del teléfono sin código
  const phoneWithoutCode = useMemo(() => {
    return getPhoneWithoutCode(formData.telefono || "");
  }, [formData.telefono, getPhoneWithoutCode]);

  // Memoizar la validación del teléfono actual
  const currentPhoneValidation = useMemo(() => {
    if (!phoneWithoutCode) return null;
    return validatePhoneNumber(phoneWithoutCode);
  }, [phoneWithoutCode, validatePhoneNumber]);

  return (
    <div className="space-y-4 sm:space-y-5">
      <div className="text-center mb-4 sm:mb-6">
        <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-cyan-400">
          Información básica
        </h2>
        <p className="text-cyan-400 text-xs sm:text-sm mt-2">
          Comencemos con tus datos principales
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
        {/* Nombre completo */}
        <div className="space-y-2">
          <label className="block text-cyan-400 font-medium text-xs sm:text-sm">
            Nombre completo *
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <FaUserAlt className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-500" />
            </div>
            <input
              type="text"
              name="nombre"
              value={formData.nombre || ""}
              onChange={handleInputChange}
              placeholder="Ingresa tu nombre completo"
              className="w-full bg-gray-800 border border-cyan-500/30 rounded-xl px-4 py-2.5 sm:py-3 pl-10 sm:pl-11 text-cyan-100 placeholder-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 text-sm sm:text-base touch-manipulation"
              style={{
                WebkitTapHighlightColor: "transparent",
                minHeight: isMobile ? "44px" : "auto",
              }}
            />
            {stepErrors.nombre && (
              <p className="text-red-400 text-xs sm:text-sm mt-1">
                {stepErrors.nombre}
              </p>
            )}
          </div>
        </div>

        {/* Teléfono con indicativo optimizado para móvil */}
        <div className="space-y-2">
          <label className="block text-cyan-400 font-medium text-xs sm:text-sm">
            Teléfono *
          </label>
          <div className="flex gap-2">
            <div className="relative">
              <select
                value={selectedCountry}
                onChange={handleCountryChange}
                className="bg-gray-800 border border-cyan-500/30 rounded-xl px-2 sm:px-3 py-2.5 sm:py-3 text-cyan-100 focus:outline-none focus:ring-2 focus:ring-cyan-500 text-xs sm:text-sm appearance-none min-w-[80px] sm:min-w-[100px] pr-6 sm:pr-8 touch-manipulation"
                style={{
                  WebkitTapHighlightColor: "transparent",
                  minHeight: isMobile ? "44px" : "auto",
                }}
              >
                {COUNTRIES.map((country, index) => (
                  <option
                    key={`${country.code}-${index}`}
                    value={country.code}
                    className="bg-gray-800"
                  >
                    {country.flag} {country.code}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                <svg
                  className="w-3 h-3 sm:w-4 sm:h-4 text-cyan-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>

            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <FaPhone className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-500" />
              </div>
              <input
                type="tel"
                value={phoneWithoutCode}
                onChange={handlePhoneChange}
                placeholder={`Ej: ${getCurrentCountry.minLength === getCurrentCountry.maxLength ? getCurrentCountry.minLength : `${getCurrentCountry.minLength}-${getCurrentCountry.maxLength}`} dígitos`}
                className="w-full bg-gray-800 border border-cyan-500/30 rounded-xl px-4 py-2.5 sm:py-3 pl-10 sm:pl-11 text-cyan-100 placeholder-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 text-sm sm:text-base touch-manipulation"
                maxLength={getCurrentCountry.maxLength}
                style={{
                  WebkitTapHighlightColor: "transparent",
                  minHeight: isMobile ? "44px" : "auto",
                }}
              />
            </div>
          </div>

          <div className="text-xs text-cyan-400 mt-1 flex items-center gap-1 sm:gap-2">
            <span>{getCurrentCountry.flag}</span>
            <span>{getCurrentCountry.name}</span>
            <span>•</span>
            <span>
              {getCurrentCountry.minLength === getCurrentCountry.maxLength
                ? `${getCurrentCountry.minLength} dígitos`
                : `${getCurrentCountry.minLength}-${getCurrentCountry.maxLength} dígitos`}
            </span>
          </div>

          {currentPhoneValidation && (
            <p className="text-yellow-400 text-xs sm:text-sm mt-1">
              {currentPhoneValidation}
            </p>
          )}

          {stepErrors.telefono && (
            <p className="text-red-400 text-xs sm:text-sm mt-1">
              {stepErrors.telefono}
            </p>
          )}
        </div>
      </div>

      {/* Correo electrónico */}
      <div className="space-y-2">
        <label className="block text-cyan-400 font-medium text-xs sm:text-sm">
          Correo electrónico *
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <FaEnvelope className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-500" />
          </div>
          <input
            type="email"
            name="correo"
            value={formData.correo || ""}
            onChange={handleInputChange}
            placeholder="tu@email.com"
            className="w-full bg-gray-800 border border-cyan-500/30 rounded-xl px-4 py-2.5 sm:py-3 pl-10 sm:pl-11 text-cyan-100 placeholder-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 text-sm sm:text-base touch-manipulation"
            style={{
              WebkitTapHighlightColor: "transparent",
              minHeight: isMobile ? "44px" : "auto",
            }}
          />
          {stepErrors.correo && (
            <p className="text-red-400 text-xs sm:text-sm mt-1">
              {stepErrors.correo}
            </p>
          )}
        </div>
      </div>

      {/* Selector de fecha */}
      <div className="space-y-2 sm:space-y-3">
        <label className="flex items-center gap-1.5 sm:gap-2 text-cyan-400 font-medium text-xs sm:text-sm lg:text-base">
          <FaCalendarAlt className="w-4 h-4 sm:w-5 sm:h-5" />
          Selecciona una fecha *
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
            <p className="text-xs sm:text-sm lg:text-base">
              No hay fechas disponibles
            </p>
          </div>
        )}
        {stepErrors.fecha && (
          <p className="text-red-400 text-xs sm:text-sm mt-1">
            {stepErrors.fecha}
          </p>
        )}
        {selectedDate && (
          <div className="text-center text-xs sm:text-sm text-cyan-300 bg-gray-800/50 rounded-lg p-2">
            Fecha seleccionada: {format(selectedDate, "PPP", { locale: es })}
          </div>
        )}
      </div>
    </div>
  );
});

export default Step1BasicInfo;
