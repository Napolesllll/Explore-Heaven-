import { Info } from "lucide-react";

interface EmergencyContact {
  nombre?: string;
  telefono?: string;
}

interface CheckoutFormData {
  contactoEmergencia?: EmergencyContact;
}

interface Step4EmergencyContactProps {
  formData: CheckoutFormData;
  setFormData: React.Dispatch<React.SetStateAction<CheckoutFormData>>;
  stepErrors: { [key: string]: string };
}

export default function Step4EmergencyContact({
  formData,
  setFormData,
  stepErrors,
}: Step4EmergencyContactProps) {
  return (
    <div className="space-y-5">
      <div className="text-center mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-yellow-400">
          Contacto de emergencia
        </h2>
        <p className="text-gray-400 text-sm mt-2">
          Persona a contactar en caso de emergencia
        </p>
      </div>

      <div className="bg-gray-800/50 p-4 rounded-xl space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Nombre completo */}
          <div>
            <label className="block text-yellow-400 font-medium mb-2">
              Nombre completo
            </label>
            <input
              type="text"
              placeholder="Nombre del contacto de emergencia"
              value={formData.contactoEmergencia?.nombre || ""}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  contactoEmergencia: {
                    ...prev.contactoEmergencia,
                    nombre: e.target.value,
                  },
                }))
              }
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:ring-2 focus:ring-yellow-500 text-sm"
            />
            {stepErrors.contactoNombre && (
              <p className="text-red-400 text-sm mt-1">
                {stepErrors.contactoNombre}
              </p>
            )}
          </div>

          {/* Teléfono */}
          <div>
            <label className="block text-yellow-400 font-medium mb-2">
              Teléfono
            </label>
            <input
              type="tel"
              placeholder="Número de teléfono"
              value={formData.contactoEmergencia?.telefono || ""}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  contactoEmergencia: {
                    ...prev.contactoEmergencia,
                    telefono: e.target.value,
                  },
                }))
              }
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:ring-2 focus:ring-yellow-500 text-sm"
            />
            {stepErrors.contactoTelefono && (
              <p className="text-red-400 text-sm mt-1">
                {stepErrors.contactoTelefono}
              </p>
            )}
          </div>
        </div>

        {/* Nota */}
        <div className="text-center text-sm text-gray-400 bg-gray-700/50 rounded-lg p-3">
          <p className="flex items-center justify-center gap-2">
            <Info className="w-4 h-4" />
            Esta información solo se usará en caso de emergencia durante el tour
          </p>
        </div>
      </div>
    </div>
  );
}
