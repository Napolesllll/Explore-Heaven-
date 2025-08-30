"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaChevronDown,
  FaMapMarkerAlt,
  FaQuestionCircle,
} from "react-icons/fa";

const faqs = [
  {
    question: "¿Cómo reservo un tour en Medellín?",
    answer:
      "Puedes reservar directamente desde nuestro sitio web seleccionando el tour, fecha y completando el proceso de pago. También puedes contactar a nuestro equipo de asesores.",
  },
  {
    question: "¿Qué incluye cada tour?",
    answer:
      "Todos nuestros tours incluyen guía profesional bilingüe, transporte, entradas a atracciones según el itinerario, y en algunos casos comidas típicas. Los detalles específicos se indican en cada tour.",
  },
  {
    question: "¿Cuál es la duración de los tours?",
    answer:
      "Ofrecemos tours desde medio día (4 horas) hasta tours completos de día entero (8-10 horas). También tenemos experiencias nocturnas y tours de varios días.",
  },
  {
    question: "¿Es seguro realizar los tours?",
    answer:
      "Absolutamente. Trabajamos con guías certificados, transportes autorizados y seguimos todos los protocolos de seguridad. Todos nuestros recorridos son en zonas seguras y turísticas de la ciudad.",
  },
  {
    question: "¿Qué debo llevar a los tours?",
    answer:
      "Recomendamos llevar ropa cómoda, zapatos para caminar, protector solar, una chaqueta ligera (por posibles cambios de clima), cámara fotográfica y dinero extra para souvenirs o gastos adicionales.",
  },
];

export default function FAQSection() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section
      className="py-20 bg-gradient-to-b from-gray-900 to-black relative overflow-hidden px-4"
      id="faq"
    >
      {/* Efectos de fondo futuristas */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[url('/grid-gold.svg')] bg-[length:100px_100px] opacity-10"></div>
        <motion.div
          className="absolute top-1/4 left-1/4 w-60 h-60 rounded-full bg-gradient-to-br from-yellow-900/20 to-transparent border border-yellow-500/20 blur-xl"
          animate={{
            y: [0, -15, 0],
            x: [0, 10, 0],
            scale: [1, 1.03, 1],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        <motion.h2
          className="text-4xl md:text-5xl font-bold text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <span className="text-yellow-400">Preguntas Frecuentes</span>
          <span className="block text-gray-300 mt-2 text-xl font-normal">
            Todo lo que necesitas saber para tu experiencia en Medellín
          </span>
        </motion.h2>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="border border-gray-700 rounded-xl bg-gradient-to-r from-gray-900/50 to-gray-800/50 backdrop-blur-sm overflow-hidden"
            >
              <button
                className="flex justify-between items-center w-full p-6 text-left group"
                onClick={() => toggleFAQ(index)}
              >
                <h3 className="text-lg md:text-xl font-semibold text-white group-hover:text-yellow-300 transition-colors">
                  <FaQuestionCircle className="inline-block mr-3 text-yellow-400" />
                  {faq.question}
                </h3>
                <motion.div
                  animate={{ rotate: activeIndex === index ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="ml-4 text-yellow-400"
                >
                  <FaChevronDown />
                </motion.div>
              </button>

              <AnimatePresence>
                {activeIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="px-6 pb-6 text-gray-300"
                  >
                    <div className="border-t border-gray-700 pt-4">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
        >
          <motion.button
            whileHover={{
              scale: 1.05,
              boxShadow: "0 0 20px rgba(255, 215, 0, 0.3)",
            }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-3 bg-gradient-to-r from-yellow-600 to-yellow-800 text-black font-bold rounded-lg flex items-center justify-center gap-3 mx-auto group"
          >
            <FaMapMarkerAlt className="group-hover:animate-bounce" />
            <span>RESERVAR TOUR AHORA</span>
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}
