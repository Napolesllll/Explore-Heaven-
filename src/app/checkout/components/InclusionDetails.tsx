import { CheckCircle, X as XIcon, Info } from "lucide-react";

/**
 * Definición del tipo Tour con las propiedades específicas que necesita este componente
 * Reemplaza el tipo 'any' para mayor seguridad de tipos
 */
interface Tour {
  incluido: string[]; // Array de elementos incluidos en el tour (transporte, guía, etc.)
  noIncluido: string[]; // Array de elementos no incluidos en el tour (comidas, propinas, etc.)
  outfit: string[]; // Array de recomendaciones de vestimenta/equipamiento para el tour
}

/**
 * Props del componente InclusionDetails
 * Usa el tipo Tour específico en lugar de any para mejor tipado
 */
interface InclusionDetailsProps {
  tour: Tour;
}

/**
 * Componente que muestra los detalles de inclusión del tour en tres columnas
 * Renderiza tres secciones principales:
 * 1. Lo que incluye el tour (con íconos verdes)
 * 2. Lo que no incluye el tour (con íconos rojos)
 * 3. Recomendaciones de vestimenta/equipamiento (con íconos azul-verde)
 *
 * @param tour - Objeto que contiene la información del tour
 */
export default function InclusionDetails({ tour }: InclusionDetailsProps) {
  return (
    // Contenedor principal con grid responsivo (1 columna en móvil, 3 en desktop)
    <section className="pt-6 grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
      {/* PRIMERA COLUMNA: Sección de elementos incluidos en el tour */}
      <div className="bg-gray-800/50 p-5 rounded-2xl">
        {/* Encabezado con ícono de check verde y título */}
        <h3 className="font-bold text-yellow-400 mb-3 flex items-center gap-2">
          <CheckCircle className="w-5 h-5" /> Incluye
        </h3>
        {/* Lista de elementos incluidos */}
        <ul className="space-y-2">
          {/* Mapeo de cada elemento incluido con bullet point amarillo */}
          {tour.incluido.map((item: string, i: number) => (
            <li key={i} className="flex items-start">
              {/* Bullet point circular amarillo */}
              <div className="w-2 h-2 rounded-full bg-yellow-500 mt-2 mr-2 flex-shrink-0" />
              {/* Texto del elemento incluido */}
              <span className="text-gray-300">{item}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* SEGUNDA COLUMNA: Sección de elementos NO incluidos en el tour */}
      <div className="bg-gray-800/50 p-5 rounded-2xl">
        {/* Encabezado con ícono X rojo y título */}
        <h3 className="font-bold text-yellow-400 mb-3 flex items-center gap-2">
          <XIcon className="w-5 h-5" /> No incluye
        </h3>
        {/* Lista de elementos no incluidos */}
        <ul className="space-y-2">
          {/* Mapeo de cada elemento no incluido con bullet point rojo */}
          {tour.noIncluido.map((item: string, i: number) => (
            <li key={i} className="flex items-start">
              {/* Bullet point circular rojo */}
              <div className="w-2 h-2 rounded-full bg-red-500 mt-2 mr-2 flex-shrink-0" />
              {/* Texto del elemento no incluido */}
              <span className="text-gray-300">{item}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* TERCERA COLUMNA: Sección de recomendaciones de vestimenta/equipamiento */}
      <div className="bg-gray-800/50 p-5 rounded-2xl">
        {/* Encabezado con ícono de información azul y título */}
        <h3 className="font-bold text-yellow-400 mb-3 flex items-center gap-2">
          <Info className="w-5 h-5" /> Recomendaciones
        </h3>
        {/* Lista de recomendaciones */}
        <ul className="space-y-2">
          {/* Mapeo de cada recomendación con bullet point verde esmeralda */}
          {tour.outfit.map((item: string, i: number) => (
            <li key={i} className="flex items-start">
              {/* Bullet point circular verde esmeralda */}
              <div className="w-2 h-2 rounded-full bg-emerald-500 mt-2 mr-2 flex-shrink-0" />
              {/* Texto de la recomendación */}
              <span className="text-gray-300">{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
