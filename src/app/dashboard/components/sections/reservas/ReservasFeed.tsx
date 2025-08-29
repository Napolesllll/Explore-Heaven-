"use client";

import { useEffect, useState } from "react";
import ReservaItem from "./ReservaItem";
import { motion } from "framer-motion";
import { FaCalendarCheck, FaSadCry, FaRegClock } from "react-icons/fa";
import Link from "next/link";
import toast from "react-hot-toast";

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

export default function ReservasFeed() {
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReservas = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/reservas", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        throw new Error(`Error ${res.status}: ${res.statusText}`);
      }

      const data: { reservas?: Reserva[] } = await res.json();
      console.log("RESERVAS DEL USUARIO:", data);

      // Ahora el API devuelve { reservas: [...] }
      setReservas(data.reservas || []);
    } catch (err: unknown) {
      console.error("Error fetching reservas:", err);
      const message = err instanceof Error ? err.message : String(err);
      setError(message || "Error al cargar las reservas");
      toast.error("Error al cargar las reservas");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReservas();
  }, []);

  // Función para filtrar reservas por estado
  const reservasActivas = reservas.filter(
    (reserva) => reserva.estado !== "Cancelada"
  );

  const reservasCanceladas = reservas.filter(
    (reserva) => reserva.estado === "Cancelada"
  );

  if (error) {
    return (
      <div className="min-h-screen pt-24 pb-12 px-4 bg-gradient-to-br from-[#0c0f1d] via-[#151b35] to-[#0c0f1d]">
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-900/20 border border-red-500/30 rounded-2xl p-8 text-center">
            <div className="text-red-400 text-6xl mb-4">⚠️</div>
            <h3 className="text-2xl font-bold text-red-400 mb-4">
              Error al cargar reservas
            </h3>
            <p className="text-gray-300 mb-6">{error}</p>
            <button
              onClick={fetchReservas}
              className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold transition-all duration-300"
            >
              Reintentar
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 bg-gradient-to-br from-[#0c0f1d] via-[#151b35] to-[#0c0f1d]">
      {/* Efecto de partículas cósmicas */}
      <div className="fixed inset-0 overflow-hidden">
        {[...Array(25)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-gradient-to-r from-cyan-400/10 to-purple-500/10"
            initial={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              width: `${Math.random() * 6 + 2}px`,
              height: `${Math.random() * 6 + 2}px`,
              opacity: 0,
            }}
            animate={{
              opacity: [0, 0.4, 0],
              scale: [0, 1, 0],
            }}
            transition={{
              duration: Math.random() * 5 + 3,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="relative bg-[#0f172a]/80 backdrop-blur-xl rounded-3xl border border-cyan-500/30 shadow-2xl shadow-cyan-500/10 p-8"
        >
          <div className="absolute -inset-4 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-cyan-500/5 via-transparent to-transparent rounded-3xl z-0"></div>

          <div className="relative z-10">
            <div className="flex items-center justify-center mb-8">
              <div className="bg-gradient-to-r from-cyan-500/20 to-purple-500/20 p-3 rounded-full mr-4">
                <FaCalendarCheck className="text-cyan-400 text-3xl" />
              </div>
              <motion.h2
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400"
              >
                Tus Expediciones Reservadas
              </motion.h2>
            </div>

            {/* Estadísticas */}
            {reservas.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 p-4 rounded-xl border border-cyan-500/20">
                  <div className="text-cyan-400 text-2xl font-bold">
                    {reservas.length}
                  </div>
                  <div className="text-gray-300 text-sm">Total Reservas</div>
                </div>
                <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 p-4 rounded-xl border border-green-500/20">
                  <div className="text-green-400 text-2xl font-bold">
                    {reservasActivas.length}
                  </div>
                  <div className="text-gray-300 text-sm">Activas</div>
                </div>
                <div className="bg-gradient-to-r from-red-500/10 to-pink-500/10 p-4 rounded-xl border border-red-500/20">
                  <div className="text-red-400 text-2xl font-bold">
                    {reservasCanceladas.length}
                  </div>
                  <div className="text-gray-300 text-sm">Canceladas</div>
                </div>
              </div>
            )}

            {loading ? (
              <div className="py-12 flex flex-col items-center justify-center">
                <div className="relative w-20 h-20 mb-8">
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full animate-spin"></div>
                  <div className="absolute inset-4 bg-[#0f172a] rounded-full"></div>
                  <div className="absolute inset-5 flex items-center justify-center">
                    <FaRegClock className="text-cyan-400 text-2xl animate-pulse" />
                  </div>
                </div>
                <p className="text-gray-400 max-w-md text-center">
                  Explorando tus reservas...
                </p>
              </div>
            ) : reservas.length === 0 ? (
              <div className="bg-gradient-to-r from-cyan-500/10 to-purple-500/10 p-8 rounded-2xl border border-cyan-500/30 backdrop-blur-sm text-center">
                <div className="inline-flex items-center justify-center p-4 bg-gray-900/50 rounded-full mb-6">
                  <FaSadCry className="h-12 w-12 text-yellow-500" />
                </div>
                <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 mb-4">
                  SIN EXPEDICIONES PROGRAMADAS
                </h3>
                <p className="text-gray-400 mb-6">
                  Aún no has reservado ninguna experiencia cósmica
                </p>
                <Link href="/tours">
                  <motion.button
                    className="px-6 py-3 bg-gradient-to-r from-cyan-600 to-purple-600 text-white rounded-xl font-bold shadow-md hover:shadow-cyan-500/30 transition-all duration-300"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Explorar Tours Disponibles
                  </motion.button>
                </Link>
              </div>
            ) : (
              <motion.div
                className="space-y-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                {/* Reservas activas primero */}
                {reservasActivas.length > 0 && (
                  <>
                    <h3 className="text-xl font-bold text-cyan-300 mb-4 flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                      Reservas Activas
                    </h3>
                    {reservasActivas.map((reserva, index) => (
                      <motion.div
                        key={reserva.id}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 + index * 0.1 }}
                      >
                        <ReservaItem
                          reserva={reserva}
                          onUpdate={fetchReservas}
                        />
                      </motion.div>
                    ))}
                  </>
                )}

                {/* Reservas canceladas */}
                {reservasCanceladas.length > 0 && (
                  <>
                    <h3 className="text-xl font-bold text-red-300 mb-4 flex items-center gap-2 mt-8">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      Reservas Canceladas
                    </h3>
                    {reservasCanceladas.map((reserva, index) => (
                      <motion.div
                        key={reserva.id}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          delay: 0.2 + (reservasActivas.length + index) * 0.1,
                        }}
                      >
                        <ReservaItem
                          reserva={reserva}
                          onUpdate={fetchReservas}
                        />
                      </motion.div>
                    ))}
                  </>
                )}
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Elemento decorativo flotante */}
      <motion.div
        className="fixed bottom-8 right-8 w-16 h-16 rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 shadow-2xl shadow-cyan-500/30 flex items-center justify-center cursor-pointer"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        title="Volver arriba"
      ></motion.div>
    </div>
  );
}
