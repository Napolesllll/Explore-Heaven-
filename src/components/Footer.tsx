// components/Footer.tsx
'use client';

import { 
  GlobeAltIcon, 
  ShieldCheckIcon, 
  PhoneIcon, 
  MapPinIcon, 
  ChatBubbleLeftRightIcon,
  BuildingStorefrontIcon
} from '@heroicons/react/24/outline';
import { 
  FaWhatsapp, 
  FaInstagram, 
  FaFacebookF, 
  FaCcVisa,
  FaCcMastercard,
  FaCcPaypal, 
  FaShieldAlt
} from 'react-icons/fa';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  // Mismos enlaces que el Navbar
  const navItems = [
    { id: 'services', label: 'Services', href: '#services' },
    { id: 'toursSection', label: 'Tours', href: '#toursSection' },
    { id: 'safety', label: 'Safety Tips', href: '#safety' },
    { id: 'contact', label: 'Contact', href: '#contact' },
    { id: 'blog', label: 'Blog', href: '/blog' },
  ];

  return (
    <footer className="bg-gradient-to-b from-gray-900 to-black text-gray-300 border-t border-yellow-500/20">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
        
        {/* Brand & Description */}
        <div className="space-y-6">
          <div className="flex items-center">
            <GlobeAltIcon className="h-10 w-10 text-yellow-400" />
            <h2 className="ml-3 text-2xl font-bold text-white">
              <span className="text-yellow-400">Explore</span> Heaven
            </h2>
          </div>
          <p className="leading-relaxed">
            Tu puerta de entrada a experiencias seguras e inolvidables en Medellín. 
            Conectamos viajeros con guías certificados y experiencias auténticas.
          </p>
          
          {/* Security Badges */}
          <div className="pt-4">
            <div className="flex items-center space-x-2 mb-3">
              <FaShieldAlt className="h-5 w-5 text-green-500" />
              <span className="text-sm font-medium">Verificación de seguridad 360°</span>
            </div>
            <div className="flex space-x-4">
              <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-2 flex items-center">
                <ShieldCheckIcon className="h-8 w-8 text-yellow-500 mr-2" />
                <span className="text-xs">Guías <br/>Certificados</span>
              </div>
              <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-2 flex items-center">
                <FaShieldAlt className="h-8 w-8 text-green-500 mr-2" />
                <span className="text-xs">Seguridad <br/>Garantizada</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Quick Links (ahora con los mismos enlaces que el Navbar) */}
        <div>
          <h3 className="text-lg font-bold text-white mb-6 pb-2 border-b border-yellow-500/30 inline-block">
            Enlaces Rápidos
          </h3>
          <ul className="space-y-4">
            {navItems.map((item, index) => (
              <li key={index}>
                <a 
                  href={item.href}
                  className="flex items-center hover:text-yellow-400 transition-colors duration-300 group"
                >
                  <span className="mr-3 opacity-80 group-hover:opacity-100 transition-opacity">↠</span>
                  <span className="group-hover:translate-x-1 transition-transform">
                    {item.label}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
        
        {/* Contact Information */}
        <div>
          <h3 className="text-lg font-bold text-white mb-6 pb-2 border-b border-yellow-500/30 inline-block">
            Contacto
          </h3>
          <ul className="space-y-5">
            <li className="flex">
              <PhoneIcon className="h-5 w-5 text-yellow-400 mt-0.5 mr-3 flex-shrink-0" />
              <div>
                <span className="block text-sm">+57 300 123 4567</span>
                <span className="text-xs text-gray-400">Disponible 24/7</span>
              </div>
            </li>
            <li className="flex">
              <MapPinIcon className="h-5 w-5 text-yellow-400 mt-0.5 mr-3 flex-shrink-0" />
              <div>
                <span className="block text-sm">El Poblado, Medellín</span>
                <span className="text-xs text-gray-400">Carrera 43A #6-45</span>
              </div>
            </li>
            <li className="pt-4">
              <h4 className="text-sm font-bold text-white mb-3">Soporte Inmediato</h4>
              <a 
                href="https://wa.me/573001234567" 
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors duration-300"
              >
                <FaWhatsapp className="h-5 w-5 mr-2" />
                WhatsApp de Emergencia
              </a>
            </li>
          </ul>
        </div>
        
        {/* Social & Payment (solo Facebook e Instagram) */}
        <div>
          <h3 className="text-lg font-bold text-white mb-6 pb-2 border-b border-yellow-500/30 inline-block">
            Conéctate
          </h3>
          <div className="mb-8">
            <div className="flex space-x-4 mb-6">
              <a 
                href="#" 
                className="bg-gradient-to-r from-purple-500 to-pink-500 w-10 h-10 rounded-full flex items-center justify-center text-white hover:opacity-90 transition-opacity"
              >
                <FaInstagram className="h-6 w-6" />
              </a>
              <a 
                href="#" 
                className="bg-blue-600 w-10 h-10 rounded-full flex items-center justify-center text-white hover:opacity-90 transition-opacity"
              >
                <FaFacebookF className="h-5 w-5" />
              </a>
            </div>
            <p className="text-sm">
              Siguenos para descuentos exclusivos y consejos de seguridad en tiempo real.
            </p>
          </div>
          
          <div>
            <h4 className="text-sm font-bold text-white mb-3">Métodos de Pago Seguros</h4>
            <div className="flex space-x-3">
              <div className="bg-white p-2 rounded-md">
                <FaCcVisa className="h-6 w-6 text-blue-900" />
              </div>
              <div className="bg-white p-2 rounded-md">
                <FaCcMastercard className="h-6 w-6 text-red-600" />
              </div>
              <div className="bg-white p-2 rounded-md">
                <FaCcPaypal className="h-6 w-6 text-blue-500" />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer Bottom */}
      <div className="border-t border-gray-800 py-6">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-500">
            © {currentYear} Explore Heaven. Todos los derechos reservados.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="text-sm text-gray-400 hover:text-yellow-400 transition-colors">
              Términos y Condiciones
            </a>
            <a href="#" className="text-sm text-gray-400 hover:text-yellow-400 transition-colors">
              Política de Privacidad
            </a>
            <a href="#" className="text-sm text-gray-400 hover:text-yellow-400 transition-colors">
              Seguridad
            </a>
          </div>
        </div>
      </div>
      
      {/* Floating Help Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <a 
          href="https://wa.me/573001234567" 
          target="_blank"
          rel="noopener noreferrer"
          className="w-14 h-14 rounded-full bg-green-600 hover:bg-green-700 flex items-center justify-center text-white shadow-lg animate-pulse transition-all duration-300 hover:animate-none hover:scale-110"
        >
          <FaWhatsapp className="h-8 w-8" />
        </a>
      </div>
    </footer>
  );
};

export default Footer;