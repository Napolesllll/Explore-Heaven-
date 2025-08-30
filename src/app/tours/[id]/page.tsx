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
import { ReservationModal } from "./components/ReservationModal/ReservationModal";
import { ReservationFormData } from "./components/ReservationModal/types";
import { ImageModal } from "./components/ImageModal";
import { ParticleBackground } from "./components/ParticleBackground";
import { InfoItem } from "./components/InfoItem";
import { useTour } from "./hooks/useTour";
import { parseGallery } from "./utils/parseGallery";
import { Review, AvailableDate } from "./types/tours";
import { FaMapMarkerAlt, FaMoneyBillWave, FaSpinner } from "react-icons/fa";
import React from "react";

// Tipo correcto para Next.js 15 - params es ahora una Promise
interface TourDetailPageProps {
  params: Promise<{ id: string }>;
}

interface PaymentSession {
  url: string;
}

interface ReservaResponse {
  id: string;
}

export default function TourDetailPage({ params }: TourDetailPageProps) {
  // Estado para el ID del tour
  const [tourId, setTourId] = useState<string | null>(null);

  // Resolver params de manera asíncrona
  useEffect(() => {
    const resolveParams = async () => {
      const resolvedParams = await params;
      setTourId(resolvedParams.id);
    };

    resolveParams();
  }, [params]);

  const { tour, loading, error } = useTour(tourId || "");
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
      if (!tour?.id) return;

      try {
        const response = await fetch(`/api/reviews?tourId=${tour.id}`);
        if (response.ok) {
          const data: Review[] = await response.json();
          setReviews(data);

          if (data.length > 0) {
            const avg =
              data.reduce((acc, review) => acc + review.rating, 0) /
              data.length;
            setAverageRating(parseFloat(avg.toFixed(1)));
          }
        }
      } catch (err: unknown) {
        console.error("Error fetching reviews:", err);
      }
    };

    if (tour?.id) fetchReviews();
  }, [tour]);

  const handleReviewSubmit = (newReview: Review) => {
    setReviews((prev) => [newReview, ...prev]);
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
    if (!session || !window.confirm("¿Estás seguro de eliminar esta reseña?"))
      return;

    setDeletingReviewId(reviewId);

    try {
      const response = await fetch(`/api/reviews/${reviewId}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Error al eliminar reseña");

      setReviews((prev) => prev.filter((review) => review.id !== reviewId));
      toast.success("Reseña eliminada correctamente");

      const remainingReviews = reviews.filter((r) => r.id !== reviewId);
      const newAvg =
        remainingReviews.length > 0
          ? remainingReviews.reduce((acc, r) => acc + r.rating, 0) /
            remainingReviews.length
          : 0;
      setAverageRating(parseFloat(newAvg.toFixed(1)));
    } catch (err: unknown) {
      const error = err instanceof Error ? err : new Error("Error desconocido");
      console.error("Error eliminando reseña:", error);
      toast.error(error.message);
    } finally {
      setDeletingReviewId(null);
    }
  };

  const handleSubmitReservation = async (
    data: ReservationFormData
  ): Promise<void> => {
    if (!tour) {
      toast.error("Información del tour no disponible");
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
      // Validación básica
      if (!data.fechaId || !data.nombre || !data.correo || !data.telefono) {
        throw new Error("Todos los campos obligatorios deben estar completos");
      }

      if (!data.participantes || data.participantes.length === 0) {
        throw new Error("Debes agregar al menos un participante");
      }

      const totalParticipantes = (data.adultos || 1) + (data.niños || 0);
      if (data.participantes.length !== totalParticipantes) {
        throw new Error("Información incompleta de participantes");
      }

      for (let i = 0; i < data.participantes.length; i++) {
        const p = data.participantes[i];
        if (
          !p.nombre ||
          !p.tipoDocumento ||
          !p.numeroDocumento ||
          !p.fechaNacimiento
        ) {
          throw new Error(
            `Todos los campos del participante ${i + 1} son obligatorios`
          );
        }
      }

      if (
        !data.contactoEmergencia?.nombre ||
        !data.contactoEmergencia?.telefono
      ) {
        throw new Error("Información de contacto de emergencia es obligatoria");
      }

      const reservationData = {
        ...data,
        adultos: Number(data.adultos) || 1,
        niños: Number(data.niños) || 0,
      };

      if (reservationData.adultos + reservationData.niños > tour.maxReservas) {
        throw new Error(`Máximo ${tour.maxReservas} personas permitidas`);
      }

      // Crear reserva en API
      const reservaResponse = await fetch("/api/reservas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tourId: tour.id, ...reservationData }),
      });

      if (!reservaResponse.ok) throw new Error("Error al crear reserva");

      const reservaData: ReservaResponse = await reservaResponse.json();

      const fechaSeleccionada = tour.availableDates?.find(
        (d: AvailableDate) => d.id === data.fechaId
      );
      if (!fechaSeleccionada)
        throw new Error("Fecha seleccionada no encontrada");

      // Crear sesión de pago
      const paymentResponse = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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
            nombre: data.nombre,
            correo: data.correo,
            telefono: data.telefono,
            fecha: fechaSeleccionada.date,
            adultos: reservationData.adultos,
            niños: reservationData.niños,
          },
        }),
      });

      if (!paymentResponse.ok)
        throw new Error("Error al crear la sesión de pago");

      const paymentSession: PaymentSession = await paymentResponse.json();
      if (!paymentSession.url)
        throw new Error("No se recibió una URL válida para el pago");

      setShowReserveModal(false);
      toast.success("¡Reserva creada! Redirigiendo al pago...");
      setTimeout(() => {
        window.location.href = paymentSession.url;
      }, 1000);
    } catch (err: unknown) {
      const error = err instanceof Error ? err : new Error("Error desconocido");
      console.error("Error en reserva:", error);
      toast.error(error.message);
    } finally {
      setReservationLoading(false);
    }
  };

  const handleReserveClick = () => {
    if (status === "loading") return toast.loading("Cargando sesión...");
    if (!session)
      return toast.error("Debes iniciar sesión para realizar una reserva");
    if (!tour?.availableDates || tour.availableDates.length === 0)
      return toast.error("No hay fechas disponibles");

    setShowReserveModal(true);
  };

  // Mostrar loading mientras resolvemos params o cargamos el tour
  if (!tourId || loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-[#0c0f1d] via-[#151b35] to-[#0c0f1d]">
        <div className="flex flex-col items-center">
          <div className="relative w-16 h-16 mb-4">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full animate-spin" />
            <div className="absolute inset-2 bg-[#0c0f1d] rounded-full" />
            <div className="absolute inset-3 flex items-center justify-center">
              <FaSpinner className="text-cyan-400 text-xl animate-pulse" />
            </div>
          </div>
          <p className="text-cyan-400 text-lg">Cargando experiencia...</p>
        </div>
      </div>
    );
  }

  if (error || !tour) return notFound();

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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          <div className="relative h-[500px] rounded-2xl overflow-hidden shadow-2xl border border-indigo-500/30 group transition-all duration-500">
            <Image
              src={tour.imagenUrl}
              alt={tour.nombre}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
            <div className="absolute bottom-6 left-6 bg-indigo-700/90 backdrop-blur-sm px-5 py-3 rounded-xl border border-indigo-500/30 shadow-lg">
              <div className="text-sm text-indigo-300">Desde</div>
              <div className="text-2xl font-bold text-white">
                ${tour.precio?.toLocaleString() || 0}{" "}
                <span className="text-sm font-normal">por persona</span>
              </div>
            </div>
          </div>
          <div className="bg-black/20 backdrop-blur-sm border border-indigo-500/30 rounded-2xl p-6 md:p-8 shadow-inner shadow-indigo-500/10 transition-all hover:border-indigo-400/50 h-full">
            <h2 className="text-xl font-semibold mb-4 text-indigo-300 flex items-center">
              <div
                className="w-3 h-3 rounded-full bg-indigo-400 mr-2 animate-pulse"
                aria-hidden="true"
              />
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
                className={`w-full ${reservationLoading || status === "loading" ? "bg-gray-600 cursor-not-allowed" : session ? "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700" : "bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700"} text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-indigo-600/30 flex items-center justify-center gap-3`}
                aria-label="Reservar este tour"
              >
                {reservationLoading || status === "loading" ? (
                  <>
                    <FaSpinner className="animate-spin h-5 w-5 text-white" />
                    Procesando...
                  </>
                ) : !session ? (
                  "Inicia sesión para reservar"
                ) : (
                  "Reservar ahora"
                )}
              </button>
              {!session && status !== "loading" && (
                <p className="text-sm text-gray-400 mt-3 text-center">
                  Necesitas una cuenta para realizar reservas
                </p>
              )}
              {tour.availableDates?.length > 0 && (
                <div className="mt-4 p-3 bg-indigo-900/20 rounded-lg border border-indigo-500/20">
                  <p className="text-sm text-indigo-300 font-semibold mb-1">
                    Fechas disponibles: {tour.availableDates.length}
                  </p>
                  <p className="text-xs text-gray-400">
                    Próxima fecha:{" "}
                    {new Date(tour.availableDates[0].date).toLocaleDateString(
                      "es-ES",
                      { weekday: "long", month: "long", day: "numeric" }
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
        <ReservationModal
          tour={tour}
          isOpen={showReserveModal}
          onClose={() => setShowReserveModal(false)}
          onSubmitReservation={handleSubmitReservation}
        />
        <ImageModal
          isOpen={showImageModal}
          imageUrl={selectedImage}
          onClose={() => setShowImageModal(false)}
        />
      </div>
    </div>
  );
}
