"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import { toast } from "react-hot-toast";
import { ClientTour, ClientAvailableDate } from "../../../types";
import { Button } from "../components/ui/button";
import { Calendar } from "../components/ui/calendar";
import { Plus, Trash2, Loader2, CalendarDays } from "lucide-react";

export default function AvailableDatesManager({ tour }: { tour: ClientTour }) {
  const [availableDates, setAvailableDates] = useState<ClientAvailableDate[]>(
    []
  );
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);
  const [bulkAdding, setBulkAdding] = useState(false);

  useEffect(() => {
    const fetchDates = async () => {
      try {
        const res = await fetch(`/api/available-dates?tourId=${tour.id}`);
        const data = await res.json();
        setAvailableDates(data);
      } catch {
        toast.error("Error al cargar fechas");
      }
    };
    fetchDates();
  }, [tour.id]);

  const handleAddDates = async () => {
    if (selectedDates.length === 0) return;

    setBulkAdding(true);
    try {
      const results = await Promise.allSettled(
        selectedDates.map((date) =>
          fetch("/api/available-dates", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ date, tourId: tour.id }),
          }).then((res) => res.json())
        )
      );

      const newDates: ClientAvailableDate[] = [];
      let errorCount = 0;

      results.forEach((result) => {
        if (result.status === "fulfilled" && result.value.id) {
          newDates.push(result.value);
        } else {
          errorCount++;
        }
      });

      if (newDates.length > 0) {
        setAvailableDates((prev) => [...prev, ...newDates]);
        toast.success(`${newDates.length} fechas agregadas`);
      }

      if (errorCount > 0) {
        toast.error(`${errorCount} fechas no pudieron agregarse`);
      }

      setSelectedDates([]);
    } catch (error: unknown) {
      toast.error(
        error instanceof Error
          ? `Error crítico: ${error.message}`
          : "Error crítico al agregar fechas"
      );
    } finally {
      setBulkAdding(false);
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

  const isDateRegistered = (date: Date) => {
    return availableDates.some(
      (d) =>
        format(new Date(d.date), "yyyy-MM-dd") === format(date, "yyyy-MM-dd")
    );
  };

  return (
    <div className="space-y-6 border rounded-2xl p-6 shadow-xl bg-gradient-to-br from-white to-blue-50 text-gray-800 max-w-5xl mx-auto">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <CalendarDays className="text-blue-600" size={24} />
            Fechas disponibles para {tour.nombre}
          </h2>
          <p className="text-gray-600 mt-1">
            Selecciona múltiples fechas antes de agregarlas
          </p>
        </div>
        <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
          {availableDates.length} fechas
        </div>
      </div>

      <div className="bg-white rounded-xl border border-blue-200 p-5 shadow-sm">
        <Calendar
          mode="multiple"
          selected={selectedDates}
          onSelect={setSelectedDates}
          className="w-full"
          modifiers={{
            registered: availableDates.map((d) => new Date(d.date)),
          }}
          modifiersStyles={{
            registered: {
              border: "2px solid #10b981",
              borderRadius: "4px",
            },
            selected: {
              backgroundColor: "#3b82f6",
              color: "white",
            },
          }}
          disabled={(date) => date < new Date() || isDateRegistered(date)}
          numberOfMonths={1}
        />

        <div className="flex flex-wrap gap-3 mt-4">
          {selectedDates.map((date) => (
            <div
              key={date.toString()}
              className="flex items-center bg-blue-100 px-3 py-1.5 rounded-full text-blue-800 font-medium"
            >
              {format(date, "dd/MM/yyyy")}
              <button
                onClick={() =>
                  setSelectedDates(selectedDates.filter((d) => d !== date))
                }
                className="ml-2 text-blue-600 hover:text-blue-800"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-600">
          {selectedDates.length} fechas seleccionadas
        </div>

        <Button
          onClick={handleAddDates}
          disabled={selectedDates.length === 0 || bulkAdding}
          className="bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white shadow-lg transition-all"
        >
          {bulkAdding ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Procesando...
            </>
          ) : (
            <>
              <Plus className="mr-2 h-4 w-4" />
              Agregar ({selectedDates.length}) fechas
            </>
          )}
        </Button>
      </div>

      <div className="mt-6">
        <h3 className="font-semibold text-lg mb-3 text-gray-700">
          Fechas registradas
        </h3>

        {availableDates.length > 0 ? (
          <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {availableDates
              .slice()
              .sort(
                (a, b) =>
                  new Date(a.date).getTime() - new Date(b.date).getTime()
              )
              .map((date) => (
                <li
                  key={date.id}
                  className="flex justify-between items-center bg-white border border-gray-200 px-4 py-3 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                >
                  <span className="font-medium">
                    {format(new Date(date.date), "dd/MM/yyyy")}
                  </span>
                  <button
                    onClick={() => handleDelete(date.id)}
                    className="text-red-600 hover:text-red-800 transition-colors p-1 rounded-full hover:bg-red-50"
                    title="Eliminar fecha"
                  >
                    <Trash2 size={18} />
                  </button>
                </li>
              ))}
          </ul>
        ) : (
          <div className="text-center py-8 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
            <p className="text-gray-500 italic">
              No hay fechas disponibles registradas
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
