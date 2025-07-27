"use client";

import { useState } from "react";

// Componente para mostrar una reserva individual
export default function ReservaItem({ reserva, onUpdate }: { reserva: any, onUpdate: () => void }) {
  const [showReprogramar, setShowReprogramar] = useState(false);
  const [nuevaFecha, setNuevaFecha] = useState("");
  const [loading, setLoading] = useState(false);

  // Cancela la reserva
  const cancelarReserva = async () => {
    setLoading(true);
    const res = await fetch(`/api/reservas/${reserva.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "cancelar" }),
    });
    setLoading(false);
    if (res.ok) {
      alert("Reserva cancelada");
      onUpdate();
    } else {
      alert("Error al cancelar reserva");
    }
  };

  // Reprograma la reserva
  const reprogramarReserva = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch(`/api/reservas/${reserva.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "reprogramar", nuevaFecha }),
    });
    setLoading(false);
    if (res.ok) {
      alert("Reserva reprogramada");
      setShowReprogramar(false);
      setNuevaFecha("");
      onUpdate();
    } else {
      alert("Error al reprogramar reserva");
    }
  };

  return (
    <div className="bg-gray-900 rounded-xl p-6 flex flex-col md:flex-row md:items-center md:justify-between border border-yellow-800 shadow-lg hover:shadow-yellow-500/30 transition-shadow animate-fade-in mb-4">
      <div>
        {/* Muestra el nombre del tour usando la relación */}
        <div className="text-lg font-bold text-yellow-300">
          {reserva.Tour?.nombre || `Tour ID: ${reserva.tourId}`}
        </div>
        <div className="text-gray-300">
          <span className="mr-4">
            Fecha: <span className="text-yellow-400">{reserva.fecha}</span>
          </span>
          <span>
            Hora: <span className="text-yellow-400">{reserva.hora || "No especificada"}</span>
          </span>
        </div>
        <div className="text-sm text-yellow-500 mt-1">
          Estado: {reserva.estado || "Pagada"}
        </div>
      </div>
      <div className="mt-4 md:mt-0 flex flex-col md:flex-row items-center gap-4">
        {reserva.estado !== "Cancelada" && (
          <> 
            <button
              onClick={cancelarReserva}
              disabled={loading}
              className="bg-gradient-to-r from-red-500 to-yellow-700 text-black px-4 py-2 rounded-lg font-bold shadow-md hover:from-red-400 hover:to-yellow-600 hover:scale-105 transition-all animate-glow"
            >
              Cancelar
            </button>
            <button
              onClick={() => setShowReprogramar(!showReprogramar)}
              className="bg-gradient-to-r from-yellow-500 to-yellow-700 text-black px-4 py-2 rounded-lg font-bold shadow-md hover:from-yellow-400 hover:to-yellow-600 hover:scale-105 transition-all animate-glow"
            >
              Reprogramar
            </button>
          </>
        )}
      </div>
      {showReprogramar && (
        <form onSubmit={reprogramarReserva} className="mt-4 flex flex-col gap-2 w-full">
          <input
            type="date"
            value={nuevaFecha}
            onChange={e => setNuevaFecha(e.target.value)}
            className="border border-yellow-600 bg-gray-900 text-yellow-200 p-2 rounded-md"
            min={new Date().toISOString().split("T")[0]}
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-gradient-to-r from-yellow-500 to-yellow-700 text-black px-4 py-2 rounded-lg font-bold shadow-md hover:from-yellow-400 hover:to-yellow-600 hover:scale-105 transition-all animate-glow"
          >
            {loading ? "Reprogramando..." : "Confirmar nueva fecha"}
          </button>
        </form>
      )}
    </div>
  );
}