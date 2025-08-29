"use client";

import { useState } from "react";
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
  availableDates: Date[];
}

export default function DateCalendar({
  selectedDate,
  onDateSelect,
  availableDates,
}: DateCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const today = startOfToday();

  const firstDayCurrentMonth = startOfMonth(currentMonth);
  const lastDayCurrentMonth = endOfMonth(currentMonth);

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
      {/* Header con mes y botones */}
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

      {/* Días de la semana */}
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
              className={`relative p-2 text-sm rounded-lg transition-all duration-200
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
