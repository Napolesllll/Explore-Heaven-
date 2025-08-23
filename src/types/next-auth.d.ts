// types/next-auth.d.ts

// types/next-auth.d.ts
import { DefaultSession, DefaultUser } from "next-auth";
import { JWT, DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: string;
      emailVerified: Date;
    } & DefaultSession["user"];
    accessToken?: string;
  }

  interface User extends DefaultUser {
    role: string;
    emailVerified: Date;
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    id: string;
    role: string;
    emailVerified: Date;
    accessToken?: string;
    refreshToken?: string;
  }
}
/*
import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role?: string | null;
      emailVerified?: Date | null;
    };
    accessToken?: string;
  }

  interface User {
    id: string;
    name?: string | null;
    email: string;
    image?: string | null;
    role?: string | null;
    emailVerified?: Date | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role?: string | null;
    image?: string | null;
    emailVerified?: Date | null;
    accessToken?: string;
    refreshToken?: string;
  }
}*/