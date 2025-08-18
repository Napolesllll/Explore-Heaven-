"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

interface HeroSectionProps {
  title: string;
  subtitle: string;
  cta: string;
}

export default function HeroSection({
  title,
  subtitle,
  cta,
}: HeroSectionProps) {
  // Animación optimizada para evitar distorsión
  const characterAnimation = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.05,
        type: "spring",
        stiffness: 100,
      },
    }),
  };

  return (
    <section className="relative h-[80vh] flex items-center justify-center overflow-hidden bg-black">
      {/* Fondo animado */}
      <motion.div
        className="absolute inset-0 z-0 bg-black"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.7 }}
        transition={{ duration: 1.5 }}
      >
        {/* Contenedor para la imagen */}
        <div className="absolute inset-0">
          <Image
            /*  src="/images/Banner-03.svg"*/
            src="/images/banner-6.jpg"
            alt="Explore Heaven Logo"
            fill
            className="object-contain object-center "
            quality={100}
            priority
          />
        </div>

        {/* Gradiente */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, rgba(17, 24, 39, 0.6), rgba(17, 24, 39, 0.3))",
          }}
        />
      </motion.div>

      {/* Contenido principal */}
      <div className="z-10 text-center space-y-8 px-4">
        <h1 className="text-5xl font-bold text-yellow-400 drop-shadow-2xl max-w-3xl mx-auto">
          {/* Título principal */}
          <div className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 to-yellow-500 font-sans mb-4">
            {title.split("").map((char, index) => (
              <motion.span
                key={`title-${index}`}
                custom={index}
                variants={characterAnimation}
                initial="hidden"
                animate="visible"
                className="inline-block"
              >
                {char === " " ? "\u00A0" : char}
              </motion.span>
            ))}
          </div>

          {/* Subtítulo */}
          <div className="text-3xl text-yellow-200 font-sans">
            {subtitle.split("").map((char, index) => (
              <motion.span
                key={`subtitle-${index}`}
                custom={index + title.length}
                variants={characterAnimation}
                initial="hidden"
                animate="visible"
                className="inline-block"
              >
                {char === " " ? "\u00A0" : char}
              </motion.span>
            ))}
          </div>
        </h1>

        {/* Botón */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Link href="/auth" prefetch={true}>
            <motion.button
              className="bg-yellow-400 text-gray-900 px-10 py-4 rounded-full hover:bg-yellow-300 transition-all duration-300 font-bold text-lg shadow-xl hover:shadow-yellow-400/40"
              whileHover={{ scale: 1.05 }}
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
