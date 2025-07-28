"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { tours } from "../../../../../data/toursData";
import TourDetail from "./TourDetail";
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
          <span className="uppercase  tracking-widest">Volver a la galería</span>
          <div className="absolute -inset-4 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 group-hover:opacity-100 opacity-0 transition-opacity duration-300 blur-xl"></div>
        </motion.button>
        <TourDetail tour={tourActual} onBack={() => setSelectedTour(null)} />
      </div>
    )
  }

  return (
    <div className="min-h-screen py-12 mt-10 px-4 bg-gradient-to-br from-[#0c0f1d] via-[#151b35] to-[#0c0f1d]">
      {/* Efecto de partículas galácticas */}
      <div className="fixed inset-0 overflow-hidden">
        {[...Array(30)].map((_, i) => (
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
              opacity: [0, 0.5, 0],
              scale: [0, 1, 0]
            }}
            transition={{ 
              duration: Math.random() * 6 + 4,
              repeat: Infinity,
              delay: Math.random() * 3
            }}
          />
        ))}
      </div>

      <motion.h1 
        className="text-3xl md:text-4xl font-bold text-center mb-10 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        EXPLORA NUESTRAS EXPERIENCIAS
      </motion.h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
        {tours.map((tour, index) => (
          <motion.div
            key={tour.id}
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ 
              opacity: isVisible ? 1 : 0, 
              y: isVisible ? 0 : 50,
              scale: isVisible ? 1 : 0.9
            }}
            transition={{ 
              duration: 0.6, 
              delay: index * 0.15,
              type: "spring",
              stiffness: 100
            }}
            whileHover={{ 
              y: -15,
              boxShadow: "0 25px 50px -15px rgba(139, 92, 246, 0.3)",
              transition: { duration: 0.3 }
            }}
            className="relative bg-gradient-to-br from-[#0f172a] to-[#1e293b] rounded-2xl overflow-hidden border border-cyan-500/30 shadow-lg shadow-cyan-500/10"
          >
            {/* Efecto de brillo al pasar el mouse */}
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 opacity-0 group-hover:opacity-30 transition-opacity duration-500"></div>
            
            {/* Cabecera de la tarjeta */}
            <div className="relative h-52 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a]/90 to-transparent z-10"></div>
              
              <div className="absolute top-4 right-4 z-20 flex gap-2">
                <div className="bg-gradient-to-r from-cyan-600 to-purple-600 text-white text-xs px-3 py-1 rounded-full flex items-center gap-1">
                  <FaRocket className="text-cyan-300" />
                  <span>{tour.duracion}</span>
                </div>
                <div className="bg-gradient-to-r from-yellow-600 to-amber-600 text-white text-xs px-3 py-1 rounded-full flex items-center gap-1">
                  <FaStar className="text-yellow-300" />
                  <span>{tour.calificacion || "5.0"}</span>
                </div>
              </div>
              
              <img
                src={tour.fotos?.[0]}
                alt={tour.nombre}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
            </div>

            {/* Contenido de la tarjeta */}
            <div className="p-6 flex flex-col flex-grow justify-between">
              <div>
                <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-purple-300 mb-3">
                  {tour.nombre}
                </h2>
                <p className="text-gray-400 text-sm mb-4 line-clamp-3">
                  {tour.descripcion}
                </p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {tour.caracteristicas?.slice(0, 3).map((caracteristica, i) => (
                    <span 
                      key={i}
                      className="text-xs px-3 py-1 bg-cyan-900/30 text-cyan-300 rounded-full border border-cyan-500/30"
                    >
                      {caracteristica}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-4 flex justify-between items-center">
                <div className="flex flex-col">
                  <span className="text-xs text-gray-400">Desde</span>
                  <span className="text-cyan-400 font-bold text-lg tracking-wider">
                    {tour.precio}
                  </span>
                </div>
                <motion.button
                  onClick={() => setSelectedTour(tour.id)}
                  className="relative px-5 py-3 bg-gradient-to-r from-cyan-600 to-purple-600 text-white rounded-xl text-sm font-bold shadow-md overflow-hidden group"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="relative z-10">Ver Detalles</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="absolute -inset-2 bg-gradient-to-r from-cyan-500/30 to-purple-500/30 rounded-xl blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </motion.button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Elemento decorativo flotante */}
      <motion.div
        className="fixed bottom-8 right-8 w-16 h-16 rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 shadow-2xl shadow-cyan-500/30 flex items-center justify-center cursor-pointer"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <FaRocket className="text-white text-2xl animate-bounce" />
      </motion.div>
    </div>
  )
}