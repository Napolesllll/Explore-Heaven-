"use client";

import Head from "next/head";
import { useSearchParams } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { tours } from "../../data/toursData";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import toast from "react-hot-toast";
import TourImages from "./components/TourImages";
import TourDetails from "./components/TourDetails";
import InclusionDetails from "./components/InclusionDetails";
import dynamic from "next/dynamic";
import { sendReservationEmail } from "../../utils/emailjsService";
import { Calendar, CheckCircle } from "lucide-react";

// Importar ReservationForm dinámicamente con SSR deshabilitado
const ReservationForm = dynamic(() => import("./components/ReservationForm"), {
  ssr: false,
  loading: () => (
    <div className="bg-white p-8 rounded-2xl max-w-2xl w-full mx-4">
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500"></div>
      </div>
    </div>
  ),
});

// Definición del tipo Tour para evitar any
interface Tour {
  id: string;
  nombre: string;
  descripcion: string;
  precio: string | number;
  salida: string;
  regreso: string;
  duracion: string;
  fotos?: string[];
  inclusiones?: string[];
}

export default function CheckoutPage() {
  const searchParams = useSearchParams();

  const [tour, setTour] = useState<Tour | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [showWhatsApp, setShowWhatsApp] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const [availableDates, setAvailableDates] = useState<Date[]>([]);
  const [formData, setFormData] = useState({
    nombre: "",
    correo: "",
    telefono: "",
    fecha: "",
    cantidadAdultos: 1,
    cantidadNinos: 0,
    adultos: [{ nombre: "", tipoDocumento: "", numeroDocumento: "" }],
    ninos: [] as {
      nombre: string;
      tipoDocumento: string;
      numeroDocumento: string;
    }[],
    contactoEmergencia: { nombre: "", telefono: "" },
  });

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Cargar tour seleccionado
  useEffect(() => {
    const tourId = searchParams.get("tourId");
    if (!tourId) return;
    const found = tours.find((t) => t.id === tourId) || null;
    setTour(found);
  }, [searchParams]);

  // Cargar fechas disponibles
  useEffect(() => {
    if (!isClient) return;

    const dates: Date[] = [];
    const today = new Date();
    for (let i = 1; i <= 60; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push(date);
    }
    setAvailableDates(dates);
  }, [isClient]);

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
      const success = await sendReservationEmail(formRef);

      if (success && tour) {
        const reserva = {
          tourName: tour.nombre,
          date: formData.fecha || "",
          amount: tour.precio,
          reference: Date.now().toString(),
          email: formData.correo,
        };
        localStorage.setItem("last_reservation", JSON.stringify(reserva));

        toast.success("Información recopilada correctamente");
        setShowWhatsApp(true);
      } else {
        throw new Error("Email sending failed");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error procesando información");
      setIsSubmitting(false);
      setHasSubmitted(false);
    }
  }

  if (!tour) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black">
        <div className="text-center animate-pulse">
          <div className="w-20 h-20 mx-auto bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-full flex items-center justify-center">
            <Calendar className="text-gray-900 w-10 h-10" />
          </div>
          <p className="mt-6 text-gray-400">Cargando detalles de tu tour...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Checkout | Reserva tu tour en Medellín</title>
        <meta
          name="description"
          content={`Reserva tu experiencia: ${tour.nombre}. Vive Medellín con seguridad y confianza.`}
        />
        <meta name="robots" content="noindex,follow" />
      </Head>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black py-12 px-4 relative overflow-hidden">
        <div className="absolute inset-0" aria-hidden>
          <div className="absolute top-0 left-0 w-1/3 h-full bg-gradient-to-r from-gray-900 to-transparent z-0"></div>
          <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-gray-900 to-transparent z-0"></div>
          <div className="absolute bottom-20 left-1/4 w-80 h-80 bg-yellow-500 rounded-full filter blur-[100px] opacity-10"></div>
          <div className="absolute top-20 right-1/4 w-60 h-60 bg-emerald-500 rounded-full filter blur-[80px] opacity-10"></div>
          <div className="pattern-dots pattern-gray-800 pattern-bg-transparent pattern-opacity-10 pattern-size-2 absolute inset-0"></div>
        </div>

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
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-stretch">
              {tour.fotos?.length > 0 && <TourImages fotos={tour.fotos} />}
              <TourDetails tour={tour} />
            </div>

            <div className="w-full">
              <InclusionDetails tour={tour} />
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4 justify-center pt-10">
              <motion.button
                type="button"
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

              <Link href="/" passHref>
                <motion.button
                  type="button"
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

        <AnimatePresence>
          {showModal && isClient && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-2 sm:p-4"
              onClick={(e) => {
                if (e.target === e.currentTarget) {
                  setShowModal(false);
                }
              }}
            >
              <ReservationForm
                tour={tour}
                formRef={formRef}
                sendEmail={sendEmail}
                isSubmitting={isSubmitting}
                hasSubmitted={hasSubmitted}
                setShowModal={setShowModal}
                availableDates={availableDates}
                formData={formData}
                setFormData={setFormData}
                showWhatsApp={showWhatsApp}
                setShowWhatsApp={setShowWhatsApp}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
