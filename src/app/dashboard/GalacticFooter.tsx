"use client";

import { useState } from "react";
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
  FaHeart,
  FaStar,
} from "react-icons/fa";

export default function GalacticFooter() {
  const [currentYear] = useState(new Date().getFullYear());

  const socialLinks = [
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
  ];

  const quickLinks = [
    { label: "Inicio", href: "#inicio" },
    { label: "Tours", href: "#tours" },
    { label: "Reservas", href: "#reservas" },
    { label: "Guías", href: "#guias" },
    { label: "Contacto", href: "#contacto" },
    { label: "Política de Privacidad", href: "#privacy" },
  ];

  const contactInfo = [
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
  ];

  return (
    <footer className="relative overflow-hidden">
      {/* Fondo galáctico animado */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a2a] via-[#1a093f] to-[#0c0522]">
        {/* Estrellas animadas */}
        {[...Array(150)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-white"
            initial={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              width: `${Math.random() * 3 + 1}px`,
              height: `${Math.random() * 3 + 1}px`,
              opacity: Math.random() * 0.8 + 0.2,
            }}
            animate={{
              opacity: [0.2, 1, 0.2],
              scale: [0.8, 1.2, 0.8],
            }}
            transition={{
              duration: Math.random() * 4 + 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}

        {/* Nebulosas flotantes */}
        <motion.div
          className="absolute top-1/4 left-1/6 w-96 h-96 rounded-full bg-purple-900/30 blur-[120px]"
          animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.3, 0.1] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/6 w-80 h-80 rounded-full bg-cyan-500/20 blur-[100px]"
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 10, repeat: Infinity, delay: 2 }}
        />
      </div>

      {/* Ondas de energía */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute inset-0 border border-cyan-500/10 rounded-full"
            initial={{ scale: 0, opacity: 1 }}
            animate={{ scale: 4, opacity: 0 }}
            transition={{
              duration: 6,
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

      {/* Contenido principal */}
      <div className="relative z-10 px-4 py-16">
        <div className="max-w-7xl mx-auto">
          {/* Header del footer */}
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="relative inline-block mb-6">
              <motion.div
                className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-500/30 to-purple-600/30 blur-xl"
                animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360] }}
                transition={{ duration: 8, repeat: Infinity }}
              />
              <div className="relative bg-[#0c0522]/80 backdrop-blur-md rounded-full p-6 border border-cyan-500/50">
                <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col sm:flex-row items-center justify-center gap-6">
                  <Image
                    src="/images/Loho brillante 1-05.svg"
                    alt="Explore Heaven Logo"
                    width={80}
                    height={80}
                  />
                  <Image
                    src="/images/horizontal logo1-10.svg"
                    alt="Explore Heaven Horizontal Logo"
                    width={160}
                    height={80}
                  />
                </div>
              </div>
            </div>

            <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
              Descubre experiencias únicas y crea recuerdos inolvidables con
              nuestros tours especializados
            </p>
          </motion.div>

          {/* Grid principal */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {/* Enlaces rápidos */}
            <motion.div
              className="space-y-6"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <h3 className="text-2xl font-bold text-cyan-300 mb-4 flex items-center gap-2">
                <FaStar className="text-yellow-400" /> Enlaces Rápidos
              </h3>
              <div className="space-y-3">
                {quickLinks.map((link, index) => (
                  <motion.a
                    key={index}
                    href={link.href}
                    className="block text-gray-300 hover:text-cyan-300 transition-all duration-300 hover:translate-x-2 border-l-2 border-transparent hover:border-cyan-500 pl-3"
                    whileHover={{ scale: 1.05 }}
                  >
                    {link.label}
                  </motion.a>
                ))}
              </div>
            </motion.div>

            {/* Contacto */}
            <motion.div
              className="space-y-6"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <h3 className="text-2xl font-bold text-purple-300 mb-4 flex items-center gap-2">
                <FaMapMarkerAlt className="text-green-400" /> Contáctanos
              </h3>
              <div className="space-y-4">
                {contactInfo.map((info, index) => (
                  <motion.div
                    key={index}
                    className="flex items-start gap-3 p-3 rounded-lg bg-[#0c0522]/40 backdrop-blur-sm border border-cyan-500/20 hover:border-cyan-500/50 transition-all duration-300"
                    whileHover={{ scale: 1.02, x: 5 }}
                  >
                    <span className={`text-lg ${info.color} mt-1`}>
                      {info.icon}
                    </span>
                    <span className="text-gray-300">{info.text}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Redes sociales */}
            <motion.div
              className="space-y-6"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <h3 className="text-2xl font-bold text-yellow-300 mb-4 flex items-center gap-2">
                <FaHeart className="text-pink-400" /> Síguenos
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {socialLinks.map((social, index) => (
                  <motion.a
                    key={index}
                    href={social.href}
                    className={`relative p-4 rounded-xl bg-gradient-to-r ${social.color} text-white font-medium text-center transition-all duration-300 hover:shadow-lg hover:shadow-current/50 overflow-hidden group`}
                    whileHover={{ scale: 1.05, y: -5 }}
                    whileTap={{ scale: 0.95 }}
                    aria-label={social.label}
                  >
                    <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <span className="relative z-10 text-xl">{social.icon}</span>
                    <div className="relative z-10 text-sm mt-1">
                      {social.label}
                    </div>
                  </motion.a>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Línea divisoria */}
          <div className="relative mb-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gradient-to-r from-transparent via-cyan-500/30 to-transparent"></div>
            </div>
            <div className="relative flex justify-center">
              <div className="bg-[#0c0522] px-4">
                <motion.div
                  className="w-8 h-1 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-full"
                  animate={{ scaleX: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </div>
            </div>
          </div>

          {/* Copyright */}
          <motion.div
            className="text-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 1 }}
          >
            <div className="bg-[#0c0522]/40 backdrop-blur-md rounded-2xl p-6 border border-cyan-500/20">
              <p className="text-gray-400 mb-2">
                © {currentYear} Explore Heaven. Todos los derechos reservados.
              </p>
              <p className="text-sm text-gray-500">
                Hecho con{" "}
                <motion.span
                  className="text-red-400"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  ♥
                </motion.span>{" "}
                para viajeros apasionados
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Partículas flotantes */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              width: `${Math.random() * 8 + 4}px`,
              height: `${Math.random() * 8 + 4}px`,
              background: `radial-gradient(circle, ${
                Math.random() > 0.5 ? "#00ffff" : "#9d4edd"
              }40, transparent)`,
            }}
            animate={{
              y: [-20, -100, -20],
              x: [-10, 10, -10],
              opacity: [0, 0.6, 0],
            }}
            transition={{
              duration: Math.random() * 10 + 8,
              repeat: Infinity,
              delay: Math.random() * 5,
            }}
          />
        ))}
      </div>
    </footer>
  );
}
