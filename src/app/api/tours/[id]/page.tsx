// app/tours/[id]/page.tsx
import { notFound } from "next/navigation";
import  prisma  from "../../../../lib/prismadb"; // Correct import for prisma
import Image from "next/image";

export default async function TourDetailPage({ params }: { params: { id: string } }) {
  const tour = await prisma.tour.findUnique({ where: { id: params.id } });

  if (!tour) return notFound();

  return (
    <div className="max-w-5xl mx-auto py-12 px-4 text-white">
      {/* Encabezado con imagen */}
      <div className="relative h-[300px] md:h-[400px] rounded-2xl overflow-hidden shadow-xl">
        <Image
          src={tour.imagenUrl}
          alt={tour.nombre}
          fill
          className="object-cover brightness-75"
          priority
        />
        <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
          <h1 className="text-3xl md:text-5xl font-bold text-yellow-500">{tour.nombre}</h1>
        </div>
      </div>

      {/* Información principal */}
      <div className="mt-8 grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-4">
          <h2 className="text-2xl font-semibold text-yellow-400">Descripción</h2>
          <p className="text-gray-300 whitespace-pre-line leading-relaxed">{tour.descripcion}</p>
        </div>
        <div className="bg-gradient-to-br from-gray-900 to-black p-6 rounded-2xl border border-yellow-700 space-y-4">
          <h3 className="text-xl font-bold text-yellow-500">Detalles del Tour</h3>
          <p><span className="font-semibold text-yellow-400">Salida:</span> {new Date(tour.salida).toLocaleString()}</p>
          <p><span className="font-semibold text-yellow-400">Regreso:</span> {new Date(tour.regreso).toLocaleString()}</p>
          <p><span className="font-semibold text-yellow-400">Máx. Personas:</span> {tour.maxReservas}</p>
          <p><span className="font-semibold text-yellow-400">Guías requeridos:</span> {tour.guias}</p>
          <button className="mt-4 w-full bg-yellow-600 hover:bg-yellow-700 transition text-black font-bold py-3 px-6 rounded-lg shadow-lg">
            Reservar este tour
          </button>
        </div>
      </div>
    </div>
  );
}
 