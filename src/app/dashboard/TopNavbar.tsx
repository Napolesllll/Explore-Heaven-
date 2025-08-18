"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaHome,
  FaRoute,
  FaCalendarCheck,
  FaUserFriends,
  FaUser,
  FaTimes,
  FaBars,
} from "react-icons/fa";

type Props = {
  activeSection: string;
  onSelect: (section: string) => void;
};

export default function TopNavbar({ activeSection, onSelect }: Props) {
  const [isScrolled, setIsScrolled] = useState(false);

  const handleSelect = (section: string) => {
    onSelect(section);
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
    {
      id: "reservas",
      label: "Reservas",
      icon: <FaCalendarCheck className="text-lg" />,
    },
    {
      id: "guias",
      label: "Guías",
      icon: <FaUserFriends className="text-lg" />,
    },
    { id: "perfil", label: "Perfil", icon: <FaUser className="text-lg" /> },
  ];

  return (
    <>
      <motion.nav
        className={`flex  items-center justify-between sm:justify-center gap-1 px-2 sm:px-4 py-3 rounded-2xl backdrop-blur-xl transition-all duration-300 fixed top-4 z-50 w-[calc(100%-2rem)] mx-4 sm:w-auto sm:left-1/2 sm:transform sm:-translate-x-1/2 ${
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
            className={`relative flex-1 sm:flex-none px-2 sm:px-3 md:px-5 py-3 rounded-xl font-medium flex items-center justify-center gap-2 transition-all duration-300 ${
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
            <span className="relative z-10 flex items-center justify-center">
              {item.icon}
            </span>
            <span className="relative z-10 hidden lg:block">{item.label}</span>
          </motion.button>
        ))}

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
                opacity: 0,
              }}
              animate={{
                opacity: [0, 0.4, 0],
                scale: [0, 1, 0],
              }}
              transition={{
                duration: Math.random() * 4 + 2,
                repeat: Infinity,
                delay: Math.random() * 1.5,
              }}
            />
          ))}
        </div>
      </motion.nav>
    </>
  );
}
