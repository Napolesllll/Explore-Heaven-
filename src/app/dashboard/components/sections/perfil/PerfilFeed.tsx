"use client";

import { useSession } from "next-auth/react";
import Image from "next/image";
import EditProfileForm from "./EditProfileForm";
import ChangePasswordForm from "./ChangePasswordForm";
import { motion } from "framer-motion";
import { FaUserAstronaut, FaCrown, FaCalendar, FaEnvelope, FaLock, FaEdit, FaKey } from "react-icons/fa";
 
export default function PerfilFeed() {
  const { data: session, status } = useSession();
  const user = session?.user;

  if (status === "loading") {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center bg-[#0a0b16]">
        <div className="relative w-32 h-32 mb-8">
          <div className="absolute inset-0 bg-gradient-to-r from-[#8a2be2] to-[#00ffff] rounded-full animate-spin blur-xl opacity-30"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-[#8a2be2] to-[#00ffff] rounded-full animate-spin opacity-50"></div>
          <div className="absolute inset-2 bg-[#0a0b16] rounded-full"></div>
          <div className="absolute inset-4 flex items-center justify-center">
            <FaUserAstronaut className="text-[#00ffff] text-3xl animate-pulse" />
          </div>
        </div>
        <motion.h2 
          className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#8a2be2] to-[#00ffff]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ repeat: Infinity, repeatType: "reverse", duration: 1.5 }}
        >
          DESCUBRIENDO TU UNIVERSO...
        </motion.h2>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center p-4 bg-[#0a0b16]">
        <div className="relative bg-gradient-to-r from-[#8a2be2]/10 to-[#00ffff]/10 p-8 rounded-3xl border border-[#8a2be2]/30 backdrop-blur-sm max-w-md text-center overflow-hidden">
          <div className="absolute -inset-4 bg-gradient-to-r from-[#8a2be2] to-[#00ffff] blur-2xl opacity-10"></div>
          <div className="relative z-10">
            <div className="inline-flex items-center justify-center p-4 bg-[#0a0b16]/50 rounded-full mb-6 border border-[#8a2be2]/30">
              <FaUserAstronaut className="h-12 w-12 text-[#00ffff]" />
            </div>
            <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#8a2be2] to-[#00ffff] mb-4">
              EXPLORADOR NO IDENTIFICADO
            </h3>
            <p className="text-[#a0aec0]">
              Por favor inicia sesión para acceder a tu portal dimensional
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0b16] py-12 px-4 relative overflow-hidden">
      {/* Efecto de fondo galáctico */}
      <div className="absolute inset-0 overflow-hidden -z-10">
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              width: `${Math.random() * 8 + 2}px`,
              height: `${Math.random() * 8 + 2}px`,
              background: `radial-gradient(circle, ${
                Math.random() > 0.5 ? '#8a2be2' : '#00ffff'
              }, transparent)`,
              opacity: 0
            }}
            animate={{ 
              opacity: [0, Math.random() * 0.4 + 0.1, 0],
              scale: [0, 1, 0]
            }}
            transition={{ 
              duration: Math.random() * 10 + 5,
              repeat: Infinity,
              delay: Math.random() * 3
            }}
          />
        ))}
        
        {/* Nebulosa */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-[#8a2be2]/10 blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 rounded-full bg-[#00ffff]/10 blur-3xl animate-pulse"></div>
      </div>

      <div className="max-w-2xl mx-auto relative">
        {/* Portal dimensional */}
        <motion.div 
          className="absolute -inset-4 bg-gradient-to-r from-[#8a2be2] to-[#00ffff] rounded-3xl blur-xl opacity-20 animate-pulse -z-10"
          animate={{ rotate: 360 }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        />
        
        <motion.div 
          className="relative bg-[#0f1122]/90 backdrop-blur-2xl rounded-3xl border border-[#8a2be2]/30 shadow-2xl shadow-[#8a2be2]/10 overflow-hidden"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          {/* Cabecera del portal */}
          <div className="pt-16 pb-8 px-6 text-center border-b border-[#8a2be2]/20 relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#8a2be2] via-[#00ffff] to-[#8a2be2] opacity-80"></div>
            
            <div className="relative flex justify-center items-center mt-4 mb-6">
              <div className="relative">
                {/* Efecto de aura */}
                <div className="absolute -inset-4 bg-gradient-to-r from-[#8a2be2] to-[#00ffff] rounded-full blur-xl opacity-30 animate-pulse"></div>
                
                {/* Avatar flotante */}
                <motion.div 
                  className="relative rounded-full border-2 border-[#00ffff]/50 overflow-hidden w-32 h-32"
                  animate={{ 
                    y: [0, -10, 0],
                    rotate: [0, 5, 0, -5, 0]
                  }}
                  transition={{ 
                    duration: 8, 
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <Image
                    src={user.image || "/default-avatar.png"}
                    alt={user.name || "Usuario"}
                    width={128}
                    height={128}
                    className="w-full h-full object-cover"
                    priority
                  />
                </motion.div>
                
                {/* Efecto de partículas alrededor del avatar */}
                {[...Array(6)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute rounded-full bg-[#00ffff]"
                    style={{
                      width: "6px",
                      height: "6px",
                      top: "50%",
                      left: "50%",
                      translateX: "-50%",
                      translateY: "-50%",
                    }}
                    animate={{
                      top: `${Math.cos((i * Math.PI) / 3) * 50 + 50}%`,
                      left: `${Math.sin((i * Math.PI) / 3) * 50 + 50}%`,
                      scale: [0.5, 1, 0.5],
                      opacity: [0, 0.8, 0]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: i * 0.2,
                      ease: "easeInOut"
                    }}
                  />
                ))}
              </div>
            </div>

            <motion.h2 
              className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#8a2be2] to-[#00ffff] mt-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {user.name}
            </motion.h2>
            
            <motion.div 
              className="inline-flex items-center gap-2 mt-2 px-4 py-1 rounded-full bg-[#0f1122] border border-[#8a2be2]/30"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <FaCrown className="text-[#ffd700]" />
              <span className="text-[#ffd700] font-medium">{user.rol || "Explorador"}</span>
            </motion.div>
          </div>

          {/* Información del usuario - Tarjetas flotantes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
            <motion.div 
              className="bg-[#0f1122] rounded-2xl border border-[#8a2be2]/30 p-5 relative overflow-hidden"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              whileHover={{ y: -5 }}
            >
              <div className="absolute -inset-1 bg-gradient-to-r from-[#8a2be2] to-transparent opacity-10 blur-sm"></div>
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-[#8a2be2]/20 p-3 rounded-xl border border-[#8a2be2]/30">
                    <FaEnvelope className="text-[#8a2be2] text-xl" />
                  </div>
                  <h3 className="text-lg font-bold text-[#8a2be2]">Correo Electrónico</h3>
                </div>
                <p className="text-[#cbd5e0] text-lg font-light pl-2">{user.email}</p>
              </div>
            </motion.div>
            
            <motion.div 
              className="bg-[#0f1122] rounded-2xl border border-[#00ffff]/30 p-5 relative overflow-hidden"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              whileHover={{ y: -5 }}
            >
              <div className="absolute -inset-1 bg-gradient-to-r from-[#00ffff] to-transparent opacity-10 blur-sm"></div>
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-[#00ffff]/20 p-3 rounded-xl border border-[#00ffff]/30">
                    <FaCalendar className="text-[#00ffff] text-xl" />
                  </div>
                  <h3 className="text-lg font-bold text-[#00ffff]">Miembro Desde</h3>
                </div>
                <p className="text-[#cbd5e0] text-lg font-light pl-2">
                  {user.fechaRegistro || "Explorando desde el inicio del tiempo"}
                </p>
              </div>
            </motion.div>
          </div>

          {/* Formularios - Secciones con efecto de energía */}
          <div className="p-6 space-y-8">
            <motion.div
              className="relative"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <div className="absolute -inset-4 bg-gradient-to-r from-[#8a2be2] to-[#00ffff] opacity-5 blur-lg"></div>
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-gradient-to-r from-[#8a2be2]/20 to-[#00ffff]/20 p-2 rounded-lg border border-[#8a2be2]/30">
                    <FaEdit className="text-[#8a2be2] text-xl" />
                  </div>
                  <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#8a2be2] to-[#00ffff]">
                    Editar Perfil 
                  </h3>
                </div>
                <EditProfileForm />
              </div>
            </motion.div>
            
            <motion.div
              className="relative"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <div className="absolute -inset-4 bg-gradient-to-r from-[#8a2be2] to-[#00ffff] opacity-5 blur-lg"></div>
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-gradient-to-r from-[#8a2be2]/20 to-[#00ffff]/20 p-2 rounded-lg border border-[#00ffff]/30">
                    <FaKey className="text-[#00ffff] text-xl" />
                  </div>
                  <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#8a2be2] to-[#00ffff]">
                    Cambiar Clave 
                  </h3>
                </div>
                <ChangePasswordForm />
              </div>
            </motion.div>
          </div>
        </motion.div>

        <motion.div 
          className="mt-8 text-center text-[#a0aec0] text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <p>Sistema Dimensional de Explore Heaven • © {new Date().getFullYear()} Explore Adventures</p>
          <div className="flex justify-center space-x-2 mt-2">
            <motion.div 
              className="w-2 h-2 rounded-full bg-[#8a2be2]"
              animate={{ opacity: [0.2, 1, 0.2] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
            <motion.div 
              className="w-2 h-2 rounded-full bg-[#00ffff]"
              animate={{ opacity: [0.2, 1, 0.2] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
            />
            <motion.div 
              className="w-2 h-2 rounded-full bg-[#8a2be2]"
              animate={{ opacity: [0.2, 1, 0.2] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: 1 }}
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
}