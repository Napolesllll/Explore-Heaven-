"use client";

import { useKeenSlider } from "keen-slider/react";
import Image from "next/image";
import { AutoSlidePlugin } from "../../../utils/plugins/AutoSlidePlugin";

interface TourImagesProps {
  fotos: string[];
}

export default function TourImages({ fotos }: TourImagesProps) {
  const [sliderRef] = useKeenSlider<HTMLDivElement>(
    {
      loop: true,
      mode: "free-snap",
      slides: { perView: 1, spacing: 0 },
    },
    [AutoSlidePlugin]
  );

  return (
    <div
      ref={sliderRef}
      className="keen-slider rounded-3xl overflow-hidden h-[300px] sm:h-[450px] shadow-2xl border-4 border-yellow-500/20"
      aria-label="Galería de imágenes del tour"
    >
      {fotos.map((foto, index) => (
        <div key={index} className="keen-slider__slide relative h-full">
          <Image
            src={foto}
            alt={`Foto del tour ${index + 1}`}
            fill
            className="object-cover"
            priority={index === 0}
          />
          <div className="absolute bottom-4 right-4 bg-black/60 px-3 py-1 rounded-full text-xs text-white">
            {index + 1} / {fotos.length}
          </div>
        </div>
      ))}
    </div>
  );
}
