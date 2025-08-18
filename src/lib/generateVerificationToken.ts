import { randomBytes } from "crypto";
import prisma from "./prismadb";

export const generateVerificationToken = async (email: string) => {
    const token = randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 horas

    // 🧹 Elimina tokens previos
    await prisma.verificationToken.deleteMany({
        where: { identifier: email },
    });

    // 💾 Guarda nuevo token
    return await prisma.verificationToken.create({
        data: { identifier: email, token, expires },
    });
};
