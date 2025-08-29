"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaPlay, FaQuoteLeft, FaStar, FaTimes } from "react-icons/fa";

const testimonials = [
  {
    name: "Sara Müller",
    location: "Alemania",
    content:
      "¡Una experiencia increíble! Colombia me sorprendió con su calidez y belleza. El guía fue excelente y muy atento.",
    videoUrl: "https://www.youtube.com/embed/Bu6eqLwT_M0",
    thumbnail: "/thumb1.jpg",
    rating: 5,
  },
  {
    name: "Marco Silva",
    location: "Brasil",
    content:
      "Los paisajes fueron espectaculares y el recorrido estuvo bien organizado. Sin duda lo recomiendo.",
    videoUrl: "https://www.youtube.com/embed/XcQYh6VhXlI",
    thumbnail: "/thumb2.jpg",
    rating: 4,
  },
  {
    name: "Emma Johnson",
    location: "Canadá",
    content:
      "Desde que reservé me sentí acompañada. El equipo fue muy profesional. ¡Gracias por esta aventura inolvidable!",
    videoUrl: "https://www.youtube.com/embed/4xDzrJKXOOY",
    thumbnail: "/thumb3.jpg",
    rating: 5,
  },
];

export default function TestimonialSection() {
  const [selectedVideo, setSelectedVideo] = useState(null);

  const openVideo = (url) => {
    setSelectedVideo(url);
  };

  const closeVideo = () => {
    setSelectedVideo(null);
  };

  return (
    <section
      className="py-20 bg-gradient-to-b from-gray-900 to-black text-white px-4 relative overflow-hidden"
      id="testimonios"
    >
      {/* Efectos de fondo futuristas */}
      <div className="absolute inset-0 z-0">
        {/* Grid holográfico dorado */}
        <div className="absolute inset-0 bg-[url('/grid-gold.svg')] bg-[length:100px_100px] opacity-10"></div>

        {/* Planetas dorados */}
        <motion.div
          className="absolute top-20 left-1/4 w-60 h-60 rounded-full bg-gradient-to-br from-yellow-900/10 to-transparent border border-yellow-500/10 blur-xl"
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

        <motion.div
          className="absolute bottom-40 right-1/4 w-40 h-40 rounded-full bg-gradient-to-br from-yellow-800/10 to-transparent border border-yellow-400/10 blur-xl"
          animate={{
            y: [0, 15, 0],
            x: [0, -10, 0],
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Efecto de luz dorada */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] bg-radial-gradient(circle, rgba(218, 165, 32, 0.05) 0%, rgba(0, 0, 0, 0) 70%)"></div>
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-4xl md:text-5xl font-bold text-center mb-16"
        >
          <span className="text-yellow-400">Voces Auténticas</span>
          <span className="block text-gray-300 mt-2 text-xl font-normal">
            De viajeros que vivieron Medellín
          </span>
        </motion.h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              whileHover={{ y: -10 }}
              className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-gray-700 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 group backdrop-blur-sm"
            >
              <div
                className="aspect-video relative cursor-pointer overflow-hidden"
                onClick={() => openVideo(item.videoUrl)}
              >
                {/* Miniaturas de YouTube reales */}
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                  style={{ backgroundImage: `url(${item.thumbnail})` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10"></div>
                  <div className="absolute inset-0 flex items-center justify-center z-20">
                    <motion.div
                      className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform"
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <FaPlay className="text-gray-900 ml-1" />
                    </motion.div>
                  </div>

                  {/* Efecto de brillo dorado al hacer hover */}
                  <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-30"></div>

                  {/* Borde dorado animado */}
                  <motion.div
                    className="absolute inset-0 border-2 border-transparent group-hover:border-yellow-400/50 transition-all duration-300 rounded-xl"
                    animate={{
                      boxShadow: [
                        "0 0 0px rgba(218, 165, 32, 0)",
                        "0 0 15px rgba(218, 165, 32, 0.5)",
                        "0 0 0px rgba(218, 165, 32, 0)",
                      ],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                    }}
                  />
                </div>
              </div>

              <div className="p-6">
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <motion.div
                      key={i}
                      whileHover={{ scale: 1.2 }}
                      transition={{ type: "spring", stiffness: 400 }}
                    >
                      <FaStar
                        className={
                          i < item.rating ? "text-yellow-400" : "text-gray-600"
                        }
                      />
                    </motion.div>
                  ))}
                </div>

                <p className="text-gray-300 mb-5 relative pl-6">
                  <FaQuoteLeft className="absolute -left-1 top-0 text-yellow-400/30 text-3xl" />
                  {item.content}
                </p>

                <div className="border-t border-gray-700 pt-4">
                  <h4 className="font-bold text-lg text-white">{item.name}</h4>
                  <p className="text-gray-400 flex items-center">
                    <span className="w-2 h-2 bg-yellow-400 rounded-full mr-2 animate-pulse"></span>
                    {item.location}
                  </p>
                </div>
              </div>

              {/* Efecto de brillo en el borde al hacer hover */}
              <div className="absolute inset-0 rounded-2xl pointer-events-none overflow-hidden">
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute -inset-[2px] bg-gradient-to-r from-yellow-400/10 to-transparent rounded-2xl blur-sm"></div>
                </div>
              </div>
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
            className="px-8 py-3 border-2 border-yellow-400 text-yellow-400 hover:bg-yellow-400/10 font-semibold rounded-full transition-all group"
          >
            <span className="relative">
              Ver Más Experiencias
              <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-yellow-400 group-hover:w-full transition-all duration-300"></span>
            </span>
          </motion.button>
        </motion.div>
      </div>

      {/* Modal de Video Futurista */}
      <AnimatePresence>
        {selectedVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
            onClick={closeVideo}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="relative w-full max-w-4xl bg-gradient-to-br from-gray-900 to-black border border-yellow-500/30 rounded-xl overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={closeVideo}
                className="absolute -top-12 right-0 text-white text-3xl hover:text-yellow-400 transition-colors z-20"
              >
                <FaTimes />
              </button>

              {/* Efecto de borde dorado animado */}
              <motion.div
                className="absolute inset-0 border border-yellow-400/30 rounded-xl"
                animate={{
                  boxShadow: [
                    "0 0 10px rgba(218, 165, 32, 0.3)",
                    "0 0 20px rgba(218, 165, 32, 0.5)",
                    "0 0 10px rgba(218, 165, 32, 0.3)",
                  ],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                }}
              />

              <div className="aspect-video bg-black relative">
                <iframe
                  src={selectedVideo}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />

                {/* Overlay de efecto futurista */}
                <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-b from-yellow-400/10 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-yellow-400/10 to-transparent"></div>
                </div>
              </div>

              {/* Pie de modal con estilo */}
              <div className="p-4 bg-gradient-to-r from-yellow-600/10 to-transparent border-t border-yellow-500/20">
                <p className="text-yellow-300 text-center font-light text-sm tracking-widest">
                  TESTIMONIO DE VIAJERO
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
