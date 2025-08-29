"use client";

import { useState, FormEvent, useRef, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { FaPaperPlane, FaArrowLeft, FaEnvelope } from "react-icons/fa";
import toast from "react-hot-toast";

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  color: string;
}

function ResendVerificationContent() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const router = useRouter();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const searchParams = useSearchParams();

  useEffect(() => {
    const emailParam = searchParams.get("email");
    if (emailParam) setEmail(decodeURIComponent(emailParam));
  }, [searchParams]);

  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(
        () => setResendCooldown(resendCooldown - 1),
        1000
      );
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const isValidEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!isValidEmail(email)) {
      toast.error("Email inválido");
      return;
    }
    if (resendCooldown > 0) {
      toast.error(`Espera ${resendCooldown} segundos antes de reenviar`);
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/resend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const text = await res.text();

      if (!res.ok) {
        if (res.status === 404)
          toast.error("No se encontró ninguna cuenta con este email");
        else if (res.status === 400 && text.includes("ya está verificada")) {
          toast.success(
            "Esta cuenta ya está verificada. Puedes iniciar sesión."
          );
          setTimeout(() => router.push("/auth"), 2000);
        } else if (res.status === 429) {
          toast.error("Demasiados intentos. Espera unos minutos.");
          setResendCooldown(300);
        } else toast.error(text || "Error al reenviar verificación.");
      } else {
        toast.success(
          "Correo de verificación reenviado. Revisa tu bandeja de entrada."
        );
        setResendCooldown(60);
        router.push(`/auth/verify-request?email=${encodeURIComponent(email)}`);
      }
    } catch (err) {
      console.error("Resend error:", err);
      toast.error("Error del servidor al reenviar correo.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles: Particle[] = [];
    const particleCount = 120;

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

      particles.forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();

        p.x += p.speedX;
        p.y += p.speedY;

        if (p.x > canvas.width || p.x < 0) p.speedX *= -1;
        if (p.y > canvas.height || p.y < 0) p.speedY *= -1;
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
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gray-900">
      <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full" />
      <div className="absolute w-[300px] h-[300px] rounded-full bg-purple-600 blur-[120px] opacity-20" />
      <button
        onClick={() => router.back()}
        disabled={isLoading}
        className="absolute top-6 left-6 z-50 flex items-center space-x-2 bg-gray-800/80 hover:bg-gray-700/90 backdrop-blur-sm border border-blue-400/30 text-blue-400 px-4 py-2.5 rounded-xl transition-all duration-300 shadow-lg hover:shadow-blue-400/20 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <FaArrowLeft className="h-4 w-4" />
        <span className="font-medium">Volver</span>
      </button>
      {/* Tarjeta de contenido */}
      <div
        className="relative z-10 w-full max-w-md p-8 rounded-3xl 
                   backdrop-blur-2xl bg-gradient-to-br from-white/10 to-white/5 
                   border border-white/10 shadow-2xl transition-all duration-700 animate-float"
      >
        {/* Encabezado con efecto de carta */}
        <div className="text-center mb-8">
          <div className="relative inline-block">
            <div className="absolute -inset-4 rounded-full bg-blue-500 blur-xl opacity-30 animate-pulse" />
            <div className="relative w-24 h-24 rounded-2xl flex items-center justify-center bg-gradient-to-br from-blue-500 to-indigo-600 shadow-[0_0_20px_rgba(66,153,225,0.5)]">
              <FaEnvelope className="h-12 w-12 text-white" />
            </div>
          </div>

          <h1
            id="resend-title"
            className="mt-6 text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-purple-300"
          >
            Reenviar Verificación
          </h1>
          <p className="mt-2 text-gray-300 max-w-md">
            Introduce tu dirección de correo electrónico para recibir un nuevo
            enlace de verificación
          </p>
        </div>

        {/* Formulario */}
        <form
          onSubmit={handleSubmit}
          className="relative flex flex-col space-y-6"
        >
          <div className="relative">
            <label
              htmlFor="email"
              className="block mb-2 text-sm font-medium text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-purple-300"
            >
              Correo Electrónico
            </label>
            <div className="relative">
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                placeholder="tu@correo.com"
                className="w-full px-5 py-4 pl-14
                           bg-gray-900/40 border border-blue-500/30
                           rounded-xl text-white placeholder-gray-500
                           focus:outline-none focus:ring-2 focus:ring-blue-500/50
                           focus:border-blue-400 transition-all shadow-[0_0_15px_rgba(66,153,225,0.2)]
                           disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                <FaEnvelope className="h-5 w-5 text-blue-400" />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading || resendCooldown > 0}
            className={`w-full flex justify-center items-center gap-3 py-4 font-semibold
                        rounded-xl text-white transition-all relative overflow-hidden
                        ${
                          isLoading || resendCooldown > 0
                            ? "bg-gradient-to-r from-gray-600 to-gray-700 cursor-not-allowed opacity-70"
                            : "bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-400 hover:to-purple-400 shadow-[0_0_20px_rgba(103,88,220,0.5)]"
                        }`}
            aria-busy={isLoading}
            aria-label={
              isLoading ? "Enviando correo" : "Enviar enlace de verificación"
            }
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-0 hover:opacity-100 transition-opacity duration-300" />
            <span className="relative z-10 flex items-center gap-3">
              {isLoading ? (
                <div className="relative">
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                </div>
              ) : resendCooldown > 0 ? (
                <span>Esperar {resendCooldown}s</span>
              ) : (
                <>
                  <FaPaperPlane className="h-5 w-5" />
                  <span>Reenviar Email</span>
                </>
              )}
            </span>
          </button>
        </form>

        {/* Información adicional */}
        <div className="mt-6 p-4 bg-gray-800/30 rounded-xl border border-gray-700/50">
          <p className="text-gray-400 text-sm text-center">
            💡 <strong>Tip:</strong> Revisa también tu carpeta de spam o correo
            no deseado
          </p>
        </div>
      </div>

      {/* Efectos de partículas flotantes */}
      <div className="absolute top-16 right-16 w-6 h-6 rounded-full bg-blue-500 shadow-lg animate-float" />
      <div
        className="absolute bottom-20 left-20 w-5 h-5 rounded-full bg-purple-500 shadow-lg animate-float"
        style={{ animationDelay: "1s" }}
      />
      <div
        className="absolute top-1/3 right-1/4 w-4 h-4 rounded-full bg-indigo-500 shadow-lg animate-float"
        style={{ animationDelay: "2s" }}
      />
    </div>
  );
}

export default function ResendVerificationPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-900 flex items-center justify-center">
          <div className="text-blue-400 animate-pulse">Cargando...</div>
        </div>
      }
    >
      <ResendVerificationContent />
    </Suspense>
  );
}
