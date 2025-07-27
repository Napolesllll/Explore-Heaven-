"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { tours } from "../../data/toursData";
import { CheckCircle, Calendar, MapPin, Clock, User, Mail, Phone, Info, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";

import emailjs from "@emailjs/browser";
import toast from "react-hot-toast";

// Plugin mejorado para auto-slide
function AutoSlidePlugin(slider: any) {
  let timeout: any;
  let mouseOver = false;
  const autoplaySpeed = 4000; // Cambia cada 4 segundos
 
  const clearNextTimeout = () => clearTimeout(timeout);

  function nextTimeout() {
    clearTimeout(timeout);
    if (mouseOver) return;
    timeout = setTimeout(() => {
      slider.next();
    }, autoplaySpeed);
  }

  slider.on("created", () => {
    slider.container.addEventListener("mouseover", () => {
      mouseOver = true;
      clearNextTimeout();
    });
    slider.container.addEventListener("mouseout", () => {
      mouseOver = false;
      nextTimeout();
    });
    nextTimeout();
  });

  slider.on("dragStarted", clearNextTimeout);
  slider.on("animationEnded", nextTimeout);
  slider.on("updated", nextTimeout);
  slider.on("destroyed", clearNextTimeout);
}

// Componente de carrusel con autoplay mejorado
function TourImages({ fotos }: { fotos: string[] }) {
  const [sliderRef, sliderInstance] = useKeenSlider<HTMLDivElement>(
    {
      loop: true,
      mode: "free-snap",
      slides: { perView: 1, spacing: 0 },
    },
    [AutoSlidePlugin]
  );

  return (
    <div
      ref={sliderRef}
      className="keen-slider rounded-3xl overflow-hidden h-[300px] sm:h-[450px] shadow-2xl border-4 border-yellow-500/20"
    >
      {fotos.map((foto, index) => (
        <div key={index} className="keen-slider__slide relative h-full">
          <Image
            src={foto}
            alt={`Foto ${index + 1}`}
            fill
            className="object-cover"
            priority={index === 0}
          />
          
          {/* Indicador de posición */}
          <div className="absolute bottom-4 right-4 bg-black/60 px-3 py-1 rounded-full text-xs text-white">
            {index + 1} / {fotos.length}
          </div>
        </div>
      ))}
    </div>
  );
}

// Componente para mostrar detalles del tour
function TourDetails({ tour }: { tour: any }) {
  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 px-6 py-3 rounded-xl inline-block mb-4">
        <h2 className="text-2xl font-bold text-gray-900">{tour.nombre}</h2>
      </div>
      
      <p className="text-gray-300 leading-relaxed italic text-center md:text-left">
        {tour.descripcion}
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
        <div className="flex items-center gap-3 bg-gray-800/50 p-4 rounded-xl">
          <span className="text-yellow-400 font-semibold">💰</span>
          <div>
            <p className="text-gray-400 text-sm">Precio</p>
            <p className="text-white font-medium">{tour.precio}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3 bg-gray-800/50 p-4 rounded-xl">
          <span className="text-yellow-400 font-semibold">🕐</span>
          <div>
            <p className="text-gray-400 text-sm">Salida</p>
            <p className="text-white font-medium">{tour.salida}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3 bg-gray-800/50 p-4 rounded-xl">
          <span className="text-yellow-400 font-semibold">🔁</span>
          <div>
            <p className="text-gray-400 text-sm">Regreso</p>
            <p className="text-white font-medium">{tour.regreso}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3 bg-gray-800/50 p-4 rounded-xl">
          <span className="text-yellow-400 font-semibold">⏳</span>
          <div>
            <p className="text-gray-400 text-sm">Duración</p>
            <p className="text-white font-medium">{tour.duracion}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Componente para detalles de inclusión (ocupa todo el ancho)
function InclusionDetails({ tour }: { tour: any }) {
  return (
    <div className="pt-6 grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
      <div className="bg-gray-800/50 p-5 rounded-2xl">
        <h3 className="font-bold text-yellow-400 mb-3 flex items-center gap-2">
          <CheckCircle className="w-5 h-5" />
          Incluye
        </h3>
        <ul className="space-y-2">
          {tour.incluido.map((item: string, index: number) => (
            <li key={index} className="flex items-start">
              <div className="w-2 h-2 rounded-full bg-yellow-500 mt-2 mr-2 flex-shrink-0"></div>
              <span className="text-gray-300">{item}</span>
            </li>
          ))}
        </ul>
      </div>
      
      <div className="bg-gray-800/50 p-5 rounded-2xl">
        <h3 className="font-bold text-yellow-400 mb-3 flex items-center gap-2">
          <X className="w-5 h-5" />
          No incluye
        </h3>
        <ul className="space-y-2">
          {tour.noIncluido.map((item: string, index: number) => (
            <li key={index} className="flex items-start">
              <div className="w-2 h-2 rounded-full bg-red-500 mt-2 mr-2 flex-shrink-0"></div>
              <span className="text-gray-300">{item}</span>
            </li>
          ))}
        </ul>
      </div>
      
      <div className="bg-gray-800/50 p-5 rounded-2xl">
        <h3 className="font-bold text-yellow-400 mb-3 flex items-center gap-2">
          <Info className="w-5 h-5" />
          Recomendaciones
        </h3>
        <ul className="space-y-2">
          {tour.outfit.map((item: string, index: number) => (
            <li key={index} className="flex items-start">
              <div className="w-2 h-2 rounded-full bg-emerald-500 mt-2 mr-2 flex-shrink-0"></div>
              <span className="text-gray-300">{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

// Componente para el formulario de reserva
function ReservationForm({
  tour,
  formRef,
  errors,
  validateForm,
  sendEmail,
  isSubmitting,
  hasSubmitted,
  setShowModal,
}: any) {
  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.8, opacity: 0 }}
      className="bg-gradient-to-br from-gray-900 to-black border-2 border-yellow-500/30 rounded-3xl shadow-2xl p-8 text-center space-y-6 max-w-md w-full relative overflow-hidden"
    >
      {/* Elementos decorativos */}
      <div className="absolute inset-0">
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-yellow-500 rounded-full filter blur-[80px] opacity-20"></div>
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-emerald-500 rounded-full filter blur-[100px] opacity-15"></div>
      </div>
      
      <div className="relative z-10">
        <h2 className="text-2xl font-bold text-yellow-400 mb-2">Completa tu reserva</h2>
        <p className="text-gray-400 text-sm mb-6">
          Déjanos tus datos y nos comunicaremos contigo para confirmar los detalles del tour.
        </p>

        <form ref={formRef} onSubmit={sendEmail} className="space-y-5 text-left">
          <input type="hidden" name="tour" value={tour.nombre} />

          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <User className="w-5 h-5 text-yellow-500" />
            </div>
            <input
              type="text"
              name="nombre"
              required
              placeholder="Nombre completo"
              className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 pl-10 text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            />
            {errors.nombre && <p className="text-red-400 text-sm mt-1">{errors.nombre}</p>}
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Mail className="w-5 h-5 text-yellow-500" />
            </div>
            <input
              type="email"
              name="correo"
              required
              placeholder="Correo electrónico"
              className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 pl-10 text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            />
            {errors.correo && <p className="text-red-400 text-sm mt-1">{errors.correo}</p>}
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Phone className="w-5 h-5 text-yellow-500" />
            </div>
            <input
              type="tel"
              name="telefono"
              required
              pattern="[0-9]{7,15}"
              placeholder="Teléfono"
              className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 pl-10 text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            />
            {errors.telefono && <p className="text-red-400 text-sm mt-1">{errors.telefono}</p>}
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Calendar className="w-5 h-5 text-yellow-500" />
            </div>
            <input
              type="date"
              name="fecha"
              required
              className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 pl-10 text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            />
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="px-4 py-3 border border-gray-600 rounded-xl text-gray-300 hover:bg-gray-800 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting || hasSubmitted}
              className={`px-6 py-3 rounded-xl font-semibold transition-all relative overflow-hidden ${
                isSubmitting || hasSubmitted
                  ? "bg-yellow-300 text-gray-900 cursor-not-allowed"
                  : "bg-gradient-to-r from-yellow-500 to-yellow-600 text-gray-900 hover:from-yellow-400 hover:to-yellow-500"
              }`}
            >
              <span className="relative z-10 flex items-center gap-2">
                {isSubmitting ? (
                  <div className="flex items-center">
                    <div className="w-4 h-4 border-t-2 border-gray-900 rounded-full animate-spin mr-2"></div>
                    Enviando...
                  </div>
                ) : hasSubmitted ? (
                  "Reserva enviada"
                ) : (
                  "Enviar reserva"
                )}
              </span>
              <span className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-yellow-500 opacity-0 hover:opacity-100 transition-opacity"></span>
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
}

export default function CheckoutPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [tour, setTour] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const [errors, setErrors] = useState<{ nombre?: string; telefono?: string; correo?: string }>({});

  useEffect(() => {
    const tourId = searchParams?.get("tourId");
    if (!tourId) return;

    const selectedTour = tours.find((t) => t.id === tourId);
    setTour(selectedTour);
  }, [searchParams]);

  const validateForm = () => {
    if (!formRef.current) return false;
    const form = formRef.current;
    const nombre = form.nombre.value.trim();
    const correo = form.correo.value.trim();
    const telefono = form.telefono.value.trim();
    let valid = true;
    const newErrors: typeof errors = {};

    if (!/^[a-zA-ZÀ-ÿ\s]{2,}$/.test(nombre)) {
      newErrors.nombre = "El nombre debe tener al menos 2 letras y solo contener caracteres válidos.";
      valid = false;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) {
      newErrors.correo = "Correo inválido";
      valid = false;
    }

    if (!/^\d{7,15}$/.test(telefono)) {
      newErrors.telefono = "Teléfono debe tener entre 7 y 15 dígitos y sin letras.";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const sendEmail = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formRef.current || !validateForm() || isSubmitting || hasSubmitted) return;

    setIsSubmitting(true);
    setHasSubmitted(true);
    setShowModal(false);

    emailjs
      .sendForm("service_48b978l", "template_uk4drlm", formRef.current, "Bl8NYZsWuRuNA-Jbi")
      .catch((error) => {
        console.error(error);
        toast.error("Hubo un error al enviar tu reserva.");
      });

    toast.success("Reserva enviada con éxito");
    router.push("/thank-you");
  };

  if (!tour) return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black">
      <div className="text-center">
        <div className="animate-pulse">
          <div className="w-20 h-20 mx-auto bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-full flex items-center justify-center">
            <Calendar className="text-gray-900 w-10 h-10" />
          </div>
        </div>
        <p className="mt-6 text-gray-400">Cargando detalles de tu tour...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black py-12 px-4 relative overflow-hidden">
      {/* Elementos decorativos de fondo */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-1/3 h-full bg-gradient-to-r from-gray-900 to-transparent z-0"></div>
        <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-gray-900 to-transparent z-0"></div>
        <div className="absolute bottom-20 left-1/4 w-80 h-80 bg-yellow-500 rounded-full filter blur-[100px] opacity-10"></div>
        <div className="absolute top-20 right-1/4 w-60 h-60 bg-emerald-500 rounded-full filter blur-[80px] opacity-10"></div>
        <div className="pattern-dots pattern-gray-800 pattern-bg-transparent pattern-opacity-10 pattern-size-2 absolute inset-0"></div>
      </div>

      {/* Contenido principal */}
      <div className="relative z-10 max-w-6xl mx-auto">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600 mb-4">
            ¡Listo para tu aventura!
          </h1>
          <p className="text-gray-400 max-w-xl mx-auto">
            Estás a un paso de vivir una experiencia inolvidable en Medellín
          </p>
        </motion.div>

        <motion.div
          className="bg-gradient-to-br from-gray-800/60 to-gray-900/80 backdrop-blur-lg rounded-3xl shadow-2xl p-6 md:p-10 space-y-8 relative border border-yellow-500/20"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 100, delay: 0.2 }}
        >
          {/* Sección superior: Carrusel y detalles básicos */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-stretch">
            {/* IMÁGENES - Carrusel automático */}
            {tour.fotos?.length > 0 && <TourImages fotos={tour.fotos} />}

            {/* INFORMACIÓN BÁSICA */}
            <TourDetails tour={tour} />
          </div>

          {/* Sección de detalles (ocupa todo el ancho) */}
          <div className="w-full">
            <InclusionDetails tour={tour} />
          </div>

          {/* Botones de acción */}
          <div className="flex flex-col sm:flex-row items-center gap-4 justify-center pt-10">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowModal(true)}
              className="relative inline-flex items-center justify-center bg-gradient-to-r from-yellow-500 to-yellow-600 text-gray-900 px-8 py-4 rounded-xl font-bold overflow-hidden group"
            >
              <span className="relative z-10 flex items-center gap-2">
                <CheckCircle className="w-6 h-6" />
                Confirmar Reserva
              </span>
              <span className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-yellow-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
            </motion.button>
            
            <Link href="/">
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="border border-yellow-500/50 text-yellow-400 px-8 py-4 rounded-xl hover:bg-gray-800/50 transition-all font-medium flex items-center gap-2"
              >
                Volver al inicio
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </div>

      {/* MODAL */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4"
          >
            <ReservationForm
              tour={tour}
              formRef={formRef}
              errors={errors}
              validateForm={validateForm}
              sendEmail={sendEmail}
              isSubmitting={isSubmitting}
              hasSubmitted={hasSubmitted}
              setShowModal={setShowModal}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}