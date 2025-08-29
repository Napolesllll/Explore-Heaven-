import { ReactNode } from "react";

// types/index.ts
export type ClientAvailableDate = {
  id: string;
  date: string;
  tourId: string;
  createdAt: string;
  updatedAt: string;
};

// Definimos un tipo para la imagen destacada si es solo URL
export type ImageData = {
  src: string;
  alt?: string;
};

export type ClientTour = {
  ubicacion: ReactNode;
  imagenDestacada: ImageData | string; // puede ser URL o un objeto con src/alt
  id: string;
  nombre: string;
};

export interface Tour {
  id: string;
  nombre: string;
  descripcion: string;
  precio: string;
  salida: string;
  regreso: string;
  duracion: string;
  fotos: string[];
  incluido: string[];
  noIncluido: string[];
  outfit: string[];
}

export interface PersonData {
  nombre: string;
  tipoDocumento: string;
  numeroDocumento: string;
}

export interface FormData {
  nombre: string;
  correo: string;
  telefono: string;
  fecha: string;
  cantidadAdultos: number;
  cantidadNinos: number;
  adultos: PersonData[];
  ninos: PersonData[];
  contactoEmergencia: {
    nombre: string;
    telefono: string;
  };
}

export interface StepErrors {
  [key: string]: string;
}
