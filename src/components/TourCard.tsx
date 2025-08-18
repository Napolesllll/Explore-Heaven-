// components/TourCard.jsx
import Image from "next/image";
import { FaCalendarAlt, FaUserAlt } from "react-icons/fa";

export default function TourCard({ tour }) {
  return (
    <div className="bg-gray-900 rounded-xl overflow-hidden border border-yellow-600/30 hover:border-yellow-500 transition-all">
      {tour.imagen && (
        <div className="h-48 relative">
          <Image
            src={tour.imagen}
            alt={tour.nombre}
            layout="fill"
            objectFit="cover"
            className="hover:scale-105 transition-transform"
          />
        </div>
      )}

      <div className="p-6">
        <h3 className="text-xl font-bold text-yellow-400 mb-2">
          {tour.nombre}
        </h3>
        <p className="text-gray-300 mb-4">{tour.descripcion}</p>

        <div className="flex justify-between text-sm text-gray-400">
          <div className="flex items-center gap-2">
            <FaCalendarAlt />
            <span>{new Date(tour.salida).toLocaleDateString()}</span>
          </div>

          <div className="flex items-center gap-2">
            <FaUserAlt />
            <span>{tour.guias} guía(s)</span>
          </div>
        </div>

        <button className="mt-6 w-full bg-yellow-600 hover:bg-yellow-700 text-black font-bold py-2 rounded-lg transition-colors">
          Reservar ahora
        </button>
      </div>
    </div>
  );
}
