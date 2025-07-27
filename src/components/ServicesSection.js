// components/ServicesSection.js
'use client';

import { GlobeAltIcon, ShieldCheckIcon, MapIcon, ClockIcon, UserGroupIcon } from '@heroicons/react/24/outline';
import ServiceCard from './ServiceCard';

export default function ServicesSection() {
  return (
    <section id="services" className="py-20 bg-gray-50 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Encabezado */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-yellow-600">
              Premium Security & Guidance Services
            </span> 
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Designed for international travelers seeking safe and authentic experiences in Medellín
          </p>
        </div>

        {/* Grid de Servicios */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <ServiceCard
            icon={<UserGroupIcon className="h-8 w-8" />}
            title="Certified Local Guides"
            description="Bilingual professionals with security training and local knowledge"
            badge="Most Popular"
            badgeColor="bg-yellow-400"
          />
          
          <ServiceCard
            icon={<ShieldCheckIcon className="h-8 w-8" />}
            title="Secure Transportation"
            description="Armored vehicles with GPS tracking and verified drivers"
            badge="Included"
            badgeColor="bg-emerald-500"
          />
          
          <ServiceCard
            icon={<MapIcon className="h-8 w-8" />}
            title="Custom Itineraries"
            description="Personalized routes avoiding high-risk areas with real-time updates"
            badge="Tailored"
            badgeColor="bg-blue-500"
          />
          
          <ServiceCard
            icon={<ClockIcon className="h-8 w-8" />}
            title="24/7 Support"
            description="Immediate assistance in English, French, and German"
            badge="24/7"
            badgeColor="bg-red-500"
          />
          
          <ServiceCard
            icon={<GlobeAltIcon className="h-8 w-8" />}
            title="Cultural Mediation"
            description="Navigate local customs and communication barriers safely"
          />
          
          <ServiceCard
            icon={<ShieldCheckIcon className="h-8 w-8" />}
            title="Emergency Protocols"
            description="Instant access to medical and security networks"
            badge="Critical"
            badgeColor="bg-red-500"
          />
        </div>

        {/* Comparativa de Seguridad */}
              <div className="mt-16 bg-white rounded-xl shadow-lg p-8">
                  <h3 className="text-3xl font-bold mb-8 text-center text-gray-900">
                      Why We're Different
                  </h3>
                  <div className="grid md:grid-cols-3 gap-6">
                      <div className="text-center p-4">
                          <div className="text-5xl font-extrabold text-yellow-600 mb-3">100%</div>
                          <div className="text-lg font-medium text-gray-800">
                              Verified Safe Locations
                          </div>
                      </div>
                      <div className="text-center p-4 border-x border-gray-200">
                          <div className="text-5xl font-extrabold text-emerald-600 mb-3">24/7</div>
                          <div className="text-lg font-medium text-gray-800">
                              Security Monitoring
                          </div>
                      </div>
                      <div className="text-center p-4">
                          <div className="text-5xl font-extrabold text-blue-600 mb-3">500+</div>
                          <div className="text-lg font-medium text-gray-900">
                              Satisfied International Clients
                          </div>
                      </div>
                  </div>
              </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <h3 className="text-3xl font-bold text-gray-900 mb-4">Ready for a Worry-Free Experience?</h3>
          <p className="text-gray-600 mb-8 max-w-xl mx-auto">
            Our security experts will contact you to design your perfect safe itinerary
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button className="bg-yellow-400 text-gray-900 px-8 py-4 rounded-full hover:bg-yellow-300 transition-all font-bold shadow-lg hover:shadow-yellow-400/30">
              Customize Your Plan
            </button>
            <button className="border-2 border-yellow-400 text-yellow-400 px-8 py-4 rounded-full hover:bg-yellow-400/10 transition-all font-semibold">
              Speak with Security Expert
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}