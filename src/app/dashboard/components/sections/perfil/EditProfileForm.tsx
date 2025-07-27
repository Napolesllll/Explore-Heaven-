"use client";

import { useSession } from "next-auth/react";
import { useState } from "react";
import { motion } from "framer-motion";

export default function EditProfileForm() {
  const { data: session, update } = useSession();
  const [name, setName] = useState(session?.user?.name || "");
  const [email, setEmail] = useState(session?.user?.email || "");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
 
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    setError("");
    
    try {
      const res = await fetch("/api/perfil", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email }),
      });
      
      if (res.ok) {
        await update(); // Actualiza la sesión en NextAuth
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      } else {
        const errorData = await res.json();
        setError(errorData.message || "Error al actualizar perfil");
      }
    } catch (err) {
      setError("Error de conexión con el servidor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.form 
      onSubmit={handleSubmit} 
      className="space-y-6 mt-4 relative"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Efecto de fondo energético */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#8a2be2]/5 to-[#00ffff]/5 rounded-xl blur-md -z-10"></div>
      
      {/* Campo de nombre */}
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
            onChange={e => setName(e.target.value)}
            placeholder="Ingresa tu nuevo nombre"
            className="w-full bg-[#0f1122]/70 backdrop-blur-sm border border-[#8a2be2]/40 focus:border-[#8a2be2] rounded-xl py-3 px-4 text-[#e2e8f0] placeholder-[#8a2be2]/60 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#8a2be2]/30"
            disabled={loading}
          />
          <div className="absolute inset-0 border border-[#8a2be2]/20 rounded-xl pointer-events-none"></div>
        </motion.div>
      </div>
      
      {/* Campo de email */}

      
      {/* Mensajes de estado */}
      {error && (
        <motion.div 
          className="p-3 bg-[#8a2be2]/10 border border-[#ff3860]/40 rounded-lg text-[#ff3860] text-center"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
        >
          ⚠️ {error}
        </motion.div>
      )}
      
      {success && (
        <motion.div 
          className="p-3 bg-[#00ffff]/10 border border-[#00ffaa]/40 rounded-lg text-[#00ffaa] text-center flex items-center justify-center gap-2"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
        >
          <div className="w-4 h-4 rounded-full bg-[#00ffaa] animate-pulse"></div>
          ¡Tu perfil ha sido actualizado!
        </motion.div>
      )}
      
      {/* Botón de guardar */}
      <motion.div 
        className="pt-4"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <button
          type="submit"
          disabled={loading}
          className={`
            w-full py-3.5 rounded-xl font-bold text-white relative overflow-hidden
            ${loading 
              ? 'bg-[#8a2be2]/60 cursor-not-allowed' 
              : 'bg-gradient-to-r from-[#8a2be2] to-[#00aaff] hover:from-[#9a3bf2] hover:to-[#10baff] shadow-lg shadow-[#8a2be2]/30'}
            transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]
          `}
        >
          {/* Efecto de energía */}
          {!loading && (
            <motion.div 
              className="absolute inset-0 bg-gradient-to-r from-white/20 via-transparent to-white/20"
              initial={{ x: "-100%" }}
              animate={{ x: "100%" }}
              transition={{ 
                duration: 1.5, 
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          )}
          
          {/* Contenido del botón */}
          <span className="relative z-10 flex items-center justify-center gap-2">
            {loading ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-5 h-5 rounded-full border-2 border-white border-r-transparent"
                />
                Actualizando tu Perfil...
              </>
            ) : (
              "Guardar Cambios"
            )}
          </span>
        </button>
      </motion.div>
      
      {/* Nota informativa */}
      <motion.p 
        className="text-center text-[#a0aec0]/70 text-sm pt-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
      >
        Tu información será sincronizada en todos los planos 
      </motion.p>
    </motion.form>
  );
}