import { ReactNode } from "react";

// types/index.ts
export type ClientAvailableDate = {
  id: string;
  date: string;
  tourId: string;
  createdAt: string;
  updatedAt: string;
};

export type ClientTour = {
  ubicacion: ReactNode;
  imagenDestacada: any;
  id: string;
  nombre: string;
};
