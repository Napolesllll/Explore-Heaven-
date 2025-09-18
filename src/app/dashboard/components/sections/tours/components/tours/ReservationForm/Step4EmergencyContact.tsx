"use client";

import { FaCheckCircle, FaPhone, FaUserAlt } from "react-icons/fa";
import { ReservationFormData } from "./types";
import { useState, useEffect } from "react";

interface Step4EmergencyContactProps {
  formData: ReservationFormData;
  setFormData: React.Dispatch<React.SetStateAction<ReservationFormData>>;
  stepErrors: Record<string, string>;
}

export default function Step4EmergencyContact({
  formData,
  setFormData,
  stepErrors,
}: Step4EmergencyContactProps) {
  const [selectedCountry, setSelectedCountry] = useState("+57"); // Colombia por defecto

  const countries = [
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
    {
      code: "+58",
      name: "Venezuela",
      flag: "🇻🇪",
      minLength: 10,
      maxLength: 10,
    },
    { code: "+51", name: "Perú", flag: "🇵🇪", minLength: 9, maxLength: 9 },
    { code: "+593", name: "Ecuador", flag: "🇪🇨", minLength: 9, maxLength: 9 },
    { code: "+507", name: "Panamá", flag: "🇵🇦", minLength: 8, maxLength: 8 },
    {
      code: "+506",
      name: "Costa Rica",
      flag: "🇨🇷",
      minLength: 8,
      maxLength: 8,
    },
    {
      code: "+503",
      name: "El Salvador",
      flag: "🇸🇻",
      minLength: 8,
      maxLength: 8,
    },
    { code: "+502", name: "Guatemala", flag: "🇬🇹", minLength: 8, maxLength: 8 },
    { code: "+504", name: "Honduras", flag: "🇭🇳", minLength: 8, maxLength: 8 },
    { code: "+505", name: "Nicaragua", flag: "🇳🇮", minLength: 8, maxLength: 8 },
    { code: "+34", name: "España", flag: "🇪🇸", minLength: 9, maxLength: 9 },
    {
      code: "+54",
      name: "Argentina",
      flag: "🇦🇷",
      minLength: 10,
      maxLength: 10,
    },
    { code: "+56", name: "Chile", flag: "🇨🇱", minLength: 9, maxLength: 9 },
    { code: "+598", name: "Uruguay", flag: "🇺🇾", minLength: 8, maxLength: 8 },
    { code: "+595", name: "Paraguay", flag: "🇵🇾", minLength: 9, maxLength: 9 },
    { code: "+591", name: "Bolivia", flag: "🇧🇴", minLength: 8, maxLength: 8 },
    { code: "+55", name: "Brasil", flag: "🇧🇷", minLength: 10, maxLength: 11 },
  ];

  // Sincronizar el código de país cuando cambie el teléfono externamente
  useEffect(() => {
    if (formData.contactoEmergencia?.telefono) {
      const phoneRegex = /^\+(\d{1,4})\s/;
      const match = formData.contactoEmergencia.telefono.match(phoneRegex);
      if (match) {
        const codeFromPhone = `+${match[1]}`;
        if (codeFromPhone !== selectedCountry) {
          setSelectedCountry(codeFromPhone);
        }
      }
    }
  }, [formData.contactoEmergencia?.telefono, selectedCountry]);

  const getCurrentCountry = () => {
    return (
      countries.find((country) => country.code === selectedCountry) ||
      countries[3] // Default Colombia (index 3)
    );
  };

  const validatePhoneNumber = (phoneNumber: string) => {
    const currentCountry = getCurrentCountry();
    const cleanNumber = phoneNumber.replace(/\D/g, ""); // Solo números

    if (cleanNumber.length < currentCountry.minLength) {
      return `El número debe tener al menos ${currentCountry.minLength} dígitos`;
    }
    if (cleanNumber.length > currentCountry.maxLength) {
      return `El número debe tener máximo ${currentCountry.maxLength} dígitos`;
    }
    return null;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const phoneNumber = e.target.value.replace(/\D/g, ""); // Solo números
    const currentCountry = getCurrentCountry();

    // Limitar la longitud según el país
    const limitedPhone = phoneNumber.slice(0, currentCountry.maxLength);
    const fullPhone = limitedPhone ? `${selectedCountry} ${limitedPhone}` : "";

    setFormData((prev) => ({
      ...prev,
      contactoEmergencia: {
        ...prev.contactoEmergencia,
        telefono: fullPhone,
      },
    }));
  };

  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newCountryCode = e.target.value;
    setSelectedCountry(newCountryCode);

    // Actualizar el teléfono con el nuevo código de país
    const currentPhone = getPhoneWithoutCode(
      formData.contactoEmergencia?.telefono || ""
    );
    if (currentPhone) {
      const newFullPhone = `${newCountryCode} ${currentPhone}`;
      setFormData((prev) => ({
        ...prev,
        contactoEmergencia: {
          ...prev.contactoEmergencia,
          telefono: newFullPhone,
        },
      }));
    }
  };

  const getPhoneWithoutCode = (fullPhone: string) => {
    if (!fullPhone) return "";
    // Buscar el patrón +código espacio número
    const phoneRegex = /^\+\d{1,4}\s(.+)$/;
    const match = fullPhone.match(phoneRegex);
    return match ? match[1] : "";
  };

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
          {/* Nombre del contacto */}
          <div className="space-y-2">
            <label className="block text-cyan-400 font-medium text-sm">
              Nombre completo *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <FaUserAlt className="w-5 h-5 text-cyan-500" />
              </div>
              <input
                type="text"
                placeholder="Nombre del contacto de emergencia"
                value={formData.contactoEmergencia?.nombre || ""}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    contactoEmergencia: {
                      ...prev.contactoEmergencia,
                      nombre: e.target.value,
                    },
                  }))
                }
                className="w-full bg-gray-700 border border-cyan-500/30 rounded-xl px-4 py-3 pl-10 text-cyan-100 placeholder-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 text-sm sm:text-base"
              />
              {stepErrors.contactoNombre && (
                <p className="text-red-400 text-sm mt-1">
                  {stepErrors.contactoNombre}
                </p>
              )}
            </div>
          </div>

          {/* Teléfono del contacto con indicativo */}
          <div className="space-y-2">
            <label className="block text-cyan-400 font-medium text-sm">
              Teléfono *
            </label>
            <div className="flex gap-2">
              {/* Selector de país */}
              <div className="relative">
                <select
                  value={selectedCountry}
                  onChange={handleCountryChange}
                  className="bg-gray-700 border border-cyan-500/30 rounded-xl px-3 py-3 text-cyan-100 focus:outline-none focus:ring-2 focus:ring-cyan-500 text-sm appearance-none min-w-[100px] pr-8"
                >
                  {countries.map((country, index) => (
                    <option
                      key={`${country.code}-${index}`}
                      value={country.code}
                      className="bg-gray-700"
                    >
                      {country.flag} {country.code}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                  <svg
                    className="w-4 h-4 text-cyan-500"
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

              {/* Input de teléfono */}
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <FaPhone className="w-5 h-5 text-cyan-500" />
                </div>
                <input
                  type="tel"
                  value={getPhoneWithoutCode(
                    formData.contactoEmergencia?.telefono || ""
                  )}
                  onChange={handlePhoneChange}
                  placeholder={`Ej: ${getCurrentCountry().minLength === getCurrentCountry().maxLength ? getCurrentCountry().minLength : `${getCurrentCountry().minLength}-${getCurrentCountry().maxLength}`} dígitos`}
                  className="w-full bg-gray-700 border border-cyan-500/30 rounded-xl px-4 py-3 pl-10 text-cyan-100 placeholder-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 text-sm sm:text-base"
                  maxLength={getCurrentCountry().maxLength}
                />
              </div>
            </div>

            {/* Información del país seleccionado */}
            <div className="text-xs text-cyan-400 mt-1 flex items-center gap-2">
              <span>{getCurrentCountry().flag}</span>
              <span>{getCurrentCountry().name}</span>
              <span>•</span>
              <span>
                {getCurrentCountry().minLength === getCurrentCountry().maxLength
                  ? `${getCurrentCountry().minLength} dígitos`
                  : `${getCurrentCountry().minLength}-${getCurrentCountry().maxLength} dígitos`}
              </span>
            </div>

            {/* Validación específica para teléfono */}
            {formData.contactoEmergencia?.telefono &&
              (() => {
                const phoneOnly = getPhoneWithoutCode(
                  formData.contactoEmergencia.telefono
                );
                const validationError = phoneOnly
                  ? validatePhoneNumber(phoneOnly)
                  : null;
                return (
                  validationError && (
                    <p className="text-yellow-400 text-sm mt-1">
                      {validationError}
                    </p>
                  )
                );
              })()}

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
            Esta información solo se usará en caso de emergencia durante el tour
          </p>
        </div>
      </div>
    </div>
  );
}
