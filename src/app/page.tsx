"use client";

// 1. Librerías externas
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { ShieldCheckIcon } from "@heroicons/react/24/outline";

// 2. Componentes internos
import Navbar from "../components/Navbar";
import HeroSection from "../components/HeroSection";
import TourSection from "components/TourSection";
import ServicesSection from "../components/ServicesSection";
import ServiceCard from "../components/ServiceCard";
import Footer from "components/Footer";
import FeaturesGrid from "components/FeaturesGrid";
import SafetyTipsCard from "components/SafetyTipsCard";

// data
import { features } from "../data/features";
import { safetyTips } from "../data/safetyTips";

// i18n
import { getI18n } from "../i18n/getI18";
const t = getI18n("es"); // Cambia "es" por "en" para inglés

// Importación dinámica del mapa para evitar errores de SSR
const SafetyMap = dynamic(() => import("../components/SafetyMap"), {
  ssr: false,
  loading: () => (
    <div className="aspect-video bg-gray-200 rounded-lg flex items-center justify-center">
      <span className="text-gray-500">{t.whyMedellin}</span>
    </div>
  ),
});

export default function Home() {
  const lang = "es"; // Obtener idioma dinámicamente
  const i18n = getI18n(lang);
  return (
    <main>
      <Navbar />
      <HeroSection
        title={t.heroTitle}
        subtitle={t.heroSubtitle}
        cta={t.heroCta}
      />

      <section
        aria-labelledby="why-medellin-title"
        className="relative bg-gradient-to-br from-gray-900 via-yellow-900/30 to-gray-800 py-20"
      >
        <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2ZmZiI+PC9yZWN0PjxwYXRoIGQ9Ik0xMDAgMEgwIDEwMEwxMDAgMjAwIDIwMCAxMDAgMTAwIDB6IiBmaWxsPSIjZmZmZmZmIiBvcGFjaXR5PSIwLjEiPjwvcGF0aD48L3N2Zz4=')]" />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block bg-yellow-400/10 text-yellow-400 px-6 py-2 rounded-full text-sm font-semibold mb-4">
              {t.whyMedellin}
            </span>
            <h2
              id="why-medellin-title"
              className="text-4xl font-bold text-white mt-4"
            >
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 to-yellow-400">
                {t.safeTourismParadise}
              </span>
            </h2>
          </div>

          <FeaturesGrid features={features} />

          <div className="mt-16 text-center">
            <p className="text-sm font-semibold tracking-wider text-yellow-300 uppercase">
              {t.recognizedByUnesco}
            </p>
          </div>
        </div>
      </section>

      <section
        aria-labelledby="tours-title"
        id="toursSection"
        className="min-h-screen bg-white py-20 px-4"
      >
        <h2 id="tours-title" className="sr-only">
          {t.toursTitle || "Tours"}
        </h2>
        <TourSection />
      </section>

      <ServicesSection />

      <section aria-labelledby="why-choose-title" className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2
            id="why-choose-title"
            className="text-3xl font-bold text-center mb-12"
          >
            {t.whyChoose}
          </h2>
          <div className="grid md:grid-cols-3 gap-12 text-center">
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

      <section
        aria-labelledby="safety-title"
        id="safety"
        className="relative py-24 overflow-hidden bg-gradient-to-br from-gray-900 to-gray-800"
      >
        {/* Fondo decorativo con patrones sutiles */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 left-0 w-full h-1/3 bg-gradient-to-b from-yellow-500/5 to-transparent"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-yellow-400 rounded-full mix-blend-soft-light filter blur-3xl opacity-10 transform translate-x-1/3 translate-y-1/3"></div>
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0ibm9uZSI+PC9yZWN0PjxwYXRoIGQ9Ik0xMDAgMEwwIDEwMEwxMDAgMjAwTDIwMCAxMDBMMTAwIDB6IiBzdHJva2U9IiMzZjNhM2QiIHN0cm9rZS13aWR0aD0iMC41IiBvcGFjaXR5PSIwLjEiPjwvcGF0aD48L3N2Zz4=')] opacity-5"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 relative z-10">
          {/* Encabezado con efecto dorado */}
          <div className="text-center mb-16">
            <motion.h2
              id="safety-title"
              className="text-4xl md:text-5xl font-extrabold text-center mb-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true }}
            >
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600 drop-shadow-lg">
                {t.safetyFirst}
              </span>
              <span className="block mt-4 h-1 w-32 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full mx-auto animate-pulse"></span>
            </motion.h2>
            <p className="text-lg text-gray-300 max-w-3xl mx-auto">
              {t.safetySubtitle}
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-10 items-start">
            <SafetyTipsCard
              lang={lang}
              tips={i18n.safetyTipsList} // Ahora usa los tips traducidos
            />
            <div className="relative h-[450px]">
              <SafetyMap />
            </div>
          </div>

          {/* CTA con estilo dorado */}
          <motion.div
            className="mt-20 text-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center bg-gradient-to-r from-gray-800 to-gray-900 px-8 py-4 rounded-full shadow-lg border border-yellow-500/20 hover:border-yellow-500/50 transition-colors">
              <ShieldCheckIcon className="h-8 w-8 text-yellow-500 mr-3" />
              <span className="text-xl font-bold text-yellow-400">
                {t.emergencyCta}
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
