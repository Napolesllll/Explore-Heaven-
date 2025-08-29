"use client";

import Link from "next/link";
import { FaArrowLeft } from "react-icons/fa";
import { StarRating } from "./StarRating";

export interface Tour {
  id: string;
  nombre: string;
  // Agrega aquí otros campos que uses del tour si es necesario
}

interface TourHeaderProps {
  tour: Tour;
  averageRating: number;
  reviewsCount: number;
}

export function TourHeader({
  tour,
  averageRating,
  reviewsCount,
}: TourHeaderProps) {
  return (
    <>
      <div className="fixed top-6 left-6 z-20">
        <Link href="/dashboard" passHref>
          <button
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-white bg-indigo-700/80 backdrop-blur-sm hover:bg-indigo-600 transition-all duration-300 shadow-lg hover:shadow-indigo-600/40 border border-indigo-500/30"
            aria-label="Volver al dashboard"
          >
            <FaArrowLeft className="text-indigo-200" />
            Volver al Dashboard
          </button>
        </Link>
      </div>

      <div className="mb-10 text-center">
        <div className="inline-block px-5 py-2 bg-indigo-700/80 backdrop-blur rounded-full mb-4 text-md font-medium text-indigo-100 border border-indigo-500/30">
          Experiencia Premium
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.7)]">
          {tour.nombre}
        </h1>
        <div className="flex justify-center mt-4">
          <StarRating rating={averageRating} reviewCount={reviewsCount} />
        </div>
      </div>
    </>
  );
}

export default TourHeader;
