// hooks/useAvailableDates.ts
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

interface DateWithAvailability {
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

    const fetchAvailableDates = async () => {
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
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`Error ${response.status}: ${response.statusText}`);
            }

            const dates = await response.json();

            console.log(`📅 Fechas recibidas:`, {
                total: dates.length,
                disponibles: dates.filter((d: any) => d.isAvailable).length,
                usuarioConReservas: dates.filter((d: any) => d.userHasReservation).length
            });

            // Procesar y filtrar fechas
            const processedDates = dates
                .map((date: any) => ({
                    ...date,
                    dateObj: new Date(date.date),
                }))
                .filter((date: DateWithAvailability) => {
                    // Solo mostrar fechas futuras
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    return date.dateObj >= today;
                })
                .sort((a: DateWithAvailability, b: DateWithAvailability) =>
                    a.dateObj.getTime() - b.dateObj.getTime()
                );

            setAvailableDates(processedDates);

        } catch (err) {
            console.error('Error cargando fechas disponibles:', err);
            setError(err instanceof Error ? err.message : 'Error desconocido');
            setAvailableDates([]);
        } finally {
            setLoading(false);
        }
    };

    // Recargar cuando cambie el tourId o la sesión del usuario
    useEffect(() => {
        fetchAvailableDates();
    }, [tourId, session?.user?.id]);

    const refetchDates = () => {
        fetchAvailableDates();
    };

    // Función para obtener información específica de una fecha por ID
    const getDateInfo = (dateId: string) => {
        return availableDates.find(date => date.id === dateId);
    };

    // Función para verificar si una fecha específica está disponible
    const isDateAvailable = (dateId: string) => {
        const dateInfo = getDateInfo(dateId);
        return dateInfo?.isAvailable || false;
    };

    // Obtener estadísticas
    const stats = {
        total: availableDates.length,
        available: availableDates.filter(d => d.isAvailable).length,
        userReservations: availableDates.filter(d => d.userHasReservation).length,
        fullyBooked: availableDates.filter(d => !d.isAvailable && !d.userHasReservation).length,
    };

    return {
        availableDates,
        loading,
        error,
        refetchDates,
        getDateInfo,
        isDateAvailable,
        stats
    };
};