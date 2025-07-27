'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';

export default function HeroSection() {
  // Textos a animar
  const titleText = "Your Safe Journey in Medellín";
  const subtitleText = "Starts With Explore Heaven";

  // Configuración de la animación en cadena (efecto gusano)
  const wormAnimation = {
    jump: {
      y: [0, -20, 0], // Movimiento: posición inicial -> salta -> vuelve abajo
      transition: {
        duration: 0.4, // Duración de cada salto
        ease: "easeOut"
      }
    } 
  };

  // Calculamos el delay para cada letra (animación en secuencia)
  const getDelay = (index, isSubtitle = false) => {
    const baseDelay = 0.2; // Tiempo entre letras
    const titleLength = titleText.length;
    const subtitleDelay = isSubtitle ? titleLength * baseDelay + 0.5 : 0;
    return index * baseDelay + subtitleDelay;
  };

  return (
    <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
      {/* Fondo animado (igual que antes) */}
      <motion.div 
        className="absolute inset-0 z-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.7 }}
        transition={{ duration: 1.5 }}
      >
        <Image
          src="/images/logo-explore-heaven.png"
          alt="Explore Heaven Logo"
          fill
          className="object-contain object-center"
          quality={100}
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 to-gray-900/30" />
      </motion.div>

      {/* Contenido principal */}
      <div className="z-10 text-center space-y-8 px-4">
        <h1 className="text-5xl font-bold text-yellow-400 drop-shadow-2xl max-w-3xl mx-auto">
          {/* Título principal */}
          <div className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 to-yellow-500">
            {titleText.split("").map((char, index) => (
              <motion.span
                key={`title-${index}`}
                className="inline-block"
                initial={{ y: 0 }}
                animate="jump"
                variants={wormAnimation}
                transition={{
                  delay: getDelay(index),
                  repeat: Infinity,
                  repeatDelay: titleText.length * 0.2 + 1 // Espera antes de repetir
                }}
              >
                {char === " " ? "\u00A0" : char}
              </motion.span>
            ))}
          </div>
          
          {/* Subtítulo */}
          <div className="text-3xl text-yellow-200 mt-4">
            {subtitleText.split("").map((char, index) => (
              <motion.span
                key={`subtitle-${index}`}
                className="inline-block"
                initial={{ y: 0 }}
                animate="jump"
                variants={wormAnimation}
                transition={{
                  delay: getDelay(index, true),
                  repeat: Infinity,
                  repeatDelay: subtitleText.length * 0.2 + 1
                }}
              >
                {char === " " ? "\u00A0" : char}
              </motion.span>
            ))}
          </div>
        </h1>

        {/* Botón (sin cambios) */}
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
              Start Your Adventure
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}