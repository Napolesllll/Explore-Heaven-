"use client";

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Icon } from 'leaflet';
import { useEffect } from 'react';

const safeZones = [
  {
    id: 1,
    name: "El Poblado",
    coordinates: [6.2126, -75.5712],
    description: "Zona residencial segura con múltiples hoteles y restaurantes",
    type: "Residencial/Turística"
  },
  {
    id: 2, 
    name: "Parque Lleras",
    coordinates: [6.2089, -75.5717],
    description: "Área turística con alta seguridad y vida nocturna",
    type: "Entretenimiento"
  },
  {
    id: 3,
    name: "Laureles",
    coordinates: [6.2447, -75.5981],
    description: "Barrio seguro con ambiente local y buena gastronomía",
    type: "Residencial"
  },
  {
    id: 4,
    name: "Provenza",
    coordinates: [6.2098, -75.5724],
    description: "Zona bohemia con cafés, arte y restaurantes",
    type: "Cultural"
  }
];

const SafetyMap = () => {
  useEffect(() => {
    // Fix para el ícono de marcador en Next.js
    delete (Icon.Default.prototype as any)._getIconUrl;
    Icon.Default.mergeOptions({
      iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
      iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
    });
  }, []);

  return (
    <MapContainer
      center={[6.2442, -75.5812]}
      zoom={13}
      style={{ height: "100%", width: "100%" }}
      className="rounded-lg"
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      />
      {safeZones.map((zone) => (
        <Marker 
          key={zone.id} 
          position={zone.coordinates as [number, number]}
        >
          <Popup>
            <div className="p-2">
              <h3 className="font-bold text-lg">{zone.name}</h3>
              <p className="text-sm text-gray-600 mb-1">{zone.description}</p>
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

export default SafetyMap;