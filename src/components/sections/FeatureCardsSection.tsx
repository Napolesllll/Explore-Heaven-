// src/components/sections/FeatureCardsSection.tsx
import dynamic from "next/dynamic";
import { ReactNode } from "react";

const ServiceCard = dynamic(() => import("../ServiceCard"));

// Definimos el tipo Feature localmente
interface Feature {
  icon: ReactNode;
  title: string;
  description: string;
}

interface FeatureCardsSectionProps {
  features: Feature[];
  title?: string;
}

const FeatureCardsSection = ({
  features,
  title = "Nuestras Características",
}: FeatureCardsSectionProps) => {
  return (
    <section
      className="py-20 px-4"
      aria-label="Características y servicios destacados"
    >
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">{title}</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <ServiceCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureCardsSection;
