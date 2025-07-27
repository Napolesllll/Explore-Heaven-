"use client";

import { useEffect, useState } from "react";
import ReservaItem from "./ReservaItem";
import { motion } from "framer-motion";
import { FaRocket, FaCalendarCheck, FaSadCry, FaRegClock } from "react-icons/fa";

export default function ReservasFeed() {
  const [reservas, setReservas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
 
  const fetchReservas = async () => {
    setLoading(true);
    const res = await fetch("/api/reservas");
    const data = await res.json();
    console.log("RESERVAS DEL USUARIO:", data.reservas);
    setReservas(data.reservas || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchReservas();
  }, []);

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
              opacity: 0
            }}
            animate={{ 
              opacity: [0, 0.4, 0],
              scale: [0, 1, 0]
            }}
            transition={{ 
              duration: Math.random() * 5 + 3,
              repeat: Infinity,
              delay: Math.random() * 2
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
                TUS EXPEDICIONES RESERVADAS
              </motion.h2>
            </div>
            
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
                <motion.button
                  className="px-6 py-3 bg-gradient-to-r from-cyan-600 to-purple-600 text-white rounded-xl font-bold shadow-md"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Explorar Tours Disponibles
                </motion.button>
              </div>
            ) : (
              <motion.div 
                className="space-y-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                {reservas.map((reserva, index) => (
                  <motion.div
                    key={reserva.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + index * 0.1 }}
                  >
                    <ReservaItem key={reserva.id} reserva={reserva} onUpdate={fetchReservas} />
                  </motion.div>
                ))}
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
      >
        <FaRocket className="text-white text-2xl animate-bounce" />
      </motion.div>
    </div>
  );
}