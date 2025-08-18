"use client";

import { LogOut } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { motion } from "framer-motion";
import { FaCompass, FaMapMarkedAlt, FaMountain, FaUser } from "react-icons/fa";
import { useEffect, useState } from "react";

export default function SidebarLeft({
  user: initialUser,
  onSelectSection,
}: {
  user: any;
  onSelectSection?: (section: string) => void;
}) {
  const { data: session } = useSession();
  const [currentUser, setCurrentUser] = useState(initialUser);

  // Actualizar usuario cuando cambie la sesión
  useEffect(() => {
    if (session?.user) {
      setCurrentUser(session.user);
    }
  }, [session]);

  // Escuchar evento personalizado de actualización de perfil
  useEffect(() => {
    const handleProfileUpdate = (event: CustomEvent) => {
      const { name, email } = event.detail;
      setCurrentUser((prev: any) => ({
        ...prev,
        name: name,
        email: email,
      }));
    };

    window.addEventListener(
      "profileUpdated",
      handleProfileUpdate as EventListener
    );

    return () => {
      window.removeEventListener(
        "profileUpdated",
        handleProfileUpdate as EventListener
      );
    };
  }, []);

  // Función para manejar el clic en el perfil
  const handleProfileClick = () => {
    if (onSelectSection) {
      onSelectSection("perfil");
    }
  };

  // Usar currentUser en lugar de user directamente
  const displayUser = currentUser || initialUser;

  return (
    <aside className="w-64 p-4 hidden lg:flex flex-col justify-between h-screen relative overflow-hidden bg-gradient-to-b from-[#0c0f1d] via-[#151b35] to-[#0c0f1d]">
      {/* Fondo galáctico */}
      <div className="absolute inset-0 -z-10">
        {/* Efecto de estrellas */}
        {[...Array(30)].map((_, i) => (
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
              opacity: [0, 0.5, 0],
              scale: [0, 1, 0],
            }}
            transition={{
              duration: Math.random() * 6 + 4,
              repeat: Infinity,
              delay: Math.random() * 3,
            }}
          />
        ))}

        {/* Nebulosas sutiles */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-purple-900/10 blur-[100px]"></div>
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 rounded-full bg-cyan-500/10 blur-[120px]"></div>
      </div>

      {/* Borde luminoso */}
      <div className="absolute inset-0 border-r border-cyan-500/30 shadow-[0_0_30px_rgba(0,255,255,0.1)] pointer-events-none"></div>

      {/* Contenido */}
      <div className="flex flex-col items-center mt-8">
        {/* Título con estilo galáctico */}
        <motion.div
          className="text-center mb-8 w-full"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">
            Panel de Explorador
          </h2>
          <div className="h-1 w-32 mx-auto bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full mt-2"></div>
        </motion.div>

        {/* Perfil galáctico */}
        <motion.div
          className="relative mb-6"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          key={displayUser?.name} // Force re-render when name changes
        >
          <div className="absolute -inset-3 rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 blur-md opacity-20"></div>
          <div className="relative">
            <Image
              src={displayUser?.image || "/default-avatar.png"}
              alt="User"
              width={110}
              height={110}
              className="rounded-full object-cover border-2 border-cyan-500/50 relative z-10 shadow-lg"
            />
            <div className="absolute inset-0 rounded-full bg-cyan-400 blur-md opacity-0 hover:opacity-20 transition-opacity duration-500"></div>
          </div>

          {/* Detalle de explorador */}
          <div className="absolute -bottom-2 -right-2 bg-[#0f172a] p-2 rounded-full border border-cyan-500/30 z-20">
            <FaCompass className="text-cyan-400" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-center"
          key={`${displayUser?.name}-${displayUser?.email}`} // Force re-render when data changes
        >
          <p className="font-bold text-lg text-cyan-300 mb-1">
            {displayUser?.name}
          </p>
          <p className="text-sm text-cyan-300/70">{displayUser?.email}</p>

          {/* Nivel de explorador */}
          <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0f172a] border border-cyan-500/30">
            <FaMountain className="text-purple-400" />
            <span className="text-purple-300 text-xs font-medium">
              Explorador
            </span>
          </div>
        </motion.div>

        {/* Acciones rápidas */}
        <motion.div
          className="mt-8 w-full space-y-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          {/* Botón nuevo para ir al perfil */}
          <button
            onClick={handleProfileClick}
            className="w-full flex items-center justify-center bg-gradient-to-r from-cyan-700 to-blue-600 text-white font-semibold py-3 px-6 rounded-lg hover:from-cyan-600 hover:to-blue-500 transition-all duration-300 group shadow-lg relative overflow-hidden border border-cyan-500/30"
          >
            <span className="relative z-10 flex items-center">
              <FaUser className="mr-3" />
              Mi Perfil
            </span>

            {/* Efecto de partículas */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="absolute rounded-full bg-cyan-400 animate-float"
                  style={{
                    top: `${Math.random() * 100}%`,
                    left: `${Math.random() * 100}%`,
                    width: `${Math.random() * 4 + 2}px`,
                    height: `${Math.random() * 4 + 2}px`,
                    opacity: Math.random() * 0.5,
                    animationDuration: `${Math.random() * 2 + 1}s`,
                    animationDelay: `${Math.random() * 0.5}s`,
                  }}
                />
              ))}
            </div>
          </button>
        </motion.div>
      </div>

      {/* Botón cerrar sesión - Estilo galáctico */}
      <motion.div
        className="mb-6 relative"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="w-full flex items-center justify-center bg-gradient-to-r from-cyan-600 to-purple-600 text-white font-semibold py-3 px-6 rounded-lg hover:from-cyan-500 hover:to-purple-500 transition-all duration-300 group shadow-lg relative overflow-hidden border border-cyan-500/30"
        >
          <span className="relative z-10 flex items-center">
            <LogOut
              size={18}
              className="mr-3 transform group-hover:translate-x-1 transition-transform"
            />
            Cerrar sesión
          </span>

          {/* Efecto de partículas */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="absolute rounded-full bg-cyan-400 animate-float"
                style={{
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  width: `${Math.random() * 4 + 2}px`,
                  height: `${Math.random() * 4 + 2}px`,
                  opacity: Math.random() * 0.5,
                  animationDuration: `${Math.random() * 2 + 1}s`,
                  animationDelay: `${Math.random() * 0.5}s`,
                }}
              />
            ))}
          </div>
        </button>
      </motion.div>

      {/* Pie de página */}
      <motion.div
        className="text-center text-cyan-500/50 text-xs"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <p>Explora • Descubre • Aventúrate</p>
        <p className="mt-1">v2.1.4 • © {new Date().getFullYear()}</p>
      </motion.div>

      {/* Animaciones CSS */}
      <style jsx>{`
        @keyframes float {
          0% {
            transform: translateY(0) translateX(0);
            opacity: 0.2;
          }
          50% {
            transform: translateY(-10px) translateX(5px);
            opacity: 0.5;
          }
          100% {
            transform: translateY(0) translateX(0);
            opacity: 0.2;
          }
        }

        .animate-float {
          animation: float linear infinite;
        }
      `}</style>
    </aside>
  );
}
