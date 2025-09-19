// TopNavbar Ultra Optimizado para Rendimiento
"use client";

import {
  useState,
  useEffect,
  useCallback,
  useMemo,
  memo,
  useRef,
  JSX,
} from "react";
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

// Hook para capacidades del dispositivo optimizado
const useDeviceCapabilities = () => {
  const [capabilities, setCapabilities] = useState({
    isMobile: false,
    reduceMotion: false,
  });

  useEffect(() => {
    const checkCapabilities = () => {
      const newCapabilities = {
        isMobile: window.innerWidth < 768,
        reduceMotion: window.matchMedia("(prefers-reduced-motion: reduce)")
          .matches,
      };

      // Solo actualizar si hay cambios para evitar re-renders innecesarios
      setCapabilities((prev) => {
        if (
          prev.isMobile !== newCapabilities.isMobile ||
          prev.reduceMotion !== newCapabilities.reduceMotion
        ) {
          return newCapabilities;
        }
        return prev;
      });
    };

    checkCapabilities();

    // Usar passive listener y debounce para resize
    let resizeTimeout: NodeJS.Timeout;
    const debouncedResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(checkCapabilities, 150);
    };

    window.addEventListener("resize", debouncedResize, { passive: true });

    return () => {
      window.removeEventListener("resize", debouncedResize);
      clearTimeout(resizeTimeout);
    };
  }, []);

  return capabilities;
};

// Componente NavItem memoizado para evitar re-renders
const NavItem = memo<{
  item: {
    id: string;
    label: string;
    icon: JSX.Element;
  };
  isActive: boolean;
  isMobile: boolean;
  enableAnimations: boolean;
  onClick: (id: string) => void;
}>(({ item, isActive, isMobile, enableAnimations, onClick }) => {
  const handleClick = useCallback(() => {
    onClick(item.id);
  }, [item.id, onClick]);

  return (
    <motion.button
      onClick={handleClick}
      className={`
        relative flex-1 sm:flex-none 
        ${isMobile ? "px-2 py-2.5" : "px-2 sm:px-3 md:px-5 py-3"} 
        rounded-lg sm:rounded-xl font-medium 
        flex items-center justify-center gap-1.5 sm:gap-2 
        transition-all duration-300 
        ${isActive ? "text-white" : "text-gray-400 hover:text-cyan-300"}
      `}
      whileHover={enableAnimations ? { scale: isMobile ? 1.02 : 1.05 } : {}}
      whileTap={enableAnimations ? { scale: 0.98 } : {}}
      // Usar layout="position" para mejor rendimiento
      layout={enableAnimations ? "position" : false}
    >
      {isActive && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-cyan-600/50 to-purple-600/50 rounded-lg sm:rounded-xl z-0"
          layoutId="activeNavItem"
          transition={
            enableAnimations
              ? { type: "spring", stiffness: 300, damping: 30, duration: 0.3 }
              : { duration: 0 }
          }
          // Evitar reflow usando transform
          style={{ willChange: "transform" }}
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
  );
});

NavItem.displayName = "NavItem";

// Componente de partícula optimizado
const OptimizedParticle = memo<{
  index: number;
  reduceMotion: boolean;
}>(({ index, reduceMotion }) => {
  if (reduceMotion) return null;

  return (
    <motion.div
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
        ease: "easeInOut",
      }}
      style={{
        contain: "layout style paint",
        willChange: "opacity, transform",
      }}
    />
  );
});

OptimizedParticle.displayName = "OptimizedParticle";

const TopNavbar = memo<TopNavbarProps>(({ activeSection, onSelect }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const { isMobile, reduceMotion } = useDeviceCapabilities();
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null); // Inicializado con null

  const handleSelect = useCallback(
    (section: string) => {
      // Usar requestAnimationFrame para mejorar rendimiento en la selección
      requestAnimationFrame(() => {
        onSelect(section);
      });
    },
    [onSelect]
  );

  useEffect(() => {
    const handleScroll = () => {
      // Debounce scroll para reducir cálculos
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
      scrollTimeoutRef.current = setTimeout(() => {
        const newScrolled = window.scrollY > 10;
        setIsScrolled((prev) => (prev !== newScrolled ? newScrolled : prev));
      }, 10);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  // Items de navegación memoizados con iconos optimizados
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

  // Configuración de partículas ultra optimizada
  const particleCount = useMemo(() => {
    if (reduceMotion || isMobile) return 0;
    return 3; // Reducido drásticamente para mejor rendimiento
  }, [isMobile, reduceMotion]);

  const enableAnimations = !reduceMotion;

  // Memoizar clases CSS para evitar recálculos
  const navClasses = useMemo(
    () => `
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
  `,
    [isMobile, isScrolled]
  );

  // Partículas memoizadas
  const particles = useMemo(
    () =>
      Array.from({ length: particleCount }, (_, i) => (
        <OptimizedParticle key={i} index={i} reduceMotion={reduceMotion} />
      )),
    [particleCount, reduceMotion]
  );

  return (
    <motion.nav
      className={navClasses}
      initial={enableAnimations ? { y: isMobile ? 100 : -100 } : {}}
      animate={enableAnimations ? { y: 0 } : {}}
      transition={
        enableAnimations
          ? {
              duration: 0.5,
              ease: "easeOut",
              type: "spring",
              stiffness: 100,
              damping: 15,
            }
          : {}
      }
      style={{ willChange: enableAnimations ? "transform" : "auto" }}
    >
      {navItems.map((item) => (
        <NavItem
          key={item.id}
          item={item}
          isActive={activeSection === item.id}
          isMobile={isMobile}
          enableAnimations={enableAnimations}
          onClick={handleSelect}
        />
      ))}

      {/* Partículas de fondo ultra optimizadas */}
      {particleCount > 0 && (
        <div
          className="absolute inset-0 overflow-hidden -z-10 rounded-xl sm:rounded-2xl"
          style={{ contain: "layout style paint" }}
        >
          {particles}
        </div>
      )}
    </motion.nav>
  );
});

TopNavbar.displayName = "TopNavbar";

export default TopNavbar;
