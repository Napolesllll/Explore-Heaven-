"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  Users,
  MapPin,
  Phone,
  Mail,
  Eye,
  Edit,
  Trash2,
  Filter,
  Search,
  Download,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  User,
  FileText,
  ChevronDown,
  ChevronUp,
  Save,
  X,
} from "lucide-react";
import Image from "next/image";

// Función para formatear fechas sin problemas de timezone
const formatDateWithoutTimezone = (dateString: string): string => {
  const date = new Date(dateString + "T00:00:00");
  return date.toLocaleDateString("es-ES", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const formatDateShort = (dateString: string): string => {
  const date = new Date(dateString + "T00:00:00");
  return date.toLocaleDateString("es-ES");
};

// Tipos para las reservas
export type ReservationStatus =
  | "pendiente"
  | "confirmada"
  | "cancelada"
  | "completada"
  | "en_proceso";

export type Reservation = {
  id: string;
  tourId: string;
  tourNombre: string;
  tourImagen?: string;
  tourUbicacion: string;
  fechaSeleccionada: string;
  fechaCreacion: string;
  status: ReservationStatus;
  nombreReservante: string;
  correoReservante: string;
  telefonoReservante: string;
  adultos: number;
  niños: number;
  totalPersonas: number;
  participantes: {
    nombre: string;
    tipoDocumento: string;
    numeroDocumento: string;
    fechaNacimiento: string;
  }[];
  contactoEmergencia: {
    nombre: string;
    telefono: string;
  };
  precioTotal?: number;
  notas?: string;
};

const statusConfig = {
  pendiente: {
    label: "Pendiente",
    color: "text-yellow-400",
    bg: "bg-yellow-900/20",
    border: "border-yellow-500/30",
    icon: Clock,
  },
  confirmada: {
    label: "Confirmada",
    color: "text-green-400",
    bg: "bg-green-900/20",
    border: "border-green-500/30",
    icon: CheckCircle,
  },
  cancelada: {
    label: "Cancelada",
    color: "text-red-400",
    bg: "bg-red-900/20",
    border: "border-red-500/30",
    icon: XCircle,
  },
  completada: {
    label: "Completada",
    color: "text-blue-400",
    bg: "bg-blue-900/20",
    border: "border-blue-500/30",
    icon: CheckCircle,
  },
  en_proceso: {
    label: "En Proceso",
    color: "text-purple-400",
    bg: "bg-purple-900/20",
    border: "border-purple-500/30",
    icon: AlertTriangle,
  },
};

// Componente para mostrar el status
function StatusBadge({ status }: { status: ReservationStatus }) {
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <div
      className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${config.color} ${config.bg} ${config.border} border`}
    >
      <Icon size={12} />
      {config.label}
    </div>
  );
}

// Modal de confirmación para eliminar
function DeleteConfirmModal({
  isOpen,
  onConfirm,
  onCancel,
  reservationName,
}: {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  reservationName: string;
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[1000]">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-gray-900 border border-red-500/30 rounded-xl p-6 max-w-md mx-4"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-red-500/20 p-2 rounded-full">
            <AlertTriangle className="text-red-400" size={20} />
          </div>
          <h3 className="text-lg font-semibold text-white">
            Confirmar eliminación
          </h3>
        </div>
        <p className="text-gray-300 mb-6">
          ¿Estás seguro de que deseas eliminar la reserva de{" "}
          <span className="font-semibold text-white">{reservationName}</span>?
          Esta acción no se puede deshacer.
        </p>
        <div className="flex gap-3 justify-end">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
          >
            Eliminar
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// Modal de edición
function EditReservationModal({
  isOpen,
  reservation,
  onSave,
  onCancel,
}: {
  isOpen: boolean;
  reservation: Reservation | null;
  onSave: (updatedReservation: Reservation) => void;
  onCancel: () => void;
}) {
  const [editedReservation, setEditedReservation] =
    useState<Reservation | null>(null);

  useEffect(() => {
    if (reservation) {
      setEditedReservation({ ...reservation });
    }
  }, [reservation]);

  if (!isOpen || !editedReservation) return null;

  const handleSave = () => {
    if (editedReservation) {
      onSave(editedReservation);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm ml-80 flex items-center justify-center z-[1000] p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-gray-900 border border-cyan-500/30 rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="sticky top-0 bg-gray-900 z-10 pb-4 border-b border-gray-700">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">Editar Reserva</h3>
            <button
              onClick={onCancel}
              className="text-gray-400 hover:text-gray-300 p-1 rounded-full hover:bg-gray-800"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        <div className="space-y-4 mt-4">
          {/* Información básica */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Nombre del Reservante
              </label>
              <input
                type="text"
                value={editedReservation.nombreReservante}
                onChange={(e) =>
                  setEditedReservation({
                    ...editedReservation,
                    nombreReservante: e.target.value,
                  })
                }
                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-cyan-400 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Email
              </label>
              <input
                type="email"
                value={editedReservation.correoReservante}
                onChange={(e) =>
                  setEditedReservation({
                    ...editedReservation,
                    correoReservante: e.target.value,
                  })
                }
                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-cyan-400 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Teléfono
              </label>
              <input
                type="tel"
                value={editedReservation.telefonoReservante}
                onChange={(e) =>
                  setEditedReservation({
                    ...editedReservation,
                    telefonoReservante: e.target.value,
                  })
                }
                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-cyan-400 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Estado
              </label>
              <select
                value={editedReservation.status}
                onChange={(e) =>
                  setEditedReservation({
                    ...editedReservation,
                    status: e.target.value as ReservationStatus,
                  })
                }
                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-cyan-400 outline-none"
              >
                {Object.entries(statusConfig).map(([key, config]) => (
                  <option key={key} value={key}>
                    {config.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Adultos
              </label>
              <input
                type="number"
                min="0"
                value={editedReservation.adultos}
                onChange={(e) =>
                  setEditedReservation({
                    ...editedReservation,
                    adultos: parseInt(e.target.value) || 0,
                  })
                }
                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-cyan-400 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Niños
              </label>
              <input
                type="number"
                min="0"
                value={editedReservation.niños}
                onChange={(e) =>
                  setEditedReservation({
                    ...editedReservation,
                    niños: parseInt(e.target.value) || 0,
                  })
                }
                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-cyan-400 outline-none"
              />
            </div>
          </div>

          {/* Precio total */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Precio Total
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={editedReservation.precioTotal || ""}
              onChange={(e) =>
                setEditedReservation({
                  ...editedReservation,
                  precioTotal: parseFloat(e.target.value) || undefined,
                })
              }
              className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-cyan-400 outline-none"
            />
          </div>

          {/* Notas */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Notas Adicionales
            </label>
            <textarea
              value={editedReservation.notas || ""}
              onChange={(e) =>
                setEditedReservation({
                  ...editedReservation,
                  notas: e.target.value,
                })
              }
              rows={3}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-cyan-400 outline-none"
            />
          </div>

          {/* Contacto de emergencia */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Contacto de Emergencia - Nombre
              </label>
              <input
                type="text"
                value={editedReservation.contactoEmergencia.nombre}
                onChange={(e) =>
                  setEditedReservation({
                    ...editedReservation,
                    contactoEmergencia: {
                      ...editedReservation.contactoEmergencia,
                      nombre: e.target.value,
                    },
                  })
                }
                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-cyan-400 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Contacto de Emergencia - Teléfono
              </label>
              <input
                type="tel"
                value={editedReservation.contactoEmergencia.telefono}
                onChange={(e) =>
                  setEditedReservation({
                    ...editedReservation,
                    contactoEmergencia: {
                      ...editedReservation.contactoEmergencia,
                      telefono: e.target.value,
                    },
                  })
                }
                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-cyan-400 outline-none"
              />
            </div>
          </div>
        </div>

        <div className="sticky bottom-0 bg-gray-900 pt-4 border-t border-gray-700 mt-6">
          <div className="flex gap-3 justify-end">
            <button
              onClick={onCancel}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg transition-colors"
            >
              <Save size={16} />
              Guardar Cambios
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// Componente para mostrar detalles expandidos
function ReservationDetails({
  reservation,
  onClose,
}: {
  reservation: Reservation;
  onClose: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      className="bg-gray-900/50 rounded-lg p-4 mt-2 border border-cyan-500/20"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Información del tour */}
        <div className="space-y-3">
          <h4 className="text-cyan-300 font-semibold flex items-center gap-2">
            <MapPin size={16} />
            Información del Tour
          </h4>
          <div className="space-y-2 text-sm">
            <p className="text-gray-300">
              <span className="text-gray-400">Fecha:</span>{" "}
              {formatDateWithoutTimezone(reservation.fechaSeleccionada)}
            </p>
            <p className="text-gray-300">
              <span className="text-gray-400">Ubicación:</span>{" "}
              {reservation.tourUbicacion}
            </p>
            <p className="text-gray-300">
              <span className="text-gray-400">Adultos:</span>{" "}
              {reservation.adultos}
            </p>
            <p className="text-gray-300">
              <span className="text-gray-400">Niños:</span> {reservation.niños}
            </p>
            {reservation.precioTotal && (
              <p className="text-green-400 font-semibold">
                <span className="text-gray-400">Total:</span> $
                {reservation.precioTotal.toLocaleString()}
              </p>
            )}
          </div>
        </div>

        {/* Información del reservante */}
        <div className="space-y-3">
          <h4 className="text-purple-300 font-semibold flex items-center gap-2">
            <User size={16} />
            Información del Reservante
          </h4>
          <div className="space-y-2 text-sm">
            <p className="text-gray-300">
              <span className="text-gray-400">Nombre:</span>{" "}
              {reservation.nombreReservante}
            </p>
            <p className="text-gray-300">
              <span className="text-gray-400">Email:</span>{" "}
              {reservation.correoReservante}
            </p>
            <p className="text-gray-300">
              <span className="text-gray-400">Teléfono:</span>{" "}
              {reservation.telefonoReservante}
            </p>
            <div className="pt-2">
              <p className="text-orange-300 font-medium">
                Contacto de Emergencia:
              </p>
              <p className="text-gray-300 text-xs">
                {reservation.contactoEmergencia.nombre} -{" "}
                {reservation.contactoEmergencia.telefono}
              </p>
            </div>
          </div>
        </div>

        {/* Participantes */}
        <div className="md:col-span-2 space-y-3">
          <h4 className="text-indigo-300 font-semibold flex items-center gap-2">
            <Users size={16} />
            Participantes ({reservation.participantes.length})
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {reservation.participantes.map((participante, index) => (
              <div
                key={index}
                className="bg-gray-800/50 rounded-lg p-3 border border-gray-700/50"
              >
                <p className="text-white font-medium text-sm">
                  {participante.nombre}
                </p>
                <p className="text-gray-400 text-xs">
                  {participante.tipoDocumento.replace("_", " ").toUpperCase()}:{" "}
                  {participante.numeroDocumento}
                </p>
                <p className="text-gray-400 text-xs">
                  Nacimiento: {formatDateShort(participante.fechaNacimiento)}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Notas adicionales */}
        {reservation.notas && (
          <div className="md:col-span-2 space-y-2">
            <h4 className="text-gray-300 font-semibold flex items-center gap-2">
              <FileText size={16} />
              Notas Adicionales
            </h4>
            <p className="text-gray-400 text-sm bg-gray-800/30 rounded-lg p-3">
              {reservation.notas}
            </p>
          </div>
        )}
      </div>

      <div className="flex justify-end mt-4">
        <button
          onClick={onClose}
          className="text-cyan-400 hover:text-cyan-300 text-sm"
        >
          Cerrar detalles
        </button>
      </div>
    </motion.div>
  );
}

// Componente principal de la lista de reservas
export default function ReservationList() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<ReservationStatus | "todos">(
    "todos"
  );
  const [expandedReservation, setExpandedReservation] = useState<string | null>(
    null
  );
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    reservation: Reservation | null;
  }>({ isOpen: false, reservation: null });
  const [editModal, setEditModal] = useState<{
    isOpen: boolean;
    reservation: Reservation | null;
  }>({ isOpen: false, reservation: null });
  const [exporting, setExporting] = useState(false);

  // Cargar reservas desde la API
  useEffect(() => {
    const fetchReservations = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/admin/reservas");

        if (!response.ok) {
          throw new Error("Error al cargar reservas");
        }

        const data = await response.json();
        setReservations(data.reservas || []);
      } catch (error) {
        console.error("Error al cargar reservas:", error);
        // En caso de error, mantener array vacío
        setReservations([]);
      } finally {
        setLoading(false);
      }
    };

    fetchReservations();
  }, []);

  // Filtrar reservas
  const filteredReservations = reservations.filter((reservation) => {
    const matchesSearch =
      reservation.nombreReservante
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      reservation.tourNombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reservation.correoReservante
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "todos" || reservation.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const toggleReservationDetails = (reservationId: string) => {
    setExpandedReservation(
      expandedReservation === reservationId ? null : reservationId
    );
  };

  const handleStatusChange = async (
    reservationId: string,
    newStatus: ReservationStatus
  ) => {
    try {
      const response = await fetch(`/api/admin/reservas/${reservationId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Actualizar el estado local con la reserva transformada
        setReservations((prev) =>
          prev.map((res) =>
            res.id === reservationId ? { ...res, status: newStatus } : res
          )
        );
        console.log("Estado actualizado correctamente");
      } else {
        console.error("Error al actualizar el estado:", data.error);
        alert(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Error de conexión al actualizar el estado");
    }
  };

  const handleEdit = (reservation: Reservation) => {
    setEditModal({ isOpen: true, reservation });
  };

  const handleSaveEdit = async (updatedReservation: Reservation) => {
    try {
      const response = await fetch(
        `/api/admin/reservas/${updatedReservation.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedReservation),
        }
      );

      const data = await response.json();

      if (response.ok && data.success) {
        // Actualizar con la reserva transformada del servidor
        setReservations((prev) =>
          prev.map((res) =>
            res.id === updatedReservation.id ? data.reserva : res
          )
        );
        setEditModal({ isOpen: false, reservation: null });
        console.log("Reserva editada correctamente");
      } else {
        console.error("Error al guardar los cambios:", data.error);
        alert(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error("Error saving reservation:", error);
      alert("Error de conexión al guardar los cambios");
    }
  };

  const handleDelete = (reservation: Reservation) => {
    setDeleteModal({ isOpen: true, reservation });
  };

  const confirmDelete = async () => {
    if (!deleteModal.reservation) return;

    try {
      const response = await fetch(
        `/api/admin/reservas/${deleteModal.reservation.id}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (response.ok && data.success) {
        // Eliminar de la lista local
        setReservations((prev) =>
          prev.filter((res) => res.id !== deleteModal.reservation!.id)
        );
        setDeleteModal({ isOpen: false, reservation: null });
        console.log("Reserva eliminada correctamente");
      } else {
        console.error("Error al eliminar la reserva:", data.error);
        alert(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error("Error deleting reservation:", error);
      alert("Error de conexión al eliminar la reserva");
    }
  };

  // También actualiza la función de exportar para manejar mejor los errores
  const handleExport = async () => {
    try {
      setExporting(true);

      if (filteredReservations.length === 0) {
        alert("No hay reservas para exportar");
        return;
      }

      // Crear CSV con los datos filtrados
      const csvHeaders = [
        "ID",
        "Tour",
        "Fecha",
        "Estado",
        "Reservante",
        "Email",
        "Teléfono",
        "Adultos",
        "Niños",
        "Total Personas",
        "Precio Total",
        "Contacto Emergencia",
        "Teléfono Emergencia",
      ];

      const csvData = filteredReservations.map((reservation) => [
        reservation.id,
        reservation.tourNombre,
        formatDateShort(reservation.fechaSeleccionada),
        statusConfig[reservation.status].label,
        reservation.nombreReservante,
        reservation.correoReservante,
        reservation.telefonoReservante,
        reservation.adultos,
        reservation.niños,
        reservation.totalPersonas,
        reservation.precioTotal
          ? `$${reservation.precioTotal.toLocaleString()}`
          : "",
        reservation.contactoEmergencia.nombre,
        reservation.contactoEmergencia.telefono,
      ]);

      const csvContent = [
        csvHeaders.join(","),
        ...csvData.map((row) =>
          row
            .map((field) => {
              // Escapar comillas y envolver en comillas si contiene comas
              const stringField = String(field).replace(/"/g, '""');
              return stringField.includes(",")
                ? `"${stringField}"`
                : stringField;
            })
            .join(",")
        ),
      ].join("\n");

      // Agregar BOM para compatibilidad con Excel
      const BOM = "\uFEFF";
      const finalContent = BOM + csvContent;

      // Descargar archivo
      const blob = new Blob([finalContent], {
        type: "text/csv;charset=utf-8;",
      });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute(
        "download",
        `reservas_${new Date().toISOString().split("T")[0]}.csv`
      );
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      console.log(`Exportadas ${filteredReservations.length} reservas`);
    } catch (error) {
      console.error("Error al exportar:", error);
      alert("Error al generar el archivo de exportación");
    } finally {
      setExporting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-cyan-500 mx-auto"></div>
          <p className="mt-4 text-cyan-300">Cargando reservas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header y filtros */}
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Buscar por nombre, tour o email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-800/80 border border-cyan-500/30 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 outline-none"
            />
          </div>
        </div>

        <div className="flex gap-3">
          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value as ReservationStatus | "todos")
            }
            className="px-4 py-2 bg-gray-800/80 border border-cyan-500/30 rounded-lg text-white focus:ring-2 focus:ring-cyan-400 outline-none"
          >
            <option value="todos">Todos los estados</option>
            {Object.entries(statusConfig).map(([key, config]) => (
              <option key={key} value={key}>
                {config.label}
              </option>
            ))}
          </select>

          <button
            onClick={handleExport}
            disabled={exporting}
            className="flex items-center gap-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-700 disabled:bg-cyan-800 text-white rounded-lg transition-colors"
          >
            <Download size={16} />
            {exporting ? "Exportando..." : "Exportar"}
          </button>
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {Object.entries(statusConfig).map(([status, config]) => {
          const count = reservations.filter((r) => r.status === status).length;
          const Icon = config.icon;

          return (
            <div
              key={status}
              className={`${config.bg} ${config.border} border rounded-xl p-4`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className={`${config.color} text-sm font-medium`}>
                    {config.label}
                  </p>
                  <p className="text-2xl font-bold text-white">{count}</p>
                </div>
                <div className={`${config.bg} p-2 rounded-full`}>
                  <Icon className={config.color} size={20} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Lista de reservas */}
      <div className="bg-[#0f172a]/80 backdrop-blur-xl rounded-2xl border border-cyan-500/30 shadow-lg shadow-cyan-500/10 overflow-hidden">
        <div className="p-6 border-b border-cyan-500/30">
          <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">
            Lista de Reservas ({filteredReservations.length})
          </h3>
        </div>

        <div className="divide-y divide-gray-700/50">
          <AnimatePresence>
            {filteredReservations.map((reservation, index) => (
              <motion.div
                key={reservation.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.05 }}
                className="p-6"
              >
                {/* Información principal de la reserva */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start space-x-4">
                    {reservation.tourImagen && (
                      <Image
                        src={reservation.tourImagen}
                        alt={reservation.tourNombre}
                        width={80}
                        height={60}
                        className="rounded-lg object-cover"
                      />
                    )}
                    <div className="flex-1">
                      <h4 className="text-lg font-semibold text-white mb-1">
                        {reservation.tourNombre}
                      </h4>
                      <p className="text-gray-400 text-sm mb-2">
                        Reservado por: {reservation.nombreReservante}
                      </p>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
                        <span className="flex items-center gap-1">
                          <Calendar size={14} />
                          {formatDateShort(reservation.fechaSeleccionada)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users size={14} />
                          {reservation.totalPersonas} personas
                        </span>
                        <span className="flex items-center gap-1">
                          <Mail size={14} />
                          {reservation.correoReservante}
                        </span>
                        <span className="flex items-center gap-1">
                          <Phone size={14} />
                          {reservation.telefonoReservante}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <StatusBadge status={reservation.status} />
                    {reservation.precioTotal && (
                      <span className="text-green-400 font-semibold">
                        ${reservation.precioTotal.toLocaleString()}
                      </span>
                    )}
                  </div>
                </div>

                {/* Acciones */}
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => toggleReservationDetails(reservation.id)}
                    className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 text-sm transition-colors"
                  >
                    <Eye size={16} />
                    {expandedReservation === reservation.id
                      ? "Ocultar detalles"
                      : "Ver detalles"}
                    {expandedReservation === reservation.id ? (
                      <ChevronUp size={16} />
                    ) : (
                      <ChevronDown size={16} />
                    )}
                  </button>

                  <div className="flex items-center gap-2">
                    {/* Selector de estado */}
                    <select
                      value={reservation.status}
                      onChange={(e) =>
                        handleStatusChange(
                          reservation.id,
                          e.target.value as ReservationStatus
                        )
                      }
                      className="px-3 py-1 bg-gray-800 border border-gray-600 rounded text-white text-sm focus:ring-2 focus:ring-cyan-400 outline-none"
                    >
                      {Object.entries(statusConfig).map(([key, config]) => (
                        <option key={key} value={key}>
                          {config.label}
                        </option>
                      ))}
                    </select>

                    <button
                      onClick={() => handleEdit(reservation)}
                      className="p-2 text-indigo-400 hover:text-indigo-300 hover:bg-indigo-500/10 rounded-lg transition-all"
                      title="Editar reserva"
                    >
                      <Edit size={16} />
                    </button>

                    <button
                      onClick={() => handleDelete(reservation)}
                      className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-all"
                      title="Eliminar reserva"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                {/* Detalles expandidos */}
                <AnimatePresence>
                  {expandedReservation === reservation.id && (
                    <ReservationDetails
                      reservation={reservation}
                      onClose={() => setExpandedReservation(null)}
                    />
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </AnimatePresence>

          {filteredReservations.length === 0 && (
            <div className="p-12 text-center">
              <Users className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-300 mb-2">
                No se encontraron reservas
              </h3>
              <p className="text-gray-400">
                {searchTerm || statusFilter !== "todos"
                  ? "Intenta cambiar los filtros de búsqueda"
                  : "No hay reservas registradas aún"}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Modales */}
      <DeleteConfirmModal
        isOpen={deleteModal.isOpen}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteModal({ isOpen: false, reservation: null })}
        reservationName={deleteModal.reservation?.nombreReservante || ""}
      />

      <EditReservationModal
        isOpen={editModal.isOpen}
        reservation={editModal.reservation}
        onSave={handleSaveEdit}
        onCancel={() => setEditModal({ isOpen: false, reservation: null })}
      />
    </div>
  );
}
