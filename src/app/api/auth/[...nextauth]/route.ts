import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import FacebookProvider from "next-auth/providers/facebook";
import GoogleProvider from "next-auth/providers/google";
import { compare, hash } from "bcryptjs";
import { NextResponse } from "next/server";
import prisma from "../../../../lib/prismadb";
import { z } from "zod";

// Esquema de validación para el registro de usuario
const registerSchema = z.object({
  email: z.string().email("Correo inválido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
  name: z.string().min(1, "El nombre es obligatorio"),
}); 

// Ruta personalizada para registro de usuario
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password, name } = registerSchema.parse(body);

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return new NextResponse("Este correo ya está registrado", { status: 400 });
    }

    const hashedPassword = await hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        email,
        name,
        hashedPassword,
      },
    });

    return NextResponse.json({
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new NextResponse(
        JSON.stringify({ error: "Datos inválidos", detalles: error.errors }),
        { status: 400 }
      );
    }
    console.error("Error en el registro:", error);
    return new NextResponse("Error interno del servidor", { status: 500 });
  }
}

// Configuración de NextAuth
export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID!,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Por favor, ingresa tu email y contraseña");
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
          select: {
            id: true,
            name: true,
            email: true,
            hashedPassword: true,
          },
        });

        if (!user || !user.hashedPassword) {
          throw new Error("Credenciales incorrectas");
        }

        const isValid = await compare(credentials.password, user.hashedPassword);
        if (!isValid) {
          throw new Error("Credenciales incorrectas");
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
        };
      },
    }),
  ],
  pages: {
    signIn: "/auth", // Página personalizada
  },
  callbacks: {
    async session({ session, token }) {
      if (token) {
        session.user.id = token.sub;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
      }
      return token;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };