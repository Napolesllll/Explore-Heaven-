import { ShieldCheckIcon } from "@heroicons/react/24/outline";
import { motion } from "framer-motion";
import { getI18n } from "../i18n/getI18"; // Importamos el sistema de traducción

interface SafetyTipsCardProps {
  tips: string[];
  title?: string;
  lang?: keyof typeof LANGS; // Nuevo prop para idioma
}

export default function SafetyTipsCard({
  tips,
  title, // No usamos valor por defecto aquí
  lang = "es", // Valor por defecto español
}: SafetyTipsCardProps) {
  const i18n = getI18n(lang);
  // Usamos el título personalizado o la traducción por defecto
  const cardTitle = title || i18n.safetyTipsTitle;

  return (
    <motion.div
      className="bg-gradient-to-br from-gray-800 to-gray-900 p-8 rounded-2xl shadow-2xl border border-yellow-500/20 relative overflow-hidden"
      initial={{ opacity: 0, x: -30 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      viewport={{ once: true }}
    >
      {/* Elementos decorativos */}
      <div className="absolute -top-6 -right-6 w-24 h-24 bg-yellow-500 rounded-full opacity-10"></div>
      <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-yellow-400 rounded-full opacity-5"></div>

      <div className="relative z-10">
        <div className="flex items-center mb-8">
          <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 p-3 rounded-xl shadow-lg">
            <ShieldCheckIcon className="h-8 w-8 text-gray-900" />
          </div>
          {/* Usamos cardTitle aquí */}
          <h3 className="text-2xl font-bold text-yellow-400 ml-4">
            {cardTitle}
          </h3>
        </div>

        <ul className="space-y-5">
          {tips.map((tip, index) => (
            <motion.li
              key={index}
              className="flex items-start bg-gradient-to-r from-gray-800 to-gray-700 p-4 rounded-xl shadow-sm border border-yellow-500/10 hover:border-yellow-500/30 transition-all duration-300 group"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 * index }}
              viewport={{ once: true }}
            >
              <div className="flex-shrink-0 mt-1">
                <div className="w-8 h-8 rounded-full bg-yellow-500/10 flex items-center justify-center group-hover:bg-yellow-500 transition-colors">
                  <ShieldCheckIcon className="h-4 w-4 text-yellow-400 group-hover:text-gray-900" />
                </div>
              </div>
              <p className="ml-4 text-gray-300 group-hover:text-yellow-100 transition-colors">
                {tip}
              </p>
            </motion.li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
}
