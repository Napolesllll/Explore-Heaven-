// src/lib/auth/auth.config.ts
import { NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "../prismadb";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import EmailProvider from "next-auth/providers/email";
import bcrypt from "bcryptjs";
import { validateAdminCredentials } from "./admin-credentials";

// Validación de variables de entorno
const requiredEnvVars = {
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    EMAIL_SERVER: process.env.EMAIL_SERVER,
    EMAIL_FROM: process.env.EMAIL_FROM,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
};

Object.entries(requiredEnvVars).forEach(([key, value]) => {
    if (!value) {
        console.error(`Missing required environment variable: ${key}`);
    }
});

interface ExtendedToken {
    id?: string;
    role?: string;
    emailVerified?: Date;
    image?: string;
    accessToken?: string;
    refreshToken?: string;
    email?: string;
    name?: string;
}

interface ExtendedSessionUser {
    id: string;
    email: string;
    name?: string | null;
    image?: string | null;
    role?: string;
    emailVerified?: Date | null;
}

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

                    const user = await prisma.user.findUnique({
                        where: { email: credentials.email.toLowerCase() },
                        include: {
                            accounts: true,
                            guiaProfile: true,
                        },
                    });

                    if (!user || !user.hashedPassword) {
                        return null;
                    }

                    if (!user.emailVerified) {
                        throw new Error("EMAIL_NOT_VERIFIED");
                    }

                    if (user.status === "SUSPENDED" || user.status === "DELETED") {
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

                    return {
                        id: user.id,
                        email: user.email,
                        name: user.name,
                        image: user.image,
                        role: user.role,
                        emailVerified: user.emailVerified,
                    };
                } catch (error) {
                    console.error("Authorization error:", error);
                    throw error;
                }
            },
        }),
        CredentialsProvider({
            id: "admin-credentials",
            name: "Administrador",
            credentials: {
                password: { label: "Contraseña de Administrador", type: "password" },
            },
            async authorize(credentials) {
                try {
                    if (!credentials?.password) {
                        return null;
                    }

                    const isValidAdmin = await validateAdminCredentials(
                        credentials.password
                    );
                    if (!isValidAdmin) {
                        return null;
                    }

                    let adminUser = await prisma.user.findFirst({
                        where: { role: "ADMIN" },
                    });

                    if (!adminUser) {
                        adminUser = await prisma.user.create({
                            data: {
                                email: "admin@sistema.com",
                                name: "Administrador del Sistema",
                                role: "ADMIN",
                                emailVerified: new Date(),
                                status: "ACTIVE",
                            },
                        });
                    }

                    await prisma.loginAttempt.create({
                        data: {
                            email: adminUser.email,
                            success: true,
                            ip: "unknown",
                            userAgent: "admin-panel",
                        },
                    });

                    await prisma.user.update({
                        where: { id: adminUser.id },
                        data: { lastLogin: new Date() },
                    });

                    return {
                        id: adminUser.id,
                        email: adminUser.email,
                        name: adminUser.name,
                        image: adminUser.image,
                        role: adminUser.role,
                        emailVerified: adminUser.emailVerified,
                    };
                } catch (error) {
                    console.error("Admin authorization error:", error);
                    return null;
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
        EmailProvider({
            server: {
                host: process.env.EMAIL_SERVER_HOST,
                port: parseInt(process.env.EMAIL_SERVER_PORT || "587"),
                auth: {
                    user: process.env.EMAIL_SERVER_USER,
                    pass: process.env.EMAIL_SERVER_PASSWORD,
                },
            },
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
                    return true;
                }

                if (account?.provider === "google" || account?.provider === "facebook") {
                    if (
                        account?.provider === "google" &&
                        (profile as { email_verified?: boolean })?.email_verified === false
                    ) {
                        return false;
                    }

                    const allowedDomains =
                        process.env.ALLOWED_DOMAINS?.split(",") || [];
                    if (allowedDomains.length > 0 && user.email) {
                        const domain = user.email.split("@")[1];
                        if (!allowedDomains.includes(domain)) {
                            return false;
                        }
                    }
                }

                return true;
            } catch (error) {
                console.error("SignIn callback error:", error);
                return false;
            }
        },
        async jwt({ token, user, account, trigger, session }) {
            const extendedToken = token as ExtendedToken;

            if (user) {
                extendedToken.id = user.id;
                extendedToken.role = user.role as string;
                extendedToken.emailVerified = user.emailVerified as Date;
                extendedToken.image = user.image as string;
            }

            if (account) {
                if ("access_token" in account && account.access_token) {
                    extendedToken.accessToken = account.access_token as string;
                }
                if ("refresh_token" in account && account.refresh_token) {
                    extendedToken.refreshToken = account.refresh_token as string;
                }
            }

            if (trigger === "update" && session) {
                if (session.user.image !== undefined) {
                    extendedToken.image = session.user.image ?? undefined;
                }
                if (session.user.name !== undefined) {
                    extendedToken.name = session.user.name ?? undefined;
                }
                if (session.user.email !== undefined) {
                    extendedToken.email = session.user.email ?? undefined;
                }
                if ((session.user as { role?: string }).role !== undefined) {
                    extendedToken.role = (session.user as { role?: string }).role;
                }
            }

            return extendedToken;
        },
        async session({ session, token }) {
            const extendedToken = token as ExtendedToken;

            if (extendedToken) {
                const user: ExtendedSessionUser = {
                    id: extendedToken.id ?? "",
                    email: extendedToken.email ?? "",
                    name: extendedToken.name ?? null,
                    image: extendedToken.image ?? null,
                    role: extendedToken.role,
                    emailVerified: extendedToken.emailVerified ?? null,
                };

                session.user = user;
                session.accessToken = extendedToken.accessToken;
            }

            return session;
        },
        async redirect({ url, baseUrl }) {
            if (url.startsWith("/")) return `${baseUrl}${url}`;
            try {
                if (new URL(url).origin === baseUrl) return url;
            } catch { }
            return baseUrl;
        },
    },
    events: {
        async signIn(message) {
            console.log(
                `User signed in: ${message.user.email} - Role: ${message.user.role}`
            );
        },
        async signOut(message) {
            console.log(`User signed out: ${message.token?.email || "unknown"}`);
        },
        async createUser(message) {
            console.log(`New user created: ${message.user.email}`);
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