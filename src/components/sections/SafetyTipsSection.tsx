// src/components/sections/SafetyTipsSection.tsx
import {
  ShieldCheckIcon,
  ExclamationTriangleIcon,
  LightBulbIcon,
} from "@heroicons/react/24/outline";
import { motion } from "framer-motion";

// Definimos el tipo SafetyTip localmente
interface SafetyTip {
  id: string;
  title: string;
  description: string;
  icon?: string;
  category?: "warning" | "tip" | "safety";
}

interface SafetyTipsSectionProps {
  safetyTips: SafetyTip[];
  title?: string;
  showIcons?: boolean;
}

const SafetyTipsSection = ({
  safetyTips,
  title = "Consejos de Seguridad",
  showIcons = true,
}: SafetyTipsSectionProps) => {
  // Función para obtener el icono según la categoría
  const getIcon = (category: string = "safety") => {
    switch (category) {
      case "warning":
        return <ExclamationTriangleIcon className="h-5 w-5 text-amber-500" />;
      case "tip":
        return <LightBulbIcon className="h-5 w-5 text-blue-500" />;
      default:
        return <ShieldCheckIcon className="h-5 w-5 text-emerald-500" />;
    }
  };

  // Función para obtener el color del borde según la categoría
  const getBorderColor = (category: string = "safety") => {
    switch (category) {
      case "warning":
        return "border-amber-500";
      case "tip":
        return "border-blue-500";
      default:
        return "border-emerald-500";
    }
  };

  return (
    <motion.div
      className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
    >
      <div className="flex items-center mb-6">
        {showIcons && (
          <div className="bg-emerald-100 p-3 rounded-full mr-4">
            <ShieldCheckIcon className="h-8 w-8 text-emerald-600" />
          </div>
        )}
        <h3 className="text-2xl font-bold text-gray-900">{title}</h3>
      </div>

      <div className="space-y-4">
        {safetyTips.length > 0 ? (
          safetyTips.map((tip, index) => (
            <motion.div
              key={tip.id}
              className={`border-l-4 ${getBorderColor(tip.category)} pl-6 py-4 bg-gray-50/50 rounded-r-lg hover:bg-gray-50 transition-colors duration-200`}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <div className="flex items-start space-x-3">
                {showIcons && getIcon(tip.category)}
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 mb-2 leading-tight">
                    {tip.title}
                  </h4>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {tip.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="text-center py-8">
            <ExclamationTriangleIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">
              No hay consejos de seguridad disponibles
            </p>
          </div>
        )}
      </div>

      {/* Footer con información adicional */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
          <ShieldCheckIcon className="h-4 w-4" />
          <span>Tu seguridad es nuestra prioridad</span>
        </div>
      </div>
    </motion.div>
  );
};

export default SafetyTipsSection;
