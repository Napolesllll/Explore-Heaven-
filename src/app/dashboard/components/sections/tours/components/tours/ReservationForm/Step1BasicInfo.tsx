"use client";

import { FaUserAlt, FaEnvelope, FaCalendarAlt } from "react-icons/fa";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import DateCalendar from "../DateCalendar";
import { ReservationFormData } from "./types";

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

export default function Step1BasicInfo({
  formData,
  handleInputChange,
  selectedDate,
  handleDateSelect,
  availableDates,
  stepErrors,
}: Step1BasicInfoProps) {
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
            <p className="text-red-400 text-sm mt-1">{stepErrors.nombre}</p>
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
            <p className="text-red-400 text-sm mt-1">{stepErrors.telefono}</p>
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
            <p className="text-sm sm:text-base">No hay fechas disponibles</p>
          </div>
        )}
        {stepErrors.fecha && (
          <p className="text-red-400 text-sm mt-1">{stepErrors.fecha}</p>
        )}
        {selectedDate && (
          <div className="text-center text-sm text-cyan-300 bg-gray-800/50 rounded-lg p-2">
            Fecha seleccionada: {format(selectedDate, "PPP", { locale: es })}
          </div>
        )}
      </div>
    </div>
  );
}
