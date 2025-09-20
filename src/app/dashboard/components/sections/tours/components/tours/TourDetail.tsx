"use client";

import {
  useState,
  useEffect,
  useRef,
  useMemo,
  lazy,
  Suspense,
  useCallback,
} from "react";
import { motion } from "framer-motion";
import { Tour } from "../../../../../../../data/toursData";
import { FaRocket, FaCheckCircle } from "react-icons/fa";
import emailjs from "@emailjs/browser";
import toast from "react-hot-toast";
import { ReservationFormData } from "./ReservationForm/types";
import Image from "next/image";

// Lazy load del modal pesado
const ReservationModal = lazy(() => import("./ReservationModal"));

type Props = {
  tour: Tour;
  onBack?: () => void;
};

// Configuración de animaciones optimizada para móvil
const getAnimationConfig = (isMobile: boolean) => ({
  container: {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: isMobile ? 0.05 : 0.1,
        duration: isMobile ? 0.3 : 0.5,
      },
    },
  },
  item: {
    hidden: { opacity: 0, y: isMobile ? 10 : 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: isMobile ? 0.3 : 0.5 },
    },
  },
});

// Componente de loading para el modal optimizado
const ModalLoadingSpinner = () => (
  <div className="fixed inset-0 bg-black bg-opacity-95 z-[9999] flex items-center justify-center">
    <div className="w-6 h-6 sm:w-8 sm:h-8 border-t-2 border-cyan-400 rounded-full animate-spin" />
  </div>
);

// Hook para detectar dispositivo móvil
const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();

    let timeoutId: NodeJS.Timeout;
    const debouncedResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(checkMobile, 150);
    };

    window.addEventListener("resize", debouncedResize, { passive: true });
    return () => {
      window.removeEventListener("resize", debouncedResize);
      clearTimeout(timeoutId);
    };
  }, []);

  return isMobile;
};

// Hook para características optimizado
const useTourFeatures = (tour: Tour) => {
  return useMemo(() => {
    const tourAsRecord = tour as unknown as Record<string, unknown>;
    return Array.isArray(tourAsRecord.caracteristicas)
      ? (tourAsRecord.caracteristicas as unknown[])
      : [];
  }, [tour]);
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
  const isMobile = useIsMobile();
  const caracteristicas = useTourFeatures(tour);
  const ANIMATION_CONFIG = getAnimationConfig(isMobile);

  // Generar fechas disponibles optimizado
  useEffect(() => {
    const generateAvailableDates = () => {
      const dates: Date[] = [];
      const today = new Date();
      const endDate = new Date(today.getTime() + 60 * 24 * 60 * 60 * 1000); // 60 días

      for (
        let date = new Date(today.getTime() + 24 * 60 * 60 * 1000);
        date <= endDate;
        date.setDate(date.getDate() + 1)
      ) {
        if (date.getDay() !== 0 && date.getDay() !== 6) {
          // No domingos ni sábados
          dates.push(new Date(date));
        }
      }
      setAvailableDates(dates);
    };

    // Usar requestIdleCallback si está disponible
    if ("requestIdleCallback" in window) {
      (
        window as typeof window & {
          requestIdleCallback: (callback: () => void) => void;
        }
      ).requestIdleCallback(generateAvailableDates);
    } else {
      setTimeout(generateAvailableDates, 0);
    }
  }, []);

  // Validación de formulario optimizada
  const validateForm = useCallback(() => {
    const { nombre, correo, telefono } = formData;
    const n = nombre.trim();
    const c = correo.trim();
    const p = telefono.trim();

    if (!/^[a-zA-ZÀ-ÿ\s]{2,}$/.test(n)) {
      toast.error("Nombre inválido");
      return false;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(c)) {
      toast.error("Correo inválido");
      return false;
    }

    if (p) {
      const phoneRegex = /^\+\d{1,4}\s\d{7,15}$/;
      if (!phoneRegex.test(p)) {
        toast.error("Formato de teléfono inválido");
        return false;
      }
      const phoneNumbers = p.split(" ")[1];
      if (
        !phoneNumbers ||
        phoneNumbers.length < 7 ||
        phoneNumbers.length > 15
      ) {
        toast.error("Número de teléfono debe tener entre 7 y 15 dígitos");
        return false;
      }
    } else {
      toast.error("Teléfono es requerido");
      return false;
    }

    return true;
  }, [formData]);

  const sendEmail = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
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

        try {
          localStorage.setItem("last_reservation", JSON.stringify(reserva));
        } catch {
          // Ignorar error de localStorage en modo incógnito
        }

        toast.success("Información recopilada correctamente");
        setShowWhatsApp(true);
        setIsSubmitting(false);
      } catch (error) {
        console.error(error);
        toast.error("Error procesando información");
        setIsSubmitting(false);
        setHasSubmitted(false);
      }
    },
    [
      validateForm,
      isSubmitting,
      hasSubmitted,
      tour.precio,
      tour.nombre,
      formData.fecha,
      formData.correo,
    ]
  );

  // Handler optimizado para cambio de imagen
  const handleImageChange = useCallback((index: number) => {
    setActiveImage(index);
  }, []);

  // Handler optimizado para modal
  const handleShowModal = useCallback(() => {
    setShowModal(true);
  }, []);

  // Reducir partículas en móvil para mejor rendimiento
  const particleCount = isMobile ? 8 : 15;

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Background Particles optimizadas */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(particleCount)].map((_, i) => (
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
              duration: Math.random() * (isMobile ? 6 : 8) + (isMobile ? 4 : 6),
              repeat: Infinity,
              delay: Math.random() * 4,
              ease: "easeInOut",
            }}
            style={{
              contain: "layout style paint",
              willChange: "transform, opacity",
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-8 lg:py-12">
        {/* Header Section */}
        <motion.header
          className="mb-6 sm:mb-8 lg:mb-12"
          initial={{ opacity: 0, y: isMobile ? -20 : -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: isMobile ? 0.4 : 0.6, ease: "easeOut" }}
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 sm:gap-6">
            <div className="space-y-3 sm:space-y-4">
              <h1 className="text-2xl sm:text-3xl lg:text-5xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-500 bg-clip-text text-transparent leading-tight">
                {tour.nombre}
              </h1>

              <div className="flex items-center gap-2 sm:gap-3">
                <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-400/30 rounded-full backdrop-blur-sm">
                  <FaRocket className="text-cyan-400 text-xs sm:text-sm" />
                  <span className="text-cyan-100 text-xs sm:text-sm font-medium">
                    {tour.duracion}
                  </span>
                </div>
              </div>
            </div>

            <div className="text-center lg:text-right">
              <p className="text-slate-400 text-xs sm:text-sm mb-1">Desde</p>
              <div className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                {tour.precio}
              </div>
            </div>
          </div>
        </motion.header>

        {/* Hero Image Section optimizado para móvil */}
        <motion.section
          className="mb-6 sm:mb-10 lg:mb-16"
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: isMobile ? 0.5 : 0.8, ease: "easeOut" }}
        >
          <div className="relative h-48 sm:h-72 lg:h-[500px] rounded-xl lg:rounded-3xl overflow-hidden border border-cyan-400/20 shadow-2xl shadow-cyan-500/10">
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent z-10" />

            {tour.fotos?.[activeImage] && (
              <Image
                src={tour.fotos[activeImage]}
                alt={`Vista principal del tour ${tour.nombre}`}
                fill
                className="object-cover transition-transform duration-500 hover:scale-105"
                priority={activeImage === 0}
                loading={activeImage === 0 ? "eager" : "lazy"}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
                style={{
                  contain: "layout style paint",
                  willChange: "transform",
                }}
              />
            )}

            {/* Image Navigation optimizado para touch - Solo mostrar si hay múltiples imágenes */}
            {tour.fotos && tour.fotos.length > 1 && (
              <div className="absolute bottom-2 sm:bottom-4 left-1/2 transform -translate-x-1/2 z-20">
                <div className="flex gap-1 sm:gap-2 p-1.5 sm:p-2 bg-slate-900/60 backdrop-blur-md rounded-xl border border-slate-700/50">
                  {tour.fotos.map((foto, index) => (
                    <button
                      key={`thumb-${index}`}
                      onClick={() => handleImageChange(index)}
                      className={`relative w-8 h-8 sm:w-12 sm:h-12 lg:w-16 lg:h-16 rounded-lg overflow-hidden border-2 transition-all duration-300 touch-manipulation ${
                        index === activeImage
                          ? "border-cyan-400 scale-110 shadow-lg shadow-cyan-400/50"
                          : "border-slate-600 opacity-70 hover:opacity-100 hover:border-slate-500 active:opacity-100 active:scale-105"
                      }`}
                      style={{
                        WebkitTapHighlightColor: "transparent",
                        contain: "layout style paint",
                      }}
                    >
                      <Image
                        src={foto}
                        alt={`Vista ${index + 1} del tour`}
                        fill
                        className="object-cover"
                        sizes="64px"
                        loading="lazy"
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.section>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-12">
          {/* Tour Information */}
          <motion.div
            className="lg:col-span-2 space-y-6 sm:space-y-8 lg:space-y-12"
            variants={ANIMATION_CONFIG.container}
            initial="hidden"
            animate="show"
          >
            {/* Description */}
            <motion.section
              variants={ANIMATION_CONFIG.item}
              className="space-y-3 sm:space-y-4"
            >
              <h2 className="text-lg sm:text-xl lg:text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                Descripción de la experiencia
              </h2>
              <div className="prose prose-invert max-w-none">
                <p className="text-slate-300 leading-relaxed text-sm sm:text-base lg:text-lg">
                  {tour.descripcion}
                </p>
              </div>
            </motion.section>

            {/* Includes */}
            <motion.section
              variants={ANIMATION_CONFIG.item}
              className="space-y-4 sm:space-y-6"
            >
              <h2 className="text-lg sm:text-xl lg:text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                Lo que incluye tu aventura
              </h2>
              <div className="grid gap-2 sm:gap-3">
                {tour.incluido.map((item, index) => (
                  <div
                    key={`include-${index}`}
                    className="flex items-start gap-2 sm:gap-3 p-2.5 sm:p-3 lg:p-4 bg-slate-800/50 border border-slate-700/50 rounded-xl backdrop-blur-sm hover:bg-slate-800/70 transition-colors duration-300"
                    style={{ contain: "layout style paint" }}
                  >
                    <FaCheckCircle className="text-cyan-400 mt-0.5 sm:mt-1 flex-shrink-0 text-sm sm:text-base" />
                    <span className="text-slate-300 text-xs sm:text-sm lg:text-base">
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </motion.section>

            {/* Features */}
            {caracteristicas.length > 0 && (
              <motion.section
                variants={ANIMATION_CONFIG.item}
                className="space-y-4 sm:space-y-6"
              >
                <h2 className="text-lg sm:text-xl lg:text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                  Características destacadas
                </h2>
                <div className="flex flex-wrap gap-2 sm:gap-3">
                  {caracteristicas.map((caracteristica, i) => (
                    <span
                      key={`feature-${i}`}
                      className="px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border border-cyan-400/30 text-cyan-300 rounded-full text-xs sm:text-sm font-medium backdrop-blur-sm hover:from-cyan-500/20 hover:to-purple-500/20 transition-colors duration-300"
                      style={{ contain: "layout style paint" }}
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
            initial={{ opacity: 0, x: isMobile ? 0 : 50, y: isMobile ? 30 : 0 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{ duration: isMobile ? 0.4 : 0.6, delay: 0.2 }}
          >
            <div className={isMobile ? "" : "sticky top-8"}>
              <div className="relative p-4 sm:p-6 lg:p-8 bg-gradient-to-br from-slate-800/80 to-slate-900/80 border border-cyan-400/20 rounded-2xl shadow-2xl shadow-cyan-500/10 backdrop-blur-sm">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-purple-500/5 rounded-2xl" />

                <div className="relative z-10 space-y-4 sm:space-y-6">
                  <div className="text-center space-y-2">
                    <h3 className="text-xl sm:text-2xl font-bold text-cyan-400">
                      Reserva tu lugar
                    </h3>
                    <p className="text-slate-400 text-xs sm:text-sm">
                      Completa el formulario para iniciar tu reserva
                    </p>
                  </div>

                  <motion.button
                    onClick={handleShowModal}
                    className="group relative w-full py-3 sm:py-4 px-4 sm:px-6 bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 active:from-cyan-700 active:to-purple-700 text-white font-bold rounded-xl transition-all duration-300 overflow-hidden touch-manipulation"
                    whileHover={isMobile ? {} : { scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    style={{
                      WebkitTapHighlightColor: "transparent",
                      contain: "layout style paint",
                    }}
                  >
                    <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/50 to-purple-500/50 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    <span className="relative z-10 flex items-center justify-center gap-2 text-sm sm:text-base">
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

      {/* Modal con Lazy Loading */}
      <Suspense fallback={<ModalLoadingSpinner />}>
        {showModal && (
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
        )}
      </Suspense>
    </div>
  );
}
