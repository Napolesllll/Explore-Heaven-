"use client";

import { useState, useEffect } from "react";

type Tour = {
  id: string;
  nombre: string;
  salida: string;
  regreso: string;
  imagenUrl?: string;
};

export default function ReservasPage() {
  const [tours, setTours] = useState<Tour[]>([]);
  const [selectedTour, setSelectedTour] = useState<string | null>(null);
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [fecha, setFecha] = useState("");
  const [hora, setHora] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchTours = async () => {
      try {
        const res = await fetch("/api/tours");
        const data = await res.json();
        setTours(data);
      } catch {
        setTours([]);
      }
    };
    fetchTours();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setSuccess(false);
    try {
      const res = await fetch("/api/reservas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre,
          correo,
          fecha,
          hora,
          tourId: selectedTour,
        }),
      });
      if (!res.ok) throw new Error("Error al reservar");
      setSuccess(true);
      setNombre("");
      setCorreo("");
      setFecha("");
      setHora("");
      setSelectedTour(null);
    } catch {
      setSuccess(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] p-4 flex flex-col items-center">
      <div className="w-full max-w-3xl bg-[#0f172a]/80 backdrop-blur-xl border border-cyan-500/30 rounded-3xl shadow-2xl shadow-cyan-500/10 p-8 mt-10">
        <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 mb-6 text-center">
          Reserva tu Experiencia
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-cyan-300 mb-2">
              Selecciona un Tour
            </label>
            <select
              value={selectedTour || ""}
              onChange={e => setSelectedTour(e.target.value)}
              className="w-full border border-cyan-500/30 bg-gray-900/50 text-white rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
              required
            >
              <option value="" disabled>
                -- Selecciona --
              </option>
              {tours.map(tour => (
                <option key={tour.id} value={tour.id}>
                  {tour.nombre} ({new Date(tour.salida).toLocaleDateString()} - {new Date(tour.regreso).toLocaleDateString()})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="nombre" className="block text-sm font-medium text-cyan-300 mb-2">
              Nombre completo
            </label>
            <input
              id="nombre"
              name="nombre"
              value={nombre}
              onChange={e => setNombre(e.target.value)}
              className="w-full border border-cyan-500/30 bg-gray-900/50 text-white rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
              placeholder="Tu nombre"
              required
            />
          </div>
          <div>
            <label htmlFor="correo" className="block text-sm font-medium text-cyan-300 mb-2">
              Correo electrónico
            </label>
            <input
              id="correo"
              name="correo"
              type="email"
              value={correo}
              onChange={e => setCorreo(e.target.value)}
              className="w-full border border-cyan-500/30 bg-gray-900/50 text-white rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
              placeholder="tucorreo@email.com"
              required
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="fecha" className="block text-sm font-medium text-cyan-300 mb-2">
                Fecha de reserva
              </label>
              <input
                id="fecha"
                name="fecha"
                type="date"
                value={fecha}
                onChange={e => setFecha(e.target.value)}
                className="w-full border border-cyan-500/30 bg-gray-900/50 text-white rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                required
              />
            </div>
            <div>
              <label htmlFor="hora" className="block text-sm font-medium text-cyan-300 mb-2">
                Hora
              </label>
              <input
                id="hora"
                name="hora"
                type="time"
                value={hora}
                onChange={e => setHora(e.target.value)}
                className="w-full border border-cyan-500/30 bg-gray-900/50 text-white rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                required
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-4 px-6 rounded-xl font-bold transition-all duration-500 flex items-center justify-center
              ${
                isLoading
                  ? "bg-gray-700 cursor-not-allowed"
                  : "bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40"
              }`}
          >
            {isLoading ? "Reservando..." : "Reservar"}
          </button>
          {success && (
            <div className="text-green-400 text-center font-semibold mt-4">
              ¡Reserva realizada con éxito!
            </div>
          )}
        </form>
      </div>
    </div>
      );
}