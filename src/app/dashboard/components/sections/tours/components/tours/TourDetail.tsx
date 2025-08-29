"use client";

import {
  useState,
  useEffect,
  useRef,
  JSXElementConstructor,
  Key,
  ReactElement,
  ReactNode,
  ReactPortal,
} from "react";
import { motion } from "framer-motion";
import { Tour } from "../../../../../../../data/toursData";
import { FaRocket, FaCheckCircle } from "react-icons/fa";
import emailjs from "@emailjs/browser";
import toast from "react-hot-toast";
import ReservationModal from "./ReservationModal";
import { ReservationFormData } from "./ReservationForm/types";
import Image from "next/image";

export default function TourDetail({ tour }: { tour: Tour }) {
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
  const formRef = useRef<HTMLFormElement>(null);

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
    if (!/^\d{7,15}$/.test(p)) {
      toast.error("Teléfono inválido");
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

  return (
    <div className="relative min-h-screen py-12 px-4 bg-gradient-to-br from-[#0c0f1d] via-[#151b35] to-[#0c0f1d]">
      {/* Partículas galácticas */}
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
            animate={{ opacity: [0, 0.5, 0], scale: [0, 1, 0] }}
            transition={{
              duration: Math.random() * 6 + 4,
              repeat: Infinity,
              delay: Math.random() * 3,
            }}
          />
        ))}
      </div>

      <div className="max-w-5xl mx-auto">
        {/* Cabecera */}
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
          {tour.fotos?.[activeImage] && (
            <Image
              src={tour.fotos[activeImage]}
              alt={`Imagen principal del tour ${tour.nombre}`}
              fill
              className="object-cover"
            />
          )}

          {/* Miniaturas */}
          <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-20">
            {tour.fotos?.map((foto, index) => (
              <button
                key={index}
                onClick={() => setActiveImage(index)}
                className={`w-16 h-16 relative rounded-lg overflow-hidden border-2 transition-all duration-300 ${
                  index === activeImage
                    ? "border-cyan-400 scale-110 shadow-lg shadow-cyan-500/50"
                    : "border-gray-700 opacity-70 hover:opacity-100"
                }`}
              >
                <Image
                  src={foto}
                  alt={`Miniatura ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Información */}
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
                {tour.caracteristicas?.map(
                  (
                    caracteristica:
                      | string
                      | number
                      | boolean
                      | ReactElement<
                          unknown,
                          string | JSXElementConstructor<unknown>
                        >
                      | Iterable<ReactNode>
                      | ReactPortal
                      | null
                      | undefined,
                    i: Key
                  ) => (
                    <span
                      key={i}
                      className="px-3 py-2 bg-cyan-900/30 text-cyan-300 rounded-lg border border-cyan-500/30"
                    >
                      {caracteristica}
                    </span>
                  )
                )}
              </div>
            </motion.div>
          </motion.div>

          {/* Reserva */}
          <motion.div
            className="bg-gradient-to-br from-[#0f172a]/80 to-[#1e293b]/80 rounded-2xl p-6 border border-cyan-500/30 shadow-xl shadow-cyan-500/10 backdrop-blur-sm"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-2xl pointer-events-none" />
              <div className="relative z-10 space-y-4">
                <h2 className="text-2xl font-bold text-cyan-400 text-center">
                  Reserva tu lugar
                </h2>
                <p className="text-cyan-400 text-sm text-center">
                  Completa el formulario para iniciar tu reserva
                </p>
              </div>

              <motion.button
                onClick={() => setShowModal(true)}
                className="w-full py-4 rounded-xl font-bold relative overflow-hidden group bg-gradient-to-r from-cyan-600 to-purple-600"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute -inset-4 bg-gradient-to-r from-cyan-500/30 to-purple-500/30 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <span className="relative z-10 flex items-center justify-center gap-2">
                  Confirmar y continuar a la Reserva
                </span>
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
      <div className="text-center text-sm text-gray-400 mt-4">
        Tu información está segura con nosotros. Reservas 100% protegidas.
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
