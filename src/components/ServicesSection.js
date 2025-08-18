'use client';

import { GlobeAltIcon, ShieldCheckIcon, MapIcon, ClockIcon, UserGroupIcon } from '@heroicons/react/24/outline';
import ServiceCard from './ServiceCard';
import { getI18n } from "../i18n/getI18";


export default function ServicesSection({ lang = 'es' }) {
  const t = getI18n(lang); // Usamos el idioma recibido o 'es' por defecto

  return (
    <section id="services" className="py-20 bg-gray-50 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Encabezado */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-yellow-600">
              {t.servicesTitle}
            </span> 
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {t.servicesSubtitle}
          </p>
        </div>

        {/* Grid de Servicios */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <ServiceCard
            icon={<UserGroupIcon className="h-8 w-8" />}
            title={t.certifiedGuides}
            description={t.certifiedGuidesDesc}
            badge={t.mostPopularBadge || "Most Popular"}
            badgeColor="bg-yellow-400"
          />
          <ServiceCard
            icon={<ShieldCheckIcon className="h-8 w-8" />}
            title={t.secureTransport}
            description={t.secureTransportDesc}
            badge={t.includedBadge || "Included"}
            badgeColor="bg-emerald-500"
          />
          <ServiceCard
            icon={<MapIcon className="h-8 w-8" />}
            title={t.customItineraries}
            description={t.customItinerariesDesc}
            badge={t.tailoredBadge || "Tailored"}
            badgeColor="bg-blue-500"
          />
          <ServiceCard
            icon={<ClockIcon className="h-8 w-8" />}
            title={t.support247}
            description={t.support247Desc}
            badge="24/7"
            badgeColor="bg-red-500"
          />
          <ServiceCard
            icon={<GlobeAltIcon className="h-8 w-8" />}
            title={t.culturalMediation}
            description={t.culturalMediationDesc}
          />
          <ServiceCard
            icon={<ShieldCheckIcon className="h-8 w-8" />}
            title={t.emergencyProtocols}
            description={t.emergencyProtocolsDesc}
            badge={t.criticalBadge || "Critical"}
            badgeColor="bg-red-500"
          />
        </div>

        {/* Comparativa de Seguridad */}
        <div className="mt-16 bg-white rounded-xl shadow-lg p-8">
          <h3 className="text-3xl font-bold mb-8 text-center text-gray-900">
            {t.whyDifferent}
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center p-4">
              <div className="text-5xl font-extrabold text-yellow-600 mb-3">100%</div>
              <div className="text-lg font-medium text-gray-800">
                {t.verifiedSafeLocations}
              </div>
            </div>
            <div className="text-center p-4 border-x border-gray-200">
              <div className="text-5xl font-extrabold text-emerald-600 mb-3">24/7</div>
              <div className="text-lg font-medium text-gray-800">
                {t.securityMonitoring}
              </div>
            </div>
            <div className="text-center p-4">
              <div className="text-5xl font-extrabold text-blue-600 mb-3">500+</div>
              <div className="text-lg font-medium text-gray-900">
                {t.satisfiedClients}
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <h3 className="text-3xl font-bold text-gray-900 mb-4">{t.ctaTitle}</h3>
          <p className="text-gray-600 mb-8 max-w-xl mx-auto">
            {t.ctaSubtitle}
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button className="bg-yellow-400 text-gray-900 px-8 py-4 rounded-full hover:bg-yellow-300 transition-all font-bold shadow-lg hover:shadow-yellow-400/30">
              {t.customizePlan}
            </button>
            <button className="border-2 border-yellow-400 text-yellow-400 px-8 py-4 rounded-full hover:bg-yellow-400/10 transition-all font-semibold">
              {t.speakWithExpert}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}