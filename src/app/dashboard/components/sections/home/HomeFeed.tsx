"use client";

import { Tour } from "@prisma/client";
import { useEffect, useState } from "react";
import TourCard from "../tours/TourCard";
import { motion } from "framer-motion";

export default function HomeFeed() {
  const [tours, setTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTours = async () => {
      try {
        const response = await fetch("/api/tours");
        const data = await response.json();
        setTours(data);
      } catch (error) {
        console.error("Error fetching tours:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTours();
  }, []);

  if (loading) {
    return (
      <div className="mt-20 min-h-[70vh] flex flex-col justify-center">
        <div className="text-center mb-12">
          <motion.h2
            className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500 mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Descubriendo Experiencias
          </motion.h2>
          <motion.p
            className="text-gray-400 max-w-md mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            Cargando las mejores aventuras para ti
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {[...Array(2)].map((_, i) => (
            <SkeletonCard key={i} index={i} />
          ))}
        </div>
      </div>
    );
  }

  if (tours.length === 0) {
    return (
      <div className="mt-20 min-h-[50vh] flex flex-col items-center justify-center text-center py-10">
        <div className="bg-gradient-to-r from-cyan-500/10 to-purple-500/10 p-8 rounded-3xl border border-cyan-500/30 backdrop-blur-sm max-w-2xl">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center justify-center p-4 bg-gray-900/50 rounded-full mb-6">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12 text-cyan-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 mb-4">
              EXPLORACIONES EN PREPARACIÓN
            </h3>
            <p className="text-gray-400 max-w-md mx-auto">
              Estamos curando nuevas experiencias increíbles para ti. ¡Vuelve
              pronto!
            </p>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12 md:py-20">
      <motion.div
        className="text-center mb-16"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500 mb-4">
          Experiencias Destacadas
        </h2>
        <p className="text-gray-400 max-w-xl mx-auto">
          Descubre nuestras aventuras más exclusivas, diseñadas para crear
          recuerdos inolvidables
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 max-w-6xl mx-auto px-4">
        {tours.map((tour, index) => (
          <motion.div
            key={tour.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.15, duration: 0.5 }}
            whileHover={{ y: -10, transition: { duration: 0.3 } }}
          >
            <TourCard tour={tour} />
          </motion.div>
        ))}
      </div>
    </div>
  );
}

const SkeletonCard = ({ index }: { index: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.2, duration: 0.5 }}
    className="bg-gradient-to-br from-[#0f172a] to-[#1e293b] rounded-2xl overflow-hidden border border-cyan-500/20 shadow-lg shadow-cyan-500/10"
  >
    <div className="relative h-64 md:h-80">
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 animate-pulse"></div>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="bg-gray-700 rounded-full p-4 animate-pulse">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-10 w-10 text-gray-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </div>
      </div>
    </div>
    <div className="p-6">
      <div className="h-8 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 rounded-full w-3/4 mb-4 animate-pulse"></div>
      <div className="space-y-3">
        <div className="h-4 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 rounded-full animate-pulse"></div>
        <div className="h-4 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 rounded-full w-5/6 animate-pulse"></div>
        <div className="h-4 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 rounded-full w-4/5 animate-pulse"></div>
      </div>
      <div className="flex justify-between mt-6">
        <div className="h-6 w-24 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 rounded-lg animate-pulse"></div>
        <div className="h-6 w-24 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 rounded-lg animate-pulse"></div>
      </div>
    </div>
  </motion.div>
);
