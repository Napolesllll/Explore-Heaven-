// Definición de interfaces
export interface AvailableDate {
    id: string;
    date: string;
}

export interface Tour {
    id: string;
    nombre: string;
    descripcion: string;
    precio: number;
    imagenUrl: string;
    gallery?: string | null;
    ubicacion: string;
    salida?: string;
    regreso?: string;
    maxReservas: number;
    guias: string;
    availableDates: AvailableDate[];
}

export interface ReservationFormData {
    nombre: string;
    correo: string;
    telefono: string;
    fechaId: string;
}

export interface Review {
    id: string;
    rating: number;
    comment: string | null;
    createdAt: string;
    userId: string;
    user: {
        id: string;
        name: string | null;
        image: string | null;
    };
}
