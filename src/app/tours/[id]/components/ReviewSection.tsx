"use client";

import { useSession } from "next-auth/react";
import Image from "next/image";
import { FaSpinner, FaTrash, FaUser, FaStar } from "react-icons/fa";
import { Review } from "../types/tours";
import { ReviewForm } from "./ReviewForm";

export interface Tour {
  id: string;
  nombre: string;
  precio?: number;
  maxReservas?: number;
}

interface ReviewSectionProps {
  tour: Tour;
  reviews: Review[];
  onReviewSubmit: (review: Review) => void;
  onDeleteReview: (reviewId: string) => void;
  deletingReviewId: string | null;
}

export function ReviewSection({
  tour,
  reviews,
  onReviewSubmit,
  onDeleteReview,
  deletingReviewId,
}: ReviewSectionProps) {
  const { data: session } = useSession();

  return (
    <div className="bg-black/20 backdrop-blur-sm border border-indigo-500/30 rounded-2xl p-6 md:p-8 transition-all hover:border-indigo-400/50">
      <h3 className="text-2xl font-semibold mb-6 text-indigo-300 flex items-center">
        <div
          className="w-3 h-3 rounded-full bg-indigo-400 mr-2 animate-pulse"
          aria-hidden="true"
        />
        Experiencias de Viajeros
      </h3>

      {session && (
        <ReviewForm tourId={tour.id} onReviewSubmit={onReviewSubmit} />
      )}

      <div className="space-y-6">
        {reviews.length === 0 ? (
          <p className="text-center text-indigo-300 py-8">
            No hay reseñas aún. ¡Sé el primero en comentar!
          </p>
        ) : (
          reviews.map((review) => (
            <div
              key={review.id}
              className="bg-indigo-900/30 backdrop-blur-sm border border-indigo-500/30 rounded-xl p-5 transition-all hover:border-indigo-400/50 relative"
            >
              {session?.user?.id === review.userId && (
                <button
                  onClick={() => onDeleteReview(review.id)}
                  disabled={deletingReviewId === review.id}
                  className="absolute top-4 right-4 text-red-400 hover:text-red-300 transition-colors disabled:opacity-50"
                  aria-label="Eliminar reseña"
                >
                  {deletingReviewId === review.id ? (
                    <FaSpinner className="animate-spin" />
                  ) : (
                    <FaTrash />
                  )}
                </button>
              )}

              <div className="flex items-center mb-3">
                {review.user.image ? (
                  <Image
                    src={review.user.image}
                    alt={`Avatar de ${review.user.name}`}
                    width={40}
                    height={40}
                    className="rounded-full mr-3"
                  />
                ) : (
                  <div className="bg-gray-700 rounded-full w-10 h-10 flex items-center justify-center mr-3">
                    <FaUser className="text-gray-400" />
                  </div>
                )}
                <div>
                  <div className="font-semibold text-white">
                    {review.user.name || "Usuario Anónimo"}
                  </div>
                  <div className="text-xs text-indigo-300">
                    {new Date(review.createdAt).toLocaleDateString("es-ES", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </div>
                </div>
              </div>

              <div className="flex items-center mb-3">
                {[...Array(5)].map((_, i) => (
                  <FaStar
                    key={i}
                    className={`text-md ${
                      i < review.rating ? "text-yellow-400" : "text-indigo-700"
                    }`}
                  />
                ))}
              </div>

              {review.comment && (
                <p className="text-gray-200 italic">
                  &quot;{review.comment}&quot;
                </p>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default ReviewSection;
