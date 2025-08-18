"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { loadStripe } from "@stripe/stripe-js";
import { Tour } from "../../../../../data/toursData";
import {
  FaCalendarAlt,
  FaUserAlt,
  FaEnvelope,
  FaRocket,
  FaCheckCircle,
  FaSpinner,
} from "react-icons/fa";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

export default function TourDetail({ tour }: { tour: Tour }) {
  const [formData, setFormData] = useState({
    nombre: "",
    correo: "",
    fecha: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [fechasDisponibles, setFechasDisponibles] = useState<string[]>([]);
  const [activeImage, setActiveImage] = useState(0);

  // Consultar disponibilidad de fechas
  useEffect(() => {
    const fetchFechasDisponibles = async () => {
      try {
        const res = await fetch(`/api/guias/fechas?tourId=${tour.id}`);
        if (!res.ok) {
          throw new Error(`Error ${res.status}: ${res.statusText}`);
        }
        const data = await res.json();
        setFechasDisponibles(data.fechas || []);
      } catch (error) {
        console.error("Error al obtener fechas disponibles:", error);
      }
    };
    fetchFechasDisponibles();
  }, [tour.id]);

  const validateForm = () => {
    if (!formData.nombre.trim()) return "El nombre es obligatorio.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.correo))
      return "Correo inválido.";
    if (
      !formData.fecha ||
      new Date(formData.fecha).getTime() < new Date().setHours(0, 0, 0, 0)
    )
      return "Fecha inválida.";
    return null;
  };

  const handleCheckout = async () => {
    const error = validateForm();
    if (error) {
      window.alert(error);
      return;
    }

    setIsLoading(true);
    try {
      const stripe = await stripePromise;
      const res = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tour,
          reserva: formData,
        }),
      });

      if (!res.ok) throw new Error("Error al crear la sesión de pago.");

      const data = await res.json();
      await stripe?.redirectToCheckout({ sessionId: data.id });
    } catch (error) {
      console.error(error);
      window.alert("Hubo un problema al procesar tu pago. Intenta nuevamente.");
    } finally {
      setIsLoading(false);
    }
  };

  // Animaciones
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <div className="relative min-h-screen py-12 px-4 bg-gradient-to-br from-[#0c0f1d] via-[#151b35] to-[#0c0f1d]">
      {/* Efecto de partículas galácticas */}
      <div className="fixed inset-0 overflow-hidden -z-10">
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
      </div>

      <div className="max-w-5xl mx-auto">
        {/* Cabecera con título y precio */}
        <motion.div
          className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500 mb-2">
              {tour.nombre}
            </h1>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 bg-gradient-to-r from-cyan-600 to-purple-600 text-white text-sm px-3 py-1 rounded-full">
                <FaRocket className="text-cyan-300" />
                <span>{tour.duracion}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-end">
            <span className="text-gray-400 text-sm">Desde</span>
            <span className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-500">
              {tour.precio}
            </span>
          </div>
        </motion.div>

        {/* Imagen principal */}
        <motion.div
          className="relative h-96 rounded-2xl overflow-hidden mb-10 border-2 border-cyan-500/30 shadow-xl shadow-cyan-500/10"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-[#0c0f1d] via-transparent to-transparent z-10"></div>
          <img
            src={tour.fotos?.[activeImage]}
            alt={`Imagen principal del tour ${tour.nombre}`}
            className="w-full h-full object-cover"
          />

          {/* Miniaturas */}
          <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-20">
            {tour.fotos?.map((foto, index) => (
              <button
                key={index}
                onClick={() => setActiveImage(index)}
                className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-all duration-300 ${
                  index === activeImage
                    ? "border-cyan-400 scale-110 shadow-lg shadow-cyan-500/50"
                    : "border-gray-700 opacity-70 hover:opacity-100"
                }`}
              >
                <img
                  src={foto}
                  alt={`Miniatura ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Información del tour */}
          <motion.div variants={container} initial="hidden" animate="show">
            <motion.div variants={item}>
              <h2 className="text-xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-400">
                Descripción de la experiencia
              </h2>
              <p className="text-gray-300 mb-8 leading-relaxed">
                {tour.descripcion}
              </p>
            </motion.div>

            <motion.div variants={item}>
              <h2 className="text-xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-400">
                Lo que incluye tu aventura
              </h2>
              <ul className="space-y-3">
                {tour.incluido.map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <FaCheckCircle className="text-cyan-400 mt-1 flex-shrink-0" />
                    <span className="text-gray-300">{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div variants={item} className="mt-8">
              <h2 className="text-xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-400">
                Características destacadas
              </h2>
              <div className="flex flex-wrap gap-2">
                {tour.caracteristicas?.map((caracteristica, i) => (
                  <span
                    key={i}
                    className="px-3 py-2 bg-cyan-900/30 text-cyan-300 rounded-lg border border-cyan-500/30"
                  >
                    {caracteristica}
                  </span>
                ))}
              </div>
            </motion.div>
          </motion.div>

          {/* Formulario de reserva */}
          <motion.div
            className="bg-gradient-to-br from-[#0f172a]/80 to-[#1e293b]/80 rounded-2xl p-6 border border-cyan-500/30 shadow-xl shadow-cyan-500/10 backdrop-blur-sm"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-2xl blur-xl opacity-30"></div>

              <div className="relative z-10">
                <h3 className="text-2xl font-bold mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-400">
                  Reserva tu viaje
                </h3>

                <div className="space-y-5">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-cyan-400">
                      <FaUserAlt />
                    </div>
                    <input
                      type="text"
                      placeholder="Nombre completo"
                      value={formData.nombre}
                      onChange={(e) =>
                        setFormData({ ...formData, nombre: e.target.value })
                      }
                      className="w-full pl-10 pr-4 py-3 bg-gray-900/70 border border-cyan-500/30 rounded-lg text-cyan-100 placeholder:text-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all"
                      aria-label="Nombre completo"
                    />
                  </div>

                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-cyan-400">
                      <FaEnvelope />
                    </div>
                    <input
                      type="email"
                      placeholder="Correo electrónico"
                      value={formData.correo}
                      onChange={(e) =>
                        setFormData({ ...formData, correo: e.target.value })
                      }
                      className="w-full pl-10 pr-4 py-3 bg-gray-900/70 border border-cyan-500/30 rounded-lg text-cyan-100 placeholder:text-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all"
                      aria-label="Correo electrónico"
                    />
                  </div>

                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-cyan-400">
                      <FaCalendarAlt />
                    </div>
                    <input
                      type="date"
                      value={formData.fecha}
                      onChange={(e) =>
                        setFormData({ ...formData, fecha: e.target.value })
                      }
                      className="w-full pl-10 pr-4 py-3 bg-gray-900/70 border border-cyan-500/30 rounded-lg text-cyan-100 placeholder:text-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all"
                      aria-label="Fecha de reserva"
                      min={new Date().toISOString().split("T")[0]}
                    />

                    <AnimatePresence>
                      {formData.fecha && (
                        <motion.div
                          className="mt-2 text-sm flex items-center gap-2"
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                        >
                          {fechasDisponibles.includes(formData.fecha) ? (
                            <>
                              <FaCheckCircle className="text-cyan-400" />
                              <span className="text-cyan-400">
                                Fecha disponible
                              </span>
                            </>
                          ) : (
                            <>
                              <FaRocket className="text-purple-400" />
                              <span className="text-purple-400">
                                Verificando disponibilidad...
                              </span>
                            </>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <motion.button
                    onClick={handleCheckout}
                    disabled={isLoading}
                    className={`w-full py-4 rounded-xl font-bold relative overflow-hidden group ${
                      isLoading
                        ? "bg-gray-700 cursor-not-allowed"
                        : "bg-gradient-to-r from-cyan-600 to-purple-600"
                    }`}
                    whileHover={!isLoading ? { scale: 1.02 } : {}}
                    whileTap={!isLoading ? { scale: 0.98 } : {}}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="absolute -inset-4 bg-gradient-to-r from-cyan-500/30 to-purple-500/30 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      {isLoading ? (
                        <>
                          <FaSpinner className="animate-spin" /> Procesando tu
                          reserva...
                        </>
                      ) : (
                        "Confirmar y continuar al pago"
                      )}
                    </span>
                  </motion.button>

                  <div className="text-center text-sm text-gray-400 mt-4">
                    Tu información está segura con nosotros. Reservas 100%
                    protegidas.
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
