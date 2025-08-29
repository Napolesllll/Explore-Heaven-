interface Tour {
  nombre: string;
  descripcion: string;
  precio: string | number;
  salida: string;
  regreso: string;
  duracion: string;
}

interface TourDetailsProps {
  tour: Tour;
}

export default function TourDetails({ tour }: TourDetailsProps) {
  return (
    <section className="space-y-8" aria-labelledby="tour-title">
      <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 px-6 py-3 rounded-xl inline-block mb-4">
        <h2 id="tour-title" className="text-2xl font-bold text-gray-900">
          {tour.nombre}
        </h2>
      </div>
      <p className="text-gray-300 leading-relaxed italic text-center md:text-left">
        {tour.descripcion}
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
        <div className="flex items-center gap-3 bg-gray-800/50 p-4 rounded-xl">
          <span className="text-yellow-400 font-semibold" aria-hidden>
            💰
          </span>
          <div>
            <p className="text-gray-400 text-sm">Precio</p>
            <p className="text-white font-medium">{tour.precio}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 bg-gray-800/50 p-4 rounded-xl">
          <span className="text-yellow-400 font-semibold" aria-hidden>
            🕐
          </span>
          <div>
            <p className="text-gray-400 text-sm">Salida</p>
            <p className="text-white font-medium">{tour.salida}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 bg-gray-800/50 p-4 rounded-xl">
          <span className="text-yellow-400 font-semibold" aria-hidden>
            🔁
          </span>
          <div>
            <p className="text-gray-400 text-sm">Regreso</p>
            <p className="text-white font-medium">{tour.regreso}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 bg-gray-800/50 p-4 rounded-xl">
          <span className="text-yellow-400 font-semibold" aria-hidden>
            ⏳
          </span>
          <div>
            <p className="text-gray-400 text-sm">Duración</p>
            <p className="text-white font-medium">{tour.duracion}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
