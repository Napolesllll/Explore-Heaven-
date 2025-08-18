"use client";

import HomeFeed from "./components/sections/home/HomeFeed";
import ToursFeed from "./components/sections/tours/ToursFeed";
import ReservasFeed from "./components/sections/reservas/ReservasFeed";
import PerfilFeed from "./components/sections/perfil/PerfilFeed";
import GuiasFeed from "./components/sections/guias/GuiasFeed";
import EmergencyButton from "components/EmergencyButton";

// Simulación de usuario autenticado (reemplaza por tu lógica real)
const user = {
  name: "Juan Pérez",
  email: "juan.perez@email.com",
  image: "https://i.pravatar.cc/150?img=3",
  rol: "Viajero",
  fechaRegistro: "2024-01-15",
};

export default function Feed({ activeSection }: { activeSection: string }) {
  return (
    <div className="p-6 bg-gradient-to-br from-gray-900 via-black to-gray-800 rounded-lg shadow-lg">
      {activeSection === "inicio" && <HomeFeed />}
      {activeSection === "tours" && <ToursFeed />}
      {activeSection === "reservas" && <ReservasFeed />}
      {activeSection === "guias" && <GuiasFeed />}
      {activeSection === "perfil" && <PerfilFeed user={user} />}
      <EmergencyButton />
    </div>
  );
}
