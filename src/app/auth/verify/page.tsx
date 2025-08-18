"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function VerifyPage() {
  const router = useRouter();

  useEffect(() => {
    const timeout = setTimeout(() => {
      router.push("/dashboard");
    }, 3000); // Espera 3s y redirige

    return () => clearTimeout(timeout);
  }, [router]);

  return (
    <main className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold">Correo verificado con éxito</h1>
      <p>Redirigiendo al panel en unos segundos...</p>
    </main>
  );
}
