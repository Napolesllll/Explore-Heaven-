import Image from "next/image";
import { parseGallery } from "../utils/parseGallery";

export function TourGallery({
  tour,
  onImageClick,
}: {
  tour: any;
  onImageClick: (img: string) => void;
}) {
  const galleryImages = parseGallery(tour.gallery);

  if (galleryImages.length === 0) return null;

  return (
    <div className="mb-16">
      <h3 className="text-2xl font-semibold mb-6 text-indigo-300 flex items-center">
        <div
          className="w-3 h-3 rounded-full bg-indigo-400 mr-2 animate-pulse"
          aria-hidden="true"
        ></div>
        Galería del Tour
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {galleryImages.map((img, idx) => (
          <div
            key={idx}
            className="relative h-40 rounded-xl overflow-hidden border border-indigo-500/30 transition-transform hover:scale-105 cursor-pointer"
            onClick={() => onImageClick(img)}
            role="button"
            tabIndex={0}
            aria-label={`Ver imagen ${idx + 1} en tamaño completo`}
          >
            <Image
              src={img}
              alt={`Imagen ${idx + 1} de ${tour.nombre}`}
              fill
              sizes="(max-width: 768px) 50vw, 25vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          </div>
        ))}
      </div>
    </div>
  );
}
