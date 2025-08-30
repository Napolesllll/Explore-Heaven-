"use client";

import { Tour } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  FaCalendarAlt,
  FaUsers,
  FaUserTie,
  FaArrowRight,
  FaStar,
} from "react-icons/fa";

const TourCard = ({ tour }: { tour: Tour }) => {
  // Ensure Image src is always a string (Next/Image doesn't accept null)
  const imageSrc: string =
    tour.imagenUrl && tour.imagenUrl.length > 0
      ? tour.imagenUrl
      : "/images/placeholder-tour.jpg"; // put a placeholder in /public

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, rotateX: -15 }}
      animate={{ opacity: 1, y: 0, rotateX: 0 }}
      whileHover={{
        y: -15,
        rotateY: 2,
        scale: 1.02,
        boxShadow:
          "0 30px 80px -20px rgba(139, 92, 246, 0.4), 0 0 50px rgba(34, 211, 238, 0.3)",
        transition: {
          type: "spring",
          stiffness: 300,
          damping: 20,
        },
      }}
      transition={{
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94],
        staggerChildren: 0.1,
      }}
      className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl overflow-hidden border border-cyan-400/30 shadow-2xl group backdrop-blur-sm max-w-sm mx-auto"
      style={{
        background: `
          radial-gradient(circle at 20% 80%, rgba(139, 92, 246, 0.15) 0%, transparent 50%),
          radial-gradient(circle at 80% 20%, rgba(34, 211, 238, 0.15) 0%, transparent 50%),
          linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)
        `,
      }}
    >
      {/* Floating particles with improved physics */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(8)].map((_, i) => {
          const size = 2 + (i % 3);
          const duration = 4 + (i % 3);
          const delay = i * 0.3;
          const left = (i * 12.5) % 100;
          const top = (i * 15) % 100;

          return (
            <motion.div
              key={i}
              className="absolute rounded-full"
              style={{
                background: `radial-gradient(circle, ${
                  i % 2 === 0
                    ? "rgba(34, 211, 238, 0.6)"
                    : "rgba(139, 92, 246, 0.6)"
                } 0%, transparent 70%)`,
                width: `${size}px`,
                height: `${size}px`,
                left: `${left}%`,
                top: `${top}%`,
              }}
              animate={{
                y: [-10, -30, -10],
                x: [-5, 5, -5],
                opacity: [0, 0.8, 0],
                scale: [0.5, 1.2, 0.5],
              }}
              transition={{
                duration,
                repeat: Infinity,
                delay,
                ease: "easeInOut",
              }}
            />
          );
        })}
      </div>

      {/* Animated border glow */}
      <div
        className="absolute -inset-1 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: `conic-gradient(from 0deg at 50% 50%, 
            rgba(34, 211, 238, 0.5) 0deg, 
            rgba(139, 92, 246, 0.5) 120deg, 
            rgba(34, 211, 238, 0.5) 240deg, 
            rgba(34, 211, 238, 0.5) 360deg)`,
        }}
      />

      {/* Compact image section */}
      <div className="relative h-48 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-slate-900/60 z-10"></div>

        <Image
          src={imageSrc}
          alt={tour.nombre ?? "Tour"}
          fill
          className="object-cover transition-all duration-700 group-hover:scale-110 group-hover:brightness-110"
          priority
        />

        {/* Floating date badge with glassmorphism */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.3, type: "spring", stiffness: 300 }}
          className="absolute top-4 right-4 backdrop-blur-md bg-white/10 border border-white/20 text-white text-xs px-3 py-2 rounded-2xl shadow-xl z-20 flex items-center gap-2"
        >
          <FaCalendarAlt className="text-cyan-300" />
          <span className="font-medium">{tour.salida || "Próximamente"}</span>
        </motion.div>

        {/* Premium badge */}
        <div className="absolute top-4 left-4 backdrop-blur-md bg-gradient-to-r from-yellow-400/20 to-orange-400/20 border border-yellow-400/30 text-yellow-300 text-xs px-3 py-1.5 rounded-full shadow-xl z-20 flex items-center gap-1">
          <FaStar className="text-yellow-400" />
          <span>Premium</span>
        </div>
      </div>

      <div className="relative z-10 p-5 space-y-4">
        {/* Enhanced title with hover effect */}
        <motion.h3
          whileHover={{ scale: 1.02 }}
          className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-cyan-400 bg-size-200 bg-pos-0 group-hover:bg-pos-100 transition-all duration-500 line-clamp-2"
          style={{ backgroundSize: "200% 100%" }}
        >
          {tour.nombre}
        </motion.h3>

        {/* Compact description */}
        <p className="text-gray-400 text-sm line-clamp-2 group-hover:text-gray-300 transition-colors leading-relaxed">
          {tour.descripcion}
        </p>

        {/* Horizontal info layout */}
        <div className="flex items-center justify-between gap-3 pt-2">
          <div className="flex items-center gap-2 text-xs bg-cyan-500/10 backdrop-blur-sm px-3 py-2 rounded-xl border border-cyan-500/20">
            <FaUsers className="text-cyan-400 flex-shrink-0" />
            <span className="text-cyan-300 font-medium">
              {tour.maxReservas}
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs bg-purple-500/10 backdrop-blur-sm px-3 py-2 rounded-xl border border-purple-500/20">
            <FaUserTie className="text-purple-400 flex-shrink-0" />
            <span className="text-purple-300 font-medium">
              {tour.guias} guías
            </span>
          </div>
        </div>

        {/* Date info in compact format */}
        <div className="text-xs text-gray-400 flex items-center justify-between">
          <span>
            Salida:{" "}
            <span className="text-cyan-300">{tour.salida || "TBD"}</span>
          </span>
          <span>
            Regreso:{" "}
            <span className="text-purple-300">{tour.regreso || "TBD"}</span>
          </span>
        </div>
      </div>

      {/* Enhanced CTA button */}
      <div className="relative z-10 p-4 pt-0">
        <Link href={`/tours/${tour.id}`}>
          <motion.button
            whileHover={{
              scale: 1.05,
              boxShadow: "0 10px 30px -10px rgba(34, 211, 238, 0.5)",
            }}
            whileTap={{ scale: 0.95 }}
            className="w-full relative overflow-hidden flex justify-center items-center gap-3 font-bold px-6 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-600 via-purple-600 to-cyan-600 bg-size-200 bg-pos-0 hover:bg-pos-100 transition-all duration-500 group/button shadow-lg"
            style={{ backgroundSize: "200% 100%" }}
          >
            {/* Button shimmer effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/button:translate-x-full transition-transform duration-1000" />

            <span className="text-white font-semibold relative z-10">
              Explorar Experiencia
            </span>
            <motion.div
              whileHover={{ x: 5 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <FaArrowRight className="text-cyan-200 relative z-10" />
            </motion.div>
          </motion.button>
        </Link>
      </div>
    </motion.div>
  );
};

export default TourCard;
