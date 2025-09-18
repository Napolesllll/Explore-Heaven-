// 5. TOP NAVBAR OPTIMIZADO PARA MÓVIL
"use client";

import { useState, useEffect, useCallback, useMemo, memo } from "react";
import { motion } from "framer-motion";
import {
  FaHome,
  FaRoute,
  FaCalendarCheck,
  FaUserFriends,
  FaUser,
} from "react-icons/fa";

interface TopNavbarProps {
  activeSection: string;
  onSelect: (section: string) => void;
}

// Hook para capacidades del dispositivo
const useDeviceCapabilities = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const checkCapabilities = () => {
      setIsMobile(window.innerWidth < 768);
      setReduceMotion(
        window.matchMedia("(prefers-reduced-motion: reduce)").matches
      );
    };

    checkCapabilities();
    window.addEventListener("resize", checkCapabilities);

    return () => window.removeEventListener("resize", checkCapabilities);
  }, []);

  return { isMobile, reduceMotion };
};

const TopNavbar = memo<TopNavbarProps>(({ activeSection, onSelect }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const { isMobile, reduceMotion } = useDeviceCapabilities();

  const handleSelect = useCallback(
    (section: string) => {
      onSelect(section);
    },
    [onSelect]
  );

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Items de navegación memoizados
  const navItems = useMemo(
    () => [
      {
        id: "inicio",
        label: "Inicio",
        icon: <FaHome className={`${isMobile ? "text-base" : "text-lg"}`} />,
      },
      {
        id: "tours",
        label: "Tours",
        icon: <FaRoute className={`${isMobile ? "text-base" : "text-lg"}`} />,
      },
      {
        id: "reservas",
        label: "Reservas",
        icon: (
          <FaCalendarCheck
            className={`${isMobile ? "text-base" : "text-lg"}`}
          />
        ),
      },
      {
        id: "guias",
        label: "Guías",
        icon: (
          <FaUserFriends className={`${isMobile ? "text-base" : "text-lg"}`} />
        ),
      },
      {
        id: "perfil",
        label: "Perfil",
        icon: <FaUser className={`${isMobile ? "text-base" : "text-lg"}`} />,
      },
    ],
    [isMobile]
  );

  // Configuración de partículas reducida para móvil
  const particleCount = isMobile ? 0 : 4;
  const enableAnimations = !reduceMotion;

  return (
    <motion.nav
      className={`
        flex items-center justify-between sm:justify-center gap-1 
        ${isMobile ? "px-1 py-2" : "px-2 sm:px-4 py-3"} 
        rounded-xl sm:rounded-2xl backdrop-blur-xl transition-all duration-300 
        fixed ${isMobile ? "bottom-4 left-2 right-2" : "top-4"} z-50 
        ${isMobile ? "w-auto mx-0" : "w-[calc(100%-2rem)] mx-4 sm:w-auto sm:left-1/2 sm:transform sm:-translate-x-1/2"} 
        ${
          isScrolled
            ? "bg-[#0f172a]/90 border border-cyan-500/30 shadow-2xl shadow-cyan-500/10"
            : isMobile
              ? "bg-[#0f172a]/80 border border-cyan-500/20"
              : "bg-transparent"
        }
      `}
      initial={enableAnimations ? { y: isMobile ? 100 : -100 } : {}}
      animate={enableAnimations ? { y: 0 } : {}}
      transition={enableAnimations ? { duration: 0.5, ease: "easeOut" } : {}}
    >
      {navItems.map((item) => (
        <motion.button
          key={item.id}
          onClick={() => handleSelect(item.id)}
          className={`
            relative flex-1 sm:flex-none 
            ${isMobile ? "px-2 py-2.5" : "px-2 sm:px-3 md:px-5 py-3"} 
            rounded-lg sm:rounded-xl font-medium 
            flex items-center justify-center gap-1.5 sm:gap-2 
            transition-all duration-300 
            ${
              activeSection === item.id
                ? "text-white"
                : "text-gray-400 hover:text-cyan-300"
            }
          `}
          whileHover={enableAnimations ? { scale: isMobile ? 1.02 : 1.05 } : {}}
          whileTap={enableAnimations ? { scale: 0.98 } : {}}
        >
          {activeSection === item.id && (
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-cyan-600/50 to-purple-600/50 rounded-lg sm:rounded-xl z-0"
              layoutId="activeNavItem"
              transition={
                enableAnimations
                  ? { type: "spring", stiffness: 300, damping: 30 }
                  : {}
              }
            />
          )}
          <span className="relative z-10 flex items-center justify-center">
            {item.icon}
          </span>
          <span
            className={`relative z-10 ${isMobile ? "text-xs" : "hidden lg:block"}`}
          >
            {item.label}
          </span>
        </motion.button>
      ))}

      {/* Partículas de fondo muy reducidas */}
      {!reduceMotion && !isMobile && (
        <div className="absolute inset-0 overflow-hidden -z-10 rounded-xl sm:rounded-2xl">
          {[...Array(particleCount)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-gradient-to-r from-cyan-400/8 to-purple-500/8"
              initial={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                width: `${Math.random() * 4 + 2}px`,
                height: `${Math.random() * 4 + 2}px`,
                opacity: 0,
              }}
              animate={{
                opacity: [0, 0.3, 0],
                scale: [0, 1, 0],
              }}
              transition={{
                duration: Math.random() * 3 + 2,
                repeat: Infinity,
                delay: Math.random() * 1,
              }}
              style={{ contain: "layout style paint" }}
            />
          ))}
        </div>
      )}
    </motion.nav>
  );
});

TopNavbar.displayName = "TopNavbar";

export default TopNavbar;
