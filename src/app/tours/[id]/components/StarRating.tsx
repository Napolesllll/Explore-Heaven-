import { FaStar } from "react-icons/fa";

export function StarRating({
  rating,
  reviewCount,
}: {
  rating: number;
  reviewCount: number;
}) {
  return (
    <div className="flex items-center">
      {[...Array(5)].map((_, i) => (
        <FaStar
          key={i}
          className={`text-xl ${
            i < Math.round(rating) ? "text-yellow-400" : "text-indigo-700"
          }`}
          aria-hidden="true"
        />
      ))}
      <span className="ml-2 text-indigo-300">
        ({reviewCount} {reviewCount === 1 ? "reseña" : "reseñas"})
      </span>
    </div>
  );
}
