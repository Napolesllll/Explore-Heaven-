// src/app/auth/confirm/page.tsx
"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import {
  FaCheckCircle,
  FaSpinner,
  FaExclamationTriangle,
} from "react-icons/fa";
import toast from "react-hot-toast";

export default function ConfirmPage() {
  const params = useSearchParams();
  const router = useRouter();
  const token = params.get("token");
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );

  useEffect(() => {
    async function verify() {
      if (!token) {
        setStatus("error");
        toast.error("Token faltante");
        return;
      }

      try {
        const res = await fetch(`/api/auth/confirm?token=${token}`);
        const data = await res.json();
        if (!res.ok || !data.success) {
          throw new Error(data.message || "Error");
        }
        setStatus("success");
        toast.success("¡Verificación exitosa! Bienvenido 👋");
        setTimeout(() => router.push("/dashboard"), 3000);
      } catch (err: any) {
        setStatus("error");
        toast.error(err.message || "Enlace inválido o expirado.");
      }
    }

    verify();
  }, [token, router]);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles: any[] = [];
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
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden bg-gray-900">
      {/* Canvas de partículas animadas */}
      <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full" />

      {/* Efecto de brillo central */}
      <div className="absolute w-[200px] h-[200px] rounded-full bg-purple-600 blur-[100px] opacity-30 animate-pulse" />

      {/* Tarjeta de contenido */}
      <div className="relative z-10 w-full max-w-md p-8 rounded-3xl backdrop-blur-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10 shadow-2xl transition-all duration-700 animate-float">
        {/* Estado: Cargando */}
        {status === "loading" && (
          <div className="flex flex-col items-center justify-center space-y-6 text-center">
            <div className="relative">
              <FaSpinner className="h-20 w-20 text-indigo-400 animate-spin" />
              <div className="absolute inset-0 rounded-full bg-indigo-500 animate-ping opacity-20" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-purple-300">
                Verificando tu correo
              </h2>
              <p className="text-gray-300">
                Estamos confirmando tu cuenta, por favor espera...
              </p>
            </div>
            <div className="w-full h-1.5 bg-gray-700 rounded-full overflow-hidden mt-4">
              <div className="h-full w-1/3 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full animate-progress" />
            </div>
          </div>
        )}

        {/* Estado: Éxito */}
        {status === "success" && (
          <div className="flex flex-col items-center justify-center space-y-6 text-center animate-scale-in">
            <div className="relative">
              <FaCheckCircle className="h-20 w-20 text-green-400" />
              <div className="absolute inset-0 rounded-full bg-green-500 animate-ping opacity-30" />
              <div className="absolute -inset-4 rounded-full border-4 border-green-400/30 animate-pulse" />
            </div>
            <div className="space-y-2">
              <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-300 to-cyan-300">
                ¡Verificación exitosa!
              </h2>
              <p className="text-gray-300 mt-2">
                ¡Bienvenido a nuestra plataforma!
              </p>
            </div>
            <div className="mt-4 flex flex-col items-center">
              <div className="flex space-x-2">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="w-3 h-3 rounded-full bg-green-400 animate-bounce"
                    style={{ animationDelay: `${i * 0.1}s` }}
                  />
                ))}
              </div>
              <p className="text-gray-400 mt-4 animate-pulse">
                Redirigiendo al dashboard...
              </p>
            </div>
          </div>
        )}

        {/* Estado: Error */}
        {status === "error" && (
          <div className="flex flex-col items-center justify-center space-y-6 text-center animate-shake">
            <div className="relative">
              <FaExclamationTriangle className="h-20 w-20 text-amber-400" />
              <div className="absolute inset-0 rounded-full bg-amber-500 animate-ping opacity-20" />
            </div>
            <div className="space-y-2">
              <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-orange-300">
                Error al verificar
              </h2>
              <p className="text-gray-300">
                El enlace es inválido o ha expirado
              </p>
            </div>
            <button
              onClick={() => router.push("/auth/resend")}
              className="mt-6 px-6 py-3 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.03] relative overflow-hidden group"
            >
              <span className="relative z-10">Reenviar enlace</span>
              <span className="absolute inset-0 bg-gradient-to-r from-amber-500 to-orange-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <span className="absolute top-0 left-0 w-full h-0.5 bg-amber-300 animate-line" />
            </button>
          </div>
        )}
      </div>

      {/* Efecto de partículas flotantes */}
      <div className="absolute bottom-8 left-8 w-4 h-4 rounded-full bg-purple-500 shadow-lg animate-float" />
      <div
        className="absolute top-12 right-12 w-6 h-6 rounded-full bg-indigo-500 shadow-lg animate-float"
        style={{ animationDelay: "1s" }}
      />
      <div
        className="absolute top-1/3 left-1/4 w-3 h-3 rounded-full bg-cyan-500 shadow-lg animate-float"
        style={{ animationDelay: "2s" }}
      />
    </div>
  );
}
