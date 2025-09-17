// src/components/LoadingAnimation.tsx
"use client";

import { memo } from "react";
import Image from "next/image";

// Componente de loading simple y optimizado
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

export default LoadingAnimation;
