"use client";

import React from "react";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "react-hot-toast";
import AuthForm from "../../components/AuthForm";

export default function AuthPage() {
  return (
    <SessionProvider>
      {/* Toast notification container */}
      <Toaster position="top-right" />

      {/* The authentication form with all its internal components */}
      <AuthForm />
    </SessionProvider>
  );
}
