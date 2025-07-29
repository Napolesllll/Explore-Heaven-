'use client';

import { useEffect, useState } from "react";
import { format } from "date-fns";
import { toast } from "react-hot-toast";
import { ClientTour, ClientAvailableDate } from "@/types";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";

export default function AvailableDatesManager({ tour }: { tour: ClientTour }) {
  const [availableDates, setAvailableDates] = useState<ClientAvailableDate[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchDates = async () => {
      try {
        const res = await fetch(`/api/available-dates?tourId=${tour.id}`);
        const data = await res.json();
        setAvailableDates(data);
      } catch (error) {
        toast.error("Error al cargar fechas");
      }
    };
    fetchDates();
  }, [tour.id]);

  const handleAddDate = async () => {
    if (!selectedDate) return;
    setLoading(true);
    try {
      const res = await fetch("/api/available-dates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date: selectedDate, tourId: tour.id }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Ya existe esta fecha");
      }

      const newDate: ClientAvailableDate = await res.json();
      setAvailableDates([...availableDates, newDate]);
      setSelectedDate(null);
      toast.success("Fecha agregada");
    } catch (error: any) {
      toast.error(error.message || "Error al agregar fecha");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/available-dates/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("No se pudo eliminar");

      setAvailableDates(availableDates.filter((d) => d.id !== id));
      toast.success("Fecha eliminada");
    } catch {
      toast.error("Error al eliminar fecha");
    }
  };

  return (
    <div className="space-y-4 border rounded-xl p-4 shadow-md bg-white">
      <h2 className="text-xl font-semibold">Fechas disponibles para {tour.nombre}</h2>

      <Calendar
        mode="single"
        selected={selectedDate!}
        onSelect={setSelectedDate}
        className="rounded-md border"
      />

      <Button onClick={handleAddDate} disabled={!selectedDate || loading}>
        {loading ? "Agregando..." : "Agregar Fecha"}
      </Button>

      <ul className="mt-4 space-y-2">
        {availableDates.map((date) => (
          <li
            key={date.id}
            className="flex justify-between items-center bg-gray-100 px-3 py-2 rounded"
          >
            <span>{format(new Date(date.date), "dd/MM/yyyy")}</span>
            <button
              onClick={() => handleDelete(date.id)}
              className="text-red-600 hover:underline"
            >
              Eliminar
            </button>
          </li>
        ))}
        {availableDates.length === 0 && (
          <li className="text-gray-500 italic">No hay fechas disponibles</li>
        )}
      </ul>
    </div>
  );
}
