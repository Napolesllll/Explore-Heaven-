"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect, useCallback, memo } from "react";
import SidebarLeft from "../app/dashboard/SidebarLeft";
import SidebarRight from "../app/dashboard/SidebarRight";
import Feed from "../app/dashboard/Feed";
import TopNavbar from "../app/dashboard/TopNavbar";
import Image from "next/image";

// Tipado para el estado de carga
type LoadingState = "idle" | "loading" | "complete";

// Tipado para estados de autenticación
type AuthStatus = "loading" | "authenticated" | "unauthenticated";

// Hook personalizado para gestionar el estado de carga
const useLoadingAnimation = () => {
  const [loadingState, setLoadingState] = useState<LoadingState>("loading");

  const completeLoading = useCallback(() => {
    setLoadingState("complete");
  }, []);

  return { loadingState, completeLoading };
};

// Componente de loading reutilizable
const LoadingAnimation = memo(() => {
  const loadingText = "Cargando Experiencia";

  return (
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
            priority
            quality={85}
            placeholder="blur"
            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx4f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R7/2Q=="
          />
        </div>

        {/* Orbitantes */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative w-0 h-0">
            <div className="absolute top-0 left-1/2 w-6 h-6 rounded-full bg-yellow-400 opacity-80 animate-orbit origin-[0px_50%]" />
            <div className="absolute bottom-0 left-1/2 w-4 h-4 rounded-full bg-yellow-500 opacity-60 animate-orbit-reverse origin-[0px_50%]" />
          </div>
        </div>

        {/* Texto animado */}
        <div className="mt-8 text-center">
          <div className="text-yellow-400 font-bold text-xl flex justify-center">
            {loadingText.split("").map((char, index) => (
              <span
                key={`${char}-${index}`}
                className="animate-wave"
                style={{ animationDelay: `${index * 0.05}s` }}
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

      <style jsx global>{`
        @keyframes pulse-slow {
          0%,
          100% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.1);
            opacity: 0.8;
          }
        }

        @keyframes orbit {
          0% {
            transform: rotate(0deg) translateX(60px) rotate(0deg);
          }
          100% {
            transform: rotate(360deg) translateX(60px) rotate(-360deg);
          }
        }

        @keyframes orbit-reverse {
          0% {
            transform: rotate(0deg) translateX(40px) rotate(0deg);
          }
          100% {
            transform: rotate(-360deg) translateX(40px) rotate(360deg);
          }
        }

        @keyframes wave {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        .animate-pulse-slow {
          animation: pulse-slow 2s ease-in-out infinite;
        }

        .animate-orbit {
          animation: orbit 3s linear infinite;
        }

        .animate-orbit-reverse {
          animation: orbit-reverse 2s linear infinite;
        }

        .animate-wave {
          display: inline-block;
          animation: wave 1s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
});

LoadingAnimation.displayName = "LoadingAnimation";

// Hook para gestión de autenticación y redirección
const useAuthRedirect = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (status === "loading") {
      return;
    }

    if (status === "unauthenticated") {
      router.push("/auth");
      return;
    }

    if (status === "authenticated") {
      const timer = setTimeout(() => setIsReady(true), 2000);
      return () => clearTimeout(timer);
    }
  }, [status, router]);

  return { session, status: status as AuthStatus, isReady };
};

// Hook para gestión del estado de la sección activa
const useActiveSection = (initialSection: string = "inicio") => {
  const [activeSection, setActiveSection] = useState<string>(initialSection);

  const handleSectionChange = useCallback((section: string) => {
    setActiveSection(section);
  }, []);

  return { activeSection, handleSectionChange };
};

// Componente principal
const DashboardPage: React.FC = () => {
  const { session, status, isReady } = useAuthRedirect();
  const { activeSection, handleSectionChange } = useActiveSection();

  // Mostrar loader si NextAuth aún carga o si estamos en el delay de 2s
  if (status === "loading" || !isReady) {
    return <LoadingAnimation />;
  }

  // Verificar que tenemos sesión (TypeScript safety)
  if (!session?.user) {
    return null; // La redirección se maneja en useAuthRedirect
  }

  // Ya está autenticado y terminó el loading → renderizar dashboard
  return (
    <div className="flex h-screen overflow-hidden bg-[#f0f2f5] text-gray-800">
      <SidebarLeft user={session.user} onSelectSection={handleSectionChange} />

      <main className="flex-1 p-4 overflow-y-auto">
        <TopNavbar
          activeSection={activeSection}
          onSelect={handleSectionChange}
        />
        <Feed activeSection={activeSection} />
      </main>

      <SidebarRight />
    </div>
  );
};

export default DashboardPage;
