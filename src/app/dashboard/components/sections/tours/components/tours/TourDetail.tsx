"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Tour } from "../../../../../../../data/toursData";
import { FaRocket, FaCheckCircle } from "react-icons/fa";
import emailjs from "@emailjs/browser";
import toast from "react-hot-toast";
import ReservationModal from "./ReservationModal";
import { ReservationFormData } from "./ReservationForm/types";
import Image from "next/image";

type Props = {
  tour: Tour;
  onBack?: () => void;
};

export default function TourDetail({ tour }: Props) {
  const [formData, setFormData] = useState<ReservationFormData>({
    nombre: "",
    correo: "",
    fecha: "",
    telefono: "",
    cantidadAdultos: 1,
    cantidadNinos: 0,
    adultos: [{ nombre: "", tipoDocumento: "", numeroDocumento: "" }],
    ninos: [],
    contactoEmergencia: { nombre: "", telefono: "" },
  });
  const [activeImage, setActiveImage] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [showWhatsApp, setShowWhatsApp] = useState(false);
  const [availableDates, setAvailableDates] = useState<Date[]>([]);

  const formRef = useRef<HTMLFormElement>(null!);

  // Generar fechas disponibles localmente
  useEffect(() => {
    const generateAvailableDates = () => {
      const dates: Date[] = [];
      const today = new Date();

      for (let i = 1; i <= 60; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);

        if (date.getDay() !== 0 && date.getDay() !== 6) {
          dates.push(date);
        }
      }
      setAvailableDates(dates);
    };

    generateAvailableDates();
  }, []);

  function validateForm() {
    const n = formData.nombre.trim();
    const c = formData.correo.trim();
    const p = formData.telefono.trim();
    let ok = true;

    if (!/^[a-zA-ZÀ-ÿ\s]{2,}$/.test(n)) {
      toast.error("Nombre inválido");
      ok = false;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(c)) {
      toast.error("Correo inválido");
      ok = false;
    }

    // Validación actualizada para teléfono con código de país
    if (p) {
      // Regex para formato: +código números (ej: +57 1234567890)
      const phoneRegex = /^\+\d{1,4}\s\d{7,15}$/;

      if (!phoneRegex.test(p)) {
        toast.error("Formato de teléfono inválido");
        ok = false;
      } else {
        // Extraer solo los números del teléfono (sin código de país)
        const phoneNumbers = p.split(" ")[1];
        if (
          !phoneNumbers ||
          phoneNumbers.length < 7 ||
          phoneNumbers.length > 15
        ) {
          toast.error("Número de teléfono debe tener entre 7 y 15 dígitos");
          ok = false;
        }
      }
    } else {
      toast.error("Teléfono es requerido");
      ok = false;
    }

    return ok;
  }

  async function sendEmail(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!validateForm() || isSubmitting || hasSubmitted) return;
    setIsSubmitting(true);
    setHasSubmitted(true);

    try {
      await emailjs.sendForm(
        "service_48b978l",
        "template_uk4drlm",
        formRef.current!,
        "Bl8NYZsWuRuNA-Jbi"
      );

      const precio =
        typeof tour.precio === "number"
          ? tour.precio
          : Number(tour.precio) || 0;

      const reserva = {
        tourName: tour.nombre,
        date: formData.fecha || "",
        amount: precio,
        reference: Date.now().toString(),
        email: formData.correo,
      };
      localStorage.setItem("last_reservation", JSON.stringify(reserva));

      toast.success("Información recopilada correctamente");
      setShowWhatsApp(true);
      setIsSubmitting(false);
    } catch (error) {
      console.error(error);
      toast.error("Error procesando información");
      setIsSubmitting(false);
      setHasSubmitted(false);
    }
  }

  // Animaciones
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const tourAsRecord = tour as unknown as Record<string, unknown>;
  const caracteristicas: unknown[] = Array.isArray(tourAsRecord.caracteristicas)
    ? (tourAsRecord.caracteristicas as unknown[])
    : [];

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Background Particles */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(25)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-gradient-to-r from-cyan-400/8 to-purple-500/8 backdrop-blur-sm"
            initial={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              width: `${Math.random() * 4 + 3}px`,
              height: `${Math.random() * 4 + 3}px`,
              opacity: 0,
            }}
            animate={{
              opacity: [0, 0.6, 0],
              scale: [0.8, 1.2, 0.8],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: Math.random() * 8 + 6,
              repeat: Infinity,
              delay: Math.random() * 4,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        {/* Header Section */}
        <motion.header
          className="mb-8 lg:mb-12"
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="space-y-4">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-500 bg-clip-text text-transparent leading-tight">
                {tour.nombre}
              </h1>

              <div className="flex items-center gap-3">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-400/30 rounded-full backdrop-blur-sm">
                  <FaRocket className="text-cyan-400 text-sm" />
                  <span className="text-cyan-100 text-sm font-medium">
                    {tour.duracion}
                  </span>
                </div>
              </div>
            </div>

            <div className="text-center lg:text-right">
              <p className="text-slate-400 text-sm mb-1">Desde</p>
              <div className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                {tour.precio}
              </div>
            </div>
          </div>
        </motion.header>

        {/* Hero Image Section */}
        <motion.section
          className="mb-10 lg:mb-16"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <div className="relative h-72 sm:h-96 lg:h-[500px] rounded-2xl lg:rounded-3xl overflow-hidden border border-cyan-400/20 shadow-2xl shadow-cyan-500/10">
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent z-10" />

            {tour.fotos?.[activeImage] && (
              <Image
                src={tour.fotos[activeImage]}
                alt={`Vista principal del tour ${tour.nombre}`}
                fill
                className="object-cover transition-transform duration-700 hover:scale-105"
                priority
              />
            )}

            {/* Image Navigation */}
            {tour.fotos && tour.fotos.length > 1 && (
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20">
                <div className="flex gap-2 p-2 bg-slate-900/60 backdrop-blur-md rounded-xl border border-slate-700/50">
                  {tour.fotos.map((foto, index) => (
                    <button
                      key={index}
                      onClick={() => setActiveImage(index)}
                      className={`relative w-12 h-12 sm:w-16 sm:h-16 rounded-lg overflow-hidden border-2 transition-all duration-300 ${
                        index === activeImage
                          ? "border-cyan-400 scale-110 shadow-lg shadow-cyan-400/50"
                          : "border-slate-600 opacity-70 hover:opacity-100 hover:border-slate-500"
                      }`}
                    >
                      <Image
                        src={foto}
                        alt={`Vista ${index + 1} del tour`}
                        fill
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.section>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Tour Information */}
          <motion.div
            className="lg:col-span-2 space-y-8 lg:space-y-12"
            variants={container}
            initial="hidden"
            animate="show"
          >
            {/* Description */}
            <motion.section variants={item} className="space-y-4">
              <h2 className="text-xl lg:text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                Descripción de la experiencia
              </h2>
              <div className="prose prose-invert max-w-none">
                <p className="text-slate-300 leading-relaxed text-base lg:text-lg">
                  {tour.descripcion}
                </p>
              </div>
            </motion.section>

            {/* Includes */}
            <motion.section variants={item} className="space-y-6">
              <h2 className="text-xl lg:text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                Lo que incluye tu aventura
              </h2>
              <div className="grid gap-3 sm:gap-4">
                {tour.incluido.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-3 lg:p-4 bg-slate-800/50 border border-slate-700/50 rounded-xl backdrop-blur-sm hover:bg-slate-800/70 transition-colors duration-300"
                  >
                    <FaCheckCircle className="text-cyan-400 mt-1 flex-shrink-0" />
                    <span className="text-slate-300 text-sm lg:text-base">
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </motion.section>

            {/* Features */}
            {caracteristicas.length > 0 && (
              <motion.section variants={item} className="space-y-6">
                <h2 className="text-xl lg:text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                  Características destacadas
                </h2>
                <div className="flex flex-wrap gap-3">
                  {caracteristicas.map((caracteristica, i) => (
                    <span
                      key={i}
                      className="px-4 py-2 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border border-cyan-400/30 text-cyan-300 rounded-full text-sm font-medium backdrop-blur-sm hover:from-cyan-500/20 hover:to-purple-500/20 transition-colors duration-300"
                    >
                      {String(caracteristica)}
                    </span>
                  ))}
                </div>
              </motion.section>
            )}
          </motion.div>

          {/* Reservation Card */}
          <motion.aside
            className="lg:col-span-1"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <div className="sticky top-8">
              <div className="relative p-6 lg:p-8 bg-gradient-to-br from-slate-800/80 to-slate-900/80 border border-cyan-400/20 rounded-2xl shadow-2xl shadow-cyan-500/10 backdrop-blur-sm">
                {/* Card Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-purple-500/5 rounded-2xl" />

                <div className="relative z-10 space-y-6">
                  <div className="text-center space-y-2">
                    <h3 className="text-2xl font-bold text-cyan-400">
                      Reserva tu lugar
                    </h3>
                    <p className="text-slate-400 text-sm">
                      Completa el formulario para iniciar tu reserva
                    </p>
                  </div>

                  <motion.button
                    onClick={() => setShowModal(true)}
                    className="group relative w-full py-4 px-6 bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white font-bold rounded-xl transition-all duration-300 overflow-hidden"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {/* Button Glow */}
                    <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/50 to-purple-500/50 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    <span className="relative z-10 flex items-center justify-center gap-2">
                      Confirmar y continuar a la Reserva
                    </span>
                  </motion.button>

                  <div className="text-center">
                    <p className="text-xs text-slate-500">
                      Tu información está segura con nosotros
                    </p>
                    <p className="text-xs text-slate-500">
                      Reservas 100% protegidas
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.aside>
        </div>
      </div>

      {/* Modal */}
      <ReservationModal
        tour={tour}
        formRef={formRef}
        sendEmail={sendEmail}
        isSubmitting={isSubmitting}
        hasSubmitted={hasSubmitted}
        showModal={showModal}
        setShowModal={setShowModal}
        availableDates={availableDates}
        formData={formData}
        setFormData={setFormData}
        showWhatsApp={showWhatsApp}
        setShowWhatsApp={setShowWhatsApp}
      />
    </div>
  );
}
