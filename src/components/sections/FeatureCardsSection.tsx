// src/components/sections/FeatureCardsSection.tsx
import dynamic from "next/dynamic";
import { useTranslation } from "next-i18next";
import { Feature } from "../../types";

const ServiceCard = dynamic(() => import("../ServiceCard"));

const FeatureCardsSection = ({ features }: { features: Feature[] }) => {
  const { t } = useTranslation("common");

  return (
    <section className="py-20 px-4" aria-label={t("features.ariaLabel")}>
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">
          {t("features.title")}
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <ServiceCard
              key={index}
              iconName={feature.icon}
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
