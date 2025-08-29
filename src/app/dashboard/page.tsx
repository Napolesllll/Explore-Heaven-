"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation"; // 🔥 useRouter eliminado
import { useState, useEffect, useRef } from "react";
import SidebarLeft from "../../app/dashboard/SidebarLeft";
import SidebarRight from "../../app/dashboard/SidebarRight";
import Feed from "../../app/dashboard/Feed";
import TopNavbar from "../../app/dashboard/TopNavbar";
import Image from "next/image";
import EmergencyButton from "components/EmergencyButton";
import GalacticFooter from "./GalacticFooter";

// 🔧 Tipo fuerte para partículas
interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  color: string;
}

// Componente de loading mejorado
const LoadingAnimation = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles: Particle[] = []; // ✅ sin any
    const particleCount = 150;

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 3 + 1,
        speedX: (Math.random() - 0.5) * 0.5,
        speedY: (Math.random() - 0.5) * 0.5,
        color: `hsl(${Math.random() * 360}, 70%, 60%)`,
      });
    }

    const connect = () => {
      for (let i = 0; i < particles.length; i++) {
        for (let j = i; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 100) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(180, 120, 255, ${1 - distance / 100})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((particle) => {
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = particle.color;
        ctx.fill();

        particle.x += particle.speedX;
        particle.y += particle.speedY;

        if (particle.x > canvas.width || particle.x < 0) particle.speedX *= -1;
        if (particle.y > canvas.height || particle.y < 0) particle.speedY *= -1;
      });

      connect();
      requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-gray-900 to-black z-[9999] overflow-hidden">
      <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full" />

      <div className="absolute w-[200px] h-[200px] rounded-full bg-purple-600 blur-[100px] opacity-30 animate-pulse" />
      <div
        className="absolute w-[300px] h-[300px] rounded-full bg-blue-600 blur-[100px] opacity-20 animate-pulse"
        style={{ animationDelay: "1s" }}
      />

      <div className="relative z-10 flex flex-col items-center justify-center">
        <div className="relative mb-12 animate-pulse-slow">
          <div className="absolute -inset-6 rounded-full bg-yellow-500 blur-xl opacity-30 animate-ping" />
          <div className="absolute -inset-4 rounded-full bg-yellow-400 blur-lg opacity-20" />

          <div className="relative rounded-10  p-6 bg-gradient-to-br from-gray-900 to-gray-800 border border-yellow-500/30 shadow-[0_0_40px_rgba(234,179,8,0.5)]">
            <Image
              src="/images/SVG-01.svg"
              alt="Loading"
              width={250}
              height={250}
              className="drop-shadow-[0_0_20px_rgba(234,179,8,0.7)]"
            />
          </div>
        </div>

        <div className="mt-16 text-center">
          <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400 flex justify-center">
            {"Cargando Experiencia ".split("").map((char, index) => (
              <span
                key={index}
                className="animate-wave"
                style={{
                  animationDelay: `${index * 0.05}s`,
                  textShadow: "0 0 10px rgba(234, 179, 8, 0.7)",
                }}
              >
                {char}
              </span>
            ))}
          </div>
          <p className="text-gray-400 mt-4 text-lg max-w-md">
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
      `}</style>
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
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [status]);

  if (status === "loading" || showLoading) return <LoadingAnimation />;
  if (!session) return redirect("/auth");

  return (
    <div className="flex h-screen overflow-hidden bg-[#f0f2f5] text-gray-800">
      <SidebarLeft user={session.user} onSelectSection={setActiveSection} />

      <main className="flex-1 p-1 overflow-y-auto">
        <TopNavbar activeSection={activeSection} onSelect={setActiveSection} />

        <Feed activeSection={activeSection} />

        <EmergencyButton />
        <GalacticFooter />
      </main>

      <SidebarRight />
    </div>
  );
}
