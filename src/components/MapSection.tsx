// src/components/sections/MapSection.tsx
import dynamic from "next/dynamic";

const ShieldCheckIcon = dynamic(
  () => import("@heroicons/react/24/outline/ShieldCheckIcon")
);

const MapSection = () => {
  return (
    <div className="bg-gray-100 rounded-xl p-4 flex items-center justify-center">
      <div className="text-center w-full">
        <h3 className="text-xl font-semibold mb-4 text-gray-800">
          Mapa de Seguridad
        </h3>
        <p className="text-gray-600 mb-4">
          Próximamente: Visualiza las zonas más seguras de la ciudad
        </p>
        <div
          className="aspect-video bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-lg flex flex-col items-center justify-center"
          aria-label="Mapa de seguridad - Próximamente"
        >
          <div className="bg-emerald-500 rounded-full w-16 h-16 flex items-center justify-center mb-4">
            <ShieldCheckIcon className="h-8 w-8 text-white" />
          </div>
          <span className="text-emerald-800 font-medium">
            Mapa de Seguridad - Próximamente
          </span>
        </div>
      </div>
    </div>
  );
};

export default MapSection;
