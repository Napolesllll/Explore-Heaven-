"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaHome, FaRoute, FaCalendarCheck, FaUserFriends, FaUser, FaTimes, FaBars } from "react-icons/fa";

type Props = {
  activeSection: string; // Ahora recibimos la sección activa como prop
  onSelect: (section: string) => void;
};

export default function TopNavbar({ activeSection, onSelect }: Props) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
 
  const handleSelect = (section: string) => {
    onSelect(section);
    setIsMenuOpen(false);
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { id: "inicio", label: "Inicio", icon: <FaHome className="text-lg" /> },
    { id: "tours", label: "Tours", icon: <FaRoute className="text-lg" /> },
    { id: "reservas", label: "Reservas", icon: <FaCalendarCheck className="text-lg" /> },
    { id: "guias", label: "Guías", icon: <FaUserFriends className="text-lg" /> },
    { id: "perfil", label: "Perfil", icon: <FaUser className="text-lg" /> }
  ];

  return (
    <>
      {/* Navbar para escritorio */}
      <motion.nav 
        className={`hidden md:flex items-center justify-center gap-1 px-4 py-3 rounded-2xl backdrop-blur-xl transition-all duration-300 fixed top-4 left-1/2 transform -translate-x-1/2 z-50 ${
          isScrolled 
            ? "bg-[#0f172a]/90 border border-cyan-500/30 shadow-2xl shadow-cyan-500/10" 
            : "bg-transparent"
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        {navItems.map((item) => (
          <motion.button
            key={item.id}
            onClick={() => handleSelect(item.id)}
            className={`relative px-5 py-3 rounded-xl font-medium flex items-center gap-2 transition-all duration-300 ${
              activeSection === item.id
                ? "text-white"
                : "text-gray-400 hover:text-cyan-300"
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {activeSection === item.id && (
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-cyan-600/50 to-purple-600/50 rounded-xl z-0"
                layoutId="activeNavItem"
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            )}
            <span className="relative z-10">{item.icon}</span>
            <span className="relative z-10 hidden lg:block">{item.label}</span>
          </motion.button>
        ))}
        
        {/* Efecto de partículas */}
        <div className="absolute inset-0 overflow-hidden -z-10 rounded-2xl">
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-gradient-to-r from-cyan-400/10 to-purple-500/10"
              initial={{ 
                top: `${Math.random() * 100}%`, 
                left: `${Math.random() * 100}%`,
                width: `${Math.random() * 6 + 2}px`,
                height: `${Math.random() * 6 + 2}px`,
                opacity: 0
              }}
              animate={{ 
                opacity: [0, 0.4, 0],
                scale: [0, 1, 0]
              }}
              transition={{ 
                duration: Math.random() * 4 + 2,
                repeat: Infinity,
                delay: Math.random() * 1.5
              }}
            />
          ))}
        </div>
      </motion.nav>

      {/* Navbar para móvil */}
      <motion.nav
        className={`md:hidden fixed top-4 right-4 z-50 ${
          isScrolled ? "bg-[#0f172a]/90 rounded-full p-2 border border-cyan-500/30 shadow-lg" : ""
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="p-3 rounded-full bg-gradient-to-r from-cyan-600 to-purple-600 shadow-lg shadow-cyan-500/30"
        >
          {isMenuOpen ? (
            <FaTimes className="text-white text-xl" />
          ) : (
            <FaBars className="text-white text-xl" />
          )}
        </button>
      </motion.nav>

      {/* Menú móvil */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            className="fixed inset-0 bg-[#0c0f1d]/95 backdrop-blur-2xl z-40 flex flex-col items-center justify-center md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="absolute top-4 right-4">
              <button
                onClick={() => setIsMenuOpen(false)}
                className="p-3 rounded-full bg-gradient-to-r from-cyan-600 to-purple-600 shadow-lg"
              >
                <FaTimes className="text-white text-xl" />
              </button>
            </div>
            
            <div className="space-y-8 text-center">
              {navItems.map((item) => (
                <motion.button
                  key={item.id}
                  onClick={() => handleSelect(item.id)}
                  className={`text-2xl font-bold flex flex-col items-center gap-3 ${
                    activeSection === item.id
                      ? "text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400"
                      : "text-gray-400"
                  }`}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 20, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <span className="text-cyan-400">{item.icon}</span>
                  {item.label}
                </motion.button>
              ))}
            </div>
            
            <div className="absolute bottom-8 text-gray-500 text-sm">
              Explore Adventures © {new Date().getFullYear()}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}