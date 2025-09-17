"use client";

import Head from "next/head";
import { useSearchParams } from "next/navigation";
import {
  useEffect,
  useState,
  useRef,
  Suspense,
  useCallback,
  useMemo,
} from "react";
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

// Carga diferida optimizada
const ReservationForm = dynamic(() => import("./components/ReservationForm"), {
  ssr: false,
  loading: () => (
    <div className="bg-white p-8 rounded-2xl max-w-2xl w-full mx-4">
      <div className="flex justify-center items-center h-32 sm:h-64">
        <div className="animate-spin rounded-full h-8 sm:h-12 w-8 sm:w-12 border-b-2 border-yellow-500" />
      </div>
    </div>
  ),
});

// Interfaces optimizadas
interface Tour {
  id: string;
  nombre: string;
  descripcion: string;
  precio: string | number;
  salida: string;
  regreso: string;
  duracion: string;
  fotos: string[];
  inclusiones: string[];
  incluido: string[];
  noIncluido: string[];
  outfit: string[];
}

interface Person {
  nombre: string;
  tipoDocumento: string;
  numeroDocumento: string;
}

interface EmergencyContact {
  nombre: string;
  telefono: string;
}

interface ReservationFormData {
  fecha?: Date;
  nombre: string;
  telefono: string;
  correo: string;
  cantidadAdultos: number;
  cantidadNinos: number;
  adultos: Person[];
  ninos: Person[];
  contactoEmergencia: EmergencyContact;
}

function CheckoutContent() {
  const searchParams = useSearchParams();
  const [tour, setTour] = useState<Tour | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [showWhatsApp, setShowWhatsApp] = useState(false);
  const [isClient, setIsClient] = useState(false);

  // Corregir el tipado del formRef - inicializarlo como HTMLFormElement
  const formRef = useRef<HTMLFormElement>(null as unknown as HTMLFormElement);

  const [availableDates, setAvailableDates] = useState<Date[]>([]);
  const [formData, setFormData] = useState<ReservationFormData>({
    nombre: "",
    correo: "",
    telefono: "",
    cantidadAdultos: 1,
    cantidadNinos: 0,
    adultos: [{ nombre: "", tipoDocumento: "", numeroDocumento: "" }],
    ninos: [],
    contactoEmergencia: { nombre: "", telefono: "" },
  });

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Cargar tour - memoizado
  const tourId = searchParams.get("tourId");
  const mappedTour = useMemo(() => {
    if (!tourId) return null;
    const found = tours.find((t) => t.id === tourId);
    if (!found) return null;

    return {
      id: found.id,
      nombre: found.nombre,
      descripcion: found.descripcion,
      precio: found.precio,
      salida: found.salida,
      regreso: found.regreso,
      duracion: found.duracion,
      fotos: found.fotos || [],
      inclusiones: found.incluido || [],
      incluido: found.incluido || [],
      noIncluido: found.noIncluido || [],
      outfit: found.outfit || [],
    };
  }, [tourId]);

  useEffect(() => {
    setTour(mappedTour);
  }, [mappedTour]);

  // Fechas disponibles - memoizado
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

  // Validación optimizada
  const validateForm = useCallback(() => {
    const n = formData.nombre.trim();
    const c = formData.correo.trim();
    const p = formData.telefono.trim();

    if (!/^[a-zA-ZÀ-ÿ\s]{2,}$/.test(n)) {
      toast.error("Nombre inválido");
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(c)) {
      toast.error("Correo inválido");
      return false;
    }
    if (!/^\d{7,15}$/.test(p)) {
      toast.error("Teléfono inválido");
      return false;
    }
    return true;
  }, [formData]);

  // Envío de email optimizado - corregir el tipado aquí también
  const sendEmail = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      // Verificar que el formRef no sea null antes de continuar
      if (
        !formRef.current ||
        !validateForm() ||
        isSubmitting ||
        hasSubmitted ||
        !tour
      )
        return;

      setIsSubmitting(true);
      setHasSubmitted(true);

      try {
        // Crear un RefObject compatible para sendReservationEmail
        const formRefForEmail = { current: formRef.current };
        const success = await sendReservationEmail(formRefForEmail);

        if (success) {
          const reserva = {
            tourName: tour.nombre,
            date: formData.fecha ? formData.fecha.toISOString() : "",
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
    },
    [validateForm, isSubmitting, hasSubmitted, tour, formData]
  );

  // Handlers memoizados
  const handleModalClose = useCallback(() => setShowModal(false), []);
  const handleModalOpen = useCallback(() => setShowModal(true), []);

  if (!tour) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black">
        <div className="text-center">
          <div className="w-16 sm:w-20 h-16 sm:h-20 mx-auto bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-full flex items-center justify-center">
            <Calendar className="text-gray-900 w-8 sm:w-10 h-8 sm:h-10" />
          </div>
          <p className="mt-4 sm:mt-6 text-gray-400 text-sm sm:text-base">
            Cargando detalles de tu tour...
          </p>
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

      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black py-8 sm:py-12 px-4 relative overflow-hidden">
        {/* Fondo optimizado para móvil */}
        <div className="absolute inset-0 opacity-60 sm:opacity-100" aria-hidden>
          <div className="absolute bottom-20 left-1/4 w-48 sm:w-80 h-48 sm:h-80 bg-yellow-500 rounded-full filter blur-[60px] sm:blur-[100px] opacity-10" />
          <div className="absolute top-20 right-1/4 w-32 sm:w-60 h-32 sm:h-60 bg-emerald-500 rounded-full filter blur-[40px] sm:blur-[80px] opacity-10" />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto">
          {/* Header optimizado */}
          <motion.div
            className="text-center mb-8 sm:mb-12"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600 mb-4">
              ¡Listo para tu aventura!
            </h1>
            <p className="text-gray-400 max-w-xl mx-auto text-sm sm:text-base">
              Estás a un paso de vivir una experiencia inolvidable en Medellín
            </p>
          </motion.div>

          {/* Contenido principal */}
          <motion.div
            className="bg-gradient-to-br from-gray-800/60 to-gray-900/80 backdrop-blur-lg rounded-3xl shadow-2xl p-4 sm:p-6 md:p-10 space-y-6 sm:space-y-8 relative border border-yellow-500/20"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 100, delay: 0.1 }}
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-10 items-stretch">
              {tour.fotos.length > 0 && <TourImages fotos={tour.fotos} />}
              <TourDetails tour={tour} />
            </div>

            <InclusionDetails tour={tour} />

            {/* CTAs optimizados para móvil */}
            <div className="flex flex-col sm:flex-row items-center gap-4 justify-center pt-6 sm:pt-10">
              <motion.button
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleModalOpen}
                className="w-full sm:w-auto relative inline-flex items-center justify-center bg-gradient-to-r from-yellow-500 to-yellow-600 text-gray-900 px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-bold overflow-hidden group"
              >
                <span className="relative z-10 flex items-center gap-2">
                  <CheckCircle className="w-5 sm:w-6 h-5 sm:h-6" />
                  Confirmar Reserva
                </span>
              </motion.button>

              <Link href="/" prefetch={true}>
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full sm:w-auto border border-yellow-500/50 text-yellow-400 px-6 sm:px-8 py-3 sm:py-4 rounded-xl hover:bg-gray-800/50 transition-all font-medium flex items-center justify-center gap-2"
                >
                  Volver al inicio
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Modal optimizado */}
        <AnimatePresence>
          {showModal && isClient && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-2 sm:p-4"
              onClick={(e) => {
                if (e.target === e.currentTarget) {
                  handleModalClose();
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

export default function CheckoutPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black">
          <div className="text-center">
            <div className="w-16 sm:w-20 h-16 sm:h-20 mx-auto bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-full flex items-center justify-center">
              <Calendar className="text-gray-900 w-8 sm:w-10 h-8 sm:h-10" />
            </div>
            <p className="mt-4 sm:mt-6 text-gray-400 text-sm sm:text-base">
              Cargando checkout...
            </p>
          </div>
        </div>
      }
    >
      <CheckoutContent />
    </Suspense>
  );
}
