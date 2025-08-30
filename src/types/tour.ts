// src/types/tour.ts
export interface Tour {
    id: string;
    nombre: string;
    descripcion: string;
    precio: number;
    ubicacion: string;
    imagenUrl?: string;
    gallery?: string[];
    salida?: string;
    regreso?: string;
    maxReservas?: number;
    guias?: string[];
    createdAt: string;
    updatedAt: string;
}