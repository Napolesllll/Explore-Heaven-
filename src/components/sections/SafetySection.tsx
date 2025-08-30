// src/components/sections/SafetySection.tsx
import dynamic from "next/dynamic";

const SafetyTipsSection = dynamic(() => import("./SafetyTipsSection"));
const MapSection = dynamic(() => import("../MapSection"));

// Definimos el tipo SafetyTip localmente
interface SafetyTip {
  id: string;
  title: string;
  description: string;
  icon?: string;
}

interface SafetySectionProps {
  safetyTips: SafetyTip[];
  title?: string;
}

const SafetySection = ({
  safetyTips,
  title = "Seguridad y Consejos",
}: SafetySectionProps) => {
  return (
    <section
      id="safety"
      className="bg-emerald-50 py-20"
      aria-label="Sección de seguridad y consejos para turistas"
    >
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12 text-emerald-900">
          {title}
        </h2>
        <div className="grid md:grid-cols-2 gap-8">
          <SafetyTipsSection safetyTips={safetyTips} />
          <MapSection />
        </div>
      </div>
    </section>
  );
};

export default SafetySection;
