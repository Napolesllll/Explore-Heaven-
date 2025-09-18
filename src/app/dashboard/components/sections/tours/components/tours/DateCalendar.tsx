"use client";

import { useState, useMemo, memo } from "react";
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
import { ChevronLeft, ChevronRight } from "lucide-react";

interface DateCalendarProps {
  selectedDate: Date | null;
  onDateSelect: (date: Date) => void;
  availableDates?: Date[];
  restrictToAvailableDates?: boolean;
}

const DateCalendar = memo(function DateCalendar({
  selectedDate,
  onDateSelect,
  availableDates = [],
  restrictToAvailableDates = false,
}: DateCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const today = startOfToday();

  // Memoizar cálculos pesados
  const { allDays, firstDayCurrentMonth } = useMemo(() => {
    const firstDay = startOfMonth(currentMonth);
    const lastDay = endOfMonth(currentMonth);

    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    const endDate = new Date(lastDay);
    endDate.setDate(endDate.getDate() + (6 - lastDay.getDay()));

    return {
      allDays: eachDayOfInterval({ start: startDate, end: endDate }),
      firstDayCurrentMonth: firstDay,
    };
  }, [currentMonth]);

  // Memoizar función de disponibilidad
  const isDateAvailable = useMemo(() => {
    if (!restrictToAvailableDates) {
      return () => true;
    }

    // Crear Set para búsqueda O(1)
    const availableDatesSet = new Set(
      availableDates.map((date) => date.toDateString())
    );

    return (date: Date) => availableDatesSet.has(date.toDateString());
  }, [availableDates, restrictToAvailableDates]);

  const goToPreviousMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const goToNextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  // Constantes para evitar recreación
  const dayNames = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

  return (
    <div className="bg-gray-800 border border-cyan-500/30 rounded-xl p-4">
      {/* Header con mes y botones */}
      <div className="flex items-center justify-between mb-4">
        <button
          type="button"
          onClick={goToPreviousMonth}
          className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
          aria-label="Mes anterior"
        >
          <ChevronLeft className="w-5 h-5 text-cyan-400" />
        </button>
        <h3 className="text-lg font-semibold text-cyan-100">
          {format(firstDayCurrentMonth, "MMMM yyyy", { locale: es })}
        </h3>
        <button
          type="button"
          onClick={goToNextMonth}
          className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
          aria-label="Mes siguiente"
        >
          <ChevronRight className="w-5 h-5 text-cyan-400" />
        </button>
      </div>

      {/* Días de la semana */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {dayNames.map((day) => (
          <div
            key={day}
            className="text-center text-sm font-medium text-cyan-400 py-2"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Días del mes */}
      <div className="grid grid-cols-7 gap-1">
        {allDays.map((day) => {
          const isCurrentMonth = isSameMonth(day, firstDayCurrentMonth);
          const isToday = isSameDay(day, today);
          const isSelected = selectedDate && isSameDay(day, selectedDate);
          const isAvailable = isDateAvailable(day);
          const isPastDate = !isAfter(day, today) && !isSameDay(day, today);
          const isEnabled = isCurrentMonth && !isPastDate && isAvailable;

          return (
            <button
              key={day.getTime()} // Usar timestamp como key más eficiente
              type="button"
              onClick={() => isEnabled && onDateSelect(day)}
              disabled={!isEnabled}
              className={`relative p-2 text-sm rounded-lg transition-all duration-200
                ${!isCurrentMonth ? "text-gray-600" : ""}
                ${isPastDate ? "text-gray-600 cursor-not-allowed" : ""}
                ${
                  isEnabled
                    ? "text-cyan-100 hover:bg-cyan-500/20 cursor-pointer"
                    : !isPastDate && isCurrentMonth
                      ? "text-gray-500 cursor-not-allowed"
                      : ""
                }
                ${isSelected ? "bg-cyan-500 text-gray-900 font-semibold" : ""}
                ${isToday && !isSelected ? "ring-2 ring-cyan-400" : ""}
              `}
            >
              {day.getDate()}
              {/* Mostrar indicador solo si restrictToAvailableDates es true y la fecha está disponible */}
              {restrictToAvailableDates &&
                isAvailable &&
                isCurrentMonth &&
                !isPastDate && (
                  <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-cyan-400 rounded-full" />
                )}
            </button>
          );
        })}
      </div>
    </div>
  );
});

export default DateCalendar;
