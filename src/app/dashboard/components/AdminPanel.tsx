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
import { X } from "lucide-react";
import { ClientTour } from "../../../types";

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState<"guias" | "tours">("guias");
  const [isLoading, setIsLoading] = useState(true);
  const [tours, setTours] = useState<ClientTour[]>([]);
  const [selectedTour, setSelectedTour] = useState<ClientTour | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1200);
    
    fetch("/api/tours")
      .then((res) => res.json())
      .then((data) => setTours(data.tours || data))
      .catch(console.error);
      
    return () => clearTimeout(timer);
  }, []);

  const openModal = (tour: ClientTour) => {
    setSelectedTour(tour);
    setIsModalOpen(true);
    // Bloquear scroll del body cuando el modal está abierto
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedTour(null);
    // Restaurar scroll del body
    document.body.style.overflow = 'auto';
  };

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
          <p className="mt-2 text-gray-400">Iniciando sistema de administración</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0c0f1d] via-[#151b35] to-[#0c0f1d] p-4 md:p-8">
      {/* Efectos de fondo */}
      <div className="fixed inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full filter blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-1/3 right-1/3 w-80 h-80 bg-purple-500/10 rounded-full filter blur-3xl animate-pulse-slow"></div>
        <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-cyan-400/5 rounded-full filter blur-3xl"></div>
      </div>

      <div className="relative max-w-6xl mx-auto">
        {/* Encabezado futurista */}
        <div className="relative z-10 bg-[#0f172a]/80 backdrop-blur-xl rounded-3xl border border-cyan-500/30 shadow-2xl shadow-cyan-500/10 overflow-hidden mb-8">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-cyan-500/5 via-transparent to-transparent"></div>
          
          <div className="relative z-10 p-8 flex flex-col items-center">
            <div className="mb-6 relative">
              <div className="absolute -inset-3 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full blur-lg opacity-30 animate-pulse"></div>
              <div className="relative bg-gray-900 border border-cyan-500/30 rounded-full p-3">
                <Image 
                  src="/images/logoExplore.png" 
                  alt="Logo Explore" 
                  width={100} 
                  height={100} 
                  className="drop-shadow-glow"
                />
              </div>
            </div>
            
            <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 text-center mb-2">
              PANEL DE ADMINISTRACIÓN
            </h1>
            <p className="text-gray-400 text-center max-w-md">
              Controla todas las operaciones de tu plataforma
            </p>
            
            {/* Navegación por pestañas futurista */}
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <button
                onClick={() => setActiveTab("guias")}
                className={`relative px-8 py-3 rounded-xl font-bold transition-all duration-300 group
                  ${
                    activeTab === "guias"
                      ? "bg-gradient-to-r from-cyan-600 to-purple-600 shadow-lg shadow-cyan-500/30"
                      : "bg-gray-800/70 hover:bg-gray-700/50 border border-cyan-500/20"
                  }`}
              >
                <span className="relative z-10 text-white">
                  Gestión de Guías
                </span>
                {activeTab === "guias" && (
                  <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-3/4 h-1 bg-cyan-400 rounded-full animate-pulse"></div>
                )}
              </button>
              
              <button
                onClick={() => setActiveTab("tours")}
                className={`relative px-8 py-3 rounded-xl font-bold transition-all duration-300 group
                  ${
                    activeTab === "tours"
                      ? "bg-gradient-to-r from-cyan-600 to-purple-600 shadow-lg shadow-cyan-500/30"
                      : "bg-gray-800/70 hover:bg-gray-700/50 border border-cyan-500/20"
                  }`}
              >
                <span className="relative z-10 text-white">
                  Gestión de Tours
                </span>
                {activeTab === "tours" && (
                  <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-3/4 h-1 bg-cyan-400 rounded-full animate-pulse"></div>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Contenido dinámico futurista */}
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-8">
          {activeTab === "guias" ? (
            <>
              {/* Sección de guías - Formulario */}
              <div className="bg-[#0f172a]/80 backdrop-blur-xl rounded-3xl border border-cyan-500/30 shadow-2xl shadow-cyan-500/10 p-6 transition-all duration-500 hover:shadow-cyan-500/20">
                <div className="flex items-center mb-6">
                  <div className="bg-cyan-500/10 p-2 rounded-lg mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-cyan-200">
                    Agregar Nuevo Guía
                  </h2>
                </div>
                <AddGuiaForm />
              </div>
              
              {/* Sección de guías - Lista */}
              <div className="bg-[#0f172a]/80 backdrop-blur-xl rounded-2xl border border-cyan-500/30 shadow-2xl shadow-cyan-500/10 p-6 transition-all duration-500 hover:shadow-cyan-500/20">
                <div className="flex items-center mb-6">
                  <div className="bg-purple-500/10 p-2 rounded-lg mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-purple-200">
                    Lista de Guías
                  </h2>
                </div>
                <GuiaList />
              </div>
            </>
          ) : (
            <>
              {/* Sección de tours - Formulario */}
              <div className="bg-[#0f172a]/80 backdrop-blur-xl rounded-3xl border border-cyan-500/30 shadow-2xl shadow-cyan-500/10 p-6 transition-all duration-500 hover:shadow-cyan-500/20">
                <div className="flex items-center mb-6">
                  <div className="bg-cyan-500/10 p-2 rounded-lg mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-cyan-200">
                    Agregar Nuevo Tour
                  </h2>
                </div>
                <AddTourForm />
              </div>
              
              {/* Sección de tours - Lista con botón de gestión de fechas */}
              <div className="bg-[#0f172a]/80 backdrop-blur-xl rounded-3xl border border-cyan-500/30 shadow-2xl shadow-cyan-500/10 p-6 transition-all duration-500 hover:shadow-cyan-500/20">
                <div className="flex items-center mb-6">
                  <div className="bg-purple-500/10 p-2 rounded-lg mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-purple-200">
                    Lista de Tours
                  </h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {tours.map((tour) => (
                    <motion.div
                      key={tour.id}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                      whileHover={{ y: -10 }}
                      className="bg-[#0f172a]/80 backdrop-blur-xl rounded-3xl border border-cyan-500/30 shadow-2xl shadow-cyan-500/10 overflow-hidden p-6"
                    >
                      <div className="flex items-center mb-4">
                        {tour.imagenDestacada && (
                          <Image
                            src={tour.imagenDestacada}
                            alt={tour.nombre}
                            width={60}
                            height={60}
                            className="rounded-lg mr-4"
                          />
                        )}
                        <div>
                          <h3 className="text-lg font-bold text-white">{tour.nombre}</h3>
                          <p className="text-sm text-gray-400">{tour.ubicacion}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => openModal(tour)}
                        className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg transition-all"
                      >
                        Gestionar Fechas
                      </button>
                    </motion.div>
                  ))}
                </div>
              </div>
              <TourList />
            </>
          )}
        </div>

        {/* Modal animado para fechas - AHORA A PANTALLA COMPLETA */}
        <AnimatePresence>
          {isModalOpen && selectedTour && (
            <Dialog
              static
              open={isModalOpen}
              onClose={closeModal}
              className="fixed inset-0 z-[100] overflow-y-auto"
            >
              {/* Fondo oscuro con desenfoque */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/80 backdrop-blur-lg"
              />
              
              {/* Contenedor principal del modal */}
              <div className="flex items-center justify-center min-h-screen p-4">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.3 }}
                  className="relative bg-gradient-to-br from-[#0f172a] to-[#1e293b] rounded-2xl border border-cyan-500/30 shadow-2xl shadow-cyan-500/20 w-full max-w-6xl mx-auto overflow-hidden"
                >
                  {/* Botón de cerrar */}
                  <button
                    onClick={closeModal}
                    className="absolute top-4 right-4 z-20 p-2 rounded-full bg-gray-800/80 backdrop-blur-sm border border-cyan-500/30 text-cyan-400 hover:text-white hover:bg-cyan-600/20 transition-all"
                  >
                    <X className="w-6 h-6" />
                  </button>
                  
                  {/* Encabezado del modal */}
                  <div className="relative p-6 bg-gradient-to-r from-cyan-900/20 to-purple-900/20 border-b border-cyan-500/30">
                    <Dialog.Title className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-purple-300">
                      Gestión de Fechas para: {selectedTour.nombre}
                    </Dialog.Title>
                    <p className="text-cyan-200 mt-1">{selectedTour.ubicacion}</p>
                  </div>
                  
                  {/* Contenido principal - 100% altura visible */}
                  <div className="max-h-[80vh] overflow-y-auto p-6">
                    <AvailableDatesManager tour={selectedTour} />
                  </div>
                  
                  {/* Pie de modal */}
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

        {/* Pie de página futurista */}
        <div className="mt-8 text-center text-gray-500 text-sm">
          <p>Sistema de Administración v2.0 • © {new Date().getFullYear()} Explore Adventures</p>
          <div className="flex justify-center space-x-2 mt-2">
            <div className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse"></div>
            <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse delay-100"></div>
            <div className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse delay-200"></div>
          </div>
        </div>
      </div>

      {/* Elementos decorativos flotantes */}
      <div className="fixed top-20 right-10 w-6 h-6 rounded-full bg-cyan-500 shadow-lg shadow-cyan-500/30 animate-pulse"></div>
      <div className="fixed bottom-40 left-12 w-4 h-4 rounded-full bg-purple-500 shadow-lg shadow-purple-500/30 animate-ping"></div>
      <div className="fixed top-1/3 left-20 w-3 h-3 rounded-full bg-cyan-400 shadow-lg shadow-cyan-400/30 animate-bounce"></div>
    </div>
  );
}