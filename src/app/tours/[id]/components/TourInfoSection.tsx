import { InfoItem } from "./InfoItem";
import { FaCalendarAlt, FaUsers, FaUserTie } from "react-icons/fa";

export function TourInfoSection({ tour }: { tour: any }) {
  const salida = tour.salida || "Por definir";
  const regreso = tour.regreso || "Por definir";

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-16">
      <InfoItem
        icon={<FaCalendarAlt className="text-indigo-300 text-xl" />}
        label="Salida"
        value={salida}
      />
      <InfoItem
        icon={<FaCalendarAlt className="text-indigo-300 text-xl" />}
        label="Regreso"
        value={regreso}
      />
      <InfoItem
        icon={<FaUsers className="text-indigo-300 text-xl" />}
        label="Capacidad"
        value={`${tour.maxReservas} personas`}
      />
      <InfoItem
        icon={<FaUserTie className="text-indigo-300 text-xl" />}
        label="Guías"
        value={tour.guias}
      />
    </div>
  );
}
