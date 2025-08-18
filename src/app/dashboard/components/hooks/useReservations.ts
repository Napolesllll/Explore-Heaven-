// hooks/useReservations.ts
import { useState, useEffect, useCallback } from 'react';
import { Reservation, ReservationStatus, StatsData } from '../../../../types/reservations';

export const useReservations = () => {
    const [reservations, setReservations] = useState<Reservation[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchReservations = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await fetch('/api/admin/reservas');

            if (!response.ok) {
                throw new Error(`Error ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();
            setReservations(data.reservas || []);
        } catch (err) {
            console.error('Error al cargar reservas:', err);
            setError(err instanceof Error ? err.message : 'Error desconocido');
            setReservations([]);
        } finally {
            setLoading(false);
        }
    }, []);

    const updateReservationStatus = async (reservationId: string, newStatus: ReservationStatus) => {
        try {
            const response = await fetch('/api/admin/reservas', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    reservaId: reservationId,
                    nuevoEstado: mapStatusToEstado(newStatus)
                })
            });

            if (!response.ok) {
                throw new Error('Error al actualizar estado');
            }

            // Actualizar el estado local
            setReservations((prev) =>
                prev.map((res) =>
                    res.id === reservationId ? { ...res, status: newStatus } : res
                )
            );

            return true;
        } catch (error) {
            console.error("Error updating status:", error);
            throw error;
        }
    };

    const deleteReservation = async (reservationId: string) => {
        try {
            const response = await fetch(`/api/admin/reservas/${reservationId}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Error al eliminar reserva');
            }

            // Actualizar el estado local
            setReservations((prev) =>
                prev.filter((res) => res.id !== reservationId)
            );

            return true;
        } catch (error) {
            console.error("Error deleting reservation:", error);
            throw error;
        }
    };

    useEffect(() => {
        fetchReservations();
    }, [fetchReservations]);

    return {
        reservations,
        loading,
        error,
        fetchReservations,
        updateReservationStatus,
        deleteReservation,
    };
};

export const useReservationStats = (timeRange: 'week' | 'month' | 'year' = 'month') => {
    const [stats, setStats] = useState<StatsData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchStats = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await fetch(`/api/admin/stats?timeRange=${timeRange}`);

            if (!response.ok) {
                throw new Error(`Error ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();
            setStats(data);
        } catch (err) {
            console.error('Error al cargar estadísticas:', err);
            setError(err instanceof Error ? err.message : 'Error desconocido');
            // Establecer datos por defecto en caso de error
            setStats({
                totalReservas: 0,
                totalPersonas: 0,
                ingresosTotales: 0,
                reservasHoy: 0,
                reservasSemana: 0,
                reservasMes: 0,
                tourMasPopular: 'N/A',
                promedioPersonasPorReserva: 0,
                tasaCrecimiento: 0,
                reservasPorEstado: {
                    confirmada: 0,
                    pendiente: 0,
                    cancelada: 0,
                    completada: 0,
                    en_proceso: 0,
                },
                reservasPorMes: [],
                tourStats: [],
            });
        } finally {
            setLoading(false);
        }
    }, [timeRange]);

    useEffect(() => {
        fetchStats();
    }, [fetchStats]);

    return {
        stats,
        loading,
        error,
        refetch: fetchStats,
    };
};

// Función auxiliar para mapear status a estado
const mapStatusToEstado = (status: ReservationStatus): string => {
    const statusMap = {
        'pendiente': 'Pendiente',
        'confirmada': 'Confirmada',
        'cancelada': 'Cancelada',
        'completada': 'Completada',
        'en_proceso': 'En proceso'
    };

    return statusMap[status] || 'Pendiente';
};