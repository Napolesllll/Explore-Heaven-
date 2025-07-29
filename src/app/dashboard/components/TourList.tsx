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

import AvailableDatesManager from "../../dashboard/admin/AvailableDatesManager";

export default function TourList() {

  const [tours, setTours] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedTourId, setSelectedTourId] = useState<string | null>(null);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editTour, setEditTour] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);

  
  const fetchTours = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/tours");
      const data = await res.json();
      setTours(data.tours || data);
    } catch (error) {
      console.error("Error al obtener tours:", error);
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
      alert("No se pudo eliminar el tour.");
    } finally {
      setModalVisible(false);
      setSelectedTourId(null);
    }
  };

  const handleEdit = (tour: any) => {
    setEditTour({ ...tour });
    setEditModalVisible(true);
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditTour((prev: any) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const res = await fetch(`/api/tours`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editTour),
      });
      if (!res.ok) throw new Error("Error al editar");
      await fetchTours();
      setEditModalVisible(false);
      setEditTour(null);
    } catch (error) {
      alert("No se pudo editar el tour.");
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    fetchTours();
  }, []);

    const tour = {
    id: "123", // Reemplazar por el tour seleccionado
    nombre: "Tour Machu Picchu",
  };

  return (
    <div className="bg-gradient-to-br from-[#0f172a] to-[#1e293b] p-6 rounded-2xl border border-cyan-500/30 shadow-2xl shadow-cyan-500/10">
      
            
      <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 mb-8 text-center">
        LISTA DE EXPERIENCIAS
      </h2>
      <AvailableDatesManager tour={tour} />

      {isLoading ? (
        <div className="py-12 flex flex-col items-center justify-center">
          <div className="relative w-24 h-24 mb-8">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full animate-spin"></div>
            <div className="absolute inset-4 bg-[#0f172a] rounded-full"></div>
            <div className="absolute inset-6 flex items-center justify-center">
              <FaRoute className="text-cyan-400 text-2xl animate-pulse" />
            </div>
          </div>
          <p className="text-gray-400 max-w-md text-center">
            Explorando experiencias disponibles...
          </p>
        </div>
      ) : tours.length === 0 ? (
        <div className="bg-gradient-to-r from-cyan-500/10 to-purple-500/10 p-8 rounded-2xl border border-cyan-500/30 backdrop-blur-sm max-w-md mx-auto text-center">
          <div className="inline-flex items-center justify-center p-4 bg-gray-900/50 rounded-full mb-6">
            <FaExclamationTriangle className="h-12 w-12 text-yellow-500" />
          </div>
          <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 mb-4">
            SIN EXPERIENCIAS DISPONIBLES
          </h3>
          <p className="text-gray-400">
            Aún no se han creado tours en el sistema
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-8">
          {tours.map((tour: any) => (
            <motion.div
              key={tour.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              whileHover={{ y: -10 }}
              className="w-full bg-gradient-to-br from-[#0f172a] to-[#1e293b] rounded-2xl border border-cyan-500/30 shadow-lg shadow-cyan-500/10 overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-cyan-100">
                    {tour.nombre}
                  </h3>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(tour)}
                      className="p-2 bg-gradient-to-r from-yellow-700/30 to-yellow-900/30 border border-yellow-500/30 rounded-lg hover:from-yellow-600/40 hover:to-yellow-800/40 transition-all group"
                    >
                      <FaEdit className="text-yellow-400 group-hover:text-yellow-300" />
                    </button>
                    <button
                      onClick={() => handleDelete(tour.id)}
                      className="p-2 bg-gradient-to-r from-red-700/30 to-red-900/30 border border-red-500/30 rounded-lg hover:from-red-600/40 hover:to-red-800/40 transition-all group"
                    >
                      <FaTrash className="text-red-400 group-hover:text-red-300" />
                    </button>
                  </div>
                </div>

                <p className="text-gray-400 mt-3 mb-2">{tour.descripcion}</p>

                {tour.info && (
                  <div className="flex items-start gap-2 mb-5">
                    <FaInfoCircle className="text-blue-400 mt-1" />
                    <p className="text-sm text-blue-300">{tour.info}</p>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-cyan-500/10 p-2 rounded-lg">
                      <FaCalendarAlt className="text-cyan-400" />
                    </div>
                    <div>
                      <p className="text-xs text-cyan-300">SALIDA</p>
                      <p className="text-gray-300">
                        {tour.salida || "Por definir"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="bg-cyan-500/10 p-2 rounded-lg">
                      <FaCalendarAlt className="text-purple-400" />
                    </div>
                    <div>
                      <p className="text-xs text-purple-300">REGRESO</p>
                      <p className="text-gray-300">
                        {tour.regreso || "Por definir"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="bg-cyan-500/10 p-2 rounded-lg">
                      <FaUsers className="text-cyan-400" />
                    </div>
                    <div>
                      <p className="text-xs text-cyan-300">CAPACIDAD</p>
                      <p className="text-gray-300">{tour.maxReservas} personas</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="bg-cyan-500/10 p-2 rounded-lg">
                      <FaUsers className="text-purple-400" />
                    </div>
                    <div>
                      <p className="text-xs text-purple-300">GUÍAS</p>
                      <p className="text-gray-300">{tour.guias} expertos</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* MODAL DE CONFIRMACIÓN */}
      {modalVisible && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center px-4">
          <div className="bg-[#0f172a] border border-cyan-500/30 rounded-xl p-6 w-full max-w-md shadow-lg">
            <h3 className="text-lg font-semibold text-cyan-300 mb-4">
              ¿Estás seguro de eliminar este tour?
            </h3>
            <p className="text-sm text-gray-400 mb-6">
              Esta acción no se puede deshacer.
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setModalVisible(false)}
                className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-800 transition"
              >
                Cancelar
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL DE EDICIÓN */}
      {editModalVisible && editTour && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center px-4">
          <form
            onSubmit={handleEditSubmit}
            className="bg-[#181a2a] border border-cyan-500/30 rounded-2xl shadow-2xl max-w-lg w-full p-8 relative"
          >
            <button
              type="button"
              onClick={() => setEditModalVisible(false)}
              className="absolute top-4 right-4 text-cyan-400 text-2xl font-bold hover:text-cyan-200 transition-all duration-300 w-8 h-8 flex items-center justify-center rounded-full bg-[#0a0a2a]/70 border border-cyan-500/30 hover:border-cyan-400/50 z-20"
              aria-label="Cerrar"
            >
              <FaTimes />
            </button>
            <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 mb-6 text-center">
              Editar Tour
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-cyan-300 mb-1">Nombre</label>
                <input
                  type="text"
                  name="nombre"
                  value={editTour.nombre || ""}
                  onChange={handleEditChange}
                  className="w-full p-2 rounded bg-gray-800 text-cyan-200 border border-cyan-500/20 focus:ring-2 focus:ring-cyan-400 outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-cyan-300 mb-1">Descripción</label>
                <textarea
                  name="descripcion"
                  value={editTour.descripcion || ""}
                  onChange={handleEditChange}
                  className="w-full p-2 rounded bg-gray-800 text-cyan-200 border border-cyan-500/20 focus:ring-2 focus:ring-cyan-400 outline-none"
                  rows={3}
                  required
                />
              </div>
              <div>
                <label className="block text-cyan-300 mb-1">Salida</label>
                <input
                  type="text"
                  name="salida"
                  value={editTour.salida || ""}
                  onChange={handleEditChange}
                  className="w-full p-2 rounded bg-gray-800 text-cyan-200 border border-cyan-500/20 focus:ring-2 focus:ring-cyan-400 outline-none"
                  placeholder="Ej: 8:00 am, Por definir, etc."
                />
              </div>
              <div>
                <label className="block text-cyan-300 mb-1">Regreso</label>
                <input
                  type="text"
                  name="regreso"
                  value={editTour.regreso || ""}
                  onChange={handleEditChange}
                  className="w-full p-2 rounded bg-gray-800 text-cyan-200 border border-cyan-500/20 focus:ring-2 focus:ring-cyan-400 outline-none"
                  placeholder="Ej: 6:00 pm, Por definir, etc."
                />
              </div>
              <div>
                <label className="block text-cyan-300 mb-1">Capacidad</label>
                <input
                  type="number"
                  name="maxReservas"
                  value={editTour.maxReservas || ""}
                  onChange={handleEditChange}
                  className="w-full p-2 rounded bg-gray-800 text-cyan-200 border border-cyan-500/20 focus:ring-2 focus:ring-cyan-400 outline-none"
                  min={1}
                  required
                />
              </div>
              <div>
                <label className="block text-cyan-300 mb-1">Guías</label>
                <input
                  type="number"
                  name="guias"
                  value={editTour.guias || ""}
                  onChange={handleEditChange}
                  className="w-full p-2 rounded bg-gray-800 text-cyan-200 border border-cyan-500/20 focus:ring-2 focus:ring-cyan-400 outline-none"
                  min={1}
                  required
                />
              </div>
              <div>
                <label className="block text-cyan-300 mb-1 flex items-center gap-2">
                  <FaMapMarkerAlt /> Ubicación
                </label>
                <input
                  type="text"
                  name="ubicacion"
                  value={editTour.ubicacion || ""}
                  onChange={handleEditChange}
                  className="w-full p-2 rounded bg-gray-800 text-cyan-200 border border-cyan-500/20 focus:ring-2 focus:ring-cyan-400 outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-cyan-300 mb-1 flex items-center gap-2">
                  <FaMoneyBillWave /> Precio
                </label>
                <input
                  type="number"
                  name="precio"
                  value={editTour.precio || ""}
                  onChange={handleEditChange}
                  className="w-full p-2 rounded bg-gray-800 text-cyan-200 border border-cyan-500/20 focus:ring-2 focus:ring-cyan-400 outline-none"
                  min={0}
                  step={0.01}
                  required
                />
              </div>
              <div>
                <label className="block text-cyan-300 mb-1 flex items-center gap-2">
                  <FaImage /> Imagen principal (URL)
                </label>
                <input
                  type="text"
                  name="imagenUrl"
                  value={editTour.imagenUrl || ""}
                  onChange={handleEditChange}
                  className="w-full p-2 rounded bg-gray-800 text-cyan-200 border border-cyan-500/20 focus:ring-2 focus:ring-cyan-400 outline-none"
                  required
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={isSaving}
              className="mt-8 w-full py-3 rounded-xl bg-gradient-to-r from-cyan-600 to-purple-600 text-white font-bold hover:from-cyan-700 hover:to-purple-700 transition-all shadow-lg"
            >
              {isSaving ? "Guardando..." : "Guardar Cambios"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}