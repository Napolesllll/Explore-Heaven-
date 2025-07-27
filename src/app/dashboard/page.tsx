"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useState, useEffect } from "react";
import SidebarLeft from "./SidebarLeft";
import SidebarRight from "./SidebarRight";
import Feed from "./Feed";
import TopNavbar from "./TopNavbar";
import Image from "next/image";
 
// Componente de loading reutilizable
const LoadingAnimation = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 z-50">
      <div className="relative">
        {/* Logo principal con animación de pulso */}
        <div className="animate-pulse-slow">
          <Image 
            src="/images/logo-explore-heaven.png" 
            alt="Loading"
            width={120}
            height={120}
            className="drop-shadow-[0_0_20px_rgba(234,179,8,0.7)]"
          />
        </div>
        
        {/* Elementos orbitantes */}
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="animate-orbit w-6 h-6 rounded-full bg-yellow-400 opacity-80 absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
            <div className="animate-orbit-reverse w-4 h-4 rounded-full bg-yellow-500 opacity-60 absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2"></div>
          </div>
        </div>
        
        {/* Texto con efecto de onda */}
        <div className="mt-8 text-center">
          <div className="text-yellow-400 font-bold text-xl flex justify-center">
            {"Cargando  Experiencia ".split("").map((char, index) => (
              <span 
                key={index} 
                className="animate-wave"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                {char}
              </span>
            ))}
          </div>
          <p className="text-gray-400 mt-2 text-sm">Explorando los mejores destinos...</p>
        </div>
      </div>
    </div>
  );
};

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const [activeSection, setActiveSection] = useState("inicio");
  const [showLoading, setShowLoading] = useState(true);

  // Simular un tiempo mínimo de carga
  useEffect(() => {
    if (status === "authenticated") {
      const timer = setTimeout(() => {
        setShowLoading(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [status]);

  if (status === "loading" || showLoading) return <LoadingAnimation />;
  if (!session) return redirect("/auth");

  return (
    <div className="flex h-screen overflow-hidden bg-[#f0f2f5] text-gray-800">
      <SidebarLeft 
        user={session.user} 
        onSelectSection={setActiveSection}
      />

      <main className="flex-1 p-4 overflow-y-auto">
        <TopNavbar 
          activeSection={activeSection}
          onSelect={setActiveSection}
        />

        <Feed activeSection={activeSection} />
      </main>

      <SidebarRight />
    </div>
  );
}