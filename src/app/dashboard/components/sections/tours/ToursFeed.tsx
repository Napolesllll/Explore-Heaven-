"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { tours } from "../../../../../data/toursData";
import TourDetail from "./components/tours/TourDetail";
import { FaArrowLeft, FaRocket, FaStar } from "react-icons/fa";

export default function ToursFeed() {
  const [selectedTour, setSelectedTour] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const tourActual = tours.find((tour) => tour.id === selectedTour);

  if (selectedTour && tourActual) {
    return (
      <div className="mt-20 mb-6">
        <motion.button
          onClick={() => setSelectedTour(null)}
          className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-cyan-600 to-purple-600 text-white font-bold rounded-xl shadow-lg border border-cyan-400/50 hover:from-cyan-500 hover:to-purple-500 transition-all group relative overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <FaArrowLeft className="text-cyan-300 group-hover:text-white transition-colors" />
          <span className="uppercase tracking-widest">Volver a la galería</span>
          <div className="absolute -inset-4 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 group-hover:opacity-100 opacity-0 transition-opacity duration-300 blur-xl"></div>
        </motion.button>
        <TourDetail tour={tourActual} onBack={() => setSelectedTour(null)} />
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 mt-10 px-4 bg-gradient-to-br from-[#0c0f1d] via-[#151b35] to-[#0c0f1d]">
      {/* Efecto de partículas galácticas mejorado */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(40)].map((_, i: number) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-gradient-to-r from-cyan-400/15 to-purple-500/15"
            initial={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              width: `${Math.random() * 4 + 2}px`,
              height: `${Math.random() * 4 + 2}px`,
              opacity: 0,
            }}
            animate={{
              opacity: [0, 0.6, 0],
              scale: [0, 1.2, 0],
              x: [0, Math.random() * 100 - 50],
              y: [0, Math.random() * 100 - 50],
            }}
            transition={{
              duration: Math.random() * 8 + 6,
              repeat: Infinity,
              delay: Math.random() * 5,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      <motion.h1
        className="text-3xl md:text-4xl font-bold text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, type: "spring", stiffness: 100 }}
      >
        Explora Nuestras Experiencias
      </motion.h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 md:grid-cols-2 gap-6 max-w-6xl mx-auto">
        <AnimatePresence>
          {tours.map((tour, index) => (
            <motion.div
              key={tour.id}
              layoutId={`card-${tour.id}`}
              initial={{ opacity: 0, y: 50, scale: 0.95, rotate: -2 }}
              animate={{
                opacity: isVisible ? 1 : 0,
                y: isVisible ? 0 : 50,
                scale: isVisible ? 1 : 0.95,
                rotate: isVisible ? 0 : -2,
              }}
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.3 } }}
              transition={{
                duration: 0.5,
                delay: index * 0.1,
                type: "spring",
                stiffness: 90,
                damping: 15,
              }}
              whileHover={{
                y: -10,
                scale: 1.02,
                rotate: 0,
                boxShadow: "0 25px 50px -12px rgba(139, 92, 246, 0.4)",
                transition: { duration: 0.3, ease: "easeOut" },
              }}
              className="relative group bg-gradient-to-br from-[#0f172a] to-[#1e293b] rounded-2xl overflow-hidden border border-cyan-500/30 shadow-lg shadow-cyan-500/10 cursor-pointer"
              onClick={() => setSelectedTour(tour.id)}
            >
              {/* Efecto de brillo al pasar el mouse */}
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-30 transition-opacity duration-500 z-0"></div>

              {/* Efecto de borde luminoso */}
              <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-cyan-500/20 group-hover:opacity-100 opacity-0 transition-all duration-500 pointer-events-none"></div>

              {/* Cabecera de la tarjeta más compacta */}
              <div className="relative h-40 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-[#0f172a]/60 to-transparent z-10"></div>

                <div className="absolute top-3 right-3 z-20 flex gap-2">
                  <motion.div
                    className="bg-gradient-to-r from-cyan-600 to-purple-600 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1 shadow-md"
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    <FaRocket className="text-cyan-300 text-[10px]" />
                    <span className="text-[10px]">{tour.duracion}</span>
                  </motion.div>
                  <motion.div
                    className="bg-gradient-to-r from-yellow-600 to-amber-600 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1 shadow-md"
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    <FaStar className="text-yellow-300 text-[10px]" />
                    <span className="text-[10px]">
                      {(tour as { calificacion?: string }).calificacion ||
                        "5.0"}
                    </span>
                  </motion.div>
                </div>

                <motion.img
                  src={tour.fotos?.[0]}
                  alt={tour.nombre}
                  className="w-full h-full object-cover"
                  whileHover={{
                    scale: 1.1,
                    transition: { duration: 0.5, ease: "easeOut" },
                  }}
                />
              </div>

              {/* Contenido de la tarjeta más compacto */}
              <div className="p-4 flex flex-col flex-grow justify-between">
                <div>
                  <motion.h2
                    className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-purple-300 mb-2"
                    whileHover={{ x: 2 }}
                    transition={{ type: "spring", stiffness: 500 }}
                  >
                    {tour.nombre}
                  </motion.h2>
                  <p className="text-gray-400 text-xs mb-3 line-clamp-2 leading-relaxed">
                    {tour.descripcion}
                  </p>

                  <div className="flex flex-wrap gap-1 mb-3">
                    {(tour as { caracteristicas?: string[] }).caracteristicas
                      ?.slice(0, 3)
                      .map((caracteristica: string, i: number) => (
                        <motion.span
                          key={i}
                          className="text-[10px] px-2 py-1 bg-cyan-900/30 text-cyan-300 rounded-full border border-cyan-500/30"
                          whileHover={{ scale: 1.05 }}
                          transition={{ type: "spring", stiffness: 500 }}
                        >
                          {caracteristica}
                        </motion.span>
                      ))}
                  </div>
                </div>

                <div className="mt-2 flex justify-between items-center">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-gray-400">Desde</span>
                    <span className="text-cyan-400 font-bold text-base tracking-wider">
                      {tour.precio}
                    </span>
                  </div>
                  <motion.button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedTour(tour.id);
                    }}
                    className="relative px-4 py-2 bg-gradient-to-r from-cyan-600 to-purple-600 text-white rounded-lg text-xs font-bold shadow-md overflow-hidden group"
                    whileHover={{
                      scale: 1.05,
                      boxShadow: "0 0 15px rgba(139, 92, 246, 0.5)",
                    }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span className="relative z-10">Ver Detalles</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/30 to-purple-500/30 rounded-lg blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Elemento decorativo flotante mejorado */}
    </div>
  );
}
