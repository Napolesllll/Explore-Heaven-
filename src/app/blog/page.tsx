"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { FaRocket, FaGlobeAmericas } from "react-icons/fa";
import TestimonialSection from "../../components/blog/TestimonialSection";
import FAQSection from "../../components/blog/FaqSection";
import { useRouter } from "next/navigation";

export default function BlogHeroSection() {
  const router = useRouter();
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const yBg = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const scaleTitle = useTransform(scrollYProgress, [0, 1], [1, 1.05]);
  const opacitySubtitle = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <div ref={containerRef} className="relative min-h-screen bg-black">
      {/* Sección Hero */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden px-4">
        {/* Fondo futurista dorado/negro */}
        <div className="absolute inset-0 z-0">
          {/* Grid holográfico dorado */}
          <div className="absolute inset-0 bg-[url('/grid-gold.svg')] bg-[length:100px_100px] opacity-20"></div>

          {/* Planetas dorados */}
          <motion.div
            className="absolute top-1/4 left-1/4 w-80 h-80 rounded-full bg-gradient-to-br from-yellow-900/20 to-transparent border border-yellow-500/20 blur-xl"
            animate={{
              y: [0, -20, 0],
              x: [0, 15, 0],
              scale: [1, 1.05, 1],
            }}
            transition={{
              duration: 12,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />

          <motion.div
            className="absolute bottom-1/3 right-1/4 w-60 h-60 rounded-full bg-gradient-to-br from-yellow-800/20 to-transparent border border-yellow-400/20 blur-xl"
            animate={{
              y: [0, 20, 0],
              x: [0, -15, 0],
              scale: [1, 1.07, 1],
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />

          {/* Efecto de luz dorada */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[200%] h-[200%] bg-radial-gradient(circle, rgba(218, 165, 32, 0.1) 0%, rgba(0, 0, 0, 0) 70%)"></div>
        </div>

        {/* Contenido principal */}
        <motion.div
          className="relative z-10 text-center space-y-8"
          style={{ y: yBg, scale: scaleTitle }}
        >
          {/* Subtítulo con efecto neón dorado */}
          <motion.p
            className="text-yellow-300 text-lg md:text-xl font-light tracking-widest"
            style={{ opacity: opacitySubtitle }}
            animate={{
              textShadow: [
                "0 0 5px rgba(218, 165, 32, 0.3)",
                "0 0 15px rgba(255, 215, 0, 0.8)",
                "0 0 5px rgba(218, 165, 32, 0.3)",
              ],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
            }}
          >
            BIENVENIDO AL BLOG
          </motion.p>

          {/* Título principal con efecto holográfico dorado */}
          <div className="relative">
            <motion.h1
              className="text-6xl md:text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-yellow-500 to-yellow-300"
              animate={{
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "linear",
              }}
            >
              EXPLORE HEAVEN
            </motion.h1>

            {/* Efecto de texto holográfico dorado */}
            <motion.div
              className="absolute top-0 left-0 w-full h-full text-6xl md:text-9xl font-bold opacity-30"
              animate={{
                textShadow: [
                  "0 0 10px rgba(218, 165, 32, 0.3)",
                  "0 0 20px rgba(255, 215, 0, 0.5)",
                  "0 0 10px rgba(218, 165, 32, 0.3)",
                ],
                y: [0, -5, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
              }}
              style={{
                WebkitTextStroke: "1px rgba(255, 215, 0, 0.3)",
                color: "transparent",
              }}
            >
              EXPLORE HEAVEN
            </motion.div>
          </div>

          {/* Descripción con efecto de escritura */}
          <motion.p
            className="text-gray-300 text-lg md:text-xl max-w-2xl mx-auto relative"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
          >
            <span className="absolute -left-6 text-yellow-400 animate-pulse">
              &gt;
            </span>
            Descubre los destinos más increíbles del universo y vive
            experiencias que desafían los límites de la realidad
          </motion.p>

          {/* Botones futuristas dorados */}
          <motion.div
            className="flex flex-wrap justify-center gap-6 pt-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <motion.button
              whileHover={{
                scale: 1.05,
                boxShadow: "0 0 20px rgba(255, 215, 0, 0.5)",
              }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-gradient-to-r from-yellow-600 to-yellow-800 text-black font-bold rounded-lg flex items-center gap-3 group"
            >
              <FaRocket className="group-hover:animate-bounce" />
              <span className="relative">
                RESERVAR EXPERIENCIA
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-black group-hover:w-full transition-all duration-300"></span>
              </span>
            </motion.button>

            <motion.button
              whileHover={{
                scale: 1.05,
                boxShadow: "0 0 20px rgba(255, 215, 0, 0.5)",
              }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-transparent border-2 border-yellow-500 text-yellow-300 font-bold rounded-lg flex items-center gap-3 group"
              onClick={() => router.push("/tours")}
            >
              <FaGlobeAmericas className="group-hover:rotate-[360deg] transition-transform duration-1000" />
              <span className="relative">
                EXPLORAR DESTINOS
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-yellow-300 group-hover:w-full transition-all duration-300"></span>
              </span>
            </motion.button>
          </motion.div>
        </motion.div>

        {/* Flecha de desplazamiento dorada */}
        <motion.div
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2 text-yellow-400 animate-bounce"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5 }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-10 w-10"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </motion.div>
      </section>

      {/* Sección de Testimonios (manteniendo coherencia con dorado/negro) */}
      <TestimonialSection />

      <FAQSection />
    </div>
  );
}
