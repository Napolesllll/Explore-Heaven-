"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const MotionForm = motion("form");

export default function EditProfileForm() {
  const { data: session, update } = useSession();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  // Actualiza los estados locales cuando cambie la sesión
  useEffect(() => {
    if (session?.user) {
      setName(session.user.name || "");
      setEmail(session.user.email || "");
    }
  }, [session]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    setError("");

    try {
      const payload = { name, email };
      console.log("📤 Enviando payload a /api/perfil:", payload);

      const res = await fetch("/api/perfil", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        // Asegurar que las cookies de sesión se envían en entornos que lo requieran
        credentials: "same-origin",
      });

      if (res.ok) {
        let updatedData: { user?: { name?: string; email?: string } } = {};
        try {
          // Intentar parsear JSON normalmente
          updatedData = await res.json();
        } catch {
          // Si el body está vacío o no es JSON, leer como texto para depuración
          const text = await res.text();
          console.warn("⚠️ Respuesta vacía o no-JSON desde /api/perfil:", text);
        }

        // SINCRONIZACIÓN AUTOMÁTICA: Actualizar la sesión inmediatamente
        const updatedSession = await update({
          ...session,
          user: {
            ...session?.user,
            name: updatedData.user?.name || name,
            email: updatedData.user?.email || email,
          },
        });

        console.log("Sesión actualizada:", updatedSession);

        // Disparar evento personalizado para notificar otros componentes
        window.dispatchEvent(
          new CustomEvent("profileUpdated", {
            detail: { user: updatedData.user },
          })
        );

        // No forzar reload: confiamos en update() y en el evento `profileUpdated`

        setSuccess(true);

        // Limpiar mensaje de éxito después de 3 segundos
        setTimeout(() => {
          setSuccess(false);
        }, 3000);
      } else {
        let errorMsg = "Error al actualizar perfil";
        try {
          const errorData = await res.json();
          errorMsg = errorData.error || errorMsg;
        } catch {
          const text = await res.text();
          console.warn(
            "⚠️ Respuesta de error no JSON desde /api/perfil:",
            text
          );
          if (text) errorMsg = text;
        }

        setError(errorMsg);

        // Limpiar mensaje de error después de 5 segundos
        setTimeout(() => {
          setError("");
        }, 5000);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      setError("Error de conexión con el servidor");

      // Limpiar mensaje de error después de 5 segundos
      setTimeout(() => {
        setError("");
      }, 5000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <MotionForm
      onSubmit={handleSubmit}
      className="space-y-6 mt-4 relative"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-[#8a2be2]/5 to-[#00ffff]/5 rounded-xl blur-md -z-10" />

      <div className="relative">
        <motion.label
          className="block text-[#8a2be2] mb-2 font-medium pl-1"
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          Tu Nombre
        </motion.label>
        <motion.div
          className="relative"
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ingresa tu nuevo nombre"
            className="w-full bg-[#0f1122]/70 backdrop-blur-sm border border-[#8a2be2]/40 focus:border-[#8a2be2] rounded-xl py-3 px-4 text-[#e2e8f0] placeholder-[#8a2be2]/60 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#8a2be2]/30"
            disabled={loading}
          />
          <div className="absolute inset-0 border border-[#8a2be2]/20 rounded-xl pointer-events-none" />
        </motion.div>
      </div>

      {/* Campo de email (solo lectura para mostrar el email actual) */}
      <div className="relative">
        <motion.label
          className="block text-[#00ffff] mb-2 font-medium pl-1"
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          Email Actual
        </motion.label>
        <motion.div
          className="relative"
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <input
            type="email"
            value={email}
            readOnly
            className="w-full bg-[#0f1122]/40 backdrop-blur-sm border border-[#00ffff]/20 rounded-xl py-3 px-4 text-[#e2e8f0]/60 cursor-not-allowed"
          />
          <div className="absolute inset-0 border border-[#00ffff]/10 rounded-xl pointer-events-none" />
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <span className="text-xs text-[#00ffff]/60 bg-[#0f1122]/80 px-2 py-1 rounded">
              Solo lectura
            </span>
          </div>
        </motion.div>
      </div>

      {error && (
        <motion.div
          className="p-4 bg-gradient-to-r from-red-500/10 to-pink-500/10 border border-red-400/30 rounded-xl text-red-300 text-center backdrop-blur-sm"
          initial={{ scale: 0.9, opacity: 0, y: -10 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: -10 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        >
          <div className="flex items-center justify-center gap-2">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 0.5, repeat: 3 }}
            >
              ⚠️
            </motion.div>
            <span>{error}</span>
          </div>
        </motion.div>
      )}

      {success && (
        <motion.div
          className="p-4 bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-400/30 rounded-xl text-green-300 text-center backdrop-blur-sm"
          initial={{ scale: 0.9, opacity: 0, y: -10 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: -10 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        >
          <div className="flex items-center justify-center gap-3">
            <motion.div
              className="w-5 h-5 rounded-full bg-green-400"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [1, 0.7, 1],
              }}
              transition={{
                duration: 1,
                repeat: 3,
                ease: "easeInOut",
              }}
            />
            <span className="font-medium">
              ¡Tu perfil ha sido actualizado exitosamente!
            </span>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, ease: "linear" }}
            >
              ✨
            </motion.div>
          </div>
        </motion.div>
      )}

      {/* Indicador de cambios pendientes */}
      {session?.user?.name !== name && name.trim() !== "" && (
        <motion.div
          className="p-3 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-400/30 rounded-lg text-yellow-300 text-center backdrop-blur-sm"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
        >
          <div className="flex items-center justify-center gap-2">
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              🔄
            </motion.div>
            <span className="text-sm">Tienes cambios sin guardar</span>
          </div>
        </motion.div>
      )}

      <motion.div
        className="pt-4"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <button
          type="submit"
          disabled={
            loading || name.trim() === "" || session?.user?.name === name
          }
          className={`
              w-full py-3.5 rounded-xl font-bold text-white relative overflow-hidden transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]
              ${
                loading
                  ? "bg-[#8a2be2]/60 cursor-not-allowed"
                  : name.trim() === "" || session?.user?.name === name
                    ? "bg-gradient-to-r from-gray-600 to-gray-700 cursor-not-allowed opacity-50"
                    : "bg-gradient-to-r from-[#8a2be2] to-[#00aaff] hover:from-[#9a3bf2] hover:to-[#10baff] shadow-lg shadow-[#8a2be2]/30 hover:shadow-[#8a2be2]/50"
              }
            `}
        >
          {!loading && session?.user?.name !== name && name.trim() !== "" && (
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-white/20 via-transparent to-white/20"
              initial={{ x: "-100%" }}
              animate={{ x: "100%" }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          )}

          <span className="relative z-10 flex items-center justify-center gap-2">
            {loading ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-5 h-5 rounded-full border-2 border-white border-r-transparent"
                />
                <span>Sincronizando en el multiverso...</span>
              </>
            ) : session?.user?.name === name ? (
              <>
                <span>✅ Perfil Actualizado</span>
              </>
            ) : name.trim() === "" ? (
              <>
                <span>⚠️ Ingresa tu nombre</span>
              </>
            ) : (
              <>
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  🚀
                </motion.div>
                <span>Guardar Cambios</span>
              </>
            )}
          </span>
        </button>
      </motion.div>

      <motion.div
        className="text-center space-y-2 pt-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
      >
        <p className="text-[#a0aec0]/70 text-sm">
          Tu información será sincronizada en todos los planos dimensionales
        </p>
        {session?.user?.name && (
          <motion.p
            className="text-[#8a2be2]/60 text-xs"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            Actualmente registrado como:{" "}
            <span className="text-[#00ffff] font-medium">
              {session.user.name}
            </span>
          </motion.p>
        )}
      </motion.div>
    </MotionForm>
  );
}
