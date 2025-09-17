"use client";

import { motion, Variants } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useCallback, useMemo } from "react";

interface HeroSectionProps {
  title: string;
  subtitle: string;
  cta: string;
}

// Hook para detectar si es móvil
const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return isMobile;
};

export default function HeroSection({
  title,
  subtitle,
  cta,
}: HeroSectionProps) {
  const isMobile = useIsMobile();

  // Memoizar animaciones para evitar recálculos
  const characterAnimation: Variants = useMemo(() => {
    return isMobile
      ? {
          hidden: { opacity: 0 },
          visible: { opacity: 1, transition: { duration: 0.3 } },
        }
      : {
          hidden: { opacity: 0, y: 20 },
          visible: (i: number) => ({
            opacity: 1,
            y: 0,
            transition: {
              delay: i * 0.03,
              type: "spring",
              stiffness: 200,
              damping: 20,
            },
          }),
        };
  }, [isMobile]);

  const renderAnimatedText = useCallback(
    (text: string, startOffset = 0) => {
      // En móvil, renderizar texto simple sin animación por caracteres
      if (isMobile) {
        return (
          <motion.span
            variants={characterAnimation}
            initial="hidden"
            animate="visible"
          >
            {text}
          </motion.span>
        );
      }

      // En desktop, mantener animación por caracteres
      const words = text.split(" ");
      const nodes: React.ReactNode[] = [];
      let offset = startOffset;

      words.forEach((word, wIndex) => {
        const charNodes = word.split("").map((ch, i) => {
          const customIndex = offset + i;
          return (
            <motion.span
              key={`${wIndex}-${i}-${ch}`}
              custom={customIndex}
              variants={characterAnimation}
              initial="hidden"
              animate="visible"
              className="inline-block"
            >
              {ch}
            </motion.span>
          );
        });

        nodes.push(
          <span
            key={`word-${wIndex}`}
            className="inline-block whitespace-nowrap"
          >
            {charNodes}
          </span>
        );

        if (wIndex < words.length - 1) nodes.push(" ");
        offset += word.length + 1;
      });

      return nodes;
    },
    [isMobile, characterAnimation]
  );

  return (
    <section className="relative h-[80vh] flex items-center justify-center overflow-hidden bg-black">
      {/* Fondo optimizado para móvil */}
      <div className="absolute inset-0 z-0">
        {/* Imagen móvil optimizada */}
        <div className="block sm:hidden absolute inset-0">
          <Image
            src="/images/portada.jpg"
            alt="Explore Heaven Mobile"
            fill
            className="object-cover object-center"
            quality={75}
            priority
            sizes="100vw"
            placeholder="blur"
            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx4f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R7/2Q=="
          />
        </div>

        {/* Imagen desktop */}
        <div className="hidden sm:block absolute inset-0">
          <Image
            src="/images/banner-6.jpg"
            alt="Explore Heaven Desktop"
            fill
            className="object-cover object-center"
            quality={85}
            priority
            sizes="100vw"
            placeholder="blur"
            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx4f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R7/2Q=="
          />
        </div>

        {/* Gradiente optimizado */}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 to-gray-900/30" />
      </div>

      {/* Contenido optimizado */}
      <div className="z-10 text-center space-y-6 sm:space-y-8 px-4 max-w-4xl">
        {/* Título optimizado para móvil */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-yellow-400 drop-shadow-2xl leading-tight">
          <div className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 to-yellow-500 font-sans mb-2 sm:mb-4">
            {renderAnimatedText(title, 0)}
          </div>
          <div className="text-2xl sm:text-3xl md:text-4xl text-yellow-200 font-sans">
            {renderAnimatedText(subtitle, title.length)}
          </div>
        </h1>

        {/* CTA optimizado */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: isMobile ? 0.3 : 0.6 }}
        >
          <Link href="/auth" prefetch={true}>
            <motion.button
              className="bg-yellow-400 text-gray-900 px-8 sm:px-10 py-3 sm:py-4 rounded-full hover:bg-yellow-300 transition-all duration-300 font-bold text-base sm:text-lg shadow-xl hover:shadow-yellow-400/40 will-change-transform"
              whileHover={{ scale: isMobile ? 1 : 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              {cta}
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
