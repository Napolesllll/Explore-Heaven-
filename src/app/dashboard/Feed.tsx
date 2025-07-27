"use client";

import HomeFeed from "./components/sections/home/HomeFeed";
import ToursFeed from "./components/sections/tours/ToursFeed";
import ReservasFeed from "./components/sections/reservas/ReservasFeed";
import PerfilFeed from "./components/sections/perfil/PerfilFeed";
import GuiasFeed from "./components/sections/guias/GuiasFeed";

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
    </div>
  );
}

// Componentes simulados por ahora
const Inicio = () => (
  <div className="text-center text-xl font-bold text-yellow-500 bg-gradient-to-r from-black to-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
    Bienvenido a Inicio 🏠
  </div>
);
const Tours = () => (
  <div className="text-center text-xl font-bold text-yellow-500 bg-gradient-to-r from-gray-800 to-black p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
    Explora nuestros Tours 🌍
  </div>
);
const Reservas = () => (
  <div className="text-center text-xl font-bold text-yellow-500 bg-gradient-to-r from-black to-gray-900 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
    Tus Reservas 📆
  </div>
);
const Guias = () => (
  <div className="text-center text-xl font-bold text-yellow-500 bg-gradient-to-r from-gray-900 to-black p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
    Conoce nuestros Guías 👥 Actualmente nuestra aplicacion se encuentra en desarrollo,
  </div>
);
const Perfil = () => (
  <div className="text-center text-xl font-bold text-yellow-500 bg-gradient-to-r from-black to-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
    Tu Perfil 👤
  </div>
);