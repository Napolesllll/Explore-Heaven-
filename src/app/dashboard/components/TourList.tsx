"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaTrash,
  FaCalendarAlt,
  FaUsers,
  FaRoute,
  FaExclamationTriangle,
  FaInfoCircle,
} from "react-icons/fa"; 

export default function TourList() {
  const [tours, setTours] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [modal, setModal] = useState({
    isOpen: false,
    message: "",
    type: "success",
    tourIdToDelete: "",
  });

  const fetchTours = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/tours");
      if (!res.ok) throw new Error("Error al obtener tours");

      const data = await res.json();
      setTours(data.tours || data);
    } catch (error) {
      console.error("Error al obtener tours:", error);
      setModal({
        isOpen: true,
        message: "Error al obtener la lista de tours",
        type: "error",
        tourIdToDelete: "",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = (tourId: string) => {
    setModal({
      isOpen: true,
      message: "¿Estás seguro de que deseas eliminar este tour?",
      type: "confirm",
      tourIdToDelete: tourId,
    });
  };

  const confirmDelete = async () => {
    if (!modal.tourIdToDelete) return;

    try {
      const res = await fetch(`/api/tours?id=${modal.tourIdToDelete}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        setModal({
          isOpen: true,
          message: "Error al eliminar el tour",
          type: "error",
          tourIdToDelete: "",
        });
        return;
      }

      fetchTours();
      setModal({
        isOpen: true,
        message: "Tour eliminado correctamente",
        type: "success",
        tourIdToDelete: "",
      });
    } catch (error) {
      console.error("Error al eliminar tour:", error);
      setModal({
        isOpen: true,
        message: "Error al eliminar el tour",
        type: "error",
        tourIdToDelete: "",
      });
    }
  };

  useEffect(() => {
    fetchTours();
  }, []);

  return (
    <div className="bg-gradient-to-br from-[#0f172a] to-[#1e293b] p-6 rounded-2xl border border-cyan-500/30 shadow-2xl shadow-cyan-500/10">
      <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 mb-8 text-center">
        LISTA DE EXPERIENCIAS
      </h2>

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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {tours.map((tour: any) => (
            <motion.div
              key={tour.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              whileHover={{ y: -10 }}
              className="bg-gradient-to-br from-[#0f172a] to-[#1e293b] rounded-2xl border border-cyan-500/30 shadow-lg shadow-cyan-500/10 overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-cyan-100">
                    {tour.nombre}
                  </h3>
                  <button
                    onClick={() => handleDelete(tour.id)}
                    className="p-2 bg-gradient-to-r from-red-700/30 to-red-900/30 border border-red-500/30 rounded-lg hover:from-red-600/40 hover:to-red-800/40 transition-all group"
                  >
                    <FaTrash className="text-red-400 group-hover:text-red-300" />
                  </button>
                </div>

                <p className="text-gray-400 mt-3 mb-2 line-clamp-3">{tour.descripcion}</p>

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
                        {new Date(tour.salida).toLocaleString()}
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
                        {new Date(tour.regreso).toLocaleString()}
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

      {/* Modal futurista */}
      {/* ... ya incluido, sin cambios */}
    </div>
  );
}
