// utils/validation.ts
import type { FormData } from "../types";

type Errors = { [key: string]: string };

export const validateBasicInfo = (formData: FormData): Errors => {
    const errors: Errors = {};

    if (!formData.nombre?.trim()) errors.nombre = "Nombre es requerido";
    if (
        !formData.correo?.trim() ||
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.correo)
    ) {
        errors.correo = "Correo válido es requerido";
    }
    if (!formData.telefono?.trim() || !/^\d{7,15}$/.test(formData.telefono)) {
        errors.telefono = "Teléfono válido es requerido";
    }
    if (!formData.fecha) errors.fecha = "Fecha es requerida";

    return errors;
};

export const validatePeopleCount = (formData: FormData): Errors => {
    const errors: Errors = {};

    if (!formData.cantidadAdultos || formData.cantidadAdultos < 1) {
        errors.cantidadAdultos = "Debe haber al menos 1 adulto";
    }
    if (formData.cantidadNinos < 0) {
        errors.cantidadNinos = "La cantidad de niños no puede ser negativa";
    }

    return errors;
};

export const validateParticipants = (formData: FormData): Errors => {
    const errors: Errors = {};

    // Validar adultos
    for (let i = 0; i < (formData.cantidadAdultos || 0); i++) {
        const adulto = formData.adultos?.[i];
        if (!adulto?.nombre?.trim()) {
            errors[`adulto${i}nombre`] = `Nombre del adulto ${i + 1} es requerido`;
        }
        if (!adulto?.tipoDocumento) {
            errors[`adulto${i}tipoDoc`] = `Tipo de documento del adulto ${i + 1} es requerido`;
        }
        if (!adulto?.numeroDocumento?.trim()) {
            errors[`adulto${i}numDoc`] = `Número de documento del adulto ${i + 1} es requerido`;
        }
    }

    // Validar niños
    for (let i = 0; i < (formData.cantidadNinos || 0); i++) {
        const nino = formData.ninos?.[i];
        if (!nino?.nombre?.trim()) {
            errors[`nino${i}nombre`] = `Nombre del niño ${i + 1} es requerido`;
        }
        if (!nino?.tipoDocumento) {
            errors[`nino${i}tipoDoc`] = `Tipo de documento del niño ${i + 1} es requerido`;
        }
        if (!nino?.numeroDocumento?.trim()) {
            errors[`nino${i}numDoc`] = `Número de documento del niño ${i + 1} es requerido`;
        }
    }

    return errors;
};

export const validateEmergencyContact = (formData: FormData): Errors => {
    const errors: Errors = {};

    const contacto = formData.contactoEmergencia;
    if (!contacto?.nombre?.trim()) {
        errors.contactoNombre = "Nombre del contacto de emergencia es requerido";
    }
    if (!contacto?.telefono?.trim() || !/^\d{7,15}$/.test(contacto.telefono)) {
        errors.contactoTelefono = "Teléfono del contacto de emergencia es requerido";
    }

    return errors;
};
