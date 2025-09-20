"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useState, useEffect, useRef, useCallback, memo } from "react";
import SidebarLeft from "./SidebarLeft";
import SidebarRight from "./SidebarRight";
import OptimizedFeed from "./Feed";
import TopNavbar from "./TopNavbar";
import Image from "next/image";
import GalacticFooter from "./GalacticFooter";

// Tipado fuerte para partículas
interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  color: string;
}

// Hook personalizado para la animación de partículas optimizado para móvil
const useParticleAnimation = (
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  isMobile: boolean
) => {
  const animationFrameRef = useRef<number>(0);
  const particlesRef = useRef<Particle[]>([]);
  const isAnimatingRef = useRef<boolean>(false);

  const initializeParticles = useCallback(
    (canvas: HTMLCanvasElement) => {
      // Reducir partículas en móvil para mejor rendimiento
      const particleCount = isMobile ? 50 : 150;
      particlesRef.current = [];

      for (let i = 0; i < particleCount; i++) {
        particlesRef.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * (isMobile ? 2 : 3) + 1,
          speedX: (Math.random() - 0.5) * (isMobile ? 0.3 : 0.5),
          speedY: (Math.random() - 0.5) * (isMobile ? 0.3 : 0.5),
          color: `hsl(${Math.random() * 360}, 70%, 60%)`,
        });
      }
    },
    [isMobile]
  );

  const connectParticles = useCallback(
    (ctx: CanvasRenderingContext2D, particles: Particle[]) => {
      // Reducir conexiones en móvil para mejor rendimiento
      const maxDistance = isMobile ? 60 : 100;
      const maxConnections = isMobile ? 3 : 5;

      for (let i = 0; i < particles.length; i++) {
        let connectionCount = 0;
        for (
          let j = i + 1;
          j < particles.length && connectionCount < maxConnections;
          j++
        ) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < maxDistance) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(180, 120, 255, ${1 - distance / maxDistance})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
            connectionCount++;
          }
        }
      }
    },
    [isMobile]
  );

  const animateParticles = useCallback(
    (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) => {
      if (!isAnimatingRef.current) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const particles = particlesRef.current;

      // Usar requestIdleCallback si está disponible para mejor rendimiento
      const updateParticles = () => {
        particles.forEach((particle) => {
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
          ctx.fillStyle = particle.color;
          ctx.fill();

          particle.x += particle.speedX;
          particle.y += particle.speedY;

          if (particle.x > canvas.width || particle.x < 0)
            particle.speedX *= -1;
          if (particle.y > canvas.height || particle.y < 0)
            particle.speedY *= -1;
        });

        if (!isMobile) {
          connectParticles(ctx, particles);
        }
      };

      if ("requestIdleCallback" in window && isMobile) {
        (
          window as typeof window & {
            requestIdleCallback: (callback: () => void) => void;
          }
        ).requestIdleCallback(updateParticles);
      } else {
        updateParticles();
      }

      animationFrameRef.current = requestAnimationFrame(() =>
        animateParticles(canvas, ctx)
      );
    },
    [connectParticles, isMobile]
  );

  const startAnimation = useCallback(() => {
    if (!canvasRef.current || isAnimatingRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    isAnimatingRef.current = true;
    initializeParticles(canvas);
    animateParticles(canvas, ctx);
  }, [canvasRef, initializeParticles, animateParticles]);

  const stopAnimation = useCallback(() => {
    isAnimatingRef.current = false;
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = 0;
    }
  }, []);

  const handleResize = useCallback(() => {
    if (canvasRef.current && isAnimatingRef.current) {
      canvasRef.current.width = window.innerWidth;
      canvasRef.current.height = window.innerHeight;
      initializeParticles(canvasRef.current);
    }
  }, [canvasRef, initializeParticles]);

  return { startAnimation, stopAnimation, handleResize };
};

// Componente de loading mejorado y optimizado para móvil
const LoadingAnimation = memo(() => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Detectar móvil
  const isMobile =
    typeof window !== "undefined" ? window.innerWidth < 768 : false;

  const { startAnimation, stopAnimation, handleResize } = useParticleAnimation(
    canvasRef,
    isMobile
  );

  useEffect(() => {
    // En móvil, usar setTimeout para evitar bloquear la UI
    if (isMobile) {
      setTimeout(() => startAnimation(), 100);
    } else {
      startAnimation();
    }

    let resizeTimeout: NodeJS.Timeout;
    const debouncedResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(handleResize, 300); // Debounce más largo en móvil
    };

    window.addEventListener("resize", debouncedResize, { passive: true });

    return () => {
      stopAnimation();
      window.removeEventListener("resize", debouncedResize);
      clearTimeout(resizeTimeout);
    };
  }, [startAnimation, stopAnimation, handleResize, isMobile]);

  const loadingText = "Cargando Experiencia ";

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-gray-900 to-black z-[9999] overflow-hidden touch-manipulation">
      <canvas
        ref={canvasRef}
        className="absolute top-0 left-0 w-full h-full"
        style={{
          willChange: "transform",
          contain: "layout style paint",
        }}
      />

      {/* Efectos de blur optimizados para móvil */}
      <div
        className={`absolute ${isMobile ? "w-32 h-32" : "w-[200px] h-[200px]"} rounded-full bg-purple-600 blur-[100px] opacity-30 animate-pulse`}
        style={{ contain: "layout style paint" }}
      />
      <div
        className={`absolute ${isMobile ? "w-40 h-40" : "w-[300px] h-[300px]"} rounded-full bg-blue-600 blur-[100px] opacity-20 animate-pulse`}
        style={{
          animationDelay: "1s",
          contain: "layout style paint",
        }}
      />

      {/* Contenido principal */}
      <div className="relative z-10 flex flex-col items-center justify-center px-4">
        <div className="relative mb-8 sm:mb-12 animate-pulse-slow">
          <div className="absolute -inset-4 sm:-inset-6 rounded-full bg-yellow-500 blur-xl opacity-30 animate-ping" />
          <div className="absolute -inset-2 sm:-inset-4 rounded-full bg-yellow-400 blur-lg opacity-20" />

          <div className="relative rounded-lg p-4 sm:p-6 bg-gradient-to-br from-gray-900 to-gray-800 border border-yellow-500/30 shadow-[0_0_40px_rgba(234,179,8,0.5)]">
            <Image
              src="/images/SVG-01.svg"
              alt="Loading"
              width={isMobile ? 180 : 250}
              height={isMobile ? 180 : 250}
              className="drop-shadow-[0_0_20px_rgba(234,179,8,0.7)]"
              priority
              quality={isMobile ? 75 : 85}
              placeholder="blur"
              blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx4f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R7/2Q=="
            />
          </div>
        </div>

        <div className="mt-8 sm:mt-16 text-center max-w-md">
          <div
            className={`${isMobile ? "text-xl" : "text-3xl"} font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400 flex justify-center flex-wrap`}
          >
            {loadingText.split("").map((char, index) => (
              <span
                key={`${char}-${index}`}
                className="animate-wave inline-block"
                style={{
                  animationDelay: `${index * 0.05}s`,
                  textShadow: "0 0 10px rgba(234, 179, 8, 0.7)",
                }}
              >
                {char}
              </span>
            ))}
          </div>
          <p
            className={`text-gray-400 mt-4 ${isMobile ? "text-base" : "text-lg"} max-w-md px-2`}
          >
            Preparando la mejor experiencia para ti...
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
            transform: scale(1.05);
            opacity: 0.9;
          }
        }

        @keyframes wave {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-15px);
          }
        }

        .animate-pulse-slow {
          animation: pulse-slow 3s ease-in-out infinite;
        }

        .animate-wave {
          display: inline-block;
          animation: wave 1.2s ease-in-out infinite;
        }

        @media (max-width: 767px) {
          .animate-wave {
            animation-duration: 1s;
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
        }
      `}</style>
    </div>
  );
});

LoadingAnimation.displayName = "LoadingAnimation";

// Hook para gestión del loading optimizado
const useLoadingState = (status: string) => {
  const [showLoading, setShowLoading] = useState(true);

  useEffect(() => {
    if (status === "authenticated") {
      // Tiempo de loading más corto en móvil
      const isMobile = window.innerWidth < 768;
      const loadingTime = isMobile ? 2500 : 4000;

      const timer = setTimeout(() => {
        setShowLoading(false);
      }, loadingTime);

      return () => clearTimeout(timer);
    }
  }, [status]);

  return showLoading;
};

// Hook para gestión de sesión y redirección
const useSessionAuth = () => {
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "unauthenticated") {
      redirect("/auth");
    }
  }, [status]);

  return { session, status };
};

// Hook para detectar móvil
const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();

    let timeoutId: NodeJS.Timeout;
    const debouncedResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(checkMobile, 200);
    };

    window.addEventListener("resize", debouncedResize, { passive: true });
    return () => {
      window.removeEventListener("resize", debouncedResize);
      clearTimeout(timeoutId);
    };
  }, []);

  return isMobile;
};

// Componente principal optimizado
const DashboardPage: React.FC = () => {
  const { session, status } = useSessionAuth();
  const [activeSection, setActiveSection] = useState<string>("inicio");
  const showLoading = useLoadingState(status);
  const isMobile = useIsMobile();

  // Manejar cambio de sección optimizado
  const handleSectionChange = useCallback(
    (section: string) => {
      // En móvil, usar requestAnimationFrame para mejor rendimiento
      if (isMobile) {
        requestAnimationFrame(() => {
          setActiveSection(section);
        });
      } else {
        setActiveSection(section);
      }
    },
    [isMobile]
  );

  // Estados de carga y autenticación
  if (status === "loading" || showLoading) {
    return <LoadingAnimation />;
  }

  if (!session?.user) {
    return null; // redirect ya se maneja en useSessionAuth
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[#f0f2f5] text-gray-800 touch-manipulation">
      {/* En móvil, ocultar sidebar izquierdo para ahorrar espacio */}
      {!isMobile && (
        <SidebarLeft
          user={session.user}
          onSelectSection={handleSectionChange}
        />
      )}

      <main
        className="flex-1 p-1 overflow-y-auto"
        style={{
          WebkitOverflowScrolling: "touch",
          overscrollBehavior: "contain",
        }}
      >
        <TopNavbar
          activeSection={activeSection}
          onSelect={handleSectionChange}
        />
        <OptimizedFeed activeSection={activeSection} />
        <GalacticFooter />
      </main>

      {/* En móvil, ocultar sidebar derecho para mejor rendimiento */}
      {!isMobile && <SidebarRight />}
    </div>
  );
};

export default DashboardPage;
