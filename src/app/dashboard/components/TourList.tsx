"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FaTrash,
  FaCalendarAlt,
  FaUsers,
  FaRoute,
  FaExclamationTriangle,
  FaInfoCircle,
  FaEdit,
  FaTimes,
  FaMapMarkerAlt,
  FaMoneyBillWave,
  FaImage,
} from "react-icons/fa";

export default function TourList() {
  const [tours, setTours] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedTourId, setSelectedTourId] = useState<string | null>(null);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editTour, setEditTour] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTours = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/tours");
      const data = await res.json();
      setTours(data.tours || data);
    } catch (error) {
      console.error("Error al obtener tours:", error);
      setError("Error al cargar los tours");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = (id: string) => {
    setSelectedTourId(id);
    setModalVisible(true);
  };

  const confirmDelete = async () => {
    if (!selectedTourId) return;
    try {
      const res = await fetch(`/api/tours?id=${selectedTourId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Error al eliminar");
      setTours((prev) => prev.filter((t: any) => t.id !== selectedTourId));
    } catch (error) {
      setError("No se pudo eliminar el tour.");
    } finally {
      setModalVisible(false);
      setSelectedTourId(null);
    }
  };

  const handleEdit = (tour: any) => {
    const formattedTour = {
      ...tour,
      maxReservas: Number(tour.maxReservas),
      guias: Number(tour.guias),
      precio: Number(tour.precio),
    };
    setEditTour(formattedTour);
    setEditModalVisible(true);
  };

  const handleEditChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setEditTour((prev: any) => ({
      ...prev,
      [name]:
        name === "maxReservas" || name === "guias" || name === "precio"
          ? Number(value)
          : value,
    }));
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);

    try {
      const res = await fetch(`/api/tours`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...editTour,
          id: editTour.id,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Error al editar el tour");
      }

      await fetchTours();
      setEditModalVisible(false);
      setEditTour(null);
    } catch (error: any) {
      console.error("Error al editar:", error);
      setError(error.message || "No se pudo editar el tour");
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    fetchTours();
  }, []);

  return (
    <div className="bg-[#0f172a]/80 backdrop-blur-xl rounded-2xl border border-cyan-500/30 shadow-lg shadow-cyan-500/10 p-6">
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 mb-2">
          Lista de Experiencias
        </h3>
        <p className="text-gray-400 text-sm">
          Gestiona todos los tours disponibles
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-900/50 border border-red-500/30 rounded-lg text-red-300">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="py-12 flex flex-col items-center justify-center">
          <div className="relative w-16 h-16 mb-6">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full animate-spin opacity-20"></div>
            <div className="absolute inset-2 bg-[#0f172a] rounded-full"></div>
            <div className="absolute inset-4 flex items-center justify-center">
              <FaRoute className="text-cyan-400 text-xl animate-pulse" />
            </div>
          </div>
          <p className="text-gray-400 text-center">Cargando experiencias...</p>
        </div>
      ) : tours.length === 0 ? (
        <div className="bg-gradient-to-r from-cyan-500/10 to-purple-500/10 p-8 rounded-xl border border-cyan-500/30 backdrop-blur-sm text-center">
          <div className="inline-flex items-center justify-center p-4 bg-gray-900/50 rounded-full mb-4">
            <FaExclamationTriangle className="h-8 w-8 text-yellow-500" />
          </div>
          <h4 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 mb-2">
            Sin Experiencias Disponibles
          </h4>
          <p className="text-gray-400">
            Aún no se han creado tours en el sistema
          </p>
        </div>
      ) : (
        <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
          {tours.map((tour: any) => (
            <motion.div
              key={tour.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-gradient-to-br from-[#1a1f3a] to-[#2a2f4a] rounded-xl border border-cyan-500/30 shadow-lg hover:shadow-cyan-500/20 transition-all duration-300 p-4"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1 min-w-0">
                  <h4 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-cyan-100 truncate">
                    {tour.nombre}
                  </h4>
                  <p className="text-gray-400 text-sm truncate">
                    {tour.ubicacion}
                  </p>
                </div>
                <div className="flex gap-2 ml-4">
                  <button
                    onClick={() => handleEdit(tour)}
                    className="p-2 bg-yellow-600/20 border border-yellow-500/30 rounded-lg hover:bg-yellow-600/30 transition-all group"
                    title="Editar tour"
                  >
                    <FaEdit className="text-yellow-400 group-hover:text-yellow-300 text-sm" />
                  </button>
                  <button
                    onClick={() => handleDelete(tour.id)}
                    className="p-2 bg-red-600/20 border border-red-500/30 rounded-lg hover:bg-red-600/30 transition-all group"
                    title="Eliminar tour"
                  >
                    <FaTrash className="text-red-400 group-hover:text-red-300 text-sm" />
                  </button>
                </div>
              </div>

              <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                {tour.descripcion}
              </p>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="flex items-center gap-2">
                  <div className="bg-cyan-500/10 p-1 rounded">
                    <FaUsers className="text-cyan-400 text-xs" />
                  </div>
                  <div>
                    <p className="text-xs text-cyan-300">CAPACIDAD</p>
                    <p className="text-gray-300">{tour.maxReservas}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="bg-purple-500/10 p-1 rounded">
                    <FaUsers className="text-purple-400 text-xs" />
                  </div>
                  <div>
                    <p className="text-xs text-purple-300">GUÍAS</p>
                    <p className="text-gray-300">{tour.guias}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="bg-emerald-500/10 p-1 rounded">
                    <FaMoneyBillWave className="text-emerald-400 text-xs" />
                  </div>
                  <div>
                    <p className="text-xs text-emerald-300">PRECIO</p>
                    <p className="text-gray-300">${tour.precio}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="bg-orange-500/10 p-1 rounded">
                    <FaCalendarAlt className="text-orange-400 text-xs" />
                  </div>
                  <div>
                    <p className="text-xs text-orange-300">FECHAS</p>
                    <p className="text-gray-300 text-xs">
                      {tour.salida ? "Configurado" : "Pendiente"}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* MODAL DE CONFIRMACIÓN */}
      {modalVisible && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center px-4">
          <div className="bg-[#0f172a] border border-cyan-500/30 rounded-xl p-6 w-full max-w-md shadow-2xl">
            <div className="flex items-center mb-4">
              <div className="bg-red-500/20 p-2 rounded-full mr-3">
                <FaTrash className="text-red-400" />
              </div>
              <h3 className="text-lg font-semibold text-cyan-300">
                Confirmar Eliminación
              </h3>
            </div>
            <p className="text-sm text-gray-400 mb-6">
              ¿Estás seguro de que deseas eliminar este tour? Esta acción no se
              puede deshacer.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setModalVisible(false)}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-800 text-white rounded-lg transition font-medium"
              >
                Cancelar
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition font-medium"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL DE EDICIÓN */}
      {editModalVisible && editTour && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm overflow-y-auto py-8">
          <div className="flex min-h-full items-center justify-center p-4">
            <form
              onSubmit={handleEditSubmit}
              className="bg-[#181a2a] border border-cyan-500/30 rounded-2xl shadow-2xl w-full max-w-lg p-6 relative my-8"
            >
              <button
                type="button"
                onClick={() => setEditModalVisible(false)}
                className="absolute top-4 right-4 text-cyan-400 hover:text-cyan-200 transition-all duration-300 w-8 h-8 flex items-center justify-center rounded-full bg-gray-800/70 border border-cyan-500/30 hover:border-cyan-400/50"
                aria-label="Cerrar"
              >
                <FaTimes />
              </button>

              <div className="mb-6">
                <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 text-center">
                  Editar Tour
                </h2>
              </div>

              {error && (
                <div className="mb-6 p-4 bg-red-900/50 border border-red-500/30 rounded-lg text-red-300">
                  {error}
                </div>
              )}

              <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                <div>
                  <label className="block text-cyan-300 mb-1 text-sm">
                    Nombre
                  </label>
                  <input
                    type="text"
                    name="nombre"
                    value={editTour.nombre || ""}
                    onChange={handleEditChange}
                    className="w-full p-3 rounded-lg bg-gray-800/50 text-cyan-200 border border-cyan-500/20 focus:ring-2 focus:ring-cyan-400 outline-none text-sm"
                    required
                  />
                </div>

                <div>
                  <label className="block text-cyan-300 mb-1 text-sm">
                    Descripción
                  </label>
                  <textarea
                    name="descripcion"
                    value={editTour.descripcion || ""}
                    onChange={handleEditChange}
                    className="w-full p-3 rounded-lg bg-gray-800/50 text-cyan-200 border border-cyan-500/20 focus:ring-2 focus:ring-cyan-400 outline-none text-sm"
                    rows={3}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-cyan-300 mb-1 text-sm">
                      Salida
                    </label>
                    <input
                      type="text"
                      name="salida"
                      value={editTour.salida || ""}
                      onChange={handleEditChange}
                      className="w-full p-3 rounded-lg bg-gray-800/50 text-cyan-200 border border-cyan-500/20 focus:ring-2 focus:ring-cyan-400 outline-none text-sm"
                      placeholder="Ej: 8:00 AM"
                    />
                  </div>

                  <div>
                    <label className="block text-cyan-300 mb-1 text-sm">
                      Regreso
                    </label>
                    <input
                      type="text"
                      name="regreso"
                      value={editTour.regreso || ""}
                      onChange={handleEditChange}
                      className="w-full p-3 rounded-lg bg-gray-800/50 text-cyan-200 border border-cyan-500/20 focus:ring-2 focus:ring-cyan-400 outline-none text-sm"
                      placeholder="Ej: 6:00 PM"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-cyan-300 mb-1 text-sm">
                      Capacidad
                    </label>
                    <input
                      type="number"
                      name="maxReservas"
                      value={editTour.maxReservas || ""}
                      onChange={handleEditChange}
                      className="w-full p-3 rounded-lg bg-gray-800/50 text-cyan-200 border border-cyan-500/20 focus:ring-2 focus:ring-cyan-400 outline-none text-sm"
                      min={1}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-cyan-300 mb-1 text-sm">
                      Guías
                    </label>
                    <input
                      type="number"
                      name="guias"
                      value={editTour.guias || ""}
                      onChange={handleEditChange}
                      className="w-full p-3 rounded-lg bg-gray-800/50 text-cyan-200 border border-cyan-500/20 focus:ring-2 focus:ring-cyan-400 outline-none text-sm"
                      min={1}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-cyan-300 mb-1 text-sm flex items-center gap-2">
                    <FaMapMarkerAlt /> Ubicación
                  </label>
                  <input
                    type="text"
                    name="ubicacion"
                    value={editTour.ubicacion || ""}
                    onChange={handleEditChange}
                    className="w-full p-3 rounded-lg bg-gray-800/50 text-cyan-200 border border-cyan-500/20 focus:ring-2 focus:ring-cyan-400 outline-none text-sm"
                    required
                  />
                </div>

                <div>
                  <label className="block text-cyan-300 mb-1 text-sm flex items-center gap-2">
                    <FaMoneyBillWave /> Precio (USD)
                  </label>
                  <input
                    type="number"
                    name="precio"
                    value={editTour.precio || ""}
                    onChange={handleEditChange}
                    className="w-full p-3 rounded-lg bg-gray-800/50 text-cyan-200 border border-cyan-500/20 focus:ring-2 focus:ring-cyan-400 outline-none text-sm"
                    min={0}
                    step={0.01}
                    required
                  />
                </div>

                <div>
                  <label className="block text-cyan-300 mb-1 text-sm flex items-center gap-2">
                    <FaImage /> Imagen principal (URL)
                  </label>
                  <input
                    type="text"
                    name="imagenUrl"
                    value={editTour.imagenUrl || ""}
                    onChange={handleEditChange}
                    className="w-full p-3 rounded-lg bg-gray-800/50 text-cyan-200 border border-cyan-500/20 focus:ring-2 focus:ring-cyan-400 outline-none text-sm"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSaving}
                className="mt-6 w-full py-3 rounded-lg bg-gradient-to-r from-cyan-600 to-purple-600 text-white font-bold hover:from-cyan-700 hover:to-purple-700 transition-all shadow-lg disabled:opacity-50"
              >
                {isSaving ? "Guardando..." : "Guardar Cambios"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
