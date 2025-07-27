"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

type Guide = {
  id: number;
  nombre: string;
  foto: string;
  descripcion?: string;
  experiencia?: string;
  idiomas?: string[];
  contacto?: string;
};

export default function SidebarRight() {
  const [guides, setGuides] = useState<Guide[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedGuide, setSelectedGuide] = useState<Guide | null>(null);

  useEffect(() => {
    const fetchGuides = async () => {
      setIsLoading(true);
      try {
        const res = await fetch("/api/guias");
        const data = await res.json();
        setGuides(data.guias || []);
      } catch (error) {
        console.error("Error al obtener los guías:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchGuides();
  }, []);

  // Función para obtener la URL válida de la foto
  const getFotoUrl = (foto?: string) =>
    foto && foto.startsWith("http") ? foto : "/images/default-avatar.png";

  return (
    <>
      {/* Fondo galáctico para toda la pantalla */}
      <div className="fixed inset-0 -z-50">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a2a] via-[#1a093f] to-[#0c0522]">
          {/* Estrellas */}
          {[...Array(100)].map((_, i) => (
            <div 
              key={i}
              className="absolute rounded-full bg-white animate-pulse-star"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                width: `${Math.random() * 3}px`,
                height: `${Math.random() * 3}px`,
                opacity: Math.random() * 0.8 + 0.2,
                animationDuration: `${Math.random() * 3 + 2}s`,
              }}
            />
          ))}
          
          {/* Nebulosas */}
          <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-purple-900/20 blur-[100px] animate-pulse-slow"></div>
          <div className="absolute bottom-1/3 right-1/4 w-80 h-80 rounded-full bg-cyan-500/20 blur-[120px] animate-pulse-slow animation-delay-2000"></div>
        </div>
      </div>

      <aside className="w-64 p-4 hidden lg:flex flex-col backdrop-blur-md bg-[#0c0522]/80 border-l border-cyan-500/30 shadow-[0_0_30px_rgba(0,255,255,0.1)]">
        {/* Título "Guías Disponibles" con diseño galáctico futurista */}
        <div className="relative mb-6 py-4 overflow-hidden rounded-xl bg-gradient-to-br from-[#0c0522] to-[#1a093f] border border-cyan-500/40 shadow-[0_0_20px_rgba(0,255,255,0.15)]">
          <div className="absolute inset-0 bg-[url('/images/stars-pattern.svg')] opacity-20"></div>
          
          <div className="text-center relative z-10">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-cyan-400 text-transparent bg-clip-text bg-size-200 animate-title-glow">
              CONDUCTORES TURISTICOS ⬇
            </h2>
          </div>
           
          <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-60"></div>
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-60"></div>
          
          {/* Partículas flotantes */}
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(10)].map((_, i) => (
              <div 
                key={i}
                className="absolute rounded-full animate-float"
                style={{
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  width: `${Math.random() * 6 + 2}px`,
                  height: `${Math.random() * 6 + 2}px`,
                  background: `radial-gradient(circle, ${Math.random() > 0.5 ? '#9d4edd' : '#00ffff'}, transparent)`,
                  opacity: Math.random() * 0.3 + 0.1,
                  animationDuration: `${Math.random() * 20 + 10}s`,
                  animationDelay: `${Math.random() * 5}s`,
                }}
              />
            ))}
          </div>
        </div>

        {isLoading ? (
          <div className="flex-1 flex flex-col items-center justify-center space-y-4">
            <div className="relative w-16 h-16">
              <div className="absolute inset-0 rounded-full border-4 border-cyan-500/30 border-t-cyan-400 animate-spin"></div>
              <div className="absolute inset-2 rounded-full border-4 border-purple-500/30 border-t-purple-400 animate-spin-reverse"></div>
            </div>
            <p className="text-cyan-300 font-medium">Cargando Guias...</p>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto space-y-6 pr-1">
            {guides.map((guide) => (
              <div
                key={guide.id}
                className="relative flex flex-col items-center text-center bg-gradient-to-br from-[#0c0522]/70 to-[#1a093f]/70 p-4 rounded-2xl border border-cyan-500/30 hover:border-cyan-400/50 transition-all duration-300 group hover:shadow-[0_0_15px_rgba(0,255,255,0.1)]"
              >
                {/* Efecto de halo */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-cyan-500/5 to-purple-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                
                {/* Avatar flotante */}
                <div className="relative mb-3 group-hover:-translate-y-1 transition-transform duration-300">
                  <div className="absolute inset-0 rounded-full bg-cyan-400 blur-md opacity-0 group-hover:opacity-40 transition-opacity duration-500"></div>
                  <Image
                    src={getFotoUrl(guide.foto)}
                    alt={guide.nombre}
                    width={80}
                    height={80}
                    className="rounded-full object-cover border-2 border-cyan-500/50 group-hover:border-cyan-400 transition-all duration-300 relative z-10"
                  />
                </div>
                
                <p className="mt-1 font-bold text-cyan-300 group-hover:text-white transition-colors duration-300">
                  {guide.nombre}
                </p>
                
                <button
                  className="mt-3 px-4 py-1.5 rounded-full bg-gradient-to-r from-cyan-600 to-purple-700 text-white text-sm font-medium hover:from-cyan-500 hover:to-purple-600 transition-all duration-300 group-hover:shadow-[0_0_10px_rgba(157,78,221,0.5)] relative overflow-hidden"
                  onClick={() => setSelectedGuide(guide)}
                >
                  <span className="relative z-10">Ver perfil </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </button>
              </div>
            ))}
          </div>
        )}
      </aside>

      {/* Modal de información del guía */}
      {selectedGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md">
          <div className="relative bg-gradient-to-br from-[#0c0522] via-[#1a093f] to-[#0c0522] rounded-2xl shadow-[0_0_50px_rgba(0,255,255,0.2)] p-8 max-w-md w-full border border-cyan-500/30 animate-fade-in">
            {/* Efectos de borde */}
            <div className="absolute inset-0 rounded-2xl border border-purple-500/20"></div>
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-50"></div>
            <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-50"></div>
            
            {/* Botón de cierre */}
            <button
              className="absolute top-4 right-4 text-cyan-400 text-2xl font-bold hover:text-cyan-200 transition-all duration-300 w-8 h-8 flex items-center justify-center rounded-full bg-[#0a0a2a]/70 border border-cyan-500/30 hover:border-cyan-400/50"
              onClick={() => setSelectedGuide(null)}
              aria-label="Cerrar"
            >
              ×
            </button>
            
            <div className="flex flex-col items-center">
              {/* Avatar con efecto galáctico */}
              <div className="relative mb-5">
                <div className="absolute inset-0 rounded-full bg-cyan-500 blur-xl animate-pulse-slow opacity-30"></div>
                <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-cyan-500 to-purple-600 animate-pulse-slow opacity-20"></div>
                <Image
                  src={getFotoUrl(selectedGuide.foto)}
                  alt={selectedGuide.nombre}
                  width={100}
                  height={100}
                  className="rounded-full object-cover border-2 border-cyan-500/50 relative z-10"
                />                
              </div>
              
              <h3 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 text-transparent bg-clip-text mb-3">
                {selectedGuide.nombre}
              </h3>
              
              <div className="w-full space-y-4 mt-4">
                {selectedGuide.descripcion && (
                  <div className="bg-[#0a0a2a]/50 p-3 rounded-xl border border-cyan-500/20">
                    <p className="text-cyan-200 text-sm">{selectedGuide.descripcion}</p>
                  </div>
                )}
                
                {selectedGuide.experiencia && (
                  <div className="flex items-start">
                    <div className="min-w-[120px] text-cyan-400 font-medium">Experiencia:</div>
                    <div className="text-cyan-200 flex-1">{selectedGuide.experiencia}</div>
                  </div>
                )}
                
                {selectedGuide.idiomas && (
                  <div className="flex items-start">
                    <div className="min-w-[120px] text-cyan-400 font-medium">Idiomas:</div>
                    <div className="flex flex-wrap gap-2">
                      {selectedGuide.idiomas.map((idioma, idx) => (
                        <span 
                          key={idx}
                          className="px-3 py-1 text-sm bg-cyan-900/50 text-cyan-300 rounded-full border border-cyan-500/30"
                        >
                          {idioma}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                {selectedGuide.contacto && (
                  <div className="flex items-start">
                    <div className="min-w-[120px] text-cyan-400 font-medium">Contacto:</div>
                    <div className="text-cyan-200 flex-1">{selectedGuide.contacto}</div>
                  </div>
                )}
              </div>
              
              <button
                className="mt-6 px-5 py-2 rounded-full bg-gradient-to-r from-cyan-600 to-purple-700 text-white font-medium hover:from-cyan-500 hover:to-purple-600 transition-all duration-300 shadow-[0_0_10px_rgba(0,255,255,0.3)] hover:shadow-[0_0_15px_rgba(157,78,221,0.5)] relative overflow-hidden"
                onClick={() => setSelectedGuide(null)}
              >
                <span className="relative z-10">Cerrar perfil</span>
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 to-purple-500/20 opacity-0 hover:opacity-100 transition-opacity duration-500"></div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Animaciones CSS */}
      <style jsx>{`
        @keyframes pulse-star {
          0%, 100% { opacity: 0.8; }
          50% { opacity: 0.4; }
        }
        
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 0.4; }
        }
        
        @keyframes fade-in {
          0% { opacity: 0; transform: translateY(10px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @keyframes spin-reverse {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(-360deg); }
        }
        
        @keyframes title-glow {
          0% {
            background-position: 0% 50%;
            text-shadow: 0 0 5px rgba(0, 255, 255, 0.3);
          }
          50% {
            background-position: 100% 50%;
            text-shadow: 0 0 20px rgba(157, 78, 221, 0.7);
          }
          100% {
            background-position: 0% 50%;
            text-shadow: 0 0 5px rgba(0, 255, 255, 0.3);
          }
        }
        
        @keyframes float {
          0% { transform: translateY(0) translateX(0); opacity: 0.2; }
          50% { transform: translateY(-20px) translateX(10px); opacity: 0.5; }
          100% { transform: translateY(0) translateX(0); opacity: 0.2; }
        }
        
        .animate-pulse-star {
          animation: pulse-star 3s infinite;
        }
        
        .animate-pulse-slow {
          animation: pulse-slow 6s infinite;
        }
        
        .animate-fade-in {
          animation: fade-in 0.5s ease-out forwards;
        }
        
        .animate-spin {
          animation: spin 2s linear infinite;
        }
        
        .animate-spin-reverse {
          animation: spin-reverse 3s linear infinite;
        }
        
        .animate-title-glow {
          animation: title-glow 4s ease-in-out infinite;
          background-size: 200% 200%;
        }
        
        .animate-float {
          animation: float linear infinite;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
      `}</style>
    </>
  );
}