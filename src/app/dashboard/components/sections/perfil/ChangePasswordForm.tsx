"use client";

import { useState, useRef, useEffect } from "react";

export default function ChangePasswordForm() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsVisible(true);
  }, []); 

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch("/api/perfil/password", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ currentPassword, newPassword }),
    });
    setLoading(false);
    if (res.ok) {
      alert("Contraseña actualizada correctamente");
      setCurrentPassword("");
      setNewPassword("");
    } else {
      const data = await res.json();
      alert(data.error || "Error al cambiar contraseña");
    }
  };

  return (
    <div 
      ref={containerRef}
      className={`max-w-md w-full mx-auto p-6 transition-all duration-1000 ease-out ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      }`}
    >
      <div className="bg-gradient-to-br from-indigo-900/70 to-purple-900/70 backdrop-blur-xl rounded-2xl p-8 border border-white/10 shadow-2xl shadow-purple-900/30">
        <div className="flex items-center justify-center mb-8">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-1 rounded-full">
            <div className="bg-gray-900 rounded-full p-3">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-8 w-8 text-blue-400" 
                viewBox="0 0 20 20" 
                fill="currentColor"
              >
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
          <h1 className="ml-4 text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
            Cambio de Contraseña
          </h1>
        </div>

        <p className="text-gray-300 text-center mb-8">
          Protege tu cuenta con una nueva contraseña segura
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <input
              type="password"
              placeholder="Contraseña actual"
              value={currentPassword}
              onChange={e => setCurrentPassword(e.target.value)}
              className="w-full px-5 py-4 bg-gray-800/60 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-white transition-all duration-300 placeholder-gray-500"
              required
            />
            <div className="absolute inset-0 rounded-xl border border-blue-500/30 pointer-events-none opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
          </div>

          <div className="relative">
            <input
              type="password"
              placeholder="Nueva contraseña"
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              className="w-full px-5 py-4 bg-gray-800/60 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 text-white transition-all duration-300 placeholder-gray-500"
              required
            />
            <div className="absolute inset-0 rounded-xl border border-purple-500/30 pointer-events-none opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 px-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 rounded-xl font-bold text-white transition-all duration-300 transform hover:scale-[1.02] shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Procesando...
              </>
            ) : (
              <>
                Cambiar contraseña
                <svg xmlns="http://www.w3.org/2000/svg" className="ml-2 h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
              </>
            )}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-800">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-gray-400">
                Usa una combinación de letras, números y símbolos para mayor seguridad.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}