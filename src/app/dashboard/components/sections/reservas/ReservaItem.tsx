"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { motion } from "framer-motion";
import {
  FaCalendarAlt,
  FaClock,
  FaMapMarkerAlt,
  FaUsers,
  FaChild,
  FaPhone,
  FaEnvelope,
  FaEdit,
  FaTimes,
  FaCheck,
  FaExclamationTriangle,
  FaBan,
  FaSpinner,
  FaInfoCircle,
  FaChevronLeft,
  FaChevronRight,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";
import toast from "react-hot-toast";
import Image from "next/image";

// Tipo para la reserva
interface Reserva {
  id: number;
  nombre: string;
  correo: string;
  telefono: string;
  fecha: string;
  hora: string | null;
  tourId: string;
  userId: string;
  adultos: number;
  niños: number;
  participantes: Array<{
    nombre: string;
    identidad?: string;
  }> | null;
  contactoEmergencia: {
    nombre: string;
    telefono: string;
  } | null;
  estado: string | null;
  Tour?: {
    id: string;
    nombre: string;
    imagenUrl: string;
    precio: number;
    ubicacion: string;
  };
  createdAt: string;
  updatedAt: string;
}

interface AvailableDate {
  id: string;
  date: string;
  tourId: string;
}

interface ReservaItemProps {
  reserva: Reserva;
  onUpdate: () => void;
}

// Componente de calendario personalizado con diseño responsivo
function CustomCalendar({
  availableDates,
  selectedDate,
  onDateSelect,
}: {
  availableDates: AvailableDate[];
  selectedDate: string;
  onDateSelect: (date: string) => void;
}) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Obtener fechas disponibles como Set para búsqueda rápida
  const availableDatesSet = useMemo(() => {
    return new Set(
      availableDates.map((date) => {
        const d = new Date(date.date);
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
          2,
          "0"
        )}-${String(d.getDate()).padStart(2, "0")}`;
      })
    );
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
  const calendarDays: Array<number | null> = [];

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

  // Verificar si una fecha está disponible
  const isDateAvailable = (day: number) => {
    const dateStr = `${currentMonth.getFullYear()}-${String(
      currentMonth.getMonth() + 1
    ).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    return availableDatesSet.has(dateStr);
  };

  // Verificar si una fecha está seleccionada
  const isDateSelected = (day: number) => {
    const dateStr = `${currentMonth.getFullYear()}-${String(
      currentMonth.getMonth() + 1
    ).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    return selectedDate === dateStr;
  };

  // Manejar click en fecha
  const handleDateClick = (day: number) => {
    if (isDateAvailable(day)) {
      const dateStr = `${currentMonth.getFullYear()}-${String(
        currentMonth.getMonth() + 1
      ).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
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

  return (
    <div className="bg-gray-900/50 rounded-xl p-2 border border-yellow-500/30">
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
                disabled={!isDateAvailable(day)}
                className={`w-full h-full rounded-md text-[11px] font-medium transition-all duration-200 ${
                  isDateSelected(day)
                    ? "bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-lg"
                    : isDateAvailable(day)
                      ? "bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-400 hover:text-yellow-300"
                      : "bg-gray-800/50 text-gray-600 cursor-not-allowed"
                }`}
                whileHover={isDateAvailable(day) ? { scale: 1.05 } : {}}
                whileTap={isDateAvailable(day) ? { scale: 0.95 } : {}}
              >
                {day}
              </motion.button>
            )}
          </div>
        ))}
      </div>

      {/* Información adicional - Solo visible en móviles */}
      <div className="mt-2 p-2 bg-blue-500/10 rounded-lg border border-blue-500/20">
        <div className="flex items-start gap-1">
          <FaInfoCircle className="text-blue-400 mt-0.5 flex-shrink-0 text-xs" />
          <p className="text-[10px] text-blue-200">
            Toca una fecha disponible para seleccionarla como la nueva fecha de
            tu reserva.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function ReservaItem({ reserva, onUpdate }: ReservaItemProps) {
  const [showReprogramar, setShowReprogramar] = useState(false);
  const [showDetalles, setShowDetalles] = useState(false);
  const [nuevaFecha, setNuevaFecha] = useState("");
  const [loading, setLoading] = useState(false);
  const [fechasDisponibles, setFechasDisponibles] = useState<AvailableDate[]>(
    []
  );
  const [loadingFechas, setLoadingFechas] = useState(false);

  // Función para obtener fechas disponibles
  const obtenerFechasDisponibles = useCallback(async () => {
    if (!reserva.tourId) return;

    setLoadingFechas(true);
    try {
      const res = await fetch(`/api/available-dates?tourId=${reserva.tourId}`);
      if (res.ok) {
        const fechas = await res.json();
        setFechasDisponibles(fechas);
      } else {
        console.error("Error al obtener fechas disponibles");
        toast.error("Error al cargar fechas disponibles");
      }
    } catch (err) {
      console.error("Error:", err);
      toast.error("Error de conexión al cargar fechas");
    } finally {
      setLoadingFechas(false);
    }
  }, [reserva.tourId]);

  // Cargar fechas disponibles cuando se abre el panel de reprogramación
  useEffect(() => {
    if (showReprogramar) {
      obtenerFechasDisponibles();
    }
  }, [showReprogramar, obtenerFechasDisponibles]);

  // Función para obtener el color del estado
  const getEstadoColor = (estado: string | null) => {
    switch (estado) {
      case "Cancelada":
        return "from-red-500/20 to-pink-500/20 border-red-500/30 text-red-400";
      case "Reprogramada":
        return "from-yellow-500/20 to-orange-500/20 border-yellow-500/30 text-yellow-400";
      case "Confirmada":
        return "from-green-500/20 to-emerald-500/20 border-green-500/30 text-green-400";
      case "Pendiente":
        return "from-blue-500/20 to-cyan-500/20 border-blue-500/30 text-blue-400";
      default:
        return "from-cyan-500/20 to-purple-500/20 border-cyan-500/30 text-cyan-400";
    }
  };

  // Función para obtener el icono del estado
  const getEstadoIcon = (estado: string | null) => {
    switch (estado) {
      case "Cancelada":
        return <FaBan className="text-red-400" />;
      case "Reprogramada":
        return <FaEdit className="text-yellow-400" />;
      case "Confirmada":
        return <FaCheck className="text-green-400" />;
      case "Pendiente":
        return <FaClock className="text-blue-400" />;
      default:
        return <FaInfoCircle className="text-cyan-400" />;
    }
  };

  // Cancela la reserva
  const cancelarReserva = async () => {
    if (!confirm("¿Estás seguro de que deseas cancelar esta reserva?")) {
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/reservas/${reserva.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "cancelar" }),
      });

      if (res.ok) {
        toast.success("Reserva cancelada exitosamente");
        onUpdate();
      } else {
        const errorData = await res.json();
        toast.error(errorData.error || "Error al cancelar reserva");
      }
    } catch (err) {
      console.error("Error:", err);
      toast.error("Error de conexión al cancelar reserva");
    } finally {
      setLoading(false);
    }
  };

  // Reprograma la reserva
  const reprogramarReserva = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nuevaFecha) {
      toast.error("Por favor selecciona una nueva fecha");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/reservas/${reserva.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "reprogramar", nuevaFecha }),
      });

      if (res.ok) {
        toast.success("Reserva reprogramada exitosamente");
        setShowReprogramar(false);
        setNuevaFecha("");
        onUpdate();
      } else {
        const errorData = await res.json();
        toast.error(errorData.error || "Error al reprogramar reserva");
      }
    } catch (err) {
      console.error("Error:", err);
      toast.error("Error de conexión al reprogramar reserva");
    } finally {
      setLoading(false);
    }
  };

  // Formatear fecha para mostrar
  const formatearFecha = (fecha: string) => {
    try {
      const fechaObj = fecha.includes("T")
        ? new Date(fecha)
        : new Date(fecha + "T00:00:00");

      if (isNaN(fechaObj.getTime())) {
        return "Fecha no válida";
      }

      return fechaObj.toLocaleDateString("es-ES", {
        weekday: "short",
        month: "short",
        day: "numeric",
      });
    } catch (err) {
      console.error("Error al formatear fecha:", err);
      return "Error en fecha";
    }
  };

  // Formatear fecha seleccionada para mostrar
  const formatearFechaSeleccionada = (fecha: string) => {
    if (!fecha) return "";
    try {
      const fechaObj = new Date(fecha + "T00:00:00");
      return fechaObj.toLocaleDateString("es-ES", {
        weekday: "short",
        month: "short",
        day: "numeric",
      });
    } catch {
      return fecha;
    }
  };

  const estadoColor = getEstadoColor(reserva.estado);
  const isCancelada = reserva.estado === "Cancelada";

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className={`relative bg-gradient-to-r ${estadoColor} backdrop-blur-xl rounded-lg sm:rounded-2xl border shadow-xl overflow-hidden ${
        isCancelada ? "opacity-75" : ""
      } mx-1 sm:mx-0`}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -skew-x-12 transform translate-x-full group-hover:translate-x-[-200%] transition-transform duration-1000"></div>

      <div className="relative z-10 p-3 sm:p-4 lg:p-6">
        {/* Header optimizado para móvil */}
        <div className="flex flex-col sm:flex-row items-start gap-2 sm:gap-4 mb-3 sm:mb-6">
          <div className="flex items-start gap-2 sm:gap-4 w-full sm:flex-1">
            {reserva.Tour?.imagenUrl && (
              <div className="w-14 h-14 sm:w-20 sm:h-20 rounded-lg sm:rounded-xl overflow-hidden flex-shrink-0 border-2 border-cyan-500/30">
                <Image
                  src={reserva.Tour.imagenUrl}
                  alt={reserva.Tour.nombre || "Imagen del tour"}
                  width={80} // sm:w-20 => 80px
                  height={80} // sm:h-20 => 80px
                  className="w-full h-full object-cover"
                  unoptimized={false} // quitar o cambiar según config
                  priority={false} // opcional
                />
              </div>
            )}

            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start">
                <h3 className="text-base sm:text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 line-clamp-2">
                  {reserva.Tour?.nombre || `Tour ID: ${reserva.tourId}`}
                </h3>
                <div className="text-xs font-mono text-cyan-300 sm:hidden">
                  #{reserva.id.toString().padStart(4, "0")}
                </div>
              </div>

              <div
                className={`inline-flex items-center gap-1 sm:gap-2 px-2 py-1 rounded-full text-xs sm:text-sm font-semibold bg-gradient-to-r ${estadoColor} border mt-1`}
              >
                {getEstadoIcon(reserva.estado)}
                <span>{reserva.estado || "Pagada"}</span>
              </div>
            </div>
          </div>

          {/* ID solo visible en desktop */}
          <div className="hidden sm:block text-left sm:text-right">
            <div className="text-xs text-gray-400 mb-1">Reserva #</div>
            <div className="text-sm font-mono text-cyan-300">
              {reserva.id.toString().padStart(6, "0")}
            </div>
          </div>
        </div>

        {/* Grid de información principal optimizado para móvil */}
        <div className="grid grid-cols-2 gap-1.5 sm:gap-3 lg:gap-4 mb-3 sm:mb-6">
          <div className="col-span-2 sm:col-span-1 flex items-center gap-1.5 sm:gap-3 p-1.5 sm:p-3 bg-gray-900/50 rounded-lg sm:rounded-xl">
            <FaCalendarAlt className="text-cyan-400 text-sm sm:text-lg flex-shrink-0" />
            <div className="min-w-0">
              <div className="text-[10px] sm:text-xs text-gray-400">Fecha</div>
              <div className="text-xs sm:text-sm font-semibold text-white truncate">
                {formatearFecha(reserva.fecha)}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-3 p-1.5 sm:p-3 bg-gray-900/50 rounded-lg sm:rounded-xl">
            <FaClock className="text-purple-400 text-sm sm:text-lg flex-shrink-0" />
            <div className="min-w-0">
              <div className="text-[10px] sm:text-xs text-gray-400">Hora</div>
              <div className="text-xs sm:text-sm font-semibold text-white truncate">
                {reserva.hora || "Por definir"}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-3 p-1.5 sm:p-3 bg-gray-900/50 rounded-lg sm:rounded-xl">
            <FaUsers className="text-green-400 text-sm sm:text-lg flex-shrink-0" />
            <div className="min-w-0">
              <div className="text-[10px] sm:text-xs text-gray-400">
                Adultos
              </div>
              <div className="text-xs sm:text-sm font-semibold text-white">
                {reserva.adultos}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-3 p-1.5 sm:p-3 bg-gray-900/50 rounded-lg sm:rounded-xl">
            <FaChild className="text-yellow-400 text-sm sm:text-lg flex-shrink-0" />
            <div className="min-w-0">
              <div className="text-[10px] sm:text-xs text-gray-400">Niños</div>
              <div className="text-xs sm:text-sm font-semibold text-white">
                {reserva.niños}
              </div>
            </div>
          </div>
        </div>

        {/* Información de contacto optimizada para móvil */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-1.5 sm:gap-4 mb-3 sm:mb-6">
          <div className="flex items-center gap-1.5 sm:gap-3 p-1.5 sm:p-3 bg-gray-900/30 rounded-lg sm:rounded-xl">
            <FaEnvelope className="text-blue-400 text-sm sm:text-lg flex-shrink-0" />
            <div className="min-w-0 flex-1">
              <div className="text-[10px] sm:text-xs text-gray-400">
                Contacto
              </div>
              <div className="text-xs sm:text-sm font-semibold text-white truncate">
                {reserva.nombre}
              </div>
              <div className="text-[10px] sm:text-xs text-gray-300 truncate">
                {reserva.correo}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-3 p-1.5 sm:p-3 bg-gray-900/30 rounded-lg sm:rounded-xl">
            <FaPhone className="text-green-400 text-sm sm:text-lg flex-shrink-0" />
            <div className="min-w-0">
              <div className="text-[10px] sm:text-xs text-gray-400">
                Teléfono
              </div>
              <div className="text-xs sm:text-sm font-semibold text-white">
                {reserva.telefono}
              </div>
            </div>
          </div>
        </div>

        {/* Ubicación optimizada para móvil */}
        {reserva.Tour?.ubicacion && (
          <div className="flex items-center gap-1.5 sm:gap-3 p-1.5 sm:p-3 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 rounded-lg sm:rounded-xl mb-3 sm:mb-6">
            <FaMapMarkerAlt className="text-cyan-400 text-sm sm:text-lg flex-shrink-0" />
            <div className="min-w-0">
              <div className="text-[10px] sm:text-xs text-gray-400">
                Ubicación
              </div>
              <div className="text-xs sm:text-sm font-semibold text-white truncate">
                {reserva.Tour.ubicacion}
              </div>
            </div>
          </div>
        )}

        {/* Botones de acción optimizados para móvil */}
        <div className="space-y-2 sm:space-y-0 sm:flex sm:flex-wrap sm:gap-3 mb-3 sm:mb-4">
          <motion.button
            onClick={() => setShowDetalles(!showDetalles)}
            className="w-full sm:w-auto px-3 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-lg sm:rounded-xl font-semibold flex items-center justify-center gap-1 sm:gap-2"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {showDetalles ? (
              <FaChevronUp className="text-xs sm:text-sm" />
            ) : (
              <FaChevronDown className="text-xs sm:text-sm" />
            )}
            <span className="text-xs sm:text-sm">
              {showDetalles ? "Ocultar" : "Detalles"}
            </span>
          </motion.button>

          {!isCancelada && (
            <div className="grid grid-cols-2 gap-2 sm:flex sm:gap-3">
              <motion.button
                onClick={() => setShowReprogramar(!showReprogramar)}
                disabled={loading}
                className="px-2 py-2 sm:px-3 sm:py-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-lg sm:rounded-xl font-semibold text-xs sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                whileHover={{ scale: loading ? 1 : 1.02 }}
                whileTap={{ scale: loading ? 1 : 0.98 }}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-1 sm:gap-2">
                    <FaSpinner className="animate-spin text-xs sm:text-sm" />
                    <span>Procesando...</span>
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-1 sm:gap-2">
                    <FaEdit className="text-xs sm:text-sm" />
                    <span>Reprogramar</span>
                  </span>
                )}
              </motion.button>

              <motion.button
                onClick={cancelarReserva}
                disabled={loading}
                className="px-2 py-2 sm:px-3 sm:py-2 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-lg sm:rounded-xl font-semibold text-xs sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                whileHover={{ scale: loading ? 1 : 1.02 }}
                whileTap={{ scale: loading ? 1 : 0.98 }}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-1 sm:gap-2">
                    <FaSpinner className="animate-spin text-xs sm:text-sm" />
                    <span>Cancelando...</span>
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-1 sm:gap-2">
                    <FaTimes className="text-xs sm:text-sm" />
                    <span>Cancelar</span>
                  </span>
                )}
              </motion.button>
            </div>
          )}
        </div>

        {/* Panel de reprogramación optimizado para móvil */}
        {showReprogramar && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 p-3 sm:p-4 rounded-xl border border-yellow-500/30 mb-3 sm:mb-4"
          >
            <h4 className="text-base sm:text-lg font-semibold text-yellow-400 mb-3 sm:mb-4 flex items-center gap-1 sm:gap-2">
              <FaEdit className="text-sm sm:text-base" />
              Reprogramar Reserva
            </h4>

            {loadingFechas ? (
              <div className="flex items-center justify-center gap-2 sm:gap-3 p-4 sm:p-8 bg-gray-900/50 border border-yellow-500/30 rounded-xl text-white">
                <FaSpinner className="animate-spin text-yellow-400 text-sm sm:text-xl" />
                <span className="text-xs sm:text-lg">Cargando fechas...</span>
              </div>
            ) : fechasDisponibles.length === 0 ? (
              <div className="p-3 sm:p-6 bg-gray-900/50 border border-yellow-500/30 rounded-xl text-center">
                <FaExclamationTriangle className="text-yellow-400 text-lg sm:text-2xl mb-2 sm:mb-3 mx-auto" />
                <p className="text-xs sm:text-base text-white mb-1 sm:mb-2">
                  No hay fechas disponibles
                </p>
              </div>
            ) : (
              <>
                <CustomCalendar
                  availableDates={fechasDisponibles}
                  selectedDate={nuevaFecha}
                  onDateSelect={setNuevaFecha}
                />

                {nuevaFecha && (
                  <div className="mt-3 sm:mt-4 p-2 sm:p-3 bg-green-500/10 rounded-lg border border-green-500/20">
                    <div className="flex items-center gap-1 sm:gap-2">
                      <FaCalendarAlt className="text-green-400 text-xs sm:text-sm" />
                      <span className="text-xs sm:text-sm text-green-400 font-semibold">
                        Fecha:
                      </span>
                      <span className="text-xs sm:text-sm text-white">
                        {formatearFechaSeleccionada(nuevaFecha)}
                      </span>
                    </div>
                  </div>
                )}

                <form
                  onSubmit={reprogramarReserva}
                  className="mt-4 sm:mt-6 grid grid-cols-2 gap-2 sm:flex sm:gap-3"
                >
                  <motion.button
                    type="submit"
                    disabled={loading || !nuevaFecha}
                    className="px-2 py-2 sm:px-4 sm:py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-lg sm:rounded-xl font-semibold text-xs sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    whileHover={{ scale: loading || !nuevaFecha ? 1 : 1.02 }}
                    whileTap={{ scale: loading || !nuevaFecha ? 1 : 0.98 }}
                  >
                    {loading ? (
                      <span className="flex items-center justify-center gap-1 sm:gap-2">
                        <FaSpinner className="animate-spin" />
                        <span className="hidden sm:inline">
                          Reprogramando...
                        </span>
                        <span className="sm:hidden">Procesando</span>
                      </span>
                    ) : (
                      <>
                        <FaCheck className="inline mr-1 sm:mr-2" />
                        <span>Confirmar</span>
                      </>
                    )}
                  </motion.button>

                  <motion.button
                    type="button"
                    onClick={() => {
                      setShowReprogramar(false);
                      setNuevaFecha("");
                    }}
                    className="px-2 py-2 sm:px-4 sm:py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg sm:rounded-xl font-semibold text-xs sm:text-sm"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <FaTimes className="inline mr-1 sm:mr-2" />
                    <span>Cancelar</span>
                  </motion.button>
                </form>
              </>
            )}
          </motion.div>
        )}

        {/* Panel de detalles optimizado para móvil */}
        {showDetalles && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-gradient-to-r from-cyan-500/10 to-purple-500/10 p-3 sm:p-4 rounded-xl border border-cyan-500/30"
          >
            <h4 className="text-base sm:text-lg font-semibold text-cyan-400 mb-3 sm:mb-4 flex items-center gap-1 sm:gap-2">
              <FaInfoCircle className="text-sm sm:text-base" />
              Detalles de la Reserva
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-4">
              {reserva.participantes && reserva.participantes.length > 0 && (
                <div>
                  <h5 className="text-xs sm:text-sm font-semibold text-gray-300 mb-1 sm:mb-2">
                    Participantes:
                  </h5>
                  <div className="space-y-1 sm:space-y-2">
                    {reserva.participantes.map((participante, index) => (
                      <div
                        key={index}
                        className="p-1.5 sm:p-2 bg-gray-900/50 rounded sm:rounded-lg"
                      >
                        <div className="text-xs sm:text-sm font-medium text-white">
                          {participante.nombre}
                        </div>
                        {participante.identidad && (
                          <div className="text-[10px] sm:text-xs text-gray-400">
                            ID: {participante.identidad}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {reserva.contactoEmergencia && (
                <div>
                  <h5 className="text-xs sm:text-sm font-semibold text-gray-300 mb-1 sm:mb-2">
                    Contacto de Emergencia:
                  </h5>
                  <div className="p-1.5 sm:p-2 bg-gray-900/50 rounded sm:rounded-lg">
                    <div className="text-xs sm:text-sm font-medium text-white">
                      {reserva.contactoEmergencia.nombre}
                    </div>
                    <div className="text-[10px] sm:text-xs text-gray-400">
                      {reserva.contactoEmergencia.telefono}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-3 sm:mt-4 pt-2 sm:pt-4 border-t border-gray-700/50 text-xs sm:text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Creado:</span>
                <span className="text-white">
                  {new Date(reserva.createdAt).toLocaleDateString("es-ES", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  })}
                </span>
              </div>
              <div className="flex justify-between mt-1 sm:mt-2">
                <span className="text-gray-400">Actualizado:</span>
                <span className="text-white">
                  {new Date(reserva.updatedAt).toLocaleDateString("es-ES", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  })}
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
