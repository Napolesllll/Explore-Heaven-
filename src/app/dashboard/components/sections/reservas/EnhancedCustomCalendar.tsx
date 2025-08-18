"use client";

import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import {
  FaChevronLeft,
  FaChevronRight,
  FaInfoCircle,
  FaExclamationTriangle,
  FaCheckCircle,
  FaTimesCircle,
  FaExclamationCircle,
  FaSpinner,
} from "react-icons/fa";

// Tipos para las fechas disponibles con información de disponibilidad
interface AvailableDate {
  id: string;
  date: string;
  tourId: string;
  isAvailable: boolean;
  spotsLeft: number;
  userHasReservation: boolean;
  reason?: string;
  dateObj: Date;
}

interface AvailableDateStats {
  total: number;
  available: number;
  userReservations: number;
  fullyBooked: number;
}

interface CustomCalendarProps {
  tourId: string;
  selectedDate: string;
  onDateSelect: (date: string) => void;
  userId?: string;
  currentReservaId?: number; // Para excluir la reserva actual al verificar disponibilidad
}

// Hook personalizado para obtener fechas disponibles con información de disponibilidad
function useAvailableDatesForReprogramming(
  tourId: string,
  userId?: string,
  currentReservaId?: number
) {
  const [availableDates, setAvailableDates] = useState<AvailableDate[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<AvailableDateStats>({
    total: 0,
    available: 0,
    userReservations: 0,
    fullyBooked: 0,
  });

  useEffect(() => {
    const fetchAvailableDates = async () => {
      if (!tourId) return;

      setLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams({
          tourId,
          ...(userId && { userId }),
          ...(currentReservaId && {
            excludeReservaId: currentReservaId.toString(),
          }),
        });

        const response = await fetch(`/api/available-dates?${params}`);

        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();

        // Procesar las fechas para añadir información de disponibilidad
        const processedDates: AvailableDate[] = data.map((dateInfo: any) => ({
          ...dateInfo,
          dateObj: new Date(dateInfo.date + "T00:00:00"),
          // La API ya debería devolver esta información, pero por si acaso:
          isAvailable: dateInfo.isAvailable ?? true,
          spotsLeft: dateInfo.spotsLeft ?? 3,
          userHasReservation: dateInfo.userHasReservation ?? false,
        }));

        setAvailableDates(processedDates);

        // Calcular estadísticas
        const newStats = processedDates.reduce(
          (acc, date) => ({
            total: acc.total + 1,
            available: acc.available + (date.isAvailable ? 1 : 0),
            userReservations:
              acc.userReservations + (date.userHasReservation ? 1 : 0),
            fullyBooked:
              acc.fullyBooked +
              (!date.isAvailable && !date.userHasReservation ? 1 : 0),
          }),
          { total: 0, available: 0, userReservations: 0, fullyBooked: 0 }
        );

        setStats(newStats);
      } catch (err) {
        console.error("Error fetching available dates:", err);
        setError(err instanceof Error ? err.message : "Error desconocido");
        setAvailableDates([]);
        setStats({
          total: 0,
          available: 0,
          userReservations: 0,
          fullyBooked: 0,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchAvailableDates();
  }, [tourId, userId, currentReservaId]);

  return { availableDates, loading, error, stats };
}

// Componente del calendario mejorado con lógica de disponibilidad
export function EnhancedCustomCalendar({
  tourId,
  selectedDate,
  onDateSelect,
  userId,
  currentReservaId,
}: CustomCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const { availableDates, loading, error, stats } =
    useAvailableDatesForReprogramming(tourId, userId, currentReservaId);

  // Obtener fechas disponibles como Set para búsqueda rápida
  const availableDatesMap = useMemo(() => {
    const map = new Map<string, AvailableDate>();
    availableDates.forEach((date) => {
      const dateStr = `${date.dateObj.getFullYear()}-${String(date.dateObj.getMonth() + 1).padStart(2, "0")}-${String(date.dateObj.getDate()).padStart(2, "0")}`;
      map.set(dateStr, date);
    });
    return map;
  }, [availableDates]);

  // Obtener el primer día del mes y el último día
  const firstDay = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth(),
    1
  );
  const lastDay = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth() + 1,
    0
  );
  const firstDayOfWeek = firstDay.getDay();
  const daysInMonth = lastDay.getDate();

  // Generar días del calendario
  const calendarDays = [];

  // Días vacíos al inicio
  for (let i = 0; i < firstDayOfWeek; i++) {
    calendarDays.push(null);
  }

  // Días del mes
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day);
  }

  // Funciones para navegar entre meses
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

  // Obtener información de disponibilidad de una fecha específica
  const getDateAvailability = (day: number) => {
    const dateStr = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    return availableDatesMap.get(dateStr);
  };

  // Verificar si una fecha está seleccionada
  const isDateSelected = (day: number) => {
    const dateStr = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    return selectedDate === dateStr;
  };

  // Manejar click en fecha
  const handleDateClick = (day: number) => {
    const dateInfo = getDateAvailability(day);
    if (dateInfo && dateInfo.isAvailable) {
      const dateStr = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
      onDateSelect(dateStr);
    }
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

  const dayNamesShort = ["D", "L", "M", "X", "J", "V", "S"];

  // Estados de carga y error
  if (loading) {
    return (
      <div className="bg-gray-900/50 rounded-xl p-4 border border-yellow-500/30">
        <div className="flex items-center justify-center gap-2 p-8 text-white">
          <FaSpinner className="animate-spin text-yellow-400 text-xl" />
          <span className="text-lg">Cargando fechas disponibles...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-900/20 rounded-xl p-4 border border-red-500/30">
        <div className="text-center text-red-300">
          <FaExclamationCircle className="mx-auto mb-2 text-2xl" />
          <p className="mb-2">Error al cargar fechas disponibles</p>
          <p className="text-sm text-red-400">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900/50 rounded-xl p-2 border border-yellow-500/30">
      {/* Estadísticas de disponibilidad */}
      <div className="mb-3 p-2 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
        <div className="grid grid-cols-2 gap-1 text-[10px] text-yellow-200">
          <div className="flex items-center gap-1">
            <span>📅</span>
            <span>Total: {stats.total}</span>
          </div>
          <div className="flex items-center gap-1">
            <span>✅</span>
            <span>Disponibles: {stats.available}</span>
          </div>
          {stats.userReservations > 0 && (
            <div className="flex items-center gap-1">
              <span>⚠️</span>
              <span>Ya reservaste: {stats.userReservations}</span>
            </div>
          )}
          <div className="flex items-center gap-1">
            <span>❌</span>
            <span>Sin cupos: {stats.fullyBooked}</span>
          </div>
        </div>
      </div>

      {/* Header del calendario - Responsivo */}
      <div className="flex items-center justify-between mb-2">
        <motion.button
          onClick={goToPreviousMonth}
          className="p-1.5 rounded-lg bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-400 transition-all duration-200"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <FaChevronLeft className="text-sm" />
        </motion.button>

        <h3 className="text-sm font-semibold text-yellow-400 text-center">
          {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
        </h3>

        <motion.button
          onClick={goToNextMonth}
          className="p-1.5 rounded-lg bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-400 transition-all duration-200"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <FaChevronRight className="text-sm" />
        </motion.button>
      </div>

      {/* Días de la semana */}
      <div className="grid grid-cols-7 gap-0.5 mb-1">
        {dayNamesShort.map((dayName) => (
          <div
            key={dayName}
            className="text-center text-[10px] font-semibold text-gray-400 p-1"
          >
            {dayName}
          </div>
        ))}
      </div>

      {/* Días del calendario */}
      <div className="grid grid-cols-7 gap-0.5">
        {calendarDays.map((day, index) => (
          <div key={index} className="aspect-square">
            {day && (
              <motion.button
                onClick={() => handleDateClick(day)}
                disabled={!getDateAvailability(day)?.isAvailable}
                title={(() => {
                  const dateInfo = getDateAvailability(day);
                  if (!dateInfo) return "No disponible";
                  if (!dateInfo.isAvailable) {
                    return (
                      dateInfo.reason ||
                      (dateInfo.userHasReservation
                        ? "Ya tienes una reserva en esta fecha"
                        : "Sin cupos disponibles")
                    );
                  }
                  return `${dateInfo.spotsLeft} cupos disponibles`;
                })()}
                className={`
                  w-full h-full rounded-md text-[11px] font-medium transition-all duration-200 relative
                  flex flex-col items-center justify-center min-h-[32px]
                  ${(() => {
                    const dateInfo = getDateAvailability(day);
                    const isSelected = isDateSelected(day);

                    if (!dateInfo) {
                      return "bg-gray-800/50 text-gray-600 cursor-not-allowed";
                    }

                    if (isSelected) {
                      return "bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-lg ring-2 ring-yellow-400";
                    }

                    if (dateInfo.isAvailable) {
                      return "bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-400 hover:text-yellow-300";
                    }

                    if (dateInfo.userHasReservation) {
                      return "bg-orange-600/30 text-orange-300 cursor-not-allowed border border-orange-500/50";
                    }

                    return "bg-red-600/30 text-red-300 cursor-not-allowed border border-red-500/50";
                  })()}
                `}
                whileHover={
                  getDateAvailability(day)?.isAvailable ? { scale: 1.05 } : {}
                }
                whileTap={
                  getDateAvailability(day)?.isAvailable ? { scale: 0.95 } : {}
                }
              >
                <span className="font-medium">{day}</span>

                {/* Indicadores visuales */}
                {(() => {
                  const dateInfo = getDateAvailability(day);
                  if (!dateInfo) return null;

                  if (dateInfo.isAvailable) {
                    return (
                      <>
                        {/* Indicador de disponibilidad */}
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute -top-1 -right-1 w-2 h-2 bg-green-400 rounded-full"
                        />
                        {/* Indicador de pocos cupos */}
                        {dateInfo.spotsLeft <= 1 && (
                          <span className="text-xs text-orange-300 font-bold absolute -bottom-1">
                            !
                          </span>
                        )}
                        {/* Mostrar cupos restantes si son pocos */}
                        {dateInfo.spotsLeft < 3 && (
                          <span className="text-[8px] text-yellow-200 font-semibold absolute bottom-0">
                            {dateInfo.spotsLeft}
                          </span>
                        )}
                      </>
                    );
                  }

                  if (dateInfo.userHasReservation) {
                    return (
                      <FaExclamationCircle className="absolute -top-1 -right-1 text-orange-400 text-xs" />
                    );
                  }

                  return (
                    <FaTimesCircle className="absolute -top-1 -right-1 text-red-400 text-xs" />
                  );
                })()}
              </motion.button>
            )}
          </div>
        ))}
      </div>

      {/* Leyenda actualizada */}
      <div className="mt-2 grid grid-cols-2 gap-1 text-[9px]">
        <div className="flex items-center gap-1">
          <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
          <span className="text-yellow-200">Disponible</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-1.5 h-1.5 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full"></div>
          <span className="text-yellow-200">Seleccionado</span>
        </div>
        <div className="flex items-center gap-1">
          <FaExclamationCircle className="text-orange-400 text-[8px]" />
          <span className="text-orange-200">Ya reservaste</span>
        </div>
        <div className="flex items-center gap-1">
          <FaTimesCircle className="text-red-400 text-[8px]" />
          <span className="text-red-200">Sin cupos</span>
        </div>
      </div>

      {/* Información de la fecha seleccionada */}
      {selectedDate && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-2 p-2 bg-green-500/10 rounded-lg border border-green-500/20"
        >
          {(() => {
            const selectedDateInfo = Array.from(
              availableDatesMap.values()
            ).find((d) => {
              const dateStr = `${d.dateObj.getFullYear()}-${String(d.dateObj.getMonth() + 1).padStart(2, "0")}-${String(d.dateObj.getDate()).padStart(2, "0")}`;
              return dateStr === selectedDate;
            });

            if (!selectedDateInfo) return null;

            return (
              <div className="text-[10px] text-green-200">
                <p className="text-center mb-1">
                  <span className="font-semibold text-white text-[11px]">
                    {selectedDateInfo.dateObj.toLocaleDateString("es-ES", {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </p>
                <div className="flex justify-center items-center gap-2">
                  <div className="flex items-center gap-1">
                    <FaCheckCircle className="text-green-400 text-[8px]" />
                    <span>{selectedDateInfo.spotsLeft} cupos disponibles</span>
                  </div>
                </div>
              </div>
            );
          })()}
        </motion.div>
      )}

      {/* Mensaje cuando no hay fechas disponibles */}
      {stats.available === 0 && (
        <div className="mt-2 p-2 bg-red-900/20 rounded-lg border border-red-500/30 text-center">
          <FaExclamationCircle className="text-red-400 mx-auto mb-1 text-sm" />
          <p className="text-red-200 text-[10px] mb-1">
            No hay fechas disponibles en este momento
          </p>
          {stats.userReservations > 0 && (
            <p className="text-orange-200 text-[9px]">
              Ya tienes {stats.userReservations} reserva
              {stats.userReservations !== 1 ? "s" : ""} para este tour
            </p>
          )}
        </div>
      )}

      {/* Información adicional - Solo visible en móviles */}
      <div className="mt-2 p-2 bg-blue-500/10 rounded-lg border border-blue-500/20">
        <div className="flex items-start gap-1">
          <FaInfoCircle className="text-blue-400 mt-0.5 flex-shrink-0 text-xs" />
          <p className="text-[10px] text-blue-200">
            Toca una fecha disponible para seleccionarla como la nueva fecha de
            tu reserva. Las fechas muestran cupos disponibles en tiempo real.
          </p>
        </div>
      </div>
    </div>
  );
}
