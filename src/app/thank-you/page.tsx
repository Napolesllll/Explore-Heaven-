"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import Head from "next/head";
import {
  FaCheckCircle,
  FaEnvelope,
  FaHome,
  FaShoppingBag,
  FaSpinner,
} from "react-icons/fa";

export default function ThankYouPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [reservationDetails, setReservationDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let timeout: NodeJS.Timeout | null = null;
    setLoading(true);
    setError(null);

    const sessionId = searchParams.get("session_id");
    const isMobile =
      typeof window !== "undefined" &&
      /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    const fetchReservationDetails = async (sessionId: string) => {
      try {
        const response = await fetch(
          `/api/verify-reservation?session_id=${sessionId}`
        );

        if (!response.ok) {
          throw new Error("No se pudo verificar la reserva");
        }

        const data = await response.json();

        if (!data.tourName || !data.amount) {
          throw new Error("Datos de reserva incompletos");
        }

        setReservationDetails({
          tourName: data.tourName,
          date: data.date || "Fecha no especificada",
          amount: data.amount,
          reference: data.reference || sessionId,
          email: data.email || "No proporcionado",
        });

        setLoading(false);

        if (isMobile) {
          localStorage.removeItem("stripe_session");
        }
      } catch (err) {
        setError(
          "Error al cargar los detalles de la reserva. Por favor verifica tu correo electrónico para los detalles."
        );
        setLoading(false);
      }
    };

    // Si hay session_id, intenta cargar desde API
    if (sessionId) {
      if (isMobile) {
        localStorage.setItem("stripe_session", sessionId);
      }
      fetchReservationDetails(sessionId);
      return;
    }

    // Si no hay session_id, espera un poco y luego lee de localStorage
    if (typeof window !== "undefined") {
      timeout = setTimeout(() => {
        const reserva = localStorage.getItem("last_reservation");
        if (reserva) {
          setReservationDetails(JSON.parse(reserva));
          setLoading(false);
        } else {
          setError(
            "No se encontró información de la reserva. Por favor verifica tu correo electrónico."
          );
          setLoading(false);
        }
      }, 200); // Espera 200ms para asegurar que localStorage esté disponible
    }

    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [searchParams, router]);

  // SEO y accesibilidad
  const seoTitle = "Reserva completada | Heaven Explore";
  const seoDescription =
    "Gracias por tu reserva en Heaven Explore. Consulta los detalles de tu pago y recibe confirmación por correo electrónico.";

  if (loading) {
    return (
      <>
        <Head>
          <title>{seoTitle}</title>
          <meta name="description" content={seoDescription} />
          <meta name="robots" content="noindex,follow" />
        </Head>
        <div className="min-h-screen bg-gradient-to-b from-indigo-900 to-indigo-950 flex items-center justify-center p-4">
          <div className="text-center">
            <FaSpinner className="animate-spin text-4xl text-white mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">
              Procesando tu reserva
            </h2>
            <p className="text-indigo-200">
              Estamos confirmando los detalles de tu pago...
            </p>
          </div>
        </div>
      </>
    );
  }

  // Solo muestra error si no hay detalles de reserva y hay error
  if (!reservationDetails && error) {
    return (
      <>
        <Head>
          <title>Error en la reserva | Heaven Explore</title>
          <meta name="description" content={seoDescription} />
          <meta name="robots" content="noindex,follow" />
        </Head>
        <div className="min-h-screen bg-gradient-to-b from-indigo-900 to-indigo-950 flex items-center justify-center p-4">
          <div className="max-w-2xl w-full bg-red-900/20 backdrop-blur-md rounded-2xl overflow-hidden border border-red-500/30 shadow-xl p-8 text-center">
            <h2 className="text-2xl font-bold text-white mb-4">
              Error en la reserva
            </h2>
            <p className="text-red-200 mb-6">{error}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Link
                href="/dashboard"
                className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-lg transition-colors"
                aria-label="Ir al dashboard"
              >
                <FaHome /> Dashboard
              </Link>
              <Link
                href="/contacto"
                className="flex items-center justify-center gap-2 bg-indigo-800/50 hover:bg-indigo-800/70 text-white py-2 px-4 rounded-lg transition-colors border border-indigo-700"
                aria-label="Contactar soporte"
              >
                <FaEnvelope /> Soporte
              </Link>
            </div>
          </div>
        </div>
      </>
    );
  }

  // Mensaje de éxito
  return (
    <>
      <Head>
        <title>{seoTitle}</title>
        <meta name="description" content={seoDescription} />
        <meta name="robots" content="noindex,follow" />
      </Head>
      <div className="min-h-screen bg-gradient-to-b from-indigo-900 to-indigo-950 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full bg-white/5 backdrop-blur-md rounded-2xl overflow-hidden border border-indigo-500/30 shadow-xl">
          <div className="bg-indigo-700/50 p-6 text-center border-b border-indigo-500/30">
            <div className="flex justify-center mb-4">
              <FaCheckCircle className="text-green-400 text-5xl" aria-hidden />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">
              ¡Reserva Exitosa!
            </h1>
            <p className="text-indigo-200">
              Gracias por tu reserva con Heaven Explore
            </p>
          </div>

          <div className="p-6 md:p-8">
            <h2 className="text-xl font-semibold text-white mb-6">
              Detalles de tu reserva
            </h2>

            <div className="space-y-4 mb-8">
              <div className="flex justify-between border-b border-indigo-500/20 pb-2">
                <span className="text-indigo-300">Tour:</span>
                <span className="text-white font-medium">
                  {reservationDetails?.tourName}
                </span>
              </div>
              <div className="flex justify-between border-b border-indigo-500/20 pb-2">
                <span className="text-indigo-300">Fecha:</span>
                <span className="text-white font-medium">
                  {reservationDetails?.date}
                </span>
              </div>
              <div className="flex justify-between border-b border-indigo-500/20 pb-2">
                <span className="text-indigo-300">Total pagado:</span>
                <span className="text-white font-medium">
                  {reservationDetails?.amount}
                </span>
              </div>
              <div className="flex justify-between border-b border-indigo-500/20 pb-2">
                <span className="text-indigo-300">Referencia:</span>
                <span className="text-white font-medium">
                  {reservationDetails?.reference}
                </span>
              </div>
            </div>

            <div className="bg-indigo-900/30 rounded-lg p-4 mb-8">
              <div className="flex items-start">
                <FaEnvelope className="text-indigo-300 mt-1 mr-3" aria-hidden />
                <div>
                  <h3 className="font-medium text-white mb-1">
                    Confirmación enviada
                  </h3>
                  <p className="text-indigo-200 text-sm">
                    Hemos enviado los detalles a{" "}
                    <span className="text-white">
                      {reservationDetails?.email}
                    </span>
                    . Revisa tu bandeja de entrada y spam.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Link
                href="/dashboard"
                className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-6 rounded-lg transition-colors"
                aria-label="Ir al dashboard"
              >
                <FaHome /> Dashboard
              </Link>
              <Link
                href="/tours"
                className="flex items-center justify-center gap-2 bg-indigo-800/50 hover:bg-indigo-800/70 text-white py-3 px-6 rounded-lg transition-colors border border-indigo-700"
                aria-label="Ver más tours"
              >
                <FaShoppingBag /> Más Tours
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
