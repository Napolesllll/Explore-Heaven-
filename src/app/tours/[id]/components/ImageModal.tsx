import { FaTimes } from "react-icons/fa";
import Image from "next/image";

export function ImageModal({
  isOpen,
  imageUrl,
  onClose,
}: {
  isOpen: boolean;
  imageUrl: string;
  onClose: () => void;
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4">
      <div className="relative w-full max-w-5xl">
        <button
          onClick={onClose}
          className="absolute -top-12 right-0 text-white hover:text-indigo-300 transition-colors z-10"
          aria-label="Cerrar visor de imagen"
        >
          <FaTimes className="text-3xl" />
        </button>
        <div className="relative w-full h-[80vh] rounded-2xl overflow-hidden">
          {
            // Proteger contra src no válido
            typeof imageUrl === "string" && imageUrl ? (
              <Image
                src={imageUrl}
                alt="Imagen ampliada de la galería del tour"
                fill
                className="object-contain"
                sizes="90vw"
              />
            ) : (
              <Image
                src="/tour-placeholder.jpg"
                alt="Imagen no disponible"
                fill
                className="object-contain"
                sizes="90vw"
              />
            )
          }
        </div>
      </div>
    </div>
  );
}
