'use client';

import { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface ServiceCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  badge?: string;
  badgeColor?: string;
}
 
export default function ServiceCard({
  icon,
  title,
  description,
  badge,
  badgeColor = 'bg-yellow-500',
}: ServiceCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      transition={{ type: 'spring', stiffness: 250, damping: 20 }}
      className="relative overflow-hidden rounded-3xl border border-white/10 backdrop-blur-md bg-white/80 shadow-xl hover:shadow-2xl transition-all duration-300 group"
    >
      {/* Glow decorativo (más tenue para no ocultar texto) */}
      <div className="absolute -inset-[1px] bg-gradient-to-br from-yellow-300/10 via-emerald-400/5 to-blue-500/10 blur-xl opacity-30 group-hover:opacity-60 transition-opacity duration-500 pointer-events-none" />

      <div className="relative p-6 z-10">
        {/* Badge flotante */}
        {badge && (
          <div
            className={`absolute top-4 right-4 text-xs font-semibold px-3 py-1 rounded-full text-white shadow-md ${badgeColor}`}
          >
            {badge}
          </div>
        )}

        {/* Icono con glow */}
        <div className="mb-6">
          <div className="w-14 h-14 flex items-center justify-center rounded-full bg-gradient-to-tr from-emerald-100 via-white to-yellow-100 shadow-inner shadow-yellow-100 group-hover:shadow-emerald-300 transition-shadow duration-500">
            <motion.div
              whileHover={{ rotate: 8 }}
              transition={{ type: 'spring', stiffness: 300, damping: 10 }}
              className="text-emerald-600 text-2xl"
            >
              {icon}
            </motion.div>
          </div>
        </div>

        {/* Título y descripción con mayor contraste */}
        <h3 className="text-xl font-extrabold text-gray-900 mb-2 group-hover:text-emerald-700 transition-colors">
          {title}
        </h3>
        <p className="text-gray-800 leading-relaxed">{description}</p>
      </div>
    </motion.div>
  );
}
