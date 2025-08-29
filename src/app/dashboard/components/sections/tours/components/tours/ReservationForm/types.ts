export type Person = {
    nombre: string;
    tipoDocumento: string;
    numeroDocumento: string;
    fechaNacimiento?: string;
};

export type ReservationFormData = {
    nombre: string;
    correo: string;
    fecha: string;
    telefono: string;
    cantidadAdultos: number;
    cantidadNinos: number;
    adultos: Person[];
    ninos: Person[];
    contactoEmergencia: { nombre: string; telefono: string };
};

export type ErrorsType = {
    nombre?: string;
    telefono?: string;
    correo?: string;
    [key: string]: string | undefined;
};