// src/app/api/auth/[...nextauth]/route.ts

import NextAuth, { NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "../../../../lib/prismadb";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import EmailProvider from "next-auth/providers/email";
import bcrypt from "bcryptjs";
import { validateAdminCredentials } from "../../../../lib/auth/admin-credentials";

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

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 días
    updateAge: 24 * 60 * 60, // 24 horas
  },
  pages: {
    error: "/auth/error",
    verifyRequest: "/auth/verify-request",
    signIn: "/auth/signin", // Página personalizada para manejar admin y usuarios
  },
  providers: [
    // Provider para usuarios regulares
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

          // Validación básica de email
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(credentials.email)) {
            return null;
          }

          const user = await prisma.user.findUnique({
            where: { email: credentials.email.toLowerCase() },
            include: {
              accounts: true,
              guiaProfile: true
            }
          });

          if (!user || !user.hashedPassword) {
            return null;
          }

          // Verificar si el email está verificado
          if (!user.emailVerified) {
            throw new Error("EMAIL_NOT_VERIFIED");
          }

          // Verificar si la cuenta está activa
          if (user.status === "SUSPENDED" || user.status === "DELETED") {
            throw new Error("ACCOUNT_SUSPENDED");
          }

          const isCorrectPassword = await bcrypt.compare(
            credentials.password,
            user.hashedPassword
          );

          if (!isCorrectPassword) {
            // Log intento de login fallido
            await prisma.loginAttempt.create({
              data: {
                email: credentials.email,
                success: false,
                ip: "unknown",
                userAgent: "unknown"
              }
            });
            return null;
          }

          // Log login exitoso
          await prisma.loginAttempt.create({
            data: {
              email: credentials.email,
              success: true,
              ip: "unknown",
              userAgent: "unknown"
            }
          });

          // Actualizar último login
          await prisma.user.update({
            where: { id: user.id },
            data: { lastLogin: new Date() }
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
    // Provider específico para administradores
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

          // Validar contraseña de administrador
          const isValidAdmin = await validateAdminCredentials(credentials.password);

          if (!isValidAdmin) {
            return null;
          }

          // Buscar o crear usuario administrador
          let adminUser = await prisma.user.findFirst({
            where: { role: "ADMIN" }
          });

          if (!adminUser) {
            // Crear usuario administrador por defecto
            adminUser = await prisma.user.create({
              data: {
                email: "admin@sistema.com",
                name: "Administrador del Sistema",
                role: "ADMIN",
                emailVerified: new Date(),
                status: "ACTIVE"
              }
            });
          }

          // Log login exitoso de admin
          await prisma.loginAttempt.create({
            data: {
              email: adminUser.email,
              success: true,
              ip: "unknown",
              userAgent: "admin-panel"
            }
          });

          // Actualizar último login
          await prisma.user.update({
            where: { id: adminUser.id },
            data: { lastLogin: new Date() }
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
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        }
      }
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID!,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
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
        const { sendVerificationRequest } = await import("../../../../lib/email/sendVerificationRequest");
        await sendVerificationRequest({ identifier, url, provider });
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      try {
        // Si es verificación por email, verificar el token
        if (account?.provider === "email") {
          const existingUser = await prisma.user.findUnique({
            where: { email: user.email! }
          });

          if (existingUser && !existingUser.emailVerified) {
            await prisma.user.update({
              where: { email: user.email! },
              data: { emailVerified: new Date() }
            });
          }
          return true;
        }

        // Verificaciones adicionales de seguridad para otros proveedores
        if (account?.provider === "google" || account?.provider === "facebook") {
          if (!profile?.email_verified && account?.provider === "google") {
            return false;
          }

          const allowedDomains = process.env.ALLOWED_DOMAINS?.split(",") || [];
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
      // En el primer login, añadir datos del usuario al token
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.emailVerified = user.emailVerified;
        token.image = user.image;
      }

      // Renovar token si es necesario
      if (account) {
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
      }

      // Si se dispara una actualización manual de sesión
      if (trigger === "update" && session) {
        if (session.user.image !== undefined) {
          token.image = session.user.image;
        }
        if (session.user.name !== undefined) {
          token.name = session.user.name;
        }
        if (session.user.email !== undefined) {
          token.email = session.user.email;
        }
        if (session.user.role !== undefined) {
          token.role = session.user.role;
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.emailVerified = token.emailVerified as Date;
        session.user.image = token.image as string;
        session.accessToken = token.accessToken;
      }

      return session;
    },
    async redirect({ url, baseUrl }) {
      // IMPORTANTE: No hacer redirecciones automáticas aquí
      // Dejar que el middleware maneje las redirecciones por rol

      // Permitir redirecciones solo a URLs del mismo dominio
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
  },
  events: {
    async signIn(message) {
      console.log(`User signed in: ${message.user.email} - Role: ${message.user.role}`);
    },
    async signOut(message) {
      console.log(`User signed out: ${message.token?.email || "unknown"}`);
    },
    async createUser(message) {
      console.log(`New user created: ${message.user.email}`);
    },
    async session({ session, token }) {
      if (process.env.NODE_ENV === "development") {
        console.log(`Session updated for: ${session.user.email} - Role: ${session.user.role}`);
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

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };