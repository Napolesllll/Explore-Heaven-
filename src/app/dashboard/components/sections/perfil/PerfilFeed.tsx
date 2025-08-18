"use client";

import { useSession, signOut } from "next-auth/react";
import Image from "next/image";
import EditProfileForm from "./EditProfileForm";
import ChangePasswordForm from "./ChangePasswordForm";
import { motion } from "framer-motion";
import { useState, useRef } from "react";
import {
  FaUserAstronaut,
  FaCrown,
  FaCalendar,
  FaEnvelope,
  FaLock,
  FaEdit,
  FaKey,
  FaCamera,
  FaSpinner,
  FaCheckCircle,
  FaExclamationTriangle,
} from "react-icons/fa";
import { LogOut } from "lucide-react";

export default function PerfilFeed() {
  const { data: session, status, update } = useSession();
  const user = session?.user;
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [uploadState, setUploadState] = useState({
    isUploading: false,
    success: false,
    error: "",
  });

  // Función para subir imagen a Cloudinary
  const uploadToCloudinary = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "heavenn");

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error("Error al subir imagen a Cloudinary");
    }

    const data = await response.json();
    return data.secure_url;
  };

  // Función para actualizar foto de perfil
  const updateProfilePhoto = async (imageUrl: string) => {
    const response = await fetch("/api/user/update-photo", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ imageUrl }),
    });

    if (!response.ok) {
      throw new Error("Error al actualizar foto de perfil");
    }

    return response.json();
  };

  // Manejar selección de archivo
  const handleFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validar tipo de archivo
    if (!file.type.startsWith("image/")) {
      setUploadState({
        isUploading: false,
        success: false,
        error: "Por favor selecciona una imagen válida",
      });
      return;
    }

    // Validar tamaño (5MB máximo)
    if (file.size > 5 * 1024 * 1024) {
      setUploadState({
        isUploading: false,
        success: false,
        error: "La imagen debe ser menor a 5MB",
      });
      return;
    }

    setUploadState({
      isUploading: true,
      success: false,
      error: "",
    });

    try {
      // Subir a Cloudinary
      const imageUrl = await uploadToCloudinary(file);

      // Actualizar en base de datos
      await updateProfilePhoto(imageUrl);

      // Actualizar sesión con la nueva imagen
      await update({
        user: {
          ...user,
          image: imageUrl,
        },
      });

      setUploadState({
        isUploading: false,
        success: true,
        error: "",
      });

      // Limpiar mensaje de éxito después de 3 segundos
      setTimeout(() => {
        setUploadState((prev) => ({ ...prev, success: false }));
      }, 3000);
    } catch (error) {
      console.error("Error al cambiar foto de perfil:", error);
      setUploadState({
        isUploading: false,
        success: false,
        error: "Error al cambiar la foto de perfil",
      });

      // Limpiar mensaje de error después de 5 segundos
      setTimeout(() => {
        setUploadState((prev) => ({ ...prev, error: "" }));
      }, 5000);
    }

    // Limpiar input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

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
          transition={{
            repeat: Infinity,
            repeatType: "reverse",
            duration: 1.5,
          }}
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
    <div className="min-h-screen mt-10 bg-[#0a0b16] py-12 px-4 relative overflow-hidden">
      {/* Efecto de fondo galáctico */}
      <div className="absolute inset-0 overflow-hidden -z-10">
        {[...Array(30)].map((_, i) => {
          const size = 2 + (i % 3);
          const duration = 5 + (i % 3);
          const delay = i * 0.1;
          const top = (i * 3.33) % 100;
          const left = (i * 2.77) % 100;

          return (
            <motion.div
              key={i}
              className="absolute rounded-full"
              style={{
                top: `${top}%`,
                left: `${left}%`,
                width: `${size}px`,
                height: `${size}px`,
                background: `radial-gradient(circle, ${
                  i % 2 === 0 ? "#8a2be2" : "#00ffff"
                }, transparent)`,
                opacity: 0,
              }}
              animate={{
                opacity: [0, 0.4, 0],
                scale: [0, 1, 0],
              }}
              transition={{
                duration,
                repeat: Infinity,
                delay,
              }}
            />
          );
        })}

        {/* Nebulosa */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-[#8a2be2]/10 blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 rounded-full bg-[#00ffff]/10 blur-3xl animate-pulse"></div>
      </div>

      <div className="max-w-2xl mx-auto relative">
        {/* Portal dimensional */}
        <div className="absolute -inset-4 bg-gradient-to-r from-[#8a2be2] to-[#00ffff] rounded-3xl blur-xl opacity-20 animate-pulse -z-10" />

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
              <div className="relative group">
                {/* Efecto de aura */}
                <div className="absolute -inset-4 bg-gradient-to-r from-[#8a2be2] to-[#00ffff] rounded-full blur-xl opacity-30 animate-pulse"></div>

                {/* Avatar flotante con botón de cambio */}
                <motion.div
                  className="relative rounded-full border-2 border-[#00ffff]/50 overflow-hidden w-32 h-32 cursor-pointer"
                  animate={{
                    y: [0, -10, 0],
                    rotate: [0, 5, 0, -5, 0],
                  }}
                  transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  onClick={triggerFileInput}
                >
                  <Image
                    src={user.image || "/default-avatar.png"}
                    alt={user.name || "Usuario"}
                    width={128}
                    height={128}
                    className="w-full h-full object-cover transition-all duration-300 group-hover:brightness-75"
                    priority
                  />

                  {/* Overlay de cambio de foto */}
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                    {uploadState.isUploading ? (
                      <FaSpinner className="text-[#00ffff] text-2xl animate-spin" />
                    ) : (
                      <div className="text-center">
                        <FaCamera className="text-[#00ffff] text-2xl mb-1 mx-auto" />
                        <span className="text-[#00ffff] text-xs font-medium">
                          Cambiar foto
                        </span>
                      </div>
                    )}
                  </div>
                </motion.div>

                {/* Input de archivo oculto */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />

                {/* Botón flotante de cámara */}
                <motion.button
                  onClick={triggerFileInput}
                  disabled={uploadState.isUploading}
                  className="absolute -bottom-2 -right-2 bg-gradient-to-r from-[#8a2be2] to-[#00ffff] p-3 rounded-full border-2 border-[#0f1122] shadow-lg hover:scale-110 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {uploadState.isUploading ? (
                    <FaSpinner className="text-white text-sm animate-spin" />
                  ) : (
                    <FaCamera className="text-white text-sm" />
                  )}
                </motion.button>

                {/* Partículas alrededor del avatar */}
                {[...Array(6)].map((_, i) => {
                  const angle = (i * Math.PI) / 3;
                  const radius = 50;
                  const x = Math.cos(angle) * radius;
                  const y = Math.sin(angle) * radius;

                  return (
                    <motion.div
                      key={i}
                      className="absolute rounded-full bg-[#00ffff] w-1.5 h-1.5"
                      style={{
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                      }}
                      animate={{
                        x: [0, x, 0],
                        y: [0, y, 0],
                        scale: [0.5, 1, 0.5],
                        opacity: [0, 0.8, 0],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        delay: i * 0.2,
                        ease: "easeInOut",
                      }}
                    />
                  );
                })}
              </div>
            </div>

            {/* Estados de carga/éxito/error */}
            {uploadState.isUploading && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-center gap-2 mb-4 text-[#00ffff]"
              >
                <FaSpinner className="animate-spin" />
                <span className="text-sm">Actualizando foto...</span>
              </motion.div>
            )}

            {uploadState.success && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-center gap-2 mb-4 text-green-400"
              >
                <FaCheckCircle />
                <span className="text-sm">
                  ¡Foto actualizada correctamente!
                </span>
              </motion.div>
            )}

            {uploadState.error && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-center gap-2 mb-4 text-red-400"
              >
                <FaExclamationTriangle />
                <span className="text-sm">{uploadState.error}</span>
              </motion.div>
            )}

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
              <span className="text-[#ffd700] font-medium">
                {user.rol || "Explorador"}
              </span>
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
                  <h3 className="text-lg font-bold text-[#8a2be2]">
                    Correo Electrónico
                  </h3>
                </div>
                <p className="text-[#cbd5e0] text-lg font-light pl-2">
                  {user.email}
                </p>
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
                  <h3 className="text-lg font-bold text-[#00ffff]">
                    Miembro Desde
                  </h3>
                </div>
                <p className="text-[#cbd5e0] text-lg font-light pl-2">
                  {user.fechaRegistro ||
                    "Explorando desde el inicio del tiempo"}
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

          {/* Botón cerrar sesión - Solo móvil */}
          <motion.div
            className="block lg:hidden p-6 pt-0"
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

              {/* Efecto de partículas fijas */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="absolute rounded-full bg-cyan-400 animate-float"
                    style={{
                      top: `${20 * i}%`,
                      left: `${15 * i}%`,
                      width: `${2 + i}px`,
                      height: `${2 + i}px`,
                      opacity: 0.5,
                      animationDuration: `${1 + i * 0.5}s`,
                      animationDelay: `${i * 0.2}s`,
                    }}
                  />
                ))}
              </div>
            </button>
          </motion.div>
        </motion.div>

        <motion.div
          className="mt-8 text-center text-[#a0aec0] text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <p>
            Sistema de Explore Heaven • © {new Date().getFullYear()} Explore
            Adventures
          </p>
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
    </div>
  );
}
