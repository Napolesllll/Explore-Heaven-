// 2. GALACTIC FOOTER OPTIMIZADO PARA MÓVIL
"use client";

import { useState, useMemo, memo } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import {
  FaFacebookF,
  FaInstagram,
  FaWhatsapp,
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaClock,
  FaStar,
} from "react-icons/fa";

const GalacticFooter = memo(() => {
  const [currentYear] = useState(new Date().getFullYear());
  const [isMobile, setIsMobile] = useState(false);

  // Detectar móvil y reducir elementos pesados
  useMemo(() => {
    if (typeof window !== "undefined") {
      setIsMobile(window.innerWidth < 768);
    }
  }, []);

  const socialLinks = useMemo(
    () => [
      {
        icon: <FaFacebookF />,
        href: "#",
        color: "from-blue-500 to-blue-600",
        label: "Facebook",
      },
      {
        icon: <FaInstagram />,
        href: "#",
        color: "from-pink-500 to-purple-600",
        label: "Instagram",
      },
      {
        icon: <FaWhatsapp />,
        href: "#",
        color: "from-green-500 to-green-600",
        label: "WhatsApp",
      },
    ],
    []
  );

  const quickLinks = useMemo(
    () => [
      { label: "Inicio", href: "#inicio" },
      { label: "Tours", href: "#tours" },
      { label: "Reservas", href: "#reservas" },
      { label: "Guías", href: "#guias" },
      { label: "Contacto", href: "#contacto" },
      { label: "Política de Privacidad", href: "#privacy" },
    ],
    []
  );

  const contactInfo = useMemo(
    () => [
      {
        icon: <FaMapMarkerAlt />,
        text: "Medellín, Antioquia, Colombia",
        color: "text-cyan-400",
      },
      { icon: <FaPhone />, text: "+57 304 123 4567", color: "text-green-400" },
      {
        icon: <FaEnvelope />,
        text: "info@turismomagico.co",
        color: "text-purple-400",
      },
      {
        icon: <FaClock />,
        text: "24/7 Soporte disponible",
        color: "text-yellow-400",
      },
    ],
    []
  );

  // Reducir partículas en móvil
  const particleCount = isMobile ? 20 : 150;
  const floatingParticleCount = isMobile ? 5 : 20;

  return (
    <footer className="relative overflow-hidden">
      {/* Fondo optimizado para móvil */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a2a] via-[#1a093f] to-[#0c0522]">
        {/* Estrellas reducidas en móvil */}
        {!isMobile &&
          [...Array(Math.min(particleCount, 100))].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-white"
              initial={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                width: `${Math.random() * 2 + 1}px`,
                height: `${Math.random() * 2 + 1}px`,
                opacity: Math.random() * 0.6 + 0.2,
              }}
              animate={{
                opacity: [0.2, 0.8, 0.2],
                scale: [0.8, 1.2, 0.8],
              }}
              transition={{
                duration: Math.random() * 3 + 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
              style={{ contain: "layout style paint" }}
            />
          ))}

        {/* Nebulosas simplificadas */}
        <div className="absolute top-1/4 left-1/6 w-48 sm:w-96 h-48 sm:h-96 rounded-full bg-purple-900/20 blur-[60px] sm:blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/6 w-40 sm:w-80 h-40 sm:h-80 rounded-full bg-cyan-500/15 blur-[50px] sm:blur-[100px]" />
      </div>

      {/* Ondas simplificadas para móvil */}
      {!isMobile && (
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(2)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute inset-0 border border-cyan-500/10 rounded-full"
              initial={{ scale: 0, opacity: 1 }}
              animate={{ scale: 3, opacity: 0 }}
              transition={{
                duration: 5,
                repeat: Infinity,
                delay: i * 2,
                ease: "easeOut",
              }}
              style={{
                transform: `translate(-50%, -50%)`,
                left: "50%",
                top: "50%",
              }}
            />
          ))}
        </div>
      )}

      {/* Contenido principal */}
      <div className="relative z-10 px-4 py-8 sm:py-16">
        <div className="max-w-7xl mx-auto">
          {/* Header optimizado */}
          <motion.div
            className="text-center mb-8 sm:mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="relative inline-block mb-4 sm:mb-6">
              {!isMobile && (
                <motion.div
                  className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-500/20 to-purple-600/20 blur-lg"
                  animate={{ scale: [1, 1.1, 1], rotate: [0, 90, 180] }}
                  transition={{ duration: 6, repeat: Infinity }}
                />
              )}
              <div className="relative bg-[#0c0522]/80 backdrop-blur-sm rounded-full p-3 sm:p-6 border border-cyan-500/30">
                <div className="max-w-7xl mx-auto px-2 sm:px-4 py-2 sm:py-6 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6">
                  <Image
                    src="/images/Loho brillante 1-05.svg"
                    alt="Explore Heaven Logo"
                    width={isMobile ? 50 : 80}
                    height={isMobile ? 50 : 80}
                    className="w-12 h-12 sm:w-20 sm:h-20"
                    priority={false}
                    loading="lazy"
                  />
                  <Image
                    src="/images/horizontal logo1-10.svg"
                    alt="Explore Heaven Horizontal Logo"
                    width={isMobile ? 120 : 160}
                    height={isMobile ? 60 : 80}
                    className="w-24 h-12 sm:w-40 sm:h-20"
                    priority={false}
                    loading="lazy"
                  />
                </div>
              </div>
            </div>

            <p
              className={`${isMobile ? "text-base" : "text-xl"} text-gray-300 max-w-2xl mx-auto leading-relaxed px-4`}
            >
              Descubre experiencias únicas y crea recuerdos inolvidables con
              nuestros tours especializados
            </p>
          </motion.div>

          {/* Grid adaptativo para móvil */}
          <div
            className={`grid grid-cols-1 ${isMobile ? "gap-6" : "md:grid-cols-2 lg:grid-cols-4 gap-8"} mb-8 sm:mb-12`}
          >
            {/* Enlaces rápidos */}
            <motion.div
              className="space-y-4 sm:space-y-6"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <h3
                className={`${isMobile ? "text-lg" : "text-2xl"} font-bold text-cyan-300 mb-4 flex items-center gap-2`}
              >
                <FaStar className="text-yellow-400" /> Enlaces Rápidos
              </h3>
              <div
                className={`grid ${isMobile ? "grid-cols-2 gap-2" : "space-y-3"}`}
              >
                {quickLinks.map((link, index) => (
                  <motion.a
                    key={index}
                    href={link.href}
                    className={`block text-gray-300 hover:text-cyan-300 transition-all duration-300 ${!isMobile ? "hover:translate-x-2" : ""} border-l-2 border-transparent hover:border-cyan-500 pl-3 text-sm sm:text-base`}
                    whileHover={{ scale: isMobile ? 1 : 1.02 }}
                  >
                    {link.label}
                  </motion.a>
                ))}
              </div>
            </motion.div>

            {/* Contacto optimizado */}
            <motion.div
              className="space-y-4 sm:space-y-6"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h3
                className={`${isMobile ? "text-lg" : "text-2xl"} font-bold text-purple-300 mb-4 flex items-center gap-2`}
              >
                <FaMapMarkerAlt className="text-green-400" /> Contáctanos
              </h3>
              <div className="space-y-3 sm:space-y-4">
                {contactInfo.map((info, index) => (
                  <motion.div
                    key={index}
                    className={`flex items-start gap-3 ${isMobile ? "p-2" : "p-3"} rounded-lg bg-[#0c0522]/30 backdrop-blur-sm border border-cyan-500/20 hover:border-cyan-500/40 transition-all duration-300`}
                    whileHover={{
                      scale: isMobile ? 1 : 1.01,
                      x: isMobile ? 0 : 3,
                    }}
                  >
                    <span
                      className={`${isMobile ? "text-base" : "text-lg"} ${info.color} mt-1 flex-shrink-0`}
                    >
                      {info.icon}
                    </span>
                    <span
                      className={`text-gray-300 ${isMobile ? "text-sm" : "text-base"} leading-relaxed`}
                    >
                      {info.text}
                    </span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Redes sociales optimizadas */}
            <motion.div
              className="space-y-4 sm:space-y-6"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <h3
                className={`${isMobile ? "text-lg" : "text-2xl"} font-bold text-yellow-300 mb-4 flex items-center gap-2`}
              >
                <span className="text-pink-400"></span> Síguenos
              </h3>
              <div
                className={`grid ${isMobile ? "grid-cols-3 gap-2" : "grid-cols-2 gap-4"}`}
              >
                {socialLinks.map((social, index) => (
                  <motion.a
                    key={index}
                    href={social.href}
                    className={`relative ${isMobile ? "p-3" : "p-4"} rounded-xl bg-gradient-to-r ${social.color} text-white font-medium text-center transition-all duration-300 hover:shadow-lg hover:shadow-current/50 overflow-hidden group`}
                    whileHover={{
                      scale: isMobile ? 1.02 : 1.05,
                      y: isMobile ? 0 : -3,
                    }}
                    whileTap={{ scale: 0.98 }}
                    aria-label={social.label}
                  >
                    <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <span
                      className={`relative z-10 ${isMobile ? "text-lg" : "text-xl"}`}
                    >
                      {social.icon}
                    </span>
                    <div
                      className={`relative z-10 ${isMobile ? "text-xs" : "text-sm"} mt-1`}
                    >
                      {social.label}
                    </div>
                  </motion.a>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Línea divisoria simplificada */}
          <div className="relative mb-6 sm:mb-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-cyan-500/20"></div>
            </div>
            <div className="relative flex justify-center">
              <div className="bg-[#0c0522] px-4">
                <motion.div
                  className={`${isMobile ? "w-6 h-0.5" : "w-8 h-1"} bg-gradient-to-r from-cyan-500 to-purple-600 rounded-full`}
                  animate={{ scaleX: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </div>
            </div>
          </div>

          {/* Copyright optimizado */}
          <motion.div
            className="text-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <div
              className={`bg-[#0c0522]/40 backdrop-blur-sm rounded-2xl ${isMobile ? "p-4" : "p-6"} border border-cyan-500/20`}
            >
              <p
                className={`text-gray-400 mb-2 ${isMobile ? "text-sm" : "text-base"}`}
              >
                © {currentYear} Explore Heaven. Todos los derechos reservados.
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Partículas flotantes reducidas */}
      {!isMobile && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(floatingParticleCount)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                width: `${Math.random() * 6 + 3}px`,
                height: `${Math.random() * 6 + 3}px`,
                background: `radial-gradient(circle, ${
                  Math.random() > 0.5 ? "#00ffff" : "#9d4edd"
                }30, transparent)`,
              }}
              animate={{
                y: [-15, -60, -15],
                x: [-8, 8, -8],
                opacity: [0, 0.4, 0],
              }}
              transition={{
                duration: Math.random() * 8 + 6,
                repeat: Infinity,
                delay: Math.random() * 4,
              }}
            />
          ))}
        </div>
      )}
    </footer>
  );
});

GalacticFooter.displayName = "GalacticFooter";

export default memo(GalacticFooter);
