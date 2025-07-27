"use client";

import { GlobeAltIcon, ShieldCheckIcon, UserGroupIcon, TicketIcon } from '@heroicons/react/24/outline';
import dynamic from 'next/dynamic';

//components
import ServiceCard from '../components/ServiceCard';
import Navbar from '../components/Navbar';
import EmergencyButton from '../components/EmergencyButton';
import ServicesSection from "../components/ServicesSection";
import HeroSection from '../components/HeroSection';
import TourSection from 'components/TourSection';
import Footer from 'components/Footer';
import { motion } from 'framer-motion';
 
// Importación dinámica del mapa para evitar errores de SSR
const SafetyMap = dynamic(() => import('../components/SafetyMap'), {
  ssr: false,
  loading: () => (
    <div className="aspect-video bg-gray-200 rounded-lg flex items-center justify-center">
      <span className="text-gray-500">Cargando mapa...</span>
    </div>
  )
});

const features = [
  {
    icon: <GlobeAltIcon className="h-8 w-8" />,
    title: "Multilingual Guides",
    description: "Certified guides in English, French, and German",
  },
  {
    icon: <UserGroupIcon className="h-8 w-8" />,
    title: "Local Expertise",
    description: "Our guides know every safe corner and hidden gem of the city",
  },
  {
    icon: <TicketIcon className="h-8 w-8" />,
    title: "Exclusive Access",
    description: "Priority entry to main attractions with security escorts",
  },
];

const safetyTips = [
  "Avoid displaying expensive jewelry or electronics in public areas",
  "Use registered transportation services (we provide verified options)",
  "Keep copies of important documents in your accommodation",
  "Stay in well-lit areas at night and avoid isolated places",
];

export default function Home() {
  return (
    <>
      <Navbar />
      <HeroSection />

      <section className="relative bg-gradient-to-br from-gray-900 via-yellow-900/30 to-gray-800 py-20">
        <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2ZmZiI+PC9yZWN0PjxwYXRoIGQ9Ik0xMDAgMEgwIDEwMEwxMDAgMjAwIDIwMCAxMDAgMTAwIDB6IiBmaWxsPSIjZmZmZmZmIiBvcGFjaXR5PSIwLjEiPjwvcGF0aD48L3N2Zz4=')]" />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block bg-yellow-400/10 text-yellow-400 px-6 py-2 rounded-full text-sm font-semibold mb-4">
              Why Medellín?
            </span>
            <h2 className="text-4xl font-bold text-white mt-4">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 to-yellow-400">
                Safe Tourism Paradise
              </span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-12 text-center">
            {features.map((feature, index) => (
              <div key={index} className="space-y-6">
                <div className="mx-auto bg-yellow-400/10 p-4 rounded-full w-20 h-20 flex items-center justify-center">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-white">{feature.title}</h3>
                <p className="text-gray-300 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>

          <div className="mt-16 text-center">
            <p className="text-sm font-semibold tracking-wider text-yellow-300 uppercase">
              Recognized by UNESCO as a City of Innovation
            </p>
          </div>
        </div>
      </section>

      <section id="toursSection" className="min-h-screen bg-white py-20 px-4">
        
        <TourSection />
      </section>

      <ServicesSection />
      <EmergencyButton />

      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            Why Choose Explore Heaven?
          </h2>
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

<section id="safety" className="relative py-24 overflow-hidden bg-gradient-to-br from-gray-900 to-gray-800">
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
        className="text-4xl md:text-5xl font-extrabold text-center mb-6"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        viewport={{ once: true }}
      >
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600 drop-shadow-lg">
          Safety First
        </span>
        <span className="block mt-4 h-1 w-32 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full mx-auto animate-pulse"></span>
      </motion.h2>
      <p className="text-lg text-gray-300 max-w-3xl mx-auto">
        Tu seguridad es nuestra prioridad. Explora Medellín con confianza gracias a nuestras recomendaciones 
        y herramientas de seguridad.
      </p>
    </div>

    <div className="grid lg:grid-cols-2 gap-10 items-start">
      {/* Tarjeta de consejos con estilo dorado */}
      <motion.div 
        className="bg-gradient-to-br from-gray-800 to-gray-900 p-8 rounded-2xl shadow-2xl border border-yellow-500/20 relative overflow-hidden"
        initial={{ opacity: 0, x: -30 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        viewport={{ once: true }}
      >
        {/* Elemento decorativo */}
        <div className="absolute -top-6 -right-6 w-24 h-24 bg-yellow-500 rounded-full opacity-10"></div>
        <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-yellow-400 rounded-full opacity-5"></div>
        
        <div className="relative z-10">
          <div className="flex items-center mb-8">
            <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 p-3 rounded-xl shadow-lg">
              <ShieldCheckIcon className="h-8 w-8 text-gray-900" />
            </div>
            <h3 className="text-2xl font-bold text-yellow-400 ml-4">
              Essential Safety Tips
            </h3>
          </div>
          
          <ul className="space-y-5">
            {safetyTips.map((tip, index) => (
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

      {/* Contenedor del mapa con estilo premium */}
      <motion.div
        className="relative"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        viewport={{ once: true }}
      >
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-1 rounded-2xl shadow-2xl border border-yellow-500/20">
          <div className="bg-gradient-to-b from-gray-800 to-gray-900 border border-yellow-500/10 rounded-xl overflow-hidden">
            <div className="p-5 text-center border-b border-yellow-500/10">
              <h3 className="text-2xl font-bold text-yellow-400 mb-2">
                Zonas Seguras de Medellín
              </h3>
              <p className="text-gray-400 max-w-md mx-auto text-sm">
                Explora las áreas más seguras para turistas en Medellín
              </p>
            </div>
            
            <div className="relative h-[450px] overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent z-10 pointer-events-none"></div>
              <div className="absolute inset-0 border-b-4 border-x-4 border-yellow-500/10 rounded-b-xl pointer-events-none"></div>
              
              <SafetyMap />
              
              {/* Botones de control con estilo dorado */}
              <div className="absolute bottom-4 left-4 flex space-x-3">
                <button className="bg-gray-800 text-yellow-400 p-2 rounded-lg shadow-lg border border-yellow-500/20 hover:bg-yellow-500 hover:text-gray-900 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </button>
                <button className="bg-gray-800 text-yellow-400 p-2 rounded-lg shadow-lg border border-yellow-500/20 hover:bg-yellow-500 hover:text-gray-900 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
            
            <div className="p-4 bg-gradient-to-r from-gray-800 to-gray-900 border-t border-yellow-500/10">
              <p className="text-gray-400 text-sm text-center flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                Usa los controles para hacer zoom y explorar diferentes áreas
              </p>
            </div>
          </div>
        </div>
        
        {/* Elementos decorativos */}
        <div className="absolute -top-4 -right-4 w-16 h-16 rounded-full bg-yellow-400 opacity-10 blur-xl"></div>
      </motion.div>
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
          ¿Necesitas ayuda inmediata? Presiona nuestro botón de emergencia
        </span>
      </div>
    </motion.div>
  </div>
</section>

      <Footer />
    </>
  );
}

