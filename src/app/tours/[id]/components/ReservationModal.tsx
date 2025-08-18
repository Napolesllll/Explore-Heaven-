import { motion } from "framer-motion";
import {
  FaTimes,
  FaCalendarAlt,
  FaArrowLeft,
  FaArrowRight,
  FaUser,
  FaUserFriends,
  FaUserAlt,
  FaPhone,
  FaExclamationTriangle,
  FaIdCard,
  FaBirthdayCake,
  FaShieldAlt,
  FaChevronLeft,
  FaChevronRight,
  FaExclamationCircle,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";
import { useForm, useFormContext, FormProvider } from "react-hook-form";
import { useState } from "react";
import PrivacyPolicyModal from "./PrivacyPolicy";
import { useAvailableDates } from "../hooks/useAvailableDates";

// Definición del tipo de datos del formulario
export type ReservationFormData = {
  nombre: string;
  correo: string;
  telefono: string;
  fechaId: string;
  adultos: number;
  niños: number;
  participantes: {
    nombre: string;
    tipoDocumento:
      | "cedula_ciudadania"
      | "cedula_extranjera"
      | "pasaporte"
      | "tarjeta_identidad";
    numeroDocumento: string;
    fechaNacimiento: string;
  }[];
  contactoEmergencia: {
    nombre: string;
    telefono: string;
  };
};

// Tipos de documento disponibles
const TIPOS_DOCUMENTO = [
  { value: "cedula_ciudadania", label: "Cédula de Ciudadanía" },
  { value: "cedula_extranjera", label: "Cédula de Extranjería" },
  { value: "pasaporte", label: "Pasaporte" },
  { value: "tarjeta_identidad", label: "Tarjeta de Identidad (Menores)" },
];

// Componente del calendario personalizado actualizado
function CustomCalendar({ tour, selectedDateId, onDateSelect, errors }) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const { availableDates, loading, error, stats } = useAvailableDates(tour.id);

  // Obtener el primer y último día del mes actual
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

  // Obtener el día de la semana del primer día (0 = domingo)
  const firstDayWeekday = firstDayOfMonth.getDay();

  // Generar array de días del mes
  const daysInMonth = lastDayOfMonth.getDate();
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  // Generar días vacíos al inicio del mes
  const emptyDays = Array.from({ length: firstDayWeekday }, (_, i) => null);

  // Función para obtener información de una fecha específica
  const getDateInfo = (day: number) => {
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

  // Función para verificar si una fecha está seleccionada
  const isDateSelected = (day: number) => {
    const dateInfo = getDateInfo(day);
    return dateInfo ? dateInfo.id === selectedDateId : false;
  };

  // Función para manejar la selección de fecha
  const handleDateSelect = (day: number) => {
    const dateInfo = getDateInfo(day);
    if (dateInfo && dateInfo.isAvailable) {
      onDateSelect(dateInfo.id);
    }
  };

  // Navegación de meses
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

  // Nombres de los meses y días
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
      <div
        className={`bg-gradient-to-br from-red-900/50 to-red-900/50 rounded-xl p-4 border-2 border-red-500/50 backdrop-blur-sm`}
      >
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
      {/* Estadísticas de disponibilidad */}
      <div className="mb-4 p-3 bg-indigo-800/30 rounded-lg border border-indigo-500/20">
        <div className="grid grid-cols-2 gap-2 text-xs text-indigo-200">
          <div>📅 Total: {stats.total}</div>
          <div>✅ Disponibles: {stats.available}</div>
          <div>⚠️ Ya reservaste: {stats.userReservations}</div>
          <div>❌ Sin cupos: {stats.fullyBooked}</div>
        </div>
      </div>

      {/* Header del calendario */}
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

      {/* Días del calendario */}
      <div className="grid grid-cols-7 gap-1">
        {/* Días vacíos al inicio */}
        {emptyDays.map((_, index) => (
          <div key={`empty-${index}`} className="p-2"></div>
        ))}

        {/* Días del mes */}
        {days.map((day) => {
          const dateInfo = getDateInfo(day);
          const isSelected = isDateSelected(day);

          if (!dateInfo) {
            // Día sin fecha disponible
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
              className={`
                p-2 text-sm rounded-lg transition-all duration-200 relative min-h-[40px] flex flex-col items-center justify-center
                ${
                  isAvailable
                    ? isSelected
                      ? "bg-indigo-600 text-white shadow-lg ring-2 ring-indigo-400"
                      : "bg-indigo-700/50 text-indigo-100 hover:bg-indigo-600 hover:text-white"
                    : userHasReservation
                      ? "bg-yellow-600/30 text-yellow-300 cursor-not-allowed border border-yellow-500/50"
                      : "bg-red-600/30 text-red-300 cursor-not-allowed border border-red-500/50"
                }
              `}
            >
              <span className="font-medium">{day}</span>

              {/* Indicadores visuales */}
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

              {/* Mostrar cupos restantes */}
              {isAvailable && spotsLeft < 3 && (
                <span className="text-xs text-indigo-200 font-semibold">
                  {spotsLeft}
                </span>
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Leyenda actualizada */}
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

      {/* Información de la fecha seleccionada */}
      {selectedDateId && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-3 p-3 bg-indigo-800/50 rounded-lg border border-indigo-500/30"
        >
          {(() => {
            const selectedDateInfo = availableDates.find(
              (d) => d.id === selectedDateId
            );
            if (!selectedDateInfo) return null;

            return (
              <div className="text-sm text-indigo-200">
                <p className="text-center mb-2">
                  <span className="font-semibold text-white">
                    {selectedDateInfo.dateObj.toLocaleDateString("es-ES", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </p>
                <div className="flex justify-center items-center gap-4">
                  <div className="flex items-center gap-1">
                    <FaCheckCircle className="text-green-400" />
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
        <div className="mt-4 p-3 bg-red-900/20 rounded-lg border border-red-500/30 text-center">
          <FaExclamationCircle className="text-red-400 mx-auto mb-2" />
          <p className="text-red-200 text-sm">
            No hay fechas disponibles en este momento
          </p>
          {stats.userReservations > 0 && (
            <p className="text-yellow-200 text-xs mt-1">
              Ya tienes {stats.userReservations} reserva
              {stats.userReservations !== 1 ? "s" : ""} para este tour
            </p>
          )}
        </div>
      )}
    </div>
  );
}

// Componente para el paso 1: Información básica
function Step1({ tour, nextStep }) {
  const {
    register,
    formState: { errors },
    trigger,
    setValue,
    watch,
  } = useFormContext();

  const selectedDateId = watch("fechaId");

  const handleNext = async () => {
    const isValid = await trigger(["nombre", "correo", "telefono", "fechaId"]);
    if (isValid) nextStep();
  };

  const handleDateSelect = (dateId) => {
    setValue("fechaId", dateId, { shouldValidate: true });
  };

  return (
    <>
      <div className="space-y-4">
        {/* Campo Nombre Completo */}
        <div>
          <label
            htmlFor="nombre"
            className="block text-indigo-300 mb-1 flex items-center gap-2"
          >
            <FaUser className="text-indigo-400" />
            <span>Nombre completo</span>
          </label>
          <input
            id="nombre"
            type="text"
            {...register("nombre", { required: "Nombre es obligatorio" })}
            className={`w-full p-2 rounded bg-gray-800 text-white border ${
              errors.nombre ? "border-red-500" : "border-indigo-500/20"
            } focus:ring-2 focus:ring-indigo-400 outline-none`}
          />
          {errors.nombre && (
            <p className="text-red-400 text-sm mt-1">{errors.nombre.message}</p>
          )}
        </div>

        {/* Campo Correo Electrónico */}
        <div>
          <label
            htmlFor="correo"
            className="block text-indigo-300 mb-1 flex items-center gap-2"
          >
            <FaUser className="text-indigo-400" />
            <span>Correo electrónico</span>
          </label>
          <input
            id="correo"
            type="email"
            {...register("correo", {
              required: "Correo es obligatorio",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Correo inválido",
              },
            })}
            className={`w-full p-2 rounded bg-gray-800 text-white border ${
              errors.correo ? "border-red-500" : "border-indigo-500/20"
            } focus:ring-2 focus:ring-indigo-400 outline-none`}
          />
          {errors.correo && (
            <p className="text-red-400 text-sm mt-1">{errors.correo.message}</p>
          )}
        </div>

        {/* Campo Teléfono */}
        <div>
          <label
            htmlFor="telefono"
            className="block text-indigo-300 mb-1 flex items-center gap-2"
          >
            <FaPhone className="text-indigo-400" />
            <span>Teléfono</span>
          </label>
          <input
            id="telefono"
            type="tel"
            {...register("telefono", {
              required: "Teléfono es obligatorio",
              pattern: {
                value: /^[0-9+-\s()]{7,20}$/,
                message: "Teléfono inválido",
              },
            })}
            className={`w-full p-2 rounded bg-gray-800 text-white border ${
              errors.telefono ? "border-red-500" : "border-indigo-500/20"
            } focus:ring-2 focus:ring-indigo-400 outline-none`}
          />
          {errors.telefono && (
            <p className="text-red-400 text-sm mt-1">
              {errors.telefono.message}
            </p>
          )}
        </div>

        {/* Calendario personalizado */}
        <div>
          <label className="block text-indigo-300 mb-2 flex items-center gap-2">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ repeat: Infinity, duration: 3 }}
            >
              <FaCalendarAlt className="text-indigo-400" />
            </motion.div>
            <span className="bg-gradient-to-r from-indigo-300 to-purple-300 bg-clip-text text-transparent">
              Selecciona una fecha disponible
            </span>
          </label>

          <CustomCalendar
            tour={tour}
            selectedDateId={selectedDateId}
            onDateSelect={handleDateSelect}
            errors={errors.fechaId}
          />

          {errors.fechaId && (
            <p className="text-red-400 text-sm mt-2">
              {errors.fechaId.message}
            </p>
          )}

          {/* Input oculto para el formulario */}
          <input
            type="hidden"
            {...register("fechaId", { required: "Seleccione una fecha" })}
          />
        </div>
      </div>

      <div className="mt-8 flex justify-end">
        <motion.button
          type="button"
          onClick={handleNext}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-6 rounded-xl transition-all duration-300"
        >
          Siguiente <FaArrowRight />
        </motion.button>
      </div>
    </>
  );
}

// Componente para el paso 2: Número de personas
function Step2({ tour, nextStep, prevStep }) {
  const {
    register,
    formState: { errors },
    trigger,
    watch,
  } = useFormContext();
  const adultos = watch("adultos") || 1;
  const niños = watch("niños") || 0;
  const totalPersonas = adultos + niños;

  const handleNext = async () => {
    const isValid = await trigger(["adultos", "niños"]);
    if (isValid) nextStep();
  };

  return (
    <>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="adultos"
              className="block text-indigo-300 mb-1 flex items-center gap-2"
            >
              <FaUserFriends className="text-indigo-400" />
              <span>Adultos</span>
            </label>
            <input
              id="adultos"
              type="number"
              min="1"
              max={tour.maxReservas}
              {...register("adultos", {
                required: "Por favor ingrese el número de adultos",
                valueAsNumber: true,
                min: { value: 1, message: "Mínimo 1 adulto" },
                max: {
                  value: tour.maxReservas,
                  message: `Máximo ${tour.maxReservas} personas`,
                },
              })}
              className={`w-full p-2 rounded bg-gray-800 text-white border ${
                errors.adultos ? "border-red-500" : "border-indigo-500/20"
              } focus:ring-2 focus:ring-indigo-400 outline-none`}
            />
            {errors.adultos && (
              <p className="text-red-400 text-sm mt-1">
                {errors.adultos.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="niños"
              className="block text-indigo-300 mb-1 flex items-center gap-2"
            >
              <FaUserFriends className="text-indigo-400" />
              <span>Niños</span>
            </label>
            <input
              id="niños"
              type="number"
              min="0"
              max={tour.maxReservas - adultos}
              {...register("niños", {
                valueAsNumber: true,
                min: { value: 0, message: "No puede ser negativo" },
                max: {
                  value: tour.maxReservas - adultos,
                  message: `Máximo ${tour.maxReservas - adultos} niños`,
                },
              })}
              className={`w-full p-2 rounded bg-gray-800 text-white border ${
                errors.niños ? "border-red-500" : "border-indigo-500/20"
              } focus:ring-2 focus:ring-indigo-400 outline-none`}
            />
            {errors.niños && (
              <p className="text-red-400 text-sm mt-1">
                {errors.niños.message}
              </p>
            )}
          </div>
        </div>

        <div className="bg-indigo-900/30 p-4 rounded-lg border border-indigo-500/30">
          <p className="text-indigo-200 text-sm">
            Capacidad máxima:{" "}
            <span className="font-bold">{tour.maxReservas} personas</span>
          </p>
          <p className="text-indigo-200 text-sm mt-1">
            Total en tu grupo:{" "}
            <span className="font-bold">
              {totalPersonas} persona{totalPersonas !== 1 ? "s" : ""}
            </span>
          </p>
        </div>
      </div>

      <div className="mt-8 flex justify-between">
        <button
          type="button"
          onClick={prevStep}
          className="flex items-center gap-2 text-indigo-300 hover:text-white"
        >
          <FaArrowLeft /> Anterior
        </button>
        <button
          type="button"
          onClick={handleNext}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-6 rounded-xl transition-all duration-300"
        >
          Siguiente <FaArrowRight />
        </button>
      </div>
    </>
  );
}

// Componente para el paso 3: Información de participantes
function Step3({
  prevStep,
  nextStep,
}: {
  prevStep: () => void;
  nextStep: () => void;
}) {
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);

  const {
    register,
    formState: { errors },
    watch,
    trigger,
  } = useFormContext<ReservationFormData>();
  const adultos = watch("adultos") || 1;
  const niños = watch("niños") || 0;
  const totalPersonas = adultos + niños;

  const handleNext = async () => {
    // Validar todos los campos de participantes
    const fieldsToValidate = [];
    for (let i = 0; i < totalPersonas; i++) {
      fieldsToValidate.push(
        `participantes.${i}.nombre`,
        `participantes.${i}.tipoDocumento`,
        `participantes.${i}.numeroDocumento`,
        `participantes.${i}.fechaNacimiento`
      );
    }

    const isValid = await trigger(fieldsToValidate);
    if (isValid) nextStep();
  };

  return (
    <>
      <div className="space-y-4">
        <div className="flex items-start gap-3 mb-4">
          <h3 className="text-lg font-semibold text-indigo-300">
            Información de los participantes
          </h3>
        </div>

        {/* Aviso importante sobre seguros médicos */}
        <div className="bg-blue-900/30 p-4 rounded-lg border border-blue-500/30 mb-6">
          <div className="flex items-start gap-3">
            <FaShieldAlt className="text-blue-400 mt-1 flex-shrink-0" />
            <div>
              <p className="text-blue-200 text-sm font-semibold mb-2">
                Información importante sobre seguros médicos
              </p>
              <p className="text-blue-200 text-xs mb-3">
                Todos los datos de identificación y fechas de nacimiento son
                obligatorios para procesar los seguros médicos durante el tour.
                Esta información es requerida por nuestras pólizas de seguro
                para garantizar la cobertura completa de todos los
                participantes.
              </p>
              <p className="text-blue-200 text-xs">
                <button
                  type="button"
                  onClick={() => setShowPrivacyModal(true)}
                  className="text-blue-300 hover:text-blue-100 underline decoration-blue-400 underline-offset-2 transition-colors"
                >
                  "Consulta nuestras políticas de protección de datos"
                </button>{" "}
                - En caso de continuar se entiende la aceptación de dichas
                políticas. Contrato disponible en el perfil de la empresa.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-indigo-900/30 p-4 rounded-lg border border-indigo-500/30 mb-4">
          <p className="text-indigo-200 text-sm">
            Por favor completa toda la información de los participantes (
            {totalPersonas} persona{totalPersonas !== 1 ? "s" : ""})
          </p>
        </div>

        {/* Campos para adultos */}
        {[...Array(adultos)].map((_, index) => (
          <motion.div
            key={`adulto-${index}`}
            className="bg-gray-900/50 p-4 rounded-lg border border-indigo-500/20 mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <h4 className="text-indigo-300 font-semibold mb-3 flex items-center gap-2">
              <FaUser className="text-indigo-400" />
              Adulto {index + 1}
            </h4>

            {/* Nombre */}
            <div className="mb-3">
              <label
                htmlFor={`adulto-nombre-${index}`}
                className="block text-indigo-300 mb-1 text-sm"
              >
                Nombre completo *
              </label>
              <input
                id={`adulto-nombre-${index}`}
                type="text"
                {...register(`participantes.${index}.nombre`, {
                  required: `Nombre del adulto ${index + 1} es obligatorio`,
                })}
                className={`w-full p-2 rounded bg-gray-800 text-white border ${
                  errors.participantes?.[index]?.nombre
                    ? "border-red-500"
                    : "border-indigo-500/20"
                } focus:ring-2 focus:ring-indigo-400 outline-none`}
                placeholder={`Nombre completo del adulto ${index + 1}`}
              />
              {errors.participantes?.[index]?.nombre && (
                <p className="text-red-400 text-sm mt-1">
                  {errors.participantes[index]?.nombre?.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
              {/* Tipo de documento */}
              <div>
                <label
                  htmlFor={`adulto-tipo-doc-${index}`}
                  className="block text-indigo-300 mb-1 text-sm flex items-center gap-1"
                >
                  <FaIdCard className="text-indigo-400" />
                  Tipo de documento *
                </label>
                <select
                  id={`adulto-tipo-doc-${index}`}
                  {...register(`participantes.${index}.tipoDocumento`, {
                    required: `Tipo de documento del adulto ${index + 1} es obligatorio`,
                  })}
                  className={`w-full p-2 rounded bg-gray-800 text-white border ${
                    errors.participantes?.[index]?.tipoDocumento
                      ? "border-red-500"
                      : "border-indigo-500/20"
                  } focus:ring-2 focus:ring-indigo-400 outline-none`}
                >
                  <option value="">Seleccione tipo</option>
                  {TIPOS_DOCUMENTO.map((tipo) => (
                    <option key={tipo.value} value={tipo.value}>
                      {tipo.label}
                    </option>
                  ))}
                </select>
                {errors.participantes?.[index]?.tipoDocumento && (
                  <p className="text-red-400 text-sm mt-1">
                    {errors.participantes[index]?.tipoDocumento?.message}
                  </p>
                )}
              </div>

              {/* Número de documento */}
              <div>
                <label
                  htmlFor={`adulto-num-doc-${index}`}
                  className="block text-indigo-300 mb-1 text-sm"
                >
                  Número de documento *
                </label>
                <input
                  id={`adulto-num-doc-${index}`}
                  type="text"
                  {...register(`participantes.${index}.numeroDocumento`, {
                    required: `Número de documento del adulto ${index + 1} es obligatorio`,
                    pattern: {
                      value: /^[A-Za-z0-9-]+$/,
                      message: "Formato de documento inválido",
                    },
                  })}
                  className={`w-full p-2 rounded bg-gray-800 text-white border ${
                    errors.participantes?.[index]?.numeroDocumento
                      ? "border-red-500"
                      : "border-indigo-500/20"
                  } focus:ring-2 focus:ring-indigo-400 outline-none`}
                  placeholder="Número de identificación"
                />
                {errors.participantes?.[index]?.numeroDocumento && (
                  <p className="text-red-400 text-sm mt-1">
                    {errors.participantes[index]?.numeroDocumento?.message}
                  </p>
                )}
              </div>
            </div>

            {/* Fecha de nacimiento */}
            <div>
              <label
                htmlFor={`adulto-fecha-${index}`}
                className="block text-indigo-300 mb-1 text-sm flex items-center gap-1"
              >
                <FaBirthdayCake className="text-indigo-400" />
                Fecha de nacimiento *
              </label>
              <input
                id={`adulto-fecha-${index}`}
                type="date"
                {...register(`participantes.${index}.fechaNacimiento`, {
                  required: `Fecha de nacimiento del adulto ${index + 1} es obligatoria`,
                  validate: {
                    isAdult: (value) => {
                      const birthDate = new Date(value);
                      const today = new Date();
                      const age = today.getFullYear() - birthDate.getFullYear();
                      const monthDiff = today.getMonth() - birthDate.getMonth();

                      if (
                        monthDiff < 0 ||
                        (monthDiff === 0 &&
                          today.getDate() < birthDate.getDate())
                      ) {
                        return (
                          age - 1 >= 18 ||
                          "Los adultos deben ser mayores de 18 años"
                        );
                      }
                      return (
                        age >= 18 || "Los adultos deben ser mayores de 18 años"
                      );
                    },
                  },
                })}
                max={new Date().toISOString().split("T")[0]}
                className={`w-full p-2 rounded bg-gray-800 text-white border ${
                  errors.participantes?.[index]?.fechaNacimiento
                    ? "border-red-500"
                    : "border-indigo-500/20"
                } focus:ring-2 focus:ring-indigo-400 outline-none`}
              />
              {errors.participantes?.[index]?.fechaNacimiento && (
                <p className="text-red-400 text-sm mt-1">
                  {errors.participantes[index]?.fechaNacimiento?.message}
                </p>
              )}
            </div>
          </motion.div>
        ))}

        {/* Campos para niños */}
        {[...Array(niños)].map((_, index) => (
          <motion.div
            key={`niño-${index}`}
            className="bg-purple-900/20 p-4 rounded-lg border border-purple-500/20 mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: (adultos + index) * 0.1 }}
          >
            <h4 className="text-purple-300 font-semibold mb-3 flex items-center gap-2">
              <FaUser className="text-purple-400" />
              Niño {index + 1}
            </h4>

            {/* Nombre */}
            <div className="mb-3">
              <label
                htmlFor={`niño-nombre-${index}`}
                className="block text-purple-300 mb-1 text-sm"
              >
                Nombre completo *
              </label>
              <input
                id={`niño-nombre-${index}`}
                type="text"
                {...register(`participantes.${adultos + index}.nombre`, {
                  required: `Nombre del niño ${index + 1} es obligatorio`,
                })}
                className={`w-full p-2 rounded bg-gray-800 text-white border ${
                  errors.participantes?.[adultos + index]?.nombre
                    ? "border-red-500"
                    : "border-purple-500/20"
                } focus:ring-2 focus:ring-purple-400 outline-none`}
                placeholder={`Nombre completo del niño ${index + 1}`}
              />
              {errors.participantes?.[adultos + index]?.nombre && (
                <p className="text-red-400 text-sm mt-1">
                  {errors.participantes[adultos + index]?.nombre?.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
              {/* Tipo de documento */}
              <div>
                <label
                  htmlFor={`niño-tipo-doc-${index}`}
                  className="block text-purple-300 mb-1 text-sm flex items-center gap-1"
                >
                  <FaIdCard className="text-purple-400" />
                  Tipo de documento *
                </label>
                <select
                  id={`niño-tipo-doc-${index}`}
                  {...register(
                    `participantes.${adultos + index}.tipoDocumento`,
                    {
                      required: `Tipo de documento del niño ${index + 1} es obligatorio`,
                    }
                  )}
                  className={`w-full p-2 rounded bg-gray-800 text-white border ${
                    errors.participantes?.[adultos + index]?.tipoDocumento
                      ? "border-red-500"
                      : "border-purple-500/20"
                  } focus:ring-2 focus:ring-purple-400 outline-none`}
                >
                  <option value="">Seleccione tipo</option>
                  {TIPOS_DOCUMENTO.map((tipo) => (
                    <option key={tipo.value} value={tipo.value}>
                      {tipo.label}
                    </option>
                  ))}
                </select>
                {errors.participantes?.[adultos + index]?.tipoDocumento && (
                  <p className="text-red-400 text-sm mt-1">
                    {
                      errors.participantes[adultos + index]?.tipoDocumento
                        ?.message
                    }
                  </p>
                )}
              </div>

              {/* Número de documento */}
              <div>
                <label
                  htmlFor={`niño-num-doc-${index}`}
                  className="block text-purple-300 mb-1 text-sm"
                >
                  Número de documento *
                </label>
                <input
                  id={`niño-num-doc-${index}`}
                  type="text"
                  {...register(
                    `participantes.${adultos + index}.numeroDocumento`,
                    {
                      required: `Número de documento del niño ${index + 1} es obligatorio`,
                      pattern: {
                        value: /^[A-Za-z0-9-]+$/,
                        message: "Formato de documento inválido",
                      },
                    }
                  )}
                  className={`w-full p-2 rounded bg-gray-800 text-white border ${
                    errors.participantes?.[adultos + index]?.numeroDocumento
                      ? "border-red-500"
                      : "border-purple-500/20"
                  } focus:ring-2 focus:ring-purple-400 outline-none`}
                  placeholder="Número de identificación"
                />
                {errors.participantes?.[adultos + index]?.numeroDocumento && (
                  <p className="text-red-400 text-sm mt-1">
                    {
                      errors.participantes[adultos + index]?.numeroDocumento
                        ?.message
                    }
                  </p>
                )}
              </div>
            </div>

            {/* Fecha de nacimiento */}
            <div>
              <label
                htmlFor={`niño-fecha-${index}`}
                className="block text-purple-300 mb-1 text-sm flex items-center gap-1"
              >
                <FaBirthdayCake className="text-purple-400" />
                Fecha de nacimiento *
              </label>
              <input
                id={`niño-fecha-${index}`}
                type="date"
                {...register(
                  `participantes.${adultos + index}.fechaNacimiento`,
                  {
                    required: `Fecha de nacimiento del niño ${index + 1} es obligatoria`,
                    validate: {
                      isMinor: (value) => {
                        const birthDate = new Date(value);
                        const today = new Date();
                        const age =
                          today.getFullYear() - birthDate.getFullYear();
                        const monthDiff =
                          today.getMonth() - birthDate.getMonth();

                        if (
                          monthDiff < 0 ||
                          (monthDiff === 0 &&
                            today.getDate() < birthDate.getDate())
                        ) {
                          return (
                            age - 1 < 18 ||
                            "Los niños deben ser menores de 18 años"
                          );
                        }
                        return (
                          age < 18 || "Los niños deben ser menores de 18 años"
                        );
                      },
                    },
                  }
                )}
                max={new Date().toISOString().split("T")[0]}
                className={`w-full p-2 rounded bg-gray-800 text-white border ${
                  errors.participantes?.[adultos + index]?.fechaNacimiento
                    ? "border-red-500"
                    : "border-purple-500/20"
                } focus:ring-2 focus:ring-purple-400 outline-none`}
              />
              {errors.participantes?.[adultos + index]?.fechaNacimiento && (
                <p className="text-red-400 text-sm mt-1">
                  {
                    errors.participantes[adultos + index]?.fechaNacimiento
                      ?.message
                  }
                </p>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-8 flex justify-between">
        <button
          type="button"
          onClick={prevStep}
          className="flex items-center gap-2 text-indigo-300 hover:text-white"
        >
          <FaArrowLeft /> Anterior
        </button>
        <button
          type="button"
          onClick={handleNext}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-6 rounded-xl transition-all duration-300"
        >
          Siguiente <FaArrowRight />
        </button>
      </div>

      {/* Modal de Políticas de Protección de Datos */}
      <PrivacyPolicyModal
        isOpen={showPrivacyModal}
        onClose={() => setShowPrivacyModal(false)}
      />
    </>
  );
}

// Componente para el paso 4: Contacto de emergencia
function Step4({
  prevStep,
  onSubmit,
  isSubmitting,
}: {
  prevStep: () => void;
  onSubmit: () => void;
  isSubmitting: boolean;
}) {
  const {
    register,
    formState: { errors },
  } = useFormContext<ReservationFormData>();

  return (
    <>
      <div className="space-y-4">
        <div className="bg-yellow-900/30 p-4 rounded-lg border border-yellow-500/30 flex items-start gap-3">
          <FaExclamationTriangle className="text-yellow-400 mt-1 flex-shrink-0" />
          <p className="text-yellow-200 text-sm">
            Por favor proporciona al menos un contacto de emergencia que podamos
            usar en caso necesario durante el tour.
          </p>
        </div>

        {/* Campo Nombre Contacto Emergencia */}
        <div>
          <label
            htmlFor="contactoEmergenciaNombre"
            className="block text-indigo-300 mb-1 flex items-center gap-2"
          >
            <FaUserAlt className="text-indigo-400" />
            <span>Nombre completo del contacto</span>
          </label>
          <input
            id="contactoEmergenciaNombre"
            type="text"
            {...register("contactoEmergencia.nombre", {
              required: "Por favor ingrese el nombre de contacto de emergencia",
            })}
            className={`w-full p-2 rounded bg-gray-800 text-white border ${
              errors.contactoEmergencia?.nombre
                ? "border-red-500"
                : "border-indigo-500/20"
            } focus:ring-2 focus:ring-indigo-400 outline-none`}
            placeholder="Nombre completo"
          />
          {errors.contactoEmergencia?.nombre && (
            <p className="text-red-400 text-sm mt-1">
              {errors.contactoEmergencia.nombre.message}
            </p>
          )}
        </div>

        {/* Campo Teléfono Contacto Emergencia */}
        <div>
          <label
            htmlFor="contactoEmergenciaTelefono"
            className="block text-indigo-300 mb-1 flex items-center gap-2"
          >
            <FaPhone className="text-indigo-400" />
            <span>Teléfono de contacto</span>
          </label>
          <input
            id="contactoEmergenciaTelefono"
            type="tel"
            {...register("contactoEmergencia.telefono", {
              required:
                "Por favor ingrese el teléfono de contacto de emergencia",
              pattern: {
                value: /^[0-9+-\s()]{7,20}$/,
                message: "Teléfono inválido",
              },
            })}
            className={`w-full p-2 rounded bg-gray-800 text-white border ${
              errors.contactoEmergencia?.telefono
                ? "border-red-500"
                : "border-indigo-500/20"
            } focus:ring-2 focus:ring-indigo-400 outline-none`}
            placeholder="Número de teléfono"
          />
          {errors.contactoEmergencia?.telefono && (
            <p className="text-red-400 text-sm mt-1">
              {errors.contactoEmergencia.telefono.message}
            </p>
          )}
        </div>
      </div>

      <div className="mt-8 flex justify-between">
        <button
          type="button"
          onClick={prevStep}
          className="flex items-center gap-2 text-indigo-300 hover:text-white"
        >
          <FaArrowLeft /> Anterior
        </button>
        <button
          type="button"
          onClick={onSubmit}
          disabled={isSubmitting}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-6 rounded-xl transition-all duration-300 disabled:opacity-50"
        >
          {isSubmitting ? "Reservando..." : "Confirmar Reserva"}
        </button>
      </div>
    </>
  );
}

// Componente principal del modal actualizado
export function ReservationModal({
  tour,
  isOpen,
  onClose,
  onSubmitReservation,
}: {
  tour: Tour;
  isOpen: boolean;
  onClose: () => void;
  onSubmitReservation: (data: ReservationFormData) => Promise<void>;
}) {
  const methods = useForm<ReservationFormData>({
    defaultValues: {
      adultos: 1,
      niños: 0,
      participantes: [],
      contactoEmergencia: {
        nombre: "",
        telefono: "",
      },
    },
  });

  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);

  const handleSubmit = async (data: ReservationFormData) => {
    setIsSubmitting(true);
    try {
      await onSubmitReservation(data);
      onClose();
      methods.reset();
      setStep(1);
    } catch (error) {
      console.error("Error al procesar la reserva:", error);
      // Manejar error (ej: mostrar notificación)
    } finally {
      setIsSubmitting(false);
    }
  };

  // Limpiar formulario al cerrar
  const handleClose = () => {
    onClose();
    methods.reset();
    setStep(1);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
      <div
        className="bg-[#0f172a] border border-indigo-500/30 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto relative"
        role="dialog"
        aria-modal="true"
        aria-labelledby="reservation-modal-title"
      >
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-indigo-300 hover:text-white transition-colors z-10"
          aria-label="Cerrar modal de reserva"
        >
          <FaTimes className="text-xl" />
        </button>

        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2
              className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400"
              id="reservation-modal-title"
            >
              Reservar Tour
            </h2>
            <div className="text-indigo-300 text-sm">Paso {step} de 4</div>
          </div>

          {/* Información del tour */}
          <div className="mb-6 p-3 bg-indigo-900/20 rounded-lg border border-indigo-500/20">
            <h3 className="text-indigo-300 font-semibold mb-1">
              {tour.nombre}
            </h3>
            <p className="text-indigo-200 text-sm">
              Precio:{" "}
              <span className="font-bold">
                ${tour.precio?.toLocaleString() || 0} por persona
              </span>
            </p>
            <p className="text-indigo-200 text-sm">
              Capacidad máxima:{" "}
              <span className="font-bold">
                {tour.maxReservas} personas por reserva
              </span>
            </p>
          </div>

          {/* Barra de progreso */}
          <div className="w-full bg-gray-700 rounded-full h-2 mb-6">
            <motion.div
              className="bg-indigo-500 h-2 rounded-full"
              initial={{ width: `${(step - 1) * 25}%` }}
              animate={{ width: `${(step - 1) * 25}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>

          <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(handleSubmit)}>
              {step === 1 && <Step1 tour={tour} nextStep={nextStep} />}
              {step === 2 && (
                <Step2 tour={tour} nextStep={nextStep} prevStep={prevStep} />
              )}
              {step === 3 && <Step3 nextStep={nextStep} prevStep={prevStep} />}
              {step === 4 && (
                <Step4
                  prevStep={prevStep}
                  onSubmit={methods.handleSubmit(handleSubmit)}
                  isSubmitting={isSubmitting}
                />
              )}
            </form>
          </FormProvider>
        </div>
      </div>
    </div>
  );
}
