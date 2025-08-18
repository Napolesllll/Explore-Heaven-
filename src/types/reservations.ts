// types/reservations.ts
export type ReservationStatus =
    | "pendiente"
    | "confirmada"
    | "cancelada"
    | "completada"
    | "en_proceso";

export type Reservation = {
    id: string;
    tourId: string;
    tourNombre: string;
    tourImagen?: string;
    tourUbicacion: string;
    fechaSeleccionada: string;
    fechaCreacion: string;
    status: ReservationStatus;
    nombreReservante: string;
    correoReservante: string;
    telefonoReservante: string;
    adultos: number;
    niños: number;
    totalPersonas: number;
    participantes: {
        nombre: string;
        tipoDocumento: string;
        numeroDocumento: string;
        fechaNacimiento: string;
    }[];
    contactoEmergencia: {
        nombre: string;
        telefono: string;
    };
    precioTotal?: number;
    notas?: string;
    // Campos adicionales que pueden venir de la DB
    guiaNombre?: string | null;
    userName?: string;
    userEmail?: string;
};

export type StatsData = {
    totalReservas: number;
    totalPersonas: number;
    ingresosTotales: number;
    reservasHoy: number;
    reservasSemana: number;
    reservasMes: number;
    tourMasPopular: string;
    promedioPersonasPorReserva: number;
    tasaCrecimiento: number;
    reservasPorEstado: Record<ReservationStatus, number>;
    reservasPorMes: Array<{
        mes: string;
        reservas: number;
        ingresos: number;
    }>;
    tourStats: Array<{
        tourNombre: string;
        reservas: number;
        personas: number;
        ingresos: number;
    }>;
};