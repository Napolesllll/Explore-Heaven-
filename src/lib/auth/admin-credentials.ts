// lib/auth/admin-credentials.ts
import bcrypt from "bcryptjs";

export async function validateAdminCredentials(password: string): Promise<boolean> {
    try {
        // Obtener la contraseña maestra desde variables de entorno
        const adminPassword = process.env.ADMIN_MASTER_PASSWORD;

        if (!adminPassword) {
            console.error("ADMIN_MASTER_PASSWORD environment variable not set");
            throw new Error("Configuración de administrador no encontrada");
        }

        // Verificar si la variable de entorno es un hash (empieza con $2a$ o $2b$)
        const isHashed = adminPassword.startsWith('$2a$') || adminPassword.startsWith('$2b$');

        if (isHashed) {
            // Comparar con hash
            return await bcrypt.compare(password, adminPassword);
        } else {
            // Comparación directa (menos segura, pero funcional)
            return password === adminPassword;
        }

    } catch (error) {
        console.error("Error validating admin credentials:", error);
        return false;
    }
}

// Función auxiliar para generar hash de contraseña
export async function generateAdminHash(password: string): Promise<string> {
    const saltRounds = 12;
    return await bcrypt.hash(password, saltRounds);
}

// Función para verificar si las credenciales de admin están configuradas
export function isAdminConfigured(): boolean {
    return !!process.env.ADMIN_MASTER_PASSWORD;
}

// Ejemplo de uso para generar hash:
// const hash = await generateAdminHash("mi_contraseña_segura");
// console.log("Hash para .env:", hash);