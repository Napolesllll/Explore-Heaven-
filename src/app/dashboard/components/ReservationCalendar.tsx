"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Users,
  MapPin,
  Clock,
  Eye,
  RefreshCw,
} from "lucide-react";
import { useReservations } from "./hooks/useReservations";
import { Reservation } from "../../../types/reservations";

// Funciones para manejar fechas sin problemas de timezone - CORREGIDAS
const createDateWithoutTimezone = (dateString: string): Date => {
  // Manejar diferentes formatos de fecha
  if (dateString.includes("T")) {
    // Si ya tiene formato ISO, extraer solo la parte de la fecha
    const datePart = dateString.split("T")[0];
    return new Date(datePart + "T00:00:00");
  }
  // Si es solo una fecha YYYY-MM-DD
  return new Date(dateString + "T00:00:00");
};

const formatDateShort = (dateString: string): string => {
  const date = createDateWithoutTimezone(dateString);
  return date.toLocaleDateString("es-ES");
};

const isSameDate = (dateString: string, compareDate: Date): boolean => {
  try {
    const date = createDateWithoutTimezone(dateString);
    return (
      date.getDate() === compareDate.getDate() &&
      date.getMonth() === compareDate.getMonth() &&
      date.getFullYear() === compareDate.getFullYear()
    );
  } catch (error) {
    console.error("Error comparing dates:", error, { dateString, compareDate });
    return false;
  }
};

// Función para normalizar las reservas y mapear campos
const normalizeReservation = (reservation: any): Reservation => {
  return {
    id: reservation.id,
    tourId: reservation.tourId || reservation.Tour?.id || "",
    // Mapear campos que pueden tener nombres diferentes
    fechaSeleccionada:
      reservation.fechaSeleccionada || reservation.fecha || reservation.date,
    fechaCreacion: reservation.fechaCreacion || reservation.createdAt,
    nombreReservante: reservation.nombreReservante || reservation.nombre,
    correoReservante:
      reservation.correoReservante || reservation.correo || reservation.email,
    telefonoReservante:
      reservation.telefonoReservante || reservation.telefono || "",
    adultos: reservation.adultos || 1,
    niños: reservation.niños || 0,
    totalPersonas:
      reservation.totalPersonas || reservation.adultos + reservation.niños || 1,
    tourNombre:
      reservation.tourNombre || reservation.Tour?.nombre || "Tour sin nombre",
    tourUbicacion:
      reservation.tourUbicacion ||
      reservation.Tour?.ubicacion ||
      "Ubicación no especificada",
    status: reservation.status || reservation.estado || "Pendiente",
    precioTotal:
      reservation.precioTotal ||
      reservation.Tour?.precio * (reservation.totalPersonas || 1),
    participantes: reservation.participantes || [],
    contactoEmergencia: reservation.contactoEmergencia || null,
  };
};

// Componente para mostrar las reservas de un día específico
function DayReservations({
  date,
  reservations,
  onViewReservation,
}: {
  date: Date;
  reservations: Reservation[];
  onViewReservation: (reservation: Reservation) => void;
}) {
  const dayReservations = reservations.filter((reservation) => {
    return isSameDate(reservation.fechaSeleccionada, date);
  });

  if (dayReservations.length === 0) return null;

  return (
    <div className="mt-1 space-y-1">
      {dayReservations.slice(0, 3).map((reservation, index) => (
        <motion.div
          key={reservation.id}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.05 }}
          onClick={() => onViewReservation(reservation)}
          className="bg-gradient-to-r from-cyan-600/80 to-purple-600/80 rounded-md px-2 py-1 text-xs text-white cursor-pointer hover:from-cyan-500 hover:to-purple-500 transition-all"
        >
          <div className="flex items-center justify-between">
            <span className="truncate flex-1">
              {reservation.nombreReservante}
            </span>
            <span className="ml-1 text-cyan-200">
              {reservation.totalPersonas}p
            </span>
          </div>
          <div className="text-cyan-200 text-xs truncate">
            {reservation.tourNombre}
          </div>
        </motion.div>
      ))}

      {dayReservations.length > 3 && (
        <div className="text-xs text-cyan-300 text-center py-1">
          +{dayReservations.length - 3} más
        </div>
      )}
    </div>
  );
}

// Modal para mostrar detalles de las reservas del día
function DayDetailsModal({
  isOpen,
  onClose,
  date,
  reservations,
}: {
  isOpen: boolean;
  onClose: () => void;
  date: Date | null;
  reservations: Reservation[];
}) {
  if (!isOpen || !date) return null;

  const dayReservations = reservations.filter((reservation) => {
    return date ? isSameDate(reservation.fechaSeleccionada, date) : false;
  });

  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-[#0f172a] border border-cyan-500/30 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden"
      >
        {/* Header */}
        <div className="p-6 border-b border-cyan-500/30 bg-gradient-to-r from-cyan-900/20 to-purple-900/20">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">
                Reservas del{" "}
                {date.toLocaleDateString("es-ES", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </h2>
              <p className="text-cyan-200 mt-1">
                {dayReservations.length} reserva
                {dayReservations.length !== 1 ? "s" : ""} programada
                {dayReservations.length !== 1 ? "s" : ""}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-white transition-colors"
            >
              ×
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {dayReservations.length === 0 ? (
            <div className="text-center py-8">
              <CalendarIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <p className="text-gray-400">No hay reservas para este día</p>
            </div>
          ) : (
            <div className="space-y-4">
              {dayReservations.map((reservation) => (
                <motion.div
                  key={reservation.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gray-900/50 rounded-lg p-4 border border-cyan-500/20"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h4 className="text-lg font-semibold text-white">
                        {reservation.tourNombre}
                      </h4>
                      <p className="text-cyan-300 text-sm">
                        {reservation.nombreReservante}
                      </p>
                      <p className="text-gray-400 text-sm">
                        {reservation.correoReservante}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="bg-cyan-600/20 border border-cyan-500/30 rounded-full px-3 py-1 text-cyan-300 text-sm">
                        {reservation.status}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                    <div className="flex items-center gap-2 text-gray-400">
                      <MapPin size={14} />
                      <span>{reservation.tourUbicacion}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-400">
                      <Users size={14} />
                      <span>{reservation.totalPersonas} personas</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-400">
                      <Clock size={14} />
                      <span>
                        Reservado: {formatDateShort(reservation.fechaCreacion)}
                      </span>
                    </div>
                    {reservation.precioTotal && (
                      <div className="text-green-400 font-semibold">
                        ${reservation.precioTotal.toLocaleString()}
                      </div>
                    )}
                  </div>

                  <div className="mt-3 flex justify-end">
                    <button className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 text-sm">
                      <Eye size={14} />
                      Ver detalles completos
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}

// Componente principal del calendario de reservas
export default function ReservationCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [viewMode, setViewMode] = useState<"month" | "week">("month");

  const {
    reservations: rawReservations,
    loading,
    error,
    fetchReservations,
  } = useReservations();

  // Normalizar las reservas para asegurar compatibilidad
  const reservations = rawReservations.map(normalizeReservation);

  // DEBUG: Agregar logs para verificar los datos
  console.log("Raw reservations:", rawReservations);
  console.log("Normalized reservations:", reservations);

  // Obtener el primer día del mes
  const firstDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  );
  const lastDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  );

  // Obtener el día de la semana del primer día (0 = domingo, 1 = lunes, etc.)
  const firstDayWeekday = firstDayOfMonth.getDay();

  // Generar array de días del mes
  const daysInMonth = lastDayOfMonth.getDate();
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  // Generar días vacíos al inicio del mes
  const emptyDays = Array.from({ length: firstDayWeekday }, () => null);

  // Navegación de meses
  const goToPreviousMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1)
    );
  };

  const goToNextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1)
    );
  };

  // Obtener reservas para un día específico
  const getReservationsForDay = (day: number) => {
    const date = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day
    );
    const dayReservations = reservations.filter((reservation) => {
      const matches = isSameDate(reservation.fechaSeleccionada, date);
      // DEBUG: Log para verificar comparaciones
      if (matches) {
        console.log(`Match found for day ${day}:`, reservation);
      }
      return matches;
    });

    console.log(`Reservations for day ${day}:`, dayReservations);
    return dayReservations;
  };

  // Verificar si un día tiene reservas
  const hasReservations = (day: number) => {
    return getReservationsForDay(day).length > 0;
  };

  // Manejar clic en un día
  const handleDayClick = (day: number) => {
    const date = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day
    );
    setSelectedDate(date);
    setShowModal(true);
  };

  // Obtener el total de personas para un día
  const getTotalPersonasForDay = (day: number) => {
    return getReservationsForDay(day).reduce(
      (total, reservation) => total + reservation.totalPersonas,
      0
    );
  };

  // Filtrar reservas del mes actual
  const reservationsThisMonth = reservations.filter((r) => {
    try {
      const date = createDateWithoutTimezone(r.fechaSeleccionada);
      return (
        date.getMonth() === currentDate.getMonth() &&
        date.getFullYear() === currentDate.getFullYear()
      );
    } catch (error) {
      console.error("Error filtering reservations for month:", error, r);
      return false;
    }
  });

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
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-cyan-500 mx-auto"></div>
          <p className="mt-4 text-cyan-300">Cargando calendario...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-6 text-center">
        <p className="text-red-400 mb-4">
          Error al cargar el calendario: {error}
        </p>
        <button
          onClick={fetchReservations}
          className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors mx-auto"
        >
          <RefreshCw size={16} />
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header del calendario */}
      <div className="bg-[#0f172a]/80 backdrop-blur-xl rounded-2xl border border-cyan-500/30 shadow-lg shadow-cyan-500/10 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">
              Calendario de Reservas
            </h2>
            <p className="text-cyan-200 mt-1">
              Vista mensual de todas las reservas programadas
            </p>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={fetchReservations}
              className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-all"
              title="Actualizar calendario"
            >
              <RefreshCw size={16} />
            </button>

            <div className="flex items-center bg-gray-800/50 rounded-lg border border-cyan-500/20">
              <button
                onClick={() => setViewMode("month")}
                className={`px-4 py-2 text-sm font-medium transition-colors ${
                  viewMode === "month"
                    ? "bg-cyan-600 text-white rounded-lg"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                Mes
              </button>
              <button
                onClick={() => setViewMode("week")}
                className={`px-4 py-2 text-sm font-medium transition-colors ${
                  viewMode === "week"
                    ? "bg-cyan-600 text-white rounded-lg"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                Semana
              </button>
            </div>
          </div>
        </div>

        {/* Controles de navegación */}
        <div className="flex items-center justify-between mb-6">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={goToPreviousMonth}
            className="flex items-center gap-2 px-4 py-2 bg-cyan-600/20 border border-cyan-500/30 rounded-lg text-cyan-300 hover:bg-cyan-600/30 transition-all"
          >
            <ChevronLeft size={20} />
            Anterior
          </motion.button>

          <h3 className="text-xl font-bold text-white">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h3>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={goToNextMonth}
            className="flex items-center gap-2 px-4 py-2 bg-cyan-600/20 border border-cyan-500/30 rounded-lg text-cyan-300 hover:bg-cyan-600/30 transition-all"
          >
            Siguiente
            <ChevronRight size={20} />
          </motion.button>
        </div>

        {/* Estadísticas del mes */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-cyan-900/20 border border-cyan-500/30 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-cyan-300 text-sm">Total Reservas</p>
                <p className="text-2xl font-bold text-white">
                  {reservationsThisMonth.length}
                </p>
              </div>
              <CalendarIcon className="text-cyan-400" size={24} />
            </div>
          </div>

          <div className="bg-purple-900/20 border border-purple-500/30 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-300 text-sm">Total Personas</p>
                <p className="text-2xl font-bold text-white">
                  {reservationsThisMonth.reduce(
                    (total, r) => total + r.totalPersonas,
                    0
                  )}
                </p>
              </div>
              <Users className="text-purple-400" size={24} />
            </div>
          </div>

          <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-300 text-sm">Ingresos</p>
                <p className="text-2xl font-bold text-white">
                  $
                  {reservationsThisMonth
                    .reduce((total, r) => total + (r.precioTotal || 0), 0)
                    .toLocaleString()}
                </p>
              </div>
              <div className="text-green-400">$</div>
            </div>
          </div>

          <div className="bg-orange-900/20 border border-orange-500/30 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-300 text-sm">Días Ocupados</p>
                <p className="text-2xl font-bold text-white">
                  {
                    [
                      ...new Set(
                        reservationsThisMonth
                          .map((r) => {
                            try {
                              return createDateWithoutTimezone(
                                r.fechaSeleccionada
                              ).getDate();
                            } catch (error) {
                              console.error("Error getting date:", error, r);
                              return null;
                            }
                          })
                          .filter(Boolean)
                      ),
                    ].length
                  }
                </p>
              </div>
              <MapPin className="text-orange-400" size={24} />
            </div>
          </div>
        </div>

        {/* Calendario */}
        <div className="bg-gray-900/30 rounded-xl p-4 border border-cyan-500/20">
          {/* Días de la semana */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {dayNames.map((day) => (
              <div
                key={day}
                className="text-center text-sm font-medium text-cyan-300 p-3"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Días del calendario */}
          <div className="grid grid-cols-7 gap-1">
            {/* Días vacíos al inicio */}
            {emptyDays.map((_, index) => (
              <div key={`empty-${index}`} className="h-24 p-1"></div>
            ))}

            {/* Días del mes */}
            {days.map((day) => {
              const dayReservations = getReservationsForDay(day);
              const totalPersonas = getTotalPersonasForDay(day);
              const today = new Date();
              const isToday =
                today.getDate() === day &&
                today.getMonth() === currentDate.getMonth() &&
                today.getFullYear() === currentDate.getFullYear();

              return (
                <motion.div
                  key={day}
                  whileHover={dayReservations.length > 0 ? { scale: 1.02 } : {}}
                  onClick={() => handleDayClick(day)}
                  className={`h-24 p-1 rounded-lg cursor-pointer transition-all border ${
                    isToday
                      ? "border-cyan-400 bg-cyan-900/20"
                      : hasReservations(day)
                        ? "border-purple-500/30 bg-purple-900/10 hover:bg-purple-900/20"
                        : "border-gray-700/30 hover:border-gray-600/50 hover:bg-gray-800/30"
                  }`}
                >
                  <div className="flex items-start justify-between h-full flex-col">
                    <div className="flex items-center justify-between w-full">
                      <span
                        className={`text-sm font-medium ${
                          isToday ? "text-cyan-300" : "text-white"
                        }`}
                      >
                        {day}
                      </span>
                      {totalPersonas > 0 && (
                        <div className="bg-cyan-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                          {totalPersonas}
                        </div>
                      )}
                    </div>

                    <DayReservations
                      date={
                        new Date(
                          currentDate.getFullYear(),
                          currentDate.getMonth(),
                          day
                        )
                      }
                      reservations={reservations}
                      onViewReservation={(reservation) => {
                        console.log("Ver reserva:", reservation);
                      }}
                    />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Leyenda */}
        <div className="flex items-center justify-center gap-6 mt-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-cyan-900/20 border border-cyan-400 rounded"></div>
            <span className="text-cyan-300">Día actual</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-purple-900/10 border border-purple-500/30 rounded"></div>
            <span className="text-gray-300">Con reservas</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gray-800/30 border border-gray-700/30 rounded"></div>
            <span className="text-gray-400">Sin reservas</span>
          </div>
        </div>
      </div>

      {/* Modal de detalles del día */}
      <AnimatePresence>
        {showModal && (
          <DayDetailsModal
            isOpen={showModal}
            onClose={() => setShowModal(false)}
            date={selectedDate}
            reservations={reservations}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
