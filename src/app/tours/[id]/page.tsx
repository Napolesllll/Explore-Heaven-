"use client";

import { notFound } from "next/navigation";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";

// Componentes
import { TourHeader } from "./components/TourHeader";
import { TourGallery } from "./components/TourGallery";
import { TourInfoSection } from "./components/TourInfoSection";
import { ReviewSection } from "./components/ReviewSection";
import {
  ReservationModal,
  ReservationFormData,
} from "./components/ReservationModal";
import { ImageModal } from "./components/ImageModal";
import { ParticleBackground } from "./components/ParticleBackground";
import { InfoItem } from "./components/InfoItem";
import { useTour } from "./hooks/useTour";
import { parseGallery } from "./utils/parseGallery";
import { Tour, Review } from "./types/tours";
import { FaMapMarkerAlt, FaMoneyBillWave, FaSpinner } from "react-icons/fa";
import React from "react";

export default function TourDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = React.use(params);
  const { tour, loading, error } = useTour(id);
  const { data: session, status } = useSession();
  const [showReserveModal, setShowReserveModal] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");
  const [reviews, setReviews] = useState<Review[]>([]);
  const [averageRating, setAverageRating] = useState<number>(0);
  const [deletingReviewId, setDeletingReviewId] = useState<string | null>(null);
  const [reservationLoading, setReservationLoading] = useState(false);

  // Obtener reseñas al cargar el tour
  useEffect(() => {
    const fetchReviews = async () => {
      if (!tour || !tour.id) return;

      try {
        const response = await fetch(`/api/reviews?tourId=${tour.id}`);
        if (response.ok) {
          const data = await response.json();
          setReviews(data);

          if (data.length > 0) {
            const avg =
              data.reduce(
                (acc: number, review: Review) => acc + review.rating,
                0
              ) / data.length;
            setAverageRating(parseFloat(avg.toFixed(1)));
          }
        }
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    };

    if (tour && tour.id) {
      fetchReviews();
    }
  }, [tour]);

  const handleReviewSubmit = (newReview: Review) => {
    setReviews((prev) => [newReview, ...prev]);

    // Actualizar promedio
    const newTotalRating = [...reviews, newReview].reduce(
      (acc, review) => acc + review.rating,
      0
    );
    setAverageRating(
      parseFloat((newTotalRating / (reviews.length + 1)).toFixed(1))
    );

    toast.success("¡Reseña enviada con éxito!");
  };

  const handleDeleteReview = async (reviewId: string) => {
    if (!session || !window.confirm("¿Estás seguro de eliminar esta reseña?")) {
      return;
    }

    setDeletingReviewId(reviewId);

    try {
      const response = await fetch(`/api/reviews/${reviewId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Error al eliminar reseña");
      }

      setReviews(reviews.filter((review) => review.id !== reviewId));
      toast.success("Reseña eliminada correctamente");

      if (reviews.length > 1) {
        const newTotalRating = reviews
          .filter((review) => review.id !== reviewId)
          .reduce((acc, review) => acc + review.rating, 0);
        setAverageRating(
          parseFloat((newTotalRating / (reviews.length - 1)).toFixed(1))
        );
      } else {
        setAverageRating(0);
      }
    } catch (error: any) {
      console.error("Error eliminando reseña:", error);
      toast.error(error.message || "Error al eliminar reseña");
    } finally {
      setDeletingReviewId(null);
    }
  };

  const handleSubmitReservation = async (data: ReservationFormData) => {
    if (!tour) {
      toast.error("Error: Información del tour no disponible");
      return;
    }

    if (status === "loading") {
      toast.error("Cargando sesión...");
      return;
    }

    if (!session) {
      toast.error("Debes iniciar sesión para realizar una reserva");
      return;
    }

    setReservationLoading(true);

    try {
      // Validar datos antes de enviar
      if (!data.fechaId || !data.nombre || !data.correo || !data.telefono) {
        throw new Error("Todos los campos obligatorios deben estar completos");
      }

      if (!data.participantes || data.participantes.length === 0) {
        throw new Error("Debes agregar al menos un participante");
      }

      // Validar que todos los participantes tengan datos completos
      const totalParticipantes = (data.adultos || 1) + (data.niños || 0);
      if (data.participantes.length !== totalParticipantes) {
        throw new Error("Información incompleta de participantes");
      }

      // Validar que cada participante tenga todos los campos obligatorios
      for (let i = 0; i < data.participantes.length; i++) {
        const participante = data.participantes[i];
        if (!participante.nombre) {
          throw new Error(`Nombre del participante ${i + 1} es obligatorio`);
        }
        if (!participante.tipoDocumento) {
          throw new Error(
            `Tipo de documento del participante ${i + 1} es obligatorio`
          );
        }
        if (!participante.numeroDocumento) {
          throw new Error(
            `Número de documento del participante ${i + 1} es obligatorio`
          );
        }
        if (!participante.fechaNacimiento) {
          throw new Error(
            `Fecha de nacimiento del participante ${i + 1} es obligatoria`
          );
        }
      }

      if (
        !data.contactoEmergencia?.nombre ||
        !data.contactoEmergencia?.telefono
      ) {
        throw new Error("Información de contacto de emergencia es obligatoria");
      }

      // Convertir campos numéricos a números
      const reservationData = {
        ...data,
        adultos: Number(data.adultos) || 1,
        niños: Number(data.niños) || 0,
      };

      // Validar números
      if (reservationData.adultos < 1) {
        throw new Error("Debe haber al menos 1 adulto");
      }

      if (reservationData.adultos + reservationData.niños > tour.maxReservas) {
        throw new Error(`Máximo ${tour.maxReservas} personas permitidas`);
      }

      console.log("Enviando datos de reserva:", {
        tourId: tour.id,
        ...reservationData,
      });

      // Crear reserva en la base de datos
      const reservaResponse = await fetch("/api/reservas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tourId: tour.id,
          fechaId: reservationData.fechaId,
          nombre: reservationData.nombre,
          correo: reservationData.correo,
          telefono: reservationData.telefono,
          adultos: reservationData.adultos,
          niños: reservationData.niños,
          participantes: reservationData.participantes,
          contactoEmergencia: reservationData.contactoEmergencia,
        }),
      });

      console.log("Status de respuesta:", reservaResponse.status);
      console.log("Headers de respuesta:", reservaResponse.headers);

      // Verificar si la respuesta tiene contenido antes de parsear JSON
      const responseText = await reservaResponse.text();
      console.log("Texto crudo de respuesta:", responseText);

      if (!reservaResponse.ok) {
        let errorMessage;
        try {
          const errorData = responseText ? JSON.parse(responseText) : {};
          errorMessage =
            errorData.error ||
            `Error ${reservaResponse.status}: ${reservaResponse.statusText}`;
        } catch (parseError) {
          console.error("Error parseando respuesta de error:", parseError);
          errorMessage = `Error ${reservaResponse.status}: ${reservaResponse.statusText}`;
        }
        console.error("Error en respuesta de reserva:", errorMessage);
        throw new Error(errorMessage);
      }

      // Parsear JSON solo si hay contenido
      let reservaData;
      if (responseText) {
        try {
          reservaData = JSON.parse(responseText);
          console.log("Reserva creada exitosamente:", reservaData);
        } catch (parseError) {
          console.error(
            "Error parseando JSON de respuesta exitosa:",
            parseError
          );
          console.error("Contenido de respuesta:", responseText);
          throw new Error("Respuesta del servidor inválida");
        }
      } else {
        throw new Error("Respuesta vacía del servidor");
      }

      // Obtener fecha seleccionada para el pago
      const fechaSeleccionada = tour.availableDates.find(
        (d) => d.id === reservationData.fechaId
      );

      if (!fechaSeleccionada) {
        throw new Error("Fecha seleccionada no encontrada");
      }

      // Solo continuar con el pago si tenemos una reserva válida
      if (!reservaData || !reservaData.id) {
        throw new Error("No se pudo crear la reserva correctamente");
      }

      // Crear sesión de pago con Stripe
      const paymentResponse = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tour: {
            id: tour.id,
            nombre: tour.nombre,
            descripcion: tour.descripcion,
            precio: tour.precio,
            fotos: [tour.imagenUrl, ...parseGallery(tour.gallery || "")],
          },
          reserva: {
            id: reservaData.id,
            nombre: reservationData.nombre,
            correo: reservationData.correo,
            telefono: reservationData.telefono,
            fecha: fechaSeleccionada.date,
            adultos: reservationData.adultos,
            niños: reservationData.niños,
          },
        }),
      });

      console.log("Status respuesta pago:", paymentResponse.status);

      const paymentResponseText = await paymentResponse.text();
      console.log("Respuesta pago texto:", paymentResponseText);

      // Manejar errores de pago
      if (!paymentResponse.ok) {
        let errorMessage;
        try {
          const errorData = paymentResponseText
            ? JSON.parse(paymentResponseText)
            : {};
          errorMessage = errorData.error || "Error al crear la sesión de pago";
        } catch (parseError) {
          console.error("Error parseando respuesta de pago:", parseError);
          errorMessage = `Error ${paymentResponse.status}: ${paymentResponse.statusText}`;
        }
        console.error("Error en sesión de pago:", errorMessage);
        throw new Error(errorMessage);
      }

      let paymentSession;
      if (paymentResponseText) {
        try {
          paymentSession = JSON.parse(paymentResponseText);
          console.log("Sesión de pago creada:", paymentSession);
        } catch (parseError) {
          console.error("Error parseando JSON de pago:", parseError);
          throw new Error("Respuesta de pago inválida");
        }
      } else {
        throw new Error("Respuesta vacía del servidor de pagos");
      }

      // Cerrar modal antes de redirigir
      setShowReserveModal(false);

      // Mostrar mensaje de éxito
      toast.success("¡Reserva creada! Redirigiendo al pago...");

      // Redirigir a Stripe con un pequeño delay para que se vea el mensaje
      setTimeout(() => {
        if (paymentSession && paymentSession.url) {
          window.location.href = paymentSession.url;
        } else {
          console.error("URL de pago no encontrada:", paymentSession);
          throw new Error("No se recibió una URL válida para el pago");
        }
      }, 1000);
    } catch (error: any) {
      console.error("Error completo en reserva:", error);
      toast.error(
        error.message ||
          "Ocurrió un error al procesar tu reserva. Por favor intenta nuevamente."
      );
    } finally {
      setReservationLoading(false);
    }
  };

  const handleReserveClick = () => {
    if (status === "loading") {
      toast.loading("Cargando sesión...");
      return;
    }

    if (!session) {
      toast.error("Debes iniciar sesión para realizar una reserva");
      return;
    }

    if (!tour?.availableDates || tour.availableDates.length === 0) {
      toast.error("No hay fechas disponibles para este tour");
      return;
    }

    setShowReserveModal(true);
  };

  if (loading) {
    return (
      <div
        className="flex justify-center items-center h-screen bg-gradient-to-br from-[#0c0f1d] via-[#151b35] to-[#0c0f1d]"
        aria-label="Cargando tour"
      >
        <div className="flex flex-col items-center">
          <div className="relative w-16 h-16 mb-4">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full animate-spin"></div>
            <div className="absolute inset-2 bg-[#0c0f1d] rounded-full"></div>
            <div className="absolute inset-3 flex items-center justify-center">
              <FaSpinner className="text-cyan-400 text-xl animate-pulse" />
            </div>
          </div>
          <p className="text-cyan-400 text-lg">Cargando experiencia...</p>
        </div>
      </div>
    );
  }

  if (error || !tour) {
    console.error("Error cargando tour:", error);
    return notFound();
  }

  const openImageModal = (img: string) => {
    setSelectedImage(img);
    setShowImageModal(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0c0f1d] via-[#151b35] to-[#0c0f1d]">
      <div className="max-w-6xl mx-auto px-4 py-12 text-white relative z-10">
        <ParticleBackground />

        <TourHeader
          tour={tour}
          averageRating={averageRating}
          reviewsCount={reviews.length}
        />

        {/* Contenido principal */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {/* Columna de imagen */}
          <div className="relative h-[500px] rounded-2xl overflow-hidden shadow-2xl border border-indigo-500/30 group transition-all duration-500">
            <Image
              src={tour.imagenUrl}
              alt={`Imagen principal del tour ${tour.nombre}`}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />

            {/* Precio destacado */}
            <div className="absolute bottom-6 left-6 bg-indigo-700/90 backdrop-blur-sm px-5 py-3 rounded-xl border border-indigo-500/30 shadow-lg">
              <div className="text-sm text-indigo-300">Desde</div>
              <div className="text-2xl font-bold text-white">
                ${tour.precio?.toLocaleString() || 0}{" "}
                <span className="text-sm font-normal">por persona</span>
              </div>
            </div>
          </div>

          {/* Columna de descripción */}
          <div className="bg-black/20 backdrop-blur-sm border border-indigo-500/30 rounded-2xl p-6 md:p-8 shadow-inner shadow-indigo-500/10 transition-all hover:border-indigo-400/50 h-full">
            <h2 className="text-xl font-semibold mb-4 text-indigo-300 flex items-center">
              <div
                className="w-3 h-3 rounded-full bg-indigo-400 mr-2 animate-pulse"
                aria-hidden="true"
              ></div>
              Descripción del Tour
            </h2>
            <p className="whitespace-pre-line text-lg leading-relaxed text-gray-200 tracking-wide mb-6">
              {tour.descripcion}
            </p>

            <div className="grid grid-cols-2 gap-4 mt-6">
              <InfoItem
                icon={<FaMapMarkerAlt className="text-indigo-300 text-xl" />}
                label="Ubicación"
                value={tour.ubicacion}
              />
              <InfoItem
                icon={<FaMoneyBillWave className="text-indigo-300 text-xl" />}
                label="Precio"
                value={`$${tour.precio?.toLocaleString() || 0}`}
              />
            </div>

            <div className="mt-8 pt-6 border-t border-indigo-700/50">
              <button
                onClick={handleReserveClick}
                disabled={reservationLoading || status === "loading"}
                className={`w-full ${
                  reservationLoading || status === "loading"
                    ? "bg-gray-600 cursor-not-allowed"
                    : session
                      ? "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                      : "bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700"
                } text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-indigo-600/30 flex items-center justify-center gap-3`}
                aria-label="Reservar este tour"
              >
                {reservationLoading ? (
                  <>
                    <FaSpinner className="animate-spin h-5 w-5 text-white" />
                    Procesando...
                  </>
                ) : status === "loading" ? (
                  <>
                    <FaSpinner className="animate-spin h-5 w-5 text-white" />
                    Cargando...
                  </>
                ) : !session ? (
                  "Inicia sesión para reservar"
                ) : (
                  <>
                    Reservar ahora
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </>
                )}
              </button>

              {/* Información adicional para usuarios no autenticados */}
              {!session && status !== "loading" && (
                <p className="text-sm text-gray-400 mt-3 text-center">
                  Necesitas una cuenta para realizar reservas
                </p>
              )}

              {/* Información sobre fechas disponibles */}
              {tour.availableDates && tour.availableDates.length > 0 && (
                <div className="mt-4 p-3 bg-indigo-900/20 rounded-lg border border-indigo-500/20">
                  <p className="text-sm text-indigo-300 font-semibold mb-1">
                    Fechas disponibles: {tour.availableDates.length}
                  </p>
                  <p className="text-xs text-gray-400">
                    Próxima fecha:{" "}
                    {new Date(tour.availableDates[0].date).toLocaleDateString(
                      "es-ES",
                      {
                        weekday: "long",
                        month: "long",
                        day: "numeric",
                      }
                    )}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        <TourInfoSection tour={tour} />
        <TourGallery tour={tour} onImageClick={openImageModal} />

        <ReviewSection
          tour={tour}
          reviews={reviews}
          onReviewSubmit={handleReviewSubmit}
          onDeleteReview={handleDeleteReview}
          deletingReviewId={deletingReviewId}
        />

        {/* Modal de reserva */}
        <ReservationModal
          tour={tour}
          isOpen={showReserveModal}
          onClose={() => setShowReserveModal(false)}
          onSubmitReservation={handleSubmitReservation}
        />

        {/* Modal de imagen */}
        <ImageModal
          isOpen={showImageModal}
          imageUrl={selectedImage}
          onClose={() => setShowImageModal(false)}
        />
      </div>
    </div>
  );
}
