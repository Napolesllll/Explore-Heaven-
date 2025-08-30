"use client";

import AddGuiaForm from "./AddGuiaForm";
import GuiaList from "./GuiaList";
import AddTourForm from "./AddTourForm";
import TourList from "./TourList";
import AvailableDatesManager from "../admin/AvailableDatesManager";
import Image from "next/image";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Dialog } from "@headlessui/react";
import {
  X,
  Menu,
  Users,
  MapPin,
  Calendar,
  Settings,
  Home,
  Plus,
  List,
} from "lucide-react";
import { ClientTour } from "../../../types";

import ReservationCalendar from "./ReservationCalendar";
import ReservationList from "./ReservationList";
import ReservationStats from "./ReservationStats";

import { useRequireAdmin } from "../../../lib/hooks/useAuth";
import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";

type MenuItem = {
  id: string;
  label: string;
  icon: React.ReactNode;
  category: "guias" | "tours" | "general" | "reservas";
};

type Stats = {
  totalGuias: number;
  totalTours: number;
  totalReservas: number;
};

const menuItems: MenuItem[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: <Home size={20} />,
    category: "general",
  },
  {
    id: "add-guia",
    label: "Agregar Guía",
    icon: <Plus size={20} />,
    category: "guias",
  },
  {
    id: "list-guias",
    label: "Lista de Guías",
    icon: <Users size={20} />,
    category: "guias",
  },
  {
    id: "add-tour",
    label: "Agregar Tour",
    icon: <Plus size={20} />,
    category: "tours",
  },
  {
    id: "list-tours",
    label: "Lista de Tours",
    icon: <List size={20} />,
    category: "tours",
  },
  {
    id: "manage-dates",
    label: "Gestionar Fechas",
    icon: <Calendar size={20} />,
    category: "tours",
  },
  {
    id: "list-reservations",
    label: "Lista de Reservas",
    icon: <Users size={20} />,
    category: "reservas",
  },
  {
    id: "reservation-calendar",
    label: "Calendario de Reservas",
    icon: <Calendar size={20} />,
    category: "reservas",
  },
  {
    id: "reservation-stats",
    label: "Estadísticas",
    icon: <Settings size={20} />,
    category: "reservas",
  },
];

export default function AdminPanel() {
  const { session, loading } = useRequireAdmin();
  const [activeSection, setActiveSection] = useState<string>("dashboard");
  const [isLoading, setIsLoading] = useState(true);
  const [tours, setTours] = useState<ClientTour[]>([]);
  const [selectedTour, setSelectedTour] = useState<ClientTour | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [stats, setStats] = useState<Stats>({
    totalGuias: 0,
    totalTours: 0,
    totalReservas: 0,
  });

  useEffect(() => {
    if (!loading && session) {
      const timer = setTimeout(() => setIsLoading(false), 1200);

      // Fetch tours, guías y reservas para las estadísticas
      Promise.all([
        // Fetch tours
        fetch("/api/tours")
          .then((res) => res.json())
          .then((data) => {
            const toursData = data.tours || data || [];
            setTours(toursData);
            setStats((prev) => ({
              ...prev,
              totalTours: toursData.length,
            }));
          }),
        // Fetch guías
        fetch("/api/guias")
          .then((res) => res.json())
          .then((data) =>
            setStats((prev) => ({
              ...prev,
              totalGuias: data.guias?.length || 0,
            }))
          ),
        // Fetch reservas
        fetch("/api/admin/reservas")
          .then((res) => res.json())
          .then((data) =>
            setStats((prev) => ({
              ...prev,
              totalReservas: data.reservas?.length || 0,
            }))
          )
          .catch((error) => {
            console.error("Error al cargar reservas:", error);
            // Si hay error con reservas, mantener el valor en 0
            setStats((prev) => ({
              ...prev,
              totalReservas: 0,
            }));
          }),
      ]).catch(console.error);

      return () => clearTimeout(timer);
    }
  }, [loading, session]);

  const openModal = (tour: ClientTour) => {
    setSelectedTour(tour);
    setIsModalOpen(true);
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedTour(null);
    document.body.style.overflow = "auto";
  };

  const handleLogout = () => {
    signOut({ callbackUrl: "/dashboard/admin" });
  };

  const renderContent = () => {
    switch (activeSection) {
      case "dashboard":
        return (
          <DashboardContent stats={stats} tours={tours} openModal={openModal} />
        );
      case "add-guia":
        return <AddGuiaForm />;
      case "list-guias":
        return <GuiaList />;
      case "add-tour":
        return <AddTourForm />;
      case "list-tours":
        return <TourList />;
      case "manage-dates":
        return <DateManagementContent tours={tours} openModal={openModal} />;
      // CASOS PARA RESERVAS
      case "list-reservations":
        return <ReservationList />;
      case "reservation-calendar":
        return <ReservationCalendar />;
      case "reservation-stats":
        return <ReservationStats />;
      default:
        return (
          <DashboardContent stats={stats} tours={tours} openModal={openModal} />
        );
    }
  };

  // Mostrar loading mientras NextAuth verifica la sesión
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0c0f1d] to-[#151b35] flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="absolute -inset-4 bg-cyan-500 rounded-full blur-xl opacity-20 animate-pulse"></div>
            <div className="relative w-24 h-24 rounded-full bg-gradient-to-r from-cyan-600 to-purple-600 flex items-center justify-center animate-spin">
              <div className="w-20 h-20 rounded-full bg-[#0c0f1d]"></div>
            </div>
          </div>
          <h1 className="mt-8 text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">
            VERIFICANDO ACCESO
          </h1>
          <p className="mt-2 text-gray-400">
            Validando permisos de administrador
          </p>
        </div>
      </div>
    );
  }

  // El hook useRequireAdmin se encarga de la redirección si no hay sesión
  if (!session) {
    return null;
  }

  // Loading interno del panel
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0c0f1d] to-[#151b35] flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="absolute -inset-4 bg-cyan-500 rounded-full blur-xl opacity-20 animate-pulse"></div>
            <div className="relative w-24 h-24 rounded-full bg-gradient-to-r from-cyan-600 to-purple-600 flex items-center justify-center animate-spin">
              <div className="w-20 h-20 rounded-full bg-[#0c0f1d]"></div>
            </div>
          </div>
          <h1 className="mt-8 text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">
            CARGANDO PANEL
          </h1>
          <p className="mt-2 text-gray-400">
            Iniciando sistema de administración
          </p>
          <p className="mt-1 text-cyan-300 text-sm">
            Bienvenido, {session.user.name || "Administrador"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0c0f1d] via-[#151b35] to-[#0c0f1d] flex">
      {/* Efectos de fondo */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/5 rounded-full filter blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-1/3 right-1/3 w-80 h-80 bg-purple-500/5 rounded-full filter blur-3xl animate-pulse-slow"></div>
      </div>

      {/* Sidebar */}
      <div
        className={`fixed lg:relative inset-y-0 left-0 z-50 w-80 transform transition-transform duration-300 ease-in-out ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
      >
        <div className="h-full bg-[#0f172a]/90 backdrop-blur-xl border-r border-cyan-500/30 shadow-2xl shadow-cyan-500/10">
          {/* Header del Sidebar */}
          <div className="p-6 border-b border-cyan-500/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full blur opacity-30"></div>
                  <div className="relative bg-gray-900 border border-cyan-500/30 rounded-full p-2">
                    <Image
                      src="/images/logoExplore.png"
                      alt="Logo"
                      width={40}
                      height={40}
                      className="drop-shadow-glow"
                    />
                  </div>
                </div>
                <div>
                  <h1 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">
                    Admin Panel
                  </h1>
                  <p className="text-xs text-gray-400">Explore Adventures</p>
                </div>
              </div>
              <button
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden p-1 rounded-lg text-cyan-400 hover:bg-cyan-500/10"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Info del Usuario Admin */}
          <div className="px-6 py-3 border-b border-cyan-500/20">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 flex items-center justify-center text-white text-sm font-bold">
                {session.user.name?.charAt(0) || "A"}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">
                  {session.user.name || "Administrador"}
                </p>
                <p className="text-xs text-cyan-300">{session.user.role}</p>
              </div>
            </div>
          </div>

          {/* Navegación */}
          <nav className="p-4 space-y-2">
            <div className="mb-4">
              <h3 className="text-xs font-semibold text-cyan-300/70 uppercase tracking-wider mb-2">
                General
              </h3>
              {menuItems
                .filter((item) => item.category === "general")
                .map((item) => (
                  <SidebarItem
                    key={item.id}
                    item={item}
                    isActive={activeSection === item.id}
                    onClick={() => {
                      setActiveSection(item.id);
                      setSidebarOpen(false);
                    }}
                  />
                ))}
            </div>

            <div className="mb-4">
              <h3 className="text-xs font-semibold text-cyan-300/70 uppercase tracking-wider mb-2">
                Guías
              </h3>
              {menuItems
                .filter((item) => item.category === "guias")
                .map((item) => (
                  <SidebarItem
                    key={item.id}
                    item={item}
                    isActive={activeSection === item.id}
                    onClick={() => {
                      setActiveSection(item.id);
                      setSidebarOpen(false);
                    }}
                  />
                ))}
            </div>

            <div className="mb-4">
              <h3 className="text-xs font-semibold text-cyan-300/70 uppercase tracking-wider mb-2">
                Tours
              </h3>
              {menuItems
                .filter((item) => item.category === "tours")
                .map((item) => (
                  <SidebarItem
                    key={item.id}
                    item={item}
                    isActive={activeSection === item.id}
                    onClick={() => {
                      setActiveSection(item.id);
                      setSidebarOpen(false);
                    }}
                  />
                ))}
            </div>

            <div className="mb-4">
              <h3 className="text-xs font-semibold text-cyan-300/70 uppercase tracking-wider mb-2">
                Reservas
              </h3>
              {menuItems
                .filter((item) => item.category === "reservas")
                .map((item) => (
                  <SidebarItem
                    key={item.id}
                    item={item}
                    isActive={activeSection === item.id}
                    onClick={() => {
                      setActiveSection(item.id);
                      setSidebarOpen(false);
                    }}
                  />
                ))}
            </div>
          </nav>

          {/* Footer del Sidebar */}
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-cyan-500/30">
            <div className="text-center">
              <p className="text-xs text-gray-500">Admin Panel v2.0</p>
              <div className="flex justify-center space-x-1 mt-2">
                <div className="w-1 h-1 rounded-full bg-cyan-500 animate-pulse"></div>
                <div className="w-1 h-1 rounded-full bg-purple-500 animate-pulse delay-100"></div>
                <div className="w-1 h-1 rounded-full bg-cyan-500 animate-pulse delay-200"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Overlay para móviles */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Contenido Principal */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Header Principal */}
        <header className="bg-[#0f172a]/80 backdrop-blur-xl border-b border-cyan-500/30 shadow-lg relative z-10">
          <div className="px-4 lg:px-8 py-4 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-lg bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20"
              >
                <Menu size={20} />
              </button>
              <div>
                <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">
                  {menuItems.find((item) => item.id === activeSection)?.label ||
                    "Dashboard"}
                </h2>
                <p className="text-sm text-gray-400">
                  Gestiona tu plataforma de turismo
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="hidden sm:flex items-center space-x-4 text-sm text-gray-400">
                <span className="flex items-center space-x-1">
                  <Users size={16} />
                  <span>{stats.totalGuias} Guías</span>
                </span>
                <span className="flex items-center space-x-1">
                  <MapPin size={16} />
                  <span>{stats.totalTours} Tours</span>
                </span>
                <span className="flex items-center space-x-1">
                  <Calendar size={16} />
                  <span>{stats.totalReservas} Reservas</span>
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-3 py-2 bg-red-600/20 border border-red-500/30 rounded-lg text-red-400 hover:bg-red-600/30 transition-all"
              >
                <LogOut size={16} />
                <span className="hidden sm:inline">Cerrar Sesión</span>
              </button>
            </div>
          </div>
        </header>

        {/* Área de Contenido */}
        <main className="flex-1 p-4 lg:p-8 relative z-10">
          <div className="max-w-7xl mx-auto">{renderContent()}</div>
        </main>
      </div>

      {/* Modal de Gestión de Fechas */}
      <AnimatePresence>
        {isModalOpen && selectedTour && (
          <Dialog
            static
            open={isModalOpen}
            onClose={closeModal}
            className="fixed inset-0 z-[100] overflow-y-auto"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-lg"
            />
            <div className="flex items-center justify-center min-h-screen p-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.3 }}
                className="relative bg-gradient-to-br from-[#0f172a] to-[#1e293b] rounded-2xl border border-cyan-500/30 shadow-2xl shadow-cyan-500/20 w-full max-w-6xl mx-auto overflow-hidden"
              >
                <button
                  onClick={closeModal}
                  className="absolute top-4 right-4 z-20 p-2 rounded-full bg-gray-800/80 backdrop-blur-sm border border-cyan-500/30 text-cyan-400 hover:text-white hover:bg-cyan-600/20 transition-all"
                >
                  <X className="w-6 h-6" />
                </button>
                <div className="relative p-6 bg-gradient-to-r from-cyan-900/20 to-purple-900/20 border-b border-cyan-500/30">
                  <Dialog.Title className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-purple-300">
                    Gestión de Fechas para: {selectedTour.nombre}
                  </Dialog.Title>
                  <p className="text-cyan-200 mt-1">{selectedTour.ubicacion}</p>
                </div>
                <div className="max-h-[80vh] overflow-y-auto p-6">
                  <AvailableDatesManager tour={selectedTour} />
                </div>
                <div className="p-4 bg-gray-900/50 border-t border-cyan-500/20 text-right">
                  <button
                    onClick={closeModal}
                    className="px-6 py-2 bg-cyan-600 hover:bg-cyan-700 rounded-lg text-white font-medium transition-colors"
                  >
                    Cerrar
                  </button>
                </div>
              </motion.div>
            </div>
          </Dialog>
        )}
      </AnimatePresence>
    </div>
  );
}

// Componente para elementos del sidebar
function SidebarItem({
  item,
  isActive,
  onClick,
}: {
  item: MenuItem;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-200 text-left ${
        isActive
          ? "bg-gradient-to-r from-cyan-600/20 to-purple-600/20 border border-cyan-500/30 text-cyan-300 shadow-lg shadow-cyan-500/10"
          : "text-gray-400 hover:text-cyan-300 hover:bg-cyan-500/10"
      }`}
    >
      <span className={isActive ? "text-cyan-400" : "text-gray-500"}>
        {item.icon}
      </span>
      <span className="font-medium">{item.label}</span>
      {isActive && (
        <div className="ml-auto w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
      )}
    </button>
  );
}

// Componente Dashboard
function DashboardContent({
  stats,
  tours,
  openModal,
}: {
  stats: Stats;
  tours: ClientTour[];
  openModal: (tour: ClientTour) => void;
}) {
  return (
    <div className="space-y-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#0f172a]/80 backdrop-blur-xl rounded-2xl border border-cyan-500/30 shadow-lg shadow-cyan-500/10 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-cyan-300 text-sm font-medium">Total Guías</p>
              <p className="text-3xl font-bold text-white">
                {stats.totalGuias}
              </p>
            </div>
            <div className="bg-cyan-500/20 p-3 rounded-full">
              <Users className="text-cyan-400" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-[#0f172a]/80 backdrop-blur-xl rounded-2xl border border-purple-500/30 shadow-lg shadow-purple-500/10 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-300 text-sm font-medium">Total Tours</p>
              <p className="text-3xl font-bold text-white">
                {stats.totalTours}
              </p>
            </div>
            <div className="bg-purple-500/20 p-3 rounded-full">
              <MapPin className="text-purple-400" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-[#0f172a]/80 backdrop-blur-xl rounded-2xl border border-emerald-500/30 shadow-lg shadow-emerald-500/10 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-emerald-300 text-sm font-medium">Reservas</p>
              <p className="text-3xl font-bold text-white">
                {stats.totalReservas}
              </p>
            </div>
            <div className="bg-emerald-500/20 p-3 rounded-full">
              <Calendar className="text-emerald-400" size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Tours Recientes */}
      <div className="bg-[#0f172a]/80 backdrop-blur-xl rounded-2xl border border-cyan-500/30 shadow-lg shadow-cyan-500/10 p-6">
        <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 mb-4">
          Tours Recientes
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tours.slice(0, 6).map((tour) => (
            <div
              key={tour.id}
              className="bg-gray-900/50 rounded-lg p-4 border border-cyan-500/20"
            >
              <div className="flex items-center space-x-3 mb-3">
                {tour.imagenDestacada &&
                  typeof tour.imagenDestacada === "string" && (
                    <Image
                      src={tour.imagenDestacada}
                      alt={tour.nombre}
                      width={40}
                      height={40}
                      className="rounded-lg object-cover"
                    />
                  )}
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-white truncate">
                    {tour.nombre}
                  </h4>
                  <p className="text-sm text-gray-400 truncate">
                    {tour.ubicacion}
                  </p>
                </div>
              </div>
              <button
                onClick={() => openModal(tour)}
                className="w-full px-3 py-1 bg-cyan-600/20 border border-cyan-500/30 rounded-lg text-cyan-300 hover:bg-cyan-600/30 transition-all text-sm"
              >
                Gestionar
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Componente para gestión de fechas
function DateManagementContent({
  tours,
  openModal,
}: {
  tours: ClientTour[];
  openModal: (tour: ClientTour) => void;
}) {
  return (
    <div className="space-y-6">
      <div className="bg-[#0f172a]/80 backdrop-blur-xl rounded-2xl border border-cyan-500/30 shadow-lg shadow-cyan-500/10 p-6">
        <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 mb-6">
          Gestión de Fechas por Tour
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {tours.map((tour) => (
            <motion.div
              key={tour.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              whileHover={{ y: -5 }}
              className="bg-[#0f172a]/80 backdrop-blur-xl rounded-xl border border-cyan-500/30 shadow-lg shadow-cyan-500/10 overflow-hidden p-6"
            >
              <div className="flex items-center mb-4">
                {tour.imagenDestacada &&
                  typeof tour.imagenDestacada === "string" && (
                    <Image
                      src={tour.imagenDestacada}
                      alt={tour.nombre}
                      width={60}
                      height={60}
                      className="rounded-lg mr-4 object-cover"
                    />
                  )}
                <div className="flex-1">
                  <h4 className="text-lg font-bold text-white">
                    {tour.nombre}
                  </h4>
                  <p className="text-sm text-gray-400">{tour.ubicacion}</p>
                </div>
              </div>
              <button
                onClick={() => openModal(tour)}
                className="w-full px-4 py-2 bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white rounded-lg transition-all font-medium"
              >
                Gestionar Fechas
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
