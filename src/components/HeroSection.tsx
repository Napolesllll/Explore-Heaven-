"use client";

import { motion, Variants } from "framer-motion";
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
  const characterAnimation: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.05,
        type: "spring" as const,
        stiffness: 100,
      },
    }),
  };

  // Renderiza el texto agrupando por palabras para evitar quiebres dentro de una palabra.
  // Cada palabra es `inline-block whitespace-nowrap` y los caracteres dentro se animan individualmente.
  const renderAnimatedText = (text: string, startOffset = 0) => {
    const words = text.split(" ");
    const nodes: React.ReactNode[] = [];
    let offset = startOffset;

    words.forEach((word, wIndex) => {
      const charNodes = word.split("").map((ch, i) => {
        const key = `ch-${wIndex}-${i}-${ch}`;
        const customIndex = offset + i;
        return (
          <motion.span
            key={key}
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

      // palabra completa (sin quiebres internos)
      nodes.push(
        <span
          key={`word-${wIndex}-${words.length}`}
          className="inline-block whitespace-nowrap"
        >
          {charNodes}
        </span>
      );

      // agrega un espacio normal entre palabras (permite quiebre aquí)
      if (wIndex < words.length - 1) {
        nodes.push(" ");
      }

      offset += word.length + 1; // +1 para el espacio
    });

    return nodes;
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
        {/* Contenedor para la imagen (mobile: /images/portada.jpg, desktop: /images/banner-6.jpg) */}
        <div className="absolute inset-0">
          {/* Imagen para dispositivos móviles (visible en <sm) */}
          <div className="block sm:hidden absolute inset-0">
            <Image
              src="/images/portada.jpg"
              alt="Explore Heaven Mobile"
              fill
              className="object-cover object-center"
              quality={100}
              priority
            />
          </div>

          {/* Imagen para pantallas >= sm */}
          <div className="hidden sm:block absolute inset-0">
            <Image
              src="/images/banner-6.jpg"
              alt="Explore Heaven Logo"
              fill
              className="object-cover object-center"
              quality={100}
              priority
            />
          </div>
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
        <h1 className="text-5xl sm:text-6xl font-bold text-yellow-400 drop-shadow-2xl max-w-3xl mx-auto leading-tight">
          {/* Título principal */}
          <div className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 to-yellow-500 font-sans mb-4">
            {renderAnimatedText(title, 0)}
          </div>

          {/* Subtítulo */}
          <div className="text-3xl sm:text-4xl text-yellow-200 font-sans">
            {renderAnimatedText(subtitle, title.length)}
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
