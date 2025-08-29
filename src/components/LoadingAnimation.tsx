// src/app/dashboard/page.tsx
"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import SidebarLeft from "../app/dashboard/SidebarLeft";
import SidebarRight from "../app/dashboard/SidebarRight";
import Feed from "../app/dashboard/Feed";
import TopNavbar from "../app/dashboard/TopNavbar";
import Image from "next/image";

// Componente de loading reutilizable
const LoadingAnimation = () => (
  <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 z-50">
    <div className="relative">
      {/* Logo con pulso */}
      <div className="animate-pulse-slow">
        <Image
          src="/images/logo-explore-heaven.png"
          alt="Loading"
          width={120}
          height={120}
          className="drop-shadow-[0_0_20px_rgba(234,179,8,0.7)]"
        />
      </div>
      {/* Orbitantes */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative w-0 h-0">
          <div className="absolute top-0 left-1/2 w-6 h-6 rounded-full bg-yellow-400 opacity-80 animate-orbit origin-[0px_50%]"></div>
          <div className="absolute bottom-0 left-1/2 w-4 h-4 rounded-full bg-yellow-500 opacity-60 animate-orbit-reverse origin-[0px_50%]"></div>
        </div>
      </div>
      {/* Texto animado */}
      <div className="mt-8 text-center">
        <div className="text-yellow-400 font-bold text-xl flex justify-center">
          {"Cargando Experiencia".split("").map((char, i) => (
            <span
              key={i}
              className="animate-wave"
              style={{ animationDelay: `${i * 0.05}s` }}
            >
              {char}
            </span>
          ))}
        </div>
        <p className="text-gray-400 mt-2 text-sm">
          Explorando los mejores destinos...
        </p>
      </div>
    </div>
  </div>
);

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [showLoading, setShowLoading] = useState(true);

  // Cuando cambie el estado de sesión...
  useEffect(() => {
    if (status === "loading") {
      // seguimos mostrando loading
      return;
    }

    if (status === "unauthenticated") {
      // no está logueado → redirigir al login
      router.push("/auth");
      return;
    }

    if (status === "authenticated") {
      // simulamos mínimo 2s de loading
      const timer = setTimeout(() => setShowLoading(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [status, router]);

  // Mostrar loader si NextAuth aún carga o si estamos en el delay de 2s
  if (status === "loading" || showLoading) {
    return <LoadingAnimation />;
  }

  // Ya está autenticado y terminó el loading → renderizar dashboard
  return (
    <div className="flex h-screen overflow-hidden bg-[#f0f2f5] text-gray-800">
      <SidebarLeft user={session!.user} onSelectSection={() => {}} />
      <main className="flex-1 p-4 overflow-y-auto">
        <TopNavbar activeSection="inicio" onSelect={() => {}} />
        <Feed activeSection="inicio" />
      </main>
      <SidebarRight />
    </div>
  );
}
