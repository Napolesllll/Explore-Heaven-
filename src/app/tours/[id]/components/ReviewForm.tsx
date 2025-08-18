import { useForm } from "react-hook-form";
import { FaStar } from "react-icons/fa";

export function ReviewForm({
  tourId,
  onReviewSubmit,
}: {
  tourId: string;
  onReviewSubmit: (review: any) => void;
}) {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<{
    rating: number;
    comment: string;
  }>();

  const watchedRating = watch("rating", 0);

  const onSubmit = async (data: { rating: number; comment: string }) => {
    try {
      const response = await fetch(`${window.location.origin}/api/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tourId,
          rating: data.rating,
          comment: data.comment,
        }),
      });

      if (!response.ok) {
        let errorMessage = "Error al enviar reseña";
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
        } catch (e) {}
        throw new Error(errorMessage);
      }

      const newReview = await response.json();
      onReviewSubmit(newReview);
      reset();
    } catch (error: any) {
      console.error("Error en onSubmitReview:", error);
    }
  };

  return (
    <div className="mb-8 p-6 bg-indigo-900/30 rounded-xl border border-indigo-500/30">
      <h4 className="text-lg font-medium mb-4 text-white">Deja tu reseña</h4>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-indigo-300 mb-2">Calificación</label>
          <div className="flex items-center">
            {[1, 2, 3, 4, 5].map((star) => (
              <label key={star} className="cursor-pointer">
                <input
                  type="radio"
                  {...register("rating", {
                    required: "Selecciona una calificación",
                    valueAsNumber: true,
                  })}
                  value={star}
                  className="hidden"
                />
                <FaStar
                  className={`text-2xl mx-1 ${
                    star <= watchedRating
                      ? "text-yellow-400"
                      : "text-indigo-700"
                  }`}
                />
              </label>
            ))}
          </div>
          {errors.rating && (
            <p className="text-red-400 text-sm mt-1">{errors.rating.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="comment" className="block text-indigo-300 mb-2">
            Comentario (opcional)
          </label>
          <textarea
            id="comment"
            {...register("comment")}
            rows={3}
            className="w-full p-2 rounded bg-gray-800 text-white border border-indigo-500/20 focus:ring-2 focus:ring-indigo-400 outline-none"
            placeholder="Cuéntanos tu experiencia..."
          ></textarea>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold py-2 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-indigo-600/30 disabled:opacity-50"
        >
          {isSubmitting ? "Enviando..." : "Enviar Reseña"}
        </button>
      </form>
    </div>
  );
}
