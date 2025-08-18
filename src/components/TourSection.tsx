"use client";

import { useState } from "react";
import { tours } from "../data/toursData";
import {
  CheckCircle,
  Clock,
  MapPin,
  CalendarDays,
  Star,
  ChevronDown,
} from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export default function TourSection() {
  const [expandedTourId, setExpandedTourId] = useState<string | null>(null);

  const toggleTour = (id: string) => {
    setExpandedTourId((prevId) => (prevId === id ? null : id));
  };

  return (
    <section className="relative py-20 overflow-hidden bg-gradient-to-b from-gray-900 to-black">
      {/* Elementos decorativos de fondo */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-1/3 h-full bg-gradient-to-r from-gray-900 to-transparent z-0"></div>
        <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-gray-900 to-transparent z-0"></div>
        <div className="absolute bottom-20 left-1/4 w-80 h-80 bg-yellow-500 rounded-full filter blur-[100px] opacity-10"></div>
        <div className="absolute top-20 right-1/4 w-60 h-60 bg-emerald-500 rounded-full filter blur-[80px] opacity-10"></div>
        <div className="pattern-dots pattern-gray-800 pattern-bg-transparent pattern-opacity-10 pattern-size-2 absolute inset-0"></div>
      </div>

      {/* Contenido */}
      <div className="relative z-10 max-w-7xl mx-auto px-4">
        {/* Encabezado */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <div className="inline-flex items-center justify-center bg-gradient-to-r from-yellow-600 to-yellow-800 px-6 py-2 rounded-full mb-6">
            <span className="text-white font-bold text-sm uppercase tracking-wider">
              Tours Exclusivos
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600 mb-4">
            Descubre Medellín como nunca antes
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            Explora nuestros tours exclusivos y vive una experiencia
            inolvidable. Desde arte urbano en la Comuna 13 hasta museos
            históricos, tenemos el recorrido perfecto para ti.
          </p>
        </motion.div>

        {/* Grid de tours */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {tours.map((tour) => {
            const isExpanded = expandedTourId === tour.id;

            return (
              <motion.div
                key={tour.id}
                layout
                className={`group relative rounded-2xl overflow-hidden cursor-pointer ${
                  isExpanded ? "md:col-span-2 lg:col-span-3" : ""
                }`}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                onClick={() => toggleTour(tour.id)}
              >
                {/* Fondo con imagen */}
                <div
                  className="absolute inset-0 bg-cover bg-center bg-no-repeat z-0 transform transition-all duration-700 group-hover:scale-110"
                  style={{ backgroundImage: `url('${tour.fotos?.[0]}')` }}
                />

                {/* Overlay */}
                <div
                  className={`absolute inset-0 z-10 ${
                    isExpanded
                      ? "bg-gradient-to-b from-black/90 to-black/80"
                      : "bg-gradient-to-b from-black/80 to-black/60"
                  }`}
                />

                {/* Contenido */}
                <div className="relative z-20 p-6 min-h-[300px] flex flex-col justify-between">
                  {/* Cabecera */}
                  <div>
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-xl font-bold text-yellow-400">
                          {tour.nombre}
                        </h3>
                        <div className="flex items-center mt-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${i < 4 ? "text-yellow-500 fill-yellow-500" : "text-gray-500"}`}
                            />
                          ))}
                          <span className="text-gray-400 text-sm ml-2">
                            (24)
                          </span>
                        </div>
                      </div>

                      <div className="bg-gradient-to-r from-yellow-600 to-yellow-800 px-3 py-1 rounded-10">
                        <span className="text-white font-bold text-sm">
                          {tour.precio}
                        </span>
                      </div>
                    </div>

                    {/* Detalles */}
                    <div className="flex flex-wrap gap-4 mt-4">
                      <div className="flex items-center gap-2 text-gray-300">
                        <CalendarDays className="w-5 h-5 text-yellow-500" />
                        <span className="text-sm">{tour.duracion}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-300">
                        <Clock className="w-5 h-5 text-yellow-500" />
                        <span className="text-sm">Salida: {tour.salida}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-300">
                        <MapPin className="w-5 h-5 text-yellow-500" />
                        <span className="text-sm">Partida: El Poblado</span>
                      </div>
                    </div>
                  </div>

                  {/* Descripción expandida */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.4 }}
                        className="mt-4"
                      >
                        <div className="border-t border-yellow-500/20 pt-4">
                          <p className="text-gray-300 leading-relaxed italic">
                            {tour.descripcion.slice(0, 200)}...
                          </p>
                          <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-3">
                            {tour.fotos?.slice(0, 3).map((foto, idx) => (
                              <div
                                key={idx}
                                className="aspect-video rounded-lg overflow-hidden border-2 border-yellow-500/30"
                                style={{
                                  backgroundImage: `url('${foto}')`,
                                  backgroundSize: "cover",
                                }}
                              />
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Pie */}
                  <div className="mt-6 flex justify-between items-center">
                    <div className="flex items-center text-gray-400 text-sm">
                      <ChevronDown
                        className={`w-4 h-4 mr-1 transition-transform ${isExpanded ? "rotate-180" : ""}`}
                      />
                      <span>{isExpanded ? "Ver menos" : "Ver detalles"}</span>
                    </div>

                    <Link
                      href={`/checkout?tourId=${tour.id}`}
                      onClick={(e) => e.stopPropagation()}
                      className="relative inline-flex items-center justify-center bg-gradient-to-r from-yellow-500 to-yellow-600 text-gray-900 px-5 py-2.5 rounded-full font-bold overflow-hidden group"
                    >
                      <span className="relative z-10 flex items-center gap-2">
                        <CheckCircle className="w-5 h-5" />
                        Reservar ahora
                      </span>
                      <span className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-yellow-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                    </Link>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* CTA Final */}
        <div className="mt-16 text-center">
          <Link
            href="/tours"
            className="inline-flex items-center bg-gradient-to-r from-gray-800 to-gray-900 border border-yellow-500/30 px-8 py-4 rounded-full font-bold text-yellow-400 hover:text-yellow-300 hover:border-yellow-500/60 transition-all group"
          >
            <span>Ver todos los tours disponibles</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
