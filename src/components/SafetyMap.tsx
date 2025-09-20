"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

export interface SafeZone {
  id: number;
  name: string;
  coordinates: [number, number];
  description: string;
  type: string;
}

interface SafetyMapProps {
  zones?: SafeZone[];
}

const defaultZones: SafeZone[] = [
  {
    id: 1,
    name: "El Poblado",
    coordinates: [6.2126, -75.5712],
    description: "Zona residencial segura con múltiples hoteles y restaurantes",
    type: "Residencial/Turística",
  },
  {
    id: 2,
    name: "Parque Lleras",
    coordinates: [6.2089, -75.5717],
    description: "Área turística con alta seguridad y vida nocturna",
    type: "Entretenimiento",
  },
  {
    id: 3,
    name: "Laureles",
    coordinates: [6.2447, -75.5981],
    description: "Barrio seguro con ambiente local y buena gastronomía",
    type: "Residencial",
  },
  {
    id: 4,
    name: "Provenza",
    coordinates: [6.2098, -75.5724],
    description: "Zona bohemia con cafés, arte y restaurantes",
    type: "Cultural",
  },
];

// Componente interno del mapa que se carga dinámicamente
const MapComponent = ({ zones }: { zones: SafeZone[] }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const loadMap = async () => {
      try {
        // Importar dinámicamente Leaflet y react-leaflet
        const [{ MapContainer, TileLayer, Marker, Popup }, { Icon }] =
          await Promise.all([import("react-leaflet"), import("leaflet")]);

        // Cargar CSS dinámicamente sin import directo
        if (typeof document !== "undefined") {
          const link = document.createElement("link");
          link.rel = "stylesheet";
          link.href = "https://unpkg.com/leaflet@1.7.1/dist/leaflet.css";
          link.integrity =
            "sha512-xodZBNTC5n17Xt2atTPuE1HxjVMSvLVW9ocqUKLsCC5CXdbqCmblAshOMAS6/keqq/sMZMZ19scR4PsZChSR7A==";
          link.crossOrigin = "";
          if (!document.querySelector('link[href*="leaflet.css"]')) {
            document.head.appendChild(link);
          }
        }

        // Fix para el ícono de marcador en Next.js
        const iconDefault = Icon.Default.prototype as unknown as Record<
          string,
          unknown
        >;
        delete iconDefault._getIconUrl;

        Icon.Default.mergeOptions({
          iconUrl:
            "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
          iconRetinaUrl:
            "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
          shadowUrl:
            "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
        });

        setIsLoaded(true);
      } catch (error) {
        console.error("Error loading map dependencies:", error);
      }
    };

    loadMap();
  }, []);

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-100 rounded-lg">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
          <p className="text-gray-600">Cargando mapa...</p>
        </div>
      </div>
    );
  }

  // Importar componentes de manera dinámica después de que estén cargados
  const DynamicMap = dynamic(
    () =>
      import("react-leaflet").then((mod) => {
        const { MapContainer, TileLayer, Marker, Popup } = mod;

        return function Map() {
          return (
            <MapContainer
              center={[6.2442, -75.5812]}
              zoom={13}
              style={{ height: "100%", width: "100%" }}
              className="rounded-lg"
              aria-label="Mapa de zonas seguras de Medellín"
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              />
              {zones.map((zone) => (
                <Marker key={zone.id} position={zone.coordinates}>
                  <Popup>
                    <div className="p-2">
                      <h3 className="font-bold text-lg">{zone.name}</h3>
                      <p className="text-sm text-gray-600 mb-1">
                        {zone.description}
                      </p>
                      <span className="inline-block bg-emerald-100 text-emerald-800 text-xs px-2 py-1 rounded">
                        {zone.type}
                      </span>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          );
        };
      }),
    {
      ssr: false,
      loading: () => (
        <div className="flex items-center justify-center h-full bg-gray-100 rounded-lg">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
            <p className="text-gray-600">Inicializando mapa...</p>
          </div>
        </div>
      ),
    }
  );

  return <DynamicMap />;
};

const SafetyMap = ({ zones = defaultZones }: SafetyMapProps) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-100 rounded-lg">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
          <p className="text-gray-600">Preparando mapa...</p>
        </div>
      </div>
    );
  }

  if (!zones.length) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        No hay zonas seguras para mostrar.
      </div>
    );
  }

  return <MapComponent zones={zones} />;
};

export default SafetyMap;
