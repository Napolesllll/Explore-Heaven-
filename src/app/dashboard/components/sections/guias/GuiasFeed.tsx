"use client";

import { motion } from "framer-motion";
import { FaHammer, FaRocket, FaTools, FaUserAstronaut } from "react-icons/fa";

export default function GuiasFeed() {
  return (
    <div className="min-h-screen pt-24 pb-12 px-4 bg-gradient-to-br from-[#0c0f1d] via-[#151b35] to-[#0c0f1d]">
      {/* Efecto de partículas cósmicas */}
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
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative bg-[#0f172a]/80 backdrop-blur-xl rounded-3xl border border-cyan-500/30 shadow-2xl shadow-cyan-500/10 p-10 text-center overflow-hidden"
        >
          {/* Efecto de construcción animado */}
          <div className="absolute inset-0 opacity-20">
            {[...Array(15)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute text-yellow-400"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  fontSize: `${Math.random() * 24 + 16}px`,
                }}
                animate={{
                  rotate: [0, 360],
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: Math.random() * 3 + 2,
                  repeat: Infinity,
                  repeatType: "reverse",
                }}
              >
                <FaTools />
              </motion.div>
            ))}
          </div>

          {/* Contenido principal */}
          <div className="relative z-10">
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3, type: "spring" }}
              className="inline-block mb-8"
            >
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full blur-xl opacity-30 animate-pulse"></div>
                <div className="relative bg-gradient-to-br from-[#0f172a] to-[#1e293b] border-2 border-cyan-500/30 rounded-full p-8">
                  <motion.div
                    animate={{
                      y: [0, -10, 0],
                      rotate: [0, 5, 0, -5, 0],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      repeatType: "reverse",
                    }}
                  >
                    <FaHammer className="text-5xl text-yellow-400 mx-auto" />
                  </motion.div>
                </div>
              </div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 mb-6"
            >
              ZONA EN CONSTRUCCIÓN
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto"
            >
              Estamos trabajando intensamente para crear una experiencia
              excepcional de gestión de guías. ¡Vuelve pronto para descubrir
              algo extraordinario!
            </motion.p>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
              className="flex flex-wrap justify-center gap-6 mb-10"
            >
              <div className="flex items-center gap-3 bg-gray-800/50 p-4 rounded-xl border border-cyan-500/30">
                <div className="bg-cyan-500/10 p-3 rounded-full">
                  <FaUserAstronaut className="text-cyan-400 text-2xl" />
                </div>
                <span className="text-gray-300">Perfiles detallados</span>
              </div>

              <div className="flex items-center gap-3 bg-gray-800/50 p-4 rounded-xl border border-purple-500/30">
                <div className="bg-purple-500/10 p-3 rounded-full">
                  <FaTools className="text-purple-400 text-2xl" />
                </div>
                <span className="text-gray-300">Herramientas avanzadas</span>
              </div>

              <div className="flex items-center gap-3 bg-gray-800/50 p-4 rounded-xl border border-yellow-500/30">
                <div className="bg-yellow-500/10 p-3 rounded-full">
                  <FaRocket className="text-yellow-400 text-2xl" />
                </div>
                <span className="text-gray-300">Experiencia futurista</span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1 }}
            >
              <div className="inline-flex items-center gap-3 bg-gradient-to-r from-cyan-600/20 to-purple-600/20 px-6 py-3 rounded-full border border-cyan-500/30 mb-8">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-cyan-300 font-medium">
                  Desarrollo en progreso
                </span>
              </div>

              <motion.div
                className="text-gray-400 mb-2"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                Próximo lanzamiento: 01/12/2025
              </motion.div>

              <div className="w-full bg-gray-800 rounded-full h-2.5 mb-10">
                <motion.div
                  className="bg-gradient-to-r from-cyan-500 to-purple-500 h-2.5 rounded-full"
                  initial={{ width: "0%" }}
                  animate={{ width: "65%" }}
                  transition={{ duration: 2, delay: 1.3 }}
                />
              </div>
            </motion.div>

            <motion.button
              className="px-8 py-4 bg-gradient-to-r from-cyan-600 to-purple-600 text-white font-bold rounded-xl shadow-lg flex items-center justify-center gap-3 mx-auto group"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5 }}
            >
              <span>Explorar Otras Secciones</span>
              <FaRocket className="text-cyan-300 group-hover:text-white transition-colors group-hover:translate-x-1" />
            </motion.button>
          </div>
        </motion.div>
      </div>

      {/* Elemento decorativo flotante */}
      <motion.div
        className="fixed bottom-8 right-8 w-16 h-16 rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 shadow-2xl shadow-cyan-500/30 flex items-center justify-center cursor-pointer"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.8, duration: 0.5 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <FaRocket className="text-white text-2xl animate-bounce" />
      </motion.div>
    </div>
  );
}
