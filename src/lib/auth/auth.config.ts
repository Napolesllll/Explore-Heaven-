// src/lib/auth/auth.config.ts - VERSIÓN CORREGIDA
import { NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import EmailProvider from "next-auth/providers/email";
import bcrypt from "bcryptjs";
import { URL } from "url";

// Importar desde el archivo prisma-rls
import { prisma, setDatabaseUser, clearDatabaseUser } from '../prisma-rls';

// Importar tu función de validación de admin
import { validateAdminCredentials } from '../auth/admin-credentials';

// Validación de variables de entorno
const requiredEnvVars = {
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    EMAIL_SERVER: process.env.EMAIL_SERVER,
    EMAIL_FROM: process.env.EMAIL_FROM,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    ADMIN_MASTER_PASSWORD: process.env.ADMIN_MASTER_PASSWORD,
    ADMIN_EMAIL: process.env.ADMIN_EMAIL,
};

Object.entries(requiredEnvVars).forEach(([key, value]) => {
    if (!value) {
        console.error(`Missing required environment variable: ${key}`);
    }
});

// Definir el tipo de usuario de sesión extendido
interface ExtendedSessionUser {
    id: string;
    email: string;
    name?: string | null;
    image?: string | null;
    role: string;
    emailVerified: Date;
}

// Opciones de autenticación para NextAuth
export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(prisma),
    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60,
        updateAge: 24 * 60 * 60,
    },
    pages: {
        error: "/auth/error",
        verifyRequest: "/auth/verify-request",
        signIn: "/auth/signin",
    },
    providers: [
        // Proveedor para administradores (nuevo)
        CredentialsProvider({
            id: "admin-credentials",
            name: "AdminCredentials",
            credentials: {
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                try {
                    if (!credentials?.password) {
                        return null;
                    }

                    // Usar tu función de validación
                    const isValid = await validateAdminCredentials(credentials.password);

                    if (!isValid) {
                        return null;
                    }

                    // Crear un usuario admin simulado
                    return {
                        id: "admin-system",
                        email: process.env.ADMIN_EMAIL || "admin@exploreheaven.com",
                        name: "Administrator",
                        role: "ADMIN",
                        emailVerified: new Date(),
                    };
                } catch (error) {
                    console.error("Admin authorization error:", error);
                    return null;
                }
            },
        }),

        // Proveedor para usuarios regulares (existente)
        CredentialsProvider({
            id: "credentials",
            name: "Credenciales de Usuario",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                try {
                    if (!credentials?.email || !credentials?.password) {
                        return null;
                    }

                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (!emailRegex.test(credentials.email)) {
                        return null;
                    }

                    // Configurar RLS para la consulta
                    await setDatabaseUser('AUTH_SYSTEM');

                    const user = await prisma.user.findUnique({
                        where: { email: credentials.email.toLowerCase() },
                        include: {
                            accounts: true,
                            guiaProfile: true,
                        },
                    });

                    if (!user || !user.hashedPassword) {
                        await clearDatabaseUser();
                        return null;
                    }

                    if (!user.emailVerified) {
                        await clearDatabaseUser();
                        throw new Error("EMAIL_NOT_VERIFIED");
                    }

                    if (user.status === "SUSPENDED" || user.status === "DELETED") {
                        await clearDatabaseUser();
                        throw new Error("ACCOUNT_SUSPENDED");
                    }

                    const isCorrectPassword = await bcrypt.compare(
                        credentials.password,
                        user.hashedPassword
                    );

                    if (!isCorrectPassword) {
                        await prisma.loginAttempt.create({
                            data: {
                                email: credentials.email,
                                success: false,
                                ip: "unknown",
                                userAgent: "unknown",
                            },
                        });
                        await clearDatabaseUser();
                        return null;
                    }

                    await prisma.loginAttempt.create({
                        data: {
                            email: credentials.email,
                            success: true,
                            ip: "unknown",
                            userAgent: "unknown",
                        },
                    });

                    await prisma.user.update({
                        where: { id: user.id },
                        data: { lastLogin: new Date() },
                    });

                    const emailVerified = user.emailVerified || new Date();

                    await clearDatabaseUser();

                    return {
                        id: user.id,
                        email: user.email,
                        name: user.name,
                        image: user.image,
                        role: user.role,
                        emailVerified,
                    };
                } catch (error) {
                    console.error("Authorization error:", error);
                    await clearDatabaseUser();
                    throw error;
                }
            },
        }),

        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID ?? "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
            authorization: {
                params: {
                    prompt: "consent",
                    access_type: "offline",
                    response_type: "code",
                },
            },
        }),

        FacebookProvider({
            clientId: process.env.FACEBOOK_CLIENT_ID ?? "",
            clientSecret: process.env.FACEBOOK_CLIENT_SECRET ?? "",
        }),

        // Configuración del proveedor de correo
        EmailProvider({
            server: process.env.EMAIL_SERVER,
            from: process.env.EMAIL_FROM,
            maxAge: 24 * 60 * 60,
            sendVerificationRequest: async ({ identifier, url, provider }) => {
                const { sendVerificationRequest } = await import(
                    "../email/sendVerificationRequest"
                );
                await sendVerificationRequest({ identifier, url, provider });
            },
        }),
    ],
    callbacks: {
        async signIn({ user, account, profile }) {
            try {
                // Configurar RLS para operaciones de autenticación
                await setDatabaseUser('AUTH_SYSTEM');

                if (account?.provider === "email") {
                    const existingUser = await prisma.user.findUnique({
                        where: { email: user.email! },
                    });

                    if (existingUser && !existingUser.emailVerified) {
                        await prisma.user.update({
                            where: { email: user.email! },
                            data: { emailVerified: new Date() },
                        });
                    }

                    await clearDatabaseUser();
                    return true;
                }

                if (account?.provider === "google" || account?.provider === "facebook") {
                    if (
                        account?.provider === "google" &&
                        (profile as { email_verified?: boolean })?.email_verified === false
                    ) {
                        await clearDatabaseUser();
                        return false;
                    }

                    const allowedDomains =
                        process.env.ALLOWED_DOMAINS?.split(",") || [];
                    if (allowedDomains.length > 0 && user.email) {
                        const domain = user.email.split("@")[1];
                        if (!allowedDomains.includes(domain)) {
                            await clearDatabaseUser();
                            return false;
                        }
                    }
                }

                // Permitir siempre el inicio de sesión de administrador
                if (account?.provider === "admin-credentials") {
                    await clearDatabaseUser();
                    return true;
                }

                await clearDatabaseUser();
                return true;
            } catch (error) {
                console.error("SignIn callback error:", error);
                await clearDatabaseUser();
                return false;
            }
        },

        async jwt({ token, user, trigger, session }) {
            try {
                if (user) {
                    // Asegurar que todas las propiedades requeridas estén presentes
                    token.id = user.id;
                    token.role = user.role || "USER";
                    token.emailVerified = user.emailVerified || new Date();
                    // Solo asignar image si existe y es string
                    if (user.image && typeof user.image === 'string') {
                        token.image = user.image;
                    }
                }

                // Actualizar token si la sesión cambia (para actualizar rol)
                if (trigger === "update" && session?.user) {
                    token.role = session.user.role || token.role;
                }

                return token;
            } catch (error) {
                console.error('Error in JWT callback:', error);
                return token;
            }
        },

        async session({ session, token }) {
            try {
                if (token) {
                    const user: ExtendedSessionUser = {
                        id: token.id as string,
                        email: token.email ?? "",
                        name: token.name ?? null,
                        image: typeof token.image === 'string' ? token.image : null,
                        role: token.role as string,
                        emailVerified: token.emailVerified as Date,
                    };

                    session.user = user;
                    session.accessToken = token.accessToken;
                }

                return session;
            } catch (error) {
                console.error('Error in session callback:', error);
                return session;
            }
        },

        async redirect({ url, baseUrl }) {
            // Prevenir bucles de redirección - solución clave
            if (url.includes('/auth/signin?callbackUrl=')) {
                return `${baseUrl}/dashboard/admin`;
            }

            // Para login de admin, redirigir directamente al dashboard
            if (url.includes('callbackUrl') && url.includes('admin')) {
                return `${baseUrl}/dashboard/admin`;
            }

            if (url.startsWith("/")) return `${baseUrl}${url}`;
            try {
                if (new URL(url).origin === baseUrl) return url;
            } catch { }
            return baseUrl;
        },
    },
    events: {
        async signIn(message) {
            try {
                console.log(`User signed in: ${message.user.email} - Role: ${message.user.role}`);
            } catch (error) {
                console.error('Error in signIn event:', error);
            }
        },
        async signOut(message) {
            console.log(`User signed out: ${message.token?.email || "unknown"}`);
        },
        async createUser(message) {
            try {
                console.log(`New user created: ${message.user.email}`);
            } catch (error) {
                console.error('Error in createUser event:', error);
            }
        },
        async session({ session }) {
            if (process.env.NODE_ENV === "development") {
                console.log(
                    `Session updated for: ${session.user.email} - Role: ${session.user.role}`
                );
            }
        },
    },
    logger: {
        error(code, metadata) {
            console.error(`NextAuth Error [${code}]:`, metadata);
        },
        warn(code) {
            console.warn(`NextAuth Warning [${code}]`);
        },
        debug(code, metadata) {
            if (process.env.NODE_ENV === "development") {
                console.debug(`NextAuth Debug [${code}]:`, metadata);
            }
        },
    },
    debug: process.env.NODE_ENV === "development",
    secret: process.env.NEXTAUTH_SECRET,
};