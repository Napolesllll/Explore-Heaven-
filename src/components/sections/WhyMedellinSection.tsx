// src/components/sections/WhyMedellinSection.tsx
import { useTranslation } from "next-i18next";
import dynamic from "next/dynamic";
import { Feature } from "../../types/next-auth";

// Iconos dinámicos
const GlobeAltIcon = dynamic(
  () => import("@heroicons/react/24/outline/GlobeAltIcon")
);
const UserGroupIcon = dynamic(
  () => import("@heroicons/react/24/outline/UserGroupIcon")
);
const ShieldCheckIcon = dynamic(
  () => import("@heroicons/react/24/outline/ShieldCheckIcon")
);

// Mapeo de iconos con tipado correcto
const iconComponents: Record<
  string,
  React.ComponentType<React.SVGProps<SVGSVGElement>>
> = {
  GlobeAltIcon,
  UserGroupIcon,
  ShieldCheckIcon,
};

interface WhyMedellinSectionProps {
  features: Feature[];
}

const WhyMedellinSection = ({ features }: WhyMedellinSectionProps) => {
  const { t } = useTranslation("common");

  return (
    <section
      className="relative bg-gradient-to-br from-gray-900 via-yellow-900/30 to-gray-800 py-20"
      aria-label={t("whyMedellin.ariaLabel")}
    >
      <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2ZmZiI+PC9yZWN0PjxwYXRoIGQ9Ik0xMDAgMEgwIDEwMEwxMDAgMjAwIDIwMCAxMDAgMTAwIDB6IiBmaWxsPSIjZmZmZmZmIiBvcGFjaXR5PSIwLjEiPjwvcGF0aD48L3N2Zz4=')]" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="inline-block bg-yellow-400/10 text-yellow-400 px-6 py-2 rounded-full text-sm font-semibold mb-4">
            {t("whyMedellin.title")}
          </span>
          <h2 className="text-4xl font-bold text-white mt-4">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 to-yellow-400">
              {t("whyMedellin.subtitle")}
            </span>
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-12 text-center">
          {features.map((feature, index) => {
            const IconComponent = iconComponents[feature.icon];
            return (
              <div
                key={index}
                className="space-y-6"
                role="region"
                aria-labelledby={`feature-title-${index}`}
              >
                <div
                  className="mx-auto bg-yellow-400/10 p-4 rounded-full w-20 h-20 flex items-center justify-center"
                  aria-hidden="true"
                >
                  {IconComponent && <IconComponent className="h-8 w-8" />}
                </div>
                <h3
                  id={`feature-title-${index}`}
                  className="text-xl font-bold text-white"
                >
                  {feature.title}
                </h3>
                <p className="text-gray-300 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>

        <div className="mt-16 text-center">
          <p className="text-sm font-semibold tracking-wider text-yellow-300 uppercase">
            {t("whyMedellin.recognition")}
          </p>
        </div>
      </div>
    </section>
  );
};

export default WhyMedellinSection;
