import { motion, AnimatePresence } from "framer-motion";
import { FaTimes, FaLock } from "react-icons/fa";

// Modal de Políticas de Protección de Datos
function PrivacyPolicyModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 ">
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative bg-gray-900 rounded-2xl border border-indigo-500/30 shadow-2xl max-w-4xl max-h-[80vh] overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-indigo-500/30">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-600/20 rounded-lg">
                  <FaLock className="text-indigo-400" />
                </div>
                <h2 className="text-xl font-bold text-indigo-300">
                  Políticas de Protección de Datos
                </h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
              >
                <FaTimes />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto max-h-[60vh] text-gray-300 space-y-4 text-sm">
              <section>
                <h3 className="text-indigo-400 font-semibold mb-2">
                  1. Recopilación de Información
                </h3>
                <p>
                  Recopilamos información personal necesaria para procesar
                  reservas y brindar nuestros servicios turísticos, incluyendo
                  nombres completos, documentos de identificación, fechas de
                  nacimiento, información de contacto y datos de emergencia.
                </p>
              </section>

              <section>
                <h3 className="text-indigo-400 font-semibold mb-2">
                  2. Uso de la Información
                </h3>
                <p>Sus datos se utilizan para:</p>
                <ul className="list-disc pl-5 mt-2 space-y-1">
                  <li>Procesar reservas y confirmaciones de tours</li>
                  <li>Gestionar seguros médicos y de viaje obligatorios</li>
                  <li>Cumplir con regulaciones turísticas y de seguridad</li>
                  <li>Comunicación relacionada con su reserva</li>
                  <li>Servicios de emergencia durante los tours</li>
                </ul>
              </section>

              <section>
                <h3 className="text-indigo-400 font-semibold mb-2">
                  3. Seguros Médicos
                </h3>
                <p>
                  Toda la información de identificación y fechas de nacimiento
                  son requeridas obligatoriamente por nuestras compañías
                  aseguradoras para garantizar cobertura médica completa durante
                  los tours. Esta información se comparte únicamente con
                  proveedores de seguros autorizados.
                </p>
              </section>

              <section>
                <h3 className="text-indigo-400 font-semibold mb-2">
                  4. Protección de Datos
                </h3>
                <p>
                  Implementamos medidas de seguridad técnicas y organizativas
                  para proteger su información personal contra acceso no
                  autorizado, alteración, divulgación o destrucción. Sus datos
                  se almacenan en servidores seguros con cifrado de nivel
                  empresarial.
                </p>
              </section>

              <section>
                <h3 className="text-indigo-400 font-semibold mb-2">
                  5. Compartir Información
                </h3>
                <p>
                  No vendemos ni compartimos su información personal con
                  terceros, excepto cuando es necesario para:
                </p>
                <ul className="list-disc pl-5 mt-2 space-y-1">
                  <li>Procesar seguros médicos y de viaje</li>
                  <li>Cumplir con regulaciones legales y gubernamentales</li>
                  <li>Servicios de emergencia médica durante tours</li>
                  <li>Proveedores de servicios turísticos autorizados</li>
                </ul>
              </section>

              <section>
                <h3 className="text-indigo-400 font-semibold mb-2">
                  6. Derechos del Usuario
                </h3>
                <p>Usted tiene derecho a:</p>
                <ul className="list-disc pl-5 mt-2 space-y-1">
                  <li>Acceder a su información personal</li>
                  <li>Rectificar datos incorrectos</li>
                  <li>
                    Solicitar eliminación de datos (sujeto a obligaciones
                    legales)
                  </li>
                  <li>Portabilidad de datos</li>
                  <li>Oponerse al procesamiento en casos específicos</li>
                </ul>
              </section>

              <section>
                <h3 className="text-indigo-400 font-semibold mb-2">
                  7. Retención de Datos
                </h3>
                <p>
                  Conservamos su información personal durante el tiempo
                  necesario para cumplir con los fines para los que fue
                  recopilada, incluyendo obligaciones legales, contables y de
                  seguros. Los datos de seguros se conservan según los
                  requerimientos de las aseguradoras.
                </p>
              </section>

              <section>
                <h3 className="text-indigo-400 font-semibold mb-2">
                  8. Contacto
                </h3>
                <p>
                  Para ejercer sus derechos o realizar consultas sobre el
                  tratamiento de sus datos personales, puede contactarnos a
                  través de nuestros canales oficiales disponibles en el perfil
                  de la empresa.
                </p>
              </section>

              <div className="bg-indigo-900/30 p-4 rounded-lg border border-indigo-500/30 mt-6">
                <p className="text-indigo-200 text-xs">
                  <strong>Última actualización:</strong>{" "}
                  {new Date().toLocaleDateString("es-ES")}
                  <br />
                  Al continuar con su reserva, usted acepta estas políticas de
                  protección de datos.
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="p-1 h-80 border-t border-indigo-500/30 ">
              <button
                onClick={onClose}
                className="w-full  bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
              >
                Entendido
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
export default PrivacyPolicyModal;
