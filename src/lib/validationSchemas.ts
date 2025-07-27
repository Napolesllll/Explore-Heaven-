import { z } from "zod";

export const registerSchema = z.object({
  email: z.string().email("El correo no es válido"),
  password: z
    .string()
    .min(8, "La contraseña debe tener al menos 8 caracteres")
    .regex(/[A-Z]/, "La contraseña debe contener al menos una letra mayúscula")
    .regex(/[a-z]/, "La contraseña debe contener al menos una letra minúscula")
    .regex(/[0-9]/, "La contraseña debe contener al menos un número"),
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
}); 