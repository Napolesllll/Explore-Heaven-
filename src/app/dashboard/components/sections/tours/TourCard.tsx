"use client";

import { Tour } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { FaCalendarAlt, FaUsers, FaUserTie, FaArrowRight } from "react-icons/fa";

const TourCard = ({ tour }: { tour: Tour }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      whileHover={{
        y: -10,
        boxShadow: "0 20px 50px -15px rgba(139, 92, 246, 0.3)",
        transition: {
          duration: 0.3,
          ease: "easeOut"
        }
      }}
      transition={{ duration: 0.5, ease: "backOut" }}
      className="relative bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] rounded-2xl overflow-hidden border border-cyan-500/20 shadow-lg shadow-cyan-500/10 hover:shadow-cyan-500/30 group"
    >
      {/* Efecto de partículas */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(5)].map((_, i) => {
          const top = Math.random() * 100;
          const left = Math.random() * 100;
          const width = Math.random() * 10 + 5;
          const height = Math.random() * 10 + 5;
          const duration = Math.random() * 5 + 3;
          const delay = Math.random() * 2;
          return (
            <motion.div
              key={i}
              className="absolute rounded-full bg-gradient-to-r from-cyan-400/20 to-purple-500/20"
              initial={{
                top: `${top}%`,
                left: `${left}%`,
                width: `${width}px`,
                height: `${height}px`,
                opacity: 0
              }}
              animate={{
                opacity: [0, 0.3, 0],
                scale: [0, 1, 0]
              }}
              transition={{
                duration,
                repeat: Infinity,
                delay
              }}
            />
          );
        })}
      </div>
      
      {/* Glow effect */}
      <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-500"></div>
      
      {/* Imagen con efecto de desenfoque */}
      <div className="relative h-64 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/10 to-purple-500/10 z-10"></div>
        <Image
          src={tour.imagenUrl}
          alt={tour.nombre}
          fill
          className="object-cover transition-all duration-700 group-hover:scale-105"
          priority
        /> 
        
        {/* Badge de fecha */}
        <div className="absolute top-4 left-4 bg-gradient-to-r from-cyan-600 to-purple-600 text-white text-xs px-3 py-1 rounded-full shadow-lg z-20 flex items-center gap-2">
          <FaCalendarAlt className="text-cyan-300" />
          <span>{tour.salida || "Por definir"}</span>
        </div>
      </div>

      <div className="relative z-10 p-6 space-y-4">
        {/* Nombre con efecto de gradiente */}
        <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 group-hover:from-cyan-300 group-hover:to-purple-300 transition-all">
          {tour.nombre}
        </h3>
        
        {/* Descripción con efecto de desvanecimiento */}
        <motion.p 
          className="text-gray-400 text-sm line-clamp-3 group-hover:text-gray-300 transition-colors"
          whileHover={{ lineClamp: 6 }}
        >
          {tour.descripcion}
        </motion.p>

        {/* Información de fechas */}
        <div className="flex flex-wrap gap-4 pt-2">
          <div className="flex items-center gap-2 text-sm bg-gray-800/50 px-3 py-1.5 rounded-lg">
            <FaCalendarAlt className="text-cyan-400 flex-shrink-0" />
            <span className="text-gray-300">
              <span className="font-medium text-cyan-300">Salida:</span> {tour.salida || "Por definir"}
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm bg-gray-800/50 px-3 py-1.5 rounded-lg">
            <FaCalendarAlt className="text-purple-400 flex-shrink-0" />
            <span className="text-gray-300">
              <span className="font-medium text-purple-300">Regreso:</span> {tour.regreso || "Por definir"}
            </span>
          </div>
        </div>

        {/* Detalles de capacidad */}
        <div className="flex flex-wrap gap-4 pt-1">
          <div className="flex items-center gap-2 text-sm">
            <div className="bg-cyan-900/30 p-2 rounded-lg">
              <FaUsers className="text-cyan-400" />
            </div>
            <div>
              <div className="text-gray-400">Capacidad</div>
              <div className="text-cyan-300 font-medium">{tour.maxReservas} personas</div>
            </div>
          </div>
          
          <div className="flex items-center gap-2 text-sm">
            <div className="bg-purple-900/30 p-2 rounded-lg">
              <FaUserTie className="text-purple-400" />
            </div>
            <div>
              <div className="text-gray-400">Guías</div>
              <div className="text-purple-300 font-medium">{tour.guias} expertos</div>
            </div>
          </div>
        </div>
      </div>

      {/* Botón con efecto de gradiente interactivo */}
      <div className="relative z-10 p-4 bg-gradient-to-r from-[#0f172a] to-[#1e293b] border-t border-cyan-500/20">
        <Link href={`/tours/${tour.id}`}>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            className="w-full flex justify-center items-center gap-3 font-semibold px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-600 to-purple-600 shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 hover:from-cyan-500 hover:to-purple-500 transition-all group/button"
          >
            <span className="text-white group-hover/button:text-cyan-100 transition-colors">
              Explorar Experiencia
            </span>
            <FaArrowRight className="text-cyan-300 group-hover/button:text-cyan-100 group-hover/button:translate-x-1 transition-all" />
          </motion.button>
        </Link>
      </div>
    </motion.div>
  );
} 

export default TourCard;