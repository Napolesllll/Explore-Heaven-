// src/components/sections/TourSectionWrapper.tsx
import dynamic from "next/dynamic";

const TourSection = dynamic(() => import("../../components/TourSection"));

interface TourSectionWrapperProps {
  title?: string;
  description?: string;
}

const TourSectionWrapper = ({
  title = "Nuestros Tours",
  description = "Descubre experiencias únicas y seguras en la hermosa ciudad de Medellín. Cada tour está diseñado para ofrecerte lo mejor de nuestra cultura, historia y belleza natural.",
}: TourSectionWrapperProps) => {
  return (
    <section
      id="toursSection"
      className="min-h-screen bg-white py-20 px-4"
      aria-label="Sección de tours y experiencias disponibles"
    >
      <h2 className="relative text-4xl sm:text-5xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600 mb-12">
        {title}
        <span className="block mx-auto mt-2 h-1 w-24 bg-yellow-500 rounded-full animate-pulse"></span>
      </h2>
      <p className="text-center text-gray-600 text-lg mt-4 max-w-2xl mx-auto mb-10">
        {description}
      </p>
      <TourSection />
    </section>
  );
};

export default TourSectionWrapper;
