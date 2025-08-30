"use client";

import { motion } from "framer-motion";
import {
  FaExclamationCircle,
  FaTimesCircle,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import { useAvailableDates } from "../../hooks/useAvailableDates";
import { useState } from "react";
import { CustomCalendarProps } from "./types";

// Tipo que coincide con lo que devuelve el hook useAvailableDates
interface DateWithAvailability {
  id: string;
  dateObj: Date;
  isAvailable: boolean;
  spotsLeft: number;
  userHasReservation: boolean;
  reason?: string | null; // Puede ser null
}

export default function CustomCalendar({
  tour,
  selectedDateId,
  onDateSelect,
  errors,
}: CustomCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const { availableDates, loading, error, stats } = useAvailableDates(tour.id);

  const firstDayOfMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth(),
    1
  );
  const lastDayOfMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth() + 1,
    0
  );
  const firstDayWeekday = firstDayOfMonth.getDay();
  const daysInMonth = lastDayOfMonth.getDate();

  // Generar array de días del mes
  const days = Array.from({ length: daysInMonth }, (_, index) => index + 1);

  // Generar días vacíos al inicio del mes
  const emptyDays = Array.from({ length: firstDayWeekday }, () => null);

  const getDateInfo = (day: number): DateWithAvailability | undefined => {
    const dateToCheck = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      day
    );
    return availableDates.find(
      (availableDate) =>
        availableDate.dateObj.toDateString() === dateToCheck.toDateString()
    );
  };

  const isDateSelected = (day: number): boolean => {
    const dateInfo = getDateInfo(day);
    return dateInfo ? dateInfo.id === selectedDateId : false;
  };

  const handleDateSelect = (day: number) => {
    const dateInfo = getDateInfo(day);
    if (dateInfo && dateInfo.isAvailable) {
      onDateSelect(dateInfo.id);
    }
  };

  const goToPreviousMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1)
    );
  };

  const goToNextMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1)
    );
  };

  const monthNames = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ];

  const dayNames = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

  if (loading) {
    return (
      <div
        className={`bg-gradient-to-br from-indigo-900/50 to-purple-900/50 rounded-xl p-4 border-2 ${
          errors ? "border-red-500" : "border-indigo-500/50"
        } backdrop-blur-sm`}
      >
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-400"></div>
          <span className="ml-2 text-indigo-300">Cargando fechas...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gradient-to-br from-red-900/50 to-red-900/50 rounded-xl p-4 border-2 border-red-500/50 backdrop-blur-sm">
        <div className="text-center text-red-300">
          <FaExclamationCircle className="mx-auto mb-2 text-2xl" />
          <p>Error cargando fechas disponibles</p>
          <p className="text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`bg-gradient-to-br from-indigo-900/50 to-purple-900/50 rounded-xl p-4 border-2 ${
        errors ? "border-red-500" : "border-indigo-500/50"
      } backdrop-blur-sm`}
    >
      {/* Estadísticas */}
      <div className="mb-4 p-3 bg-indigo-800/30 rounded-lg border border-indigo-500/20">
        <div className="grid grid-cols-2 gap-2 text-xs text-indigo-200">
          <div>📅 Total: {stats.total}</div>
          <div>✅ Disponibles: {stats.available}</div>
          <div>⚠️ Ya reservaste: {stats.userReservations}</div>
          <div>❌ Sin cupos: {stats.fullyBooked}</div>
        </div>
      </div>

      {/* Header calendario */}
      <div className="flex items-center justify-between mb-4">
        <motion.button
          type="button"
          onClick={goToPreviousMonth}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="p-2 text-indigo-300 hover:text-white hover:bg-indigo-700/50 rounded-lg transition-all"
        >
          <FaChevronLeft />
        </motion.button>
        <h3 className="text-lg font-semibold text-white">
          {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
        </h3>
        <motion.button
          type="button"
          onClick={goToNextMonth}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="p-2 text-indigo-300 hover:text-white hover:bg-indigo-700/50 rounded-lg transition-all"
        >
          <FaChevronRight />
        </motion.button>
      </div>

      {/* Días de la semana */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {dayNames.map((day) => (
          <div
            key={day}
            className="text-center text-xs font-medium text-indigo-300 p-2"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Días del mes */}
      <div className="grid grid-cols-7 gap-1">
        {emptyDays.map((_, index) => (
          <div key={`empty-${index}`} className="p-2"></div>
        ))}

        {days.map((day) => {
          const dateInfo = getDateInfo(day);
          const isSelected = isDateSelected(day);

          if (!dateInfo) {
            return (
              <div
                key={day}
                className="p-2 text-sm text-gray-500 text-center cursor-not-allowed"
              >
                {day}
              </div>
            );
          }

          const { isAvailable, spotsLeft, userHasReservation, reason } =
            dateInfo;

          return (
            <motion.button
              key={day}
              type="button"
              onClick={() => handleDateSelect(day)}
              disabled={!isAvailable}
              whileHover={isAvailable ? { scale: 1.05 } : {}}
              whileTap={isAvailable ? { scale: 0.95 } : {}}
              title={
                !isAvailable
                  ? reason || "No disponible"
                  : `${spotsLeft} cupos disponibles`
              }
              className={`p-2 text-sm rounded-lg transition-all duration-200 relative min-h-[40px] flex flex-col items-center justify-center
                ${
                  isAvailable
                    ? isSelected
                      ? "bg-indigo-600 text-white shadow-lg ring-2 ring-indigo-400"
                      : "bg-indigo-700/50 text-indigo-100 hover:bg-indigo-600 hover:text-white"
                    : userHasReservation
                      ? "bg-yellow-600/30 text-yellow-300 cursor-not-allowed border border-yellow-500/50"
                      : "bg-red-600/30 text-red-300 cursor-not-allowed border border-red-500/50"
                }`}
            >
              <span className="font-medium">{day}</span>

              {isAvailable && (
                <>
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 w-2 h-2 bg-green-400 rounded-full"
                  />
                  {spotsLeft <= 1 && (
                    <span className="text-xs text-orange-300 font-bold">!</span>
                  )}
                </>
              )}

              {userHasReservation && (
                <FaExclamationCircle className="absolute -top-1 -right-1 text-yellow-400 text-xs" />
              )}

              {!isAvailable && !userHasReservation && (
                <FaTimesCircle className="absolute -top-1 -right-1 text-red-400 text-xs" />
              )}

              {isAvailable && spotsLeft < 3 && (
                <span className="text-xs text-indigo-200 font-semibold">
                  {spotsLeft}
                </span>
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Leyenda */}
      <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
          <span className="text-indigo-200">Disponible</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 bg-indigo-600 rounded-full"></div>
          <span className="text-indigo-200">Seleccionado</span>
        </div>
        <div className="flex items-center gap-1">
          <FaExclamationCircle className="text-yellow-400 text-xs" />
          <span className="text-yellow-200">Ya reservaste</span>
        </div>
        <div className="flex items-center gap-1">
          <FaTimesCircle className="text-red-400 text-xs" />
          <span className="text-red-200">Sin cupos</span>
        </div>
      </div>
    </div>
  );
}
