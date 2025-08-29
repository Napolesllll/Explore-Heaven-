"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";

export interface DateWithAvailability {
    id: string;
    date: string;
    dateObj: Date;
    reservasCount: number;
    spotsLeft: number;
    isAvailable: boolean;
    userHasReservation: boolean;
    reason?: string | null;
}

export const useAvailableDates = (tourId: string) => {
    const [availableDates, setAvailableDates] = useState<DateWithAvailability[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { data: session } = useSession();

    const fetchAvailableDates = useCallback(async () => {
        if (!tourId) {
            setAvailableDates([]);
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setError(null);

            console.log(`🔍 Cargando fechas disponibles para tour: ${tourId}`);

            const response = await fetch(`/api/available-dates?tourId=${tourId}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                throw new Error(`Error ${response.status}: ${response.statusText}`);
            }

            const dates: DateWithAvailability[] = await response.json();

            console.log("📅 Fechas recibidas:", {
                total: dates.length,
                disponibles: dates.filter((d) => d.isAvailable).length,
                usuarioConReservas: dates.filter((d) => d.userHasReservation).length,
            });

            const processedDates: DateWithAvailability[] = dates
                .map((date) => ({
                    ...date,
                    dateObj: new Date(date.date),
                }))
                .filter((date) => {
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    return date.dateObj >= today;
                })
                .sort((a, b) => a.dateObj.getTime() - b.dateObj.getTime());

            setAvailableDates(processedDates);
        } catch (err) {
            console.error("Error cargando fechas disponibles:", err);
            setError(err instanceof Error ? err.message : "Error desconocido");
            setAvailableDates([]);
        } finally {
            setLoading(false);
        }
    }, [tourId]);

    // Recargar cuando cambie el tourId o la sesión del usuario
    useEffect(() => {
        fetchAvailableDates();
    }, [fetchAvailableDates, session?.user?.id]);

    const refetchDates = () => {
        fetchAvailableDates();
    };

    const getDateInfo = (dateId: string) => {
        return availableDates.find((date) => date.id === dateId);
    };

    const isDateAvailable = (dateId: string) => {
        const dateInfo = getDateInfo(dateId);
        return dateInfo?.isAvailable || false;
    };

    const stats = {
        total: availableDates.length,
        available: availableDates.filter((d) => d.isAvailable).length,
        userReservations: availableDates.filter((d) => d.userHasReservation).length,
        fullyBooked: availableDates.filter((d) => !d.isAvailable && !d.userHasReservation).length,
    };

    return {
        availableDates,
        loading,
        error,
        refetchDates,
        getDateInfo,
        isDateAvailable,
        stats,
    };
};
