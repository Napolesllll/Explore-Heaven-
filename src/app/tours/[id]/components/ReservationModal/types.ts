// src/app/tours/[id]/components/ReservationModal/types.ts

export type ReservationFormData = {
    nombre: string;
    correo: string;
    telefono: string;
    fechaId: string;
    adultos: number;
    niños: number;
    participantes: {
        nombre: string;
        tipoDocumento:
        | "cedula_ciudadania"
        | "cedula_extranjera"
        | "pasaporte"
        | "tarjeta_identidad";
        numeroDocumento: string;
        fechaNacimiento: string;
    }[];
    contactoEmergencia: {
        nombre: string;
        telefono: string;
    };
};

export type Tour = {
    id: string;
    nombre: string;
    precio: number;
    maxReservas: number;
};

export type AvailableDate = {
    id: string;
    dateObj: Date;
    isAvailable: boolean;
    spotsLeft: number;
    userHasReservation: boolean;
    reason?: string;
};

export type DateStats = {
    total: number;
    available: number;
    userReservations: number;
    fullyBooked: number;
};

export type CustomCalendarProps = {
    tour: Tour;
    selectedDateId: string;
    onDateSelect: (dateId: string) => void;
};

export type StepProps = {
    tour?: Tour;
    nextStep?: () => void;
    prevStep?: () => void;
    onSubmit?: () => void;
    isSubmitting?: boolean;
};

export const TIPOS_DOCUMENTO = [
    { value: "cedula_ciudadania", label: "Cédula de Ciudadanía" },
    { value: "cedula_extranjera", label: "Cédula de Extranjería" },
    { value: "pasaporte", label: "Pasaporte" },
    { value: "tarjeta_identidad", label: "Tarjeta de Identidad (Menores)" },
];